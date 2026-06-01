"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { EditModalProps } from "@/types/ui";
import { type GoalPayload, type GoalType } from "@/types/dtos/goal.dto";
import { useGoalStore, getGoalProgress } from "@/store/goal-store";
import { useCategoryStore } from "@/store/category-store";
import { formatAOA, maskAOAInput, parseAOA } from "@/lib/currency";
import Select from "@/components/ui/select";
import CategorySelect from "@/components/ui/category-select";

type EditFormState = {
  title: string;
  description: string;
  targetAmount: string;
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
    goal.categoryId ?? goal.category?.id ?? "",
  );
};

const buildInitialFormData = (
  objective: EditModalProps["objective"],
): EditFormState => ({
  title: objective?.title ?? "",
  description: objective?.description ?? "",
  targetAmount: objective?.targetAmount?.toString() ?? "",
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
  const { update } = useGoalStore();
  const { categories } = useCategoryStore();
  const [formData, setFormData] = useState<EditFormState>(() =>
    buildInitialFormData(objective),
  );
  const [targetAmountDisplay, setTargetAmountDisplay] = useState(() =>
    objective?.targetAmount ? formatAOA(objective.targetAmount) : "",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    setFormData(buildInitialFormData(objective));
    setTargetAmountDisplay(objective?.targetAmount ? formatAOA(objective.targetAmount) : "");
    setSubmitError("");
  }, [objective]);

  const isCompleted = objective ? getGoalProgress(objective) >= 100 : false;
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
      };

      await update(objective.id, payload);
      onUpdated?.();
      onClose();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível atualizar o objetivo agora.";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const disableInputs = isSubmitting || isCompleted;
  const selectedCategoryValue = formData.categoryId || resolvedCategoryId || "";

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!objective) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/15"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-modal-title"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-[0_4px_16px_rgba(0,60,195,0.08)]"
          >
        <form className="p-6 md:p-8 space-y-6" onSubmit={handleSubmit}>
          <div className="flex items-center justify-between gap-4">
            <h2 id="edit-modal-title" className="text-[16px] font-bold text-gray-900">
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
              <label htmlFor="edit-goal-title" className="block text-sm font-medium text-gray-700 mb-2">
                Nome do objetivo
              </label>
              <input
                id="edit-goal-title"
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
              <Select
                label="Tipo"
                value={formData.type}
                onChange={(v) => handleChange("type", v as GoalType)}
                options={typeOptions}
                disabled={disableInputs}
              />
            </div>

            <div>
              <label htmlFor="edit-goal-description" className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                id="edit-goal-description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Descreva o objetivo"
                disabled={disableInputs}
              />
            </div>

            <div>
              <label htmlFor="edit-goal-amount" className="block text-sm font-medium text-gray-700 mb-2">
                Valor necessário
              </label>
              <input
                id="edit-goal-amount"
                type="text"
                inputMode="decimal"
                value={targetAmountDisplay}
                onChange={(e) => {
                  const masked = maskAOAInput(e.target.value);
                  setTargetAmountDisplay(masked);
                  handleChange("targetAmount", parseAOA(masked));
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="0,00"
                required
                disabled={disableInputs}
              />
            </div>

            <div>
              <label htmlFor="edit-goal-start" className="block text-sm font-medium text-gray-700 mb-2">
                Data de início
              </label>
              <input
                id="edit-goal-start"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
                disabled={disableInputs}
              />
            </div>

            <div>
              <label htmlFor="edit-goal-end" className="block text-sm font-medium text-gray-700 mb-2">
                Data limite
              </label>
              <input
                id="edit-goal-end"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleChange("endDate", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
                disabled={disableInputs}
              />
            </div>

            <div>
              <CategorySelect
                label="Categoria"
                value={selectedCategoryValue}
                onChange={(v) => handleChange("categoryId", v)}
                disabled={disableInputs}
              />
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
              className="px-6 py-3 bg-secondary text-white rounded-lg font-medium hover:bg-secondary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={disableInputs}
            >
              {isSubmitting ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>
        </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditModal;
