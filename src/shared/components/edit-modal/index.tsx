"use client";

import { useEffect, useMemo, useState } from "react";
import type { EditModalProps } from "@/shared/types/modal";
import {
  GoalsService,
  type GoalPayload,
  type GoalType,
} from "@/services/goals-service";
import { useCategories } from "@/hooks/category/use-categories";
import { getGoalProgress } from "@/hooks/objective/use-goals";
import { useUiStore } from "@/shared/store/ui-store";

type EditFormState = {
  title: string;
  description: string;
  targetAmount: string;
  currentAmount: string;
  startDate: string;
  endDate: string;
  type: GoalType;
  categoryId: string;
};

const toDateInputValue = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value.split("T")[0] ?? "";
  }
  return date.toISOString().split("T")[0];
};

const normalizeCategoryId = (value: string | number | undefined | null) => {
  if (value === undefined || value === null) {
    return "";
  }
  return String(value);
};

const extractCategoryId = (goal: EditModalProps["objective"]) => {
  if (!goal) {
    return "";
  }
  return normalizeCategoryId(
    goal.categoryId ?? goal.category_id ?? goal.category?.id ?? "",
  );
};

const buildInitialFormData = (
  objective: EditModalProps["objective"],
): EditFormState => ({
  title: objective?.title ?? "",
  description: objective?.description ?? "",
  targetAmount: objective?.targetAmount?.toString() ?? "",
  currentAmount: objective?.currentAmount?.toString() ?? "",
  startDate: toDateInputValue(objective?.startDate),
  endDate: toDateInputValue(objective?.endDate),
  type: (objective?.type as GoalType) ?? "SHORT_TERM",
  categoryId: extractCategoryId(objective),
});

const typeOptions: { value: GoalType; label: string }[] = [
  { value: "SHORT_TERM", label: "Curto prazo" },
  { value: "LONG_TERM", label: "Longo prazo" },
];

const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  objective,
  onUpdated,
}) => {
  const { showNotification } = useUiStore();
  const {
    categories,
    status: categoriesStatus,
    error: categoriesError,
  } = useCategories();
  const [formData, setFormData] = useState<EditFormState>(() =>
    buildInitialFormData(objective),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    setFormData(buildInitialFormData(objective));
    setSubmitError("");
  }, [objective]);

  const isCompleted = objective ? getGoalProgress(objective) >= 100 : false;
  const isLoadingCategories = categoriesStatus === "loading";
  const resolvedCategoryId = useMemo(() => {
    if (!objective) {
      return "";
    }
    const directId = extractCategoryId(objective);
    if (directId) {
      return directId;
    }

    if (objective.categoryName && categories.length) {
      const match = categories.find(
        (category) =>
          category.name.toLowerCase() === objective.categoryName?.toLowerCase(),
      );
      if (match) {
        return normalizeCategoryId(match.id);
      }
    }

    return "";
  }, [categories, objective]);

  useEffect(() => {
    if (!formData.categoryId && resolvedCategoryId) {
      setFormData((prev) => ({ ...prev, categoryId: resolvedCategoryId }));
    }
  }, [formData.categoryId, resolvedCategoryId]);

  const categoryOptions = useMemo(() => {
    const options = [
      {
        value: "",
        label: isLoadingCategories
          ? "Carregando categorias..."
          : "Selecione a categoria",
      },
      ...categories.map((category) => ({
        value: normalizeCategoryId(category.id),
        label: category.name,
      })),
    ];

    const selectedCategoryId = resolvedCategoryId;
    const selectedCategoryName =
      categories.find(
        (category) => normalizeCategoryId(category.id) === selectedCategoryId,
      )?.name ??
      objective?.category?.name ??
      objective?.categoryName ??
      "Categoria atual";

    if (
      selectedCategoryId &&
      !options.some((option) => option.value === selectedCategoryId)
    ) {
      options.push({ value: selectedCategoryId, label: selectedCategoryName });
    }

    return options;
  }, [
    categories,
    isLoadingCategories,
    objective?.category,
    objective?.categoryName,
    resolvedCategoryId,
  ]);

  const handleChange = (field: keyof EditFormState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!objective || isCompleted) {
      return;
    }
    setIsSubmitting(true);
    setSubmitError("");
    try {
      const payload: GoalPayload = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        targetAmount: Number(formData.targetAmount) || 0,
        startDate: formData.startDate,
        endDate: formData.endDate,
        categoryId: selectedCategoryValue,
        currentAmount: formData.currentAmount
          ? Number(formData.currentAmount)
          : undefined,
      };

      await GoalsService.update(objective.id, payload);
      showNotification(
        "success",
        "Objetivo atualizado",
        "As informações do objetivo foram atualizadas com sucesso.",
      );
      onUpdated?.();
      onClose();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível atualizar o objetivo agora.";
      setSubmitError(message);
      showNotification("error", "Erro ao atualizar", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const disableInputs = isSubmitting || isCompleted;
  const selectedCategoryValue = formData.categoryId || resolvedCategoryId || "";

  if (!objective || !isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/10 bg-opacity-50">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-xl">
        <form className="p-6 md:p-8 space-y-6" onSubmit={handleSubmit}>
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              Editar objetivo financeiro
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Fechar
            </button>
          </div>

          {isCompleted && (
            <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              Este objetivo já foi concluído e está disponível apenas para
              consulta.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do objetivo
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Comprar uma moto"
                required
                disabled={disableInputs}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo
              </label>
              <div className="relative">
                <select
                  value={formData.type}
                  onChange={(e) =>
                    handleChange("type", e.target.value as GoalType)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                >
                  {typeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <svg
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Descreva o objetivo"
                disabled={disableInputs}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor necessário
              </label>
              <input
                type="number"
                value={formData.targetAmount}
                onChange={(e) => handleChange("targetAmount", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="800.000"
                required
                disabled={disableInputs}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor arrecadado
              </label>
              <input
                type="number"
                value={formData.currentAmount}
                onChange={(e) => handleChange("currentAmount", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="400.000"
                disabled={disableInputs}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de início
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
                disabled={disableInputs}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data limite
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleChange("endDate", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
                disabled={disableInputs}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria
              </label>
              <div className="relative">
                <select
                  value={selectedCategoryValue}
                  onChange={(e) => handleChange("categoryId", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                  disabled={disableInputs}
                >
                  {categoryOptions.map((option) => (
                    <option
                      key={option.value || "placeholder"}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
                <svg
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              {categoriesError && (
                <p className="text-xs text-red-500 mt-1">{categoriesError}</p>
              )}
            </div>
          </div>

          {submitError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {submitError}
            </div>
          )}

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-yellow-400 text-white rounded-lg font-medium hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={disableInputs}
            >
              {isSubmitting ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
