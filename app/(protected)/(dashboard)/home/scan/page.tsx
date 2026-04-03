"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { LoadingSpinner, Button } from "@/components/ui";
import { useUiStore } from "@/store/ui-store";
import { useTransactionStore } from "@/store/transaction-store";
import { useUserStore } from "@/store/user-store";
import {
  ManualCompletionRequiredError,
  TransactionService,
} from "@/services/transaction.service";
import {
  ALLOWED_UPLOAD_MIME,
  MAX_UPLOAD_FILE_SIZE_BYTES,
  MAX_UPLOAD_FILE_SIZE_MB,
} from "@/constants/upload";
import { defaultCategories } from "@/constants/mock-data";
import {
  PlusFileIcon,
  ReceiptIcon,
  EditIcon,
  NoMovementIcon,
  CloseIcon,
} from "@/constants/icons";
import TextInput from "@/components/ui/text-input";
import { ModalContent } from "@/components/ui/modal-content";
import type { Document } from "@/types/ui";
import type { Category } from "@/types/dtos/category.dto";
import type {
  TransactionFormData,
  TransactionFormField,
} from "@/types/dtos/transaction.dto";
import {
  formatDateTimeLocal,
  isFutureDateTime,
  normalizeDateTimePayload,
} from "@/utils/date-time";

// ── UploadSection ──────────────────────────────────────────────────────────────

const UploadSection: React.FC<{ onUploadClick: () => void }> = ({
  onUploadClick,
}) => (
  <div
    className="flex flex-col justify-center text-center p-4 m-2 sm:m-4 bg-white rounded-2xl shadow-xl w-full max-w-md mx-auto cursor-pointer transition-transform hover:-translate-y-0.5"
    onClick={onUploadClick}
    role="button"
    tabIndex={0}
  >
    <div className="p-4 border-2 border-dashed border-gray-400 rounded-xl h-full flex flex-col justify-center">
      <PlusFileIcon className="mx-auto mb-2 text-gray-600" />
      <p className="text-center text-sm text-gray-500 px-2">
        Comprovativos, imagens e documentos financeiros
      </p>
    </div>
  </div>
);

// ── UploadOptions ──────────────────────────────────────────────────────────────

const UploadOptions: React.FC<{
  onFileSelect: (file: File, type: "image" | "document") => void;
  onManualClick?: () => void;
}> = ({ onFileSelect, onManualClick }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "document",
  ) => {
    const files = event.target.files;
    if (files && files.length > 0) onFileSelect(files[0], type);
  };

  const handleManualButtonClick = () => {
    if (onManualClick) onManualClick();
    else handleButtonClick();
  };

  return (
    <div className="flex flex-col space-y-4">
      <Button
        leftIcon={<EditIcon />}
        variant="option"
        label="Manual"
        onClick={handleManualButtonClick}
      />
      <Button
        leftIcon={<ReceiptIcon />}
        label="Comprovativo"
        variant="option"
        onClick={handleButtonClick}
      />
      <input
        type="file"
        ref={fileInputRef}
        accept="application/pdf"
        onChange={(e) => handleFileChange(e, "document")}
        style={{ display: "none" }}
      />
    </div>
  );
};

// ── SentDocumentsSection ───────────────────────────────────────────────────────

type SentDocItem = { id: number; name: string; type: "doc" | "img" | "text" };

const SentDocumentsSection: React.FC<{
  documents: Document[];
  showOptions: boolean;
  onFileSelect: (file: File, type: "image" | "document") => void;
  onManualClick?: () => void;
}> = ({ documents, showOptions, onFileSelect, onManualClick }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [items, setItems] = useState<SentDocItem[]>([
    { id: 1, name: "Manual", type: "text" },
    { id: 1, name: "Comprovativo-12", type: "doc" },
    { id: 2, name: "Imagem", type: "img" },
    { id: 3, name: "Extrato", type: "doc" },
  ]);

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setItems((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          name: `Item Extra ${prev.length + 1}`,
          type: "doc",
        },
        {
          id: prev.length + 2,
          name: `Item Extra ${prev.length + 2}`,
          type: "img",
        },
      ]);
      setIsLoading(false);
    }, 1500);
  };

  if (showOptions) {
    return (
      <section className="flex flex-col flex-1 mb-2 items-center">
        <div className="flex justify-center mb-6 md:hidden">
          <h2 className="text-sm font-bold uppercase text-gray-900">
            Adicionar Transação
          </h2>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm flex flex-col justify-center flex-1 w-full max-w-md">
          <UploadOptions
            onFileSelect={onFileSelect}
            onManualClick={onManualClick}
          />
        </div>
      </section>
    );
  }

  if (documents.length === 0) {
    return (
      <section className="flex flex-col flex-1 mb-2">
        <div className="flex justify-center items-center mb-1 border-b-2 py-2 border-gray-200">
          <h2 className="text-sm font-bold uppercase text-gray-900">
            Adicionar Transação
          </h2>
        </div>
        <div className="bg-white rounded-xl my-4 mb-20 md:my-2 p-8 text-center justify-center shadow-sm flex flex-col items-center flex-1">
          <NoMovementIcon className="mx-auto mb-2 text-gray-600" />
          <p className="text-lg font-semibold text-gray-900">
            Nenhum movimento registrado.
          </p>
          <p className="text-sm text-gray-500">
            Toque no botão acima para começar.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col flex-1 mb-2">
      <div className="flex justify-center items-center mb-8">
        <h2 className="text-sm font-bold uppercase text-gray-900">
          Adicionar Transação
        </h2>
      </div>
      <div className="bg-white rounded-xl shadow-sm flex flex-col flex-1 justify-center">
        <UploadOptions
          onFileSelect={onFileSelect}
          onManualClick={onManualClick}
        />
      </div>
    </section>
  );
};

// ── CategoryScreen ─────────────────────────────────────────────────────────────

const CategoryScreen: React.FC<{
  onCloseOrSuccess?: () => void;
  selectedCategory: Category | null;
  setSelectedCategory: (c: Category | null) => void;
  isCategoryModalOpen: boolean;
  setIsCategoryModalOpen: (open: boolean) => void;
  transactionDescription: string;
  setTransactionDescription: (desc: string) => void;
}> = ({
  onCloseOrSuccess,
  selectedCategory,
  setSelectedCategory,
  isCategoryModalOpen,
  setIsCategoryModalOpen,
  transactionDescription,
  setTransactionDescription,
}) => {
  const saveCategory = () => {};
  const onCloseDetailsModal = () => {};

  const [showSuccessScreen, setShowSuccessScreen] = useState(false);

  const handleCategorySelect = (category: Category) =>
    setSelectedCategory(category);

  const handleSave = () => {
    if (selectedCategory && transactionDescription.trim()) {
      try {
        saveCategory();
        setShowSuccessScreen(true);
        setTimeout(() => {
          setShowSuccessScreen(false);
          setIsCategoryModalOpen(false);
          onCloseDetailsModal();
          setSelectedCategory(null);
          setTransactionDescription("");
          onCloseOrSuccess?.();
        }, 2000);
      } catch (error) {}
    }
  };

  const handleClose = () => {
    setIsCategoryModalOpen(false);
    setSelectedCategory(null);
    setTransactionDescription("");
    onCloseOrSuccess?.();
  };

  if (!isCategoryModalOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-white z-40 md:hidden overflow-y-auto">
        <div className="min-h-screen bg-gray-50">
          <div className="flex items-center justify-between p-6 bg-gray-100 border-b border-gray-100">
            <button
              onClick={handleClose}
              className="p-2 -m-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h2 className="text-xl font-semibold text-gray-900">Categorias</h2>
            <div className="w-10"></div>
          </div>
          <div className="p-6 bg-gray-100 rounded-2xl">
            <div className="bg-white rounded-2xl p-4">
              <div className="mb-8">
                <h3 className="text-base font-medium text-gray-700 mb-6">
                  Categorias padrão
                </h3>
                <div className="flex flex-wrap gap-3">
                  {defaultCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(category)}
                      className={`px-5 py-3 rounded-full text-sm font-medium transition-all ${
                        selectedCategory?.id === category.id
                          ? "bg-yellow-400 text-white shadow-lg scale-105"
                          : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                      }`}
                      style={
                        selectedCategory?.id === category.id && category.color
                          ? { backgroundColor: category.color }
                          : {}
                      }
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
              {selectedCategory && (
                <div className="mb-8">
                  <h3 className="text-base font-medium text-gray-700 mb-4">
                    Descrição
                  </h3>
                  <textarea
                    value={transactionDescription}
                    onChange={(e) => setTransactionDescription(e.target.value)}
                    placeholder="Escrever"
                    className="w-full h-32 p-4 bg-white border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-base"
                  />
                </div>
              )}
              {selectedCategory && transactionDescription.trim() && (
                <div className="mt-4">
                  <button
                    onClick={handleSave}
                    className="w-full py-4 rounded-xl font-semibold text-white bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 transition-all"
                  >
                    Guardar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showSuccessScreen && (
        <div className="md:hidden fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Categoria definida com sucesso
            </h3>
            <p className="text-sm text-gray-600">
              O movimento "Débito" foi definido na categoria{" "}
              {selectedCategory?.name.toLowerCase()}.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

// ── ScanMainContent ────────────────────────────────────────────────────────────

const ScanMainContent: React.FC<{
  documents: Document[];
  showUploadOptions: boolean;
  handleFileSelect: (file: File, type: "image" | "document") => void;
  onCategoryCloseOrSuccess: () => void;
  onManualClick?: () => void;
}> = ({
  documents,
  showUploadOptions,
  handleFileSelect,
  onCategoryCloseOrSuccess,
  onManualClick,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [transactionDescription, setTransactionDescription] = useState("");

  const categoryProps = {
    selectedCategory,
    setSelectedCategory,
    isCategoryModalOpen,
    setIsCategoryModalOpen,
    transactionDescription,
    setTransactionDescription,
  };

  return (
    <>
      <div className="flex flex-col flex-1 h-full">
        {!showUploadOptions ? (
          <div className="flex flex-col flex-1 h-full">
            <div className="flex flex-1 flex-col"></div>
          </div>
        ) : (
          <div className="flex flex-col flex-1 h-full">
            <SentDocumentsSection
              documents={[]}
              showOptions={true}
              onFileSelect={handleFileSelect}
              onManualClick={onManualClick}
            />
          </div>
        )}
      </div>

      <div>
        {isCategoryModalOpen && (
          <CategoryScreen
            {...categoryProps}
            onCloseOrSuccess={onCategoryCloseOrSuccess}
          />
        )}
      </div>
    </>
  );
};

// ── AddTransactionModal ────────────────────────────────────────────────────────

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => Promise<boolean>;
  formData: TransactionFormData;
  errors: Record<string, string>;
  isLoading: boolean;
  submitError: string;
  onFormChange: (field: string, value: string) => void;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  errors,
  isLoading,
  submitError,
  onFormChange,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const { showNotification } = useUiStore();

  useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && formData.type !== "expense") {
      onFormChange("type", "expense");
    }
  }, [formData.type, isOpen, onFormChange]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onSubmit();
    if (success) {
      showNotification(
        "success",
        "Transação Adicionada!",
        "Sua transação foi registrada com sucesso.",
      );
    }
  };

  if (!isOpen && !isVisible) return null;

  const categories = [
    { id: "food", name: "Alimentação" },
    { id: "transport", name: "Transporte" },
    { id: "housing", name: "Moradia" },
    { id: "health", name: "Saúde" },
    { id: "education", name: "Educação" },
    { id: "leisure", name: "Lazer" },
    { id: "services", name: "Serviços" },
    { id: "others", name: "Outros" },
  ];

  const maxTransactionDate = formatDateTimeLocal();
  const maxTransactionDateLabel = new Date(maxTransactionDate).toLocaleString(
    "pt-AO",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    },
  );

  const handleDateInvalid = (event: React.InvalidEvent<HTMLInputElement>) => {
    event.currentTarget.setCustomValidity(
      `Use uma data e hora iguais ou anteriores a ${maxTransactionDateLabel}.`,
    );
  };

  const handleDateInput = (event: React.FormEvent<HTMLInputElement>) => {
    event.currentTarget.setCustomValidity("");
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
    >
      <div
        className={`bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-lg transform transition-all duration-300 ${
          isVisible
            ? "scale-100 translate-y-0 opacity-100"
            : "scale-95 translate-y-4 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-5 border-b border-gray-900/20">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                Nova transação
              </p>
              <h2 className="text-lg font-semibold text-white">
                Adicionar despesa
              </h2>
            </div>
            <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
              Despesa
            </span>
          </div>
          <p className="text-sm text-white/70 mt-2">
            Registre gastos e acompanhe o impacto no seu orçamento.
          </p>
        </div>

        <div className="p-6">
          {/* Error Message */}
          {submitError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              {/* Transaction Summary */}
              <div className="rounded-2xl border border-gray-200 bg-gray-50/60 px-4 py-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Tipo selecionado
                    </p>
                    <p className="text-base font-semibold text-gray-900">
                      Despesa
                    </p>
                    <p className="text-sm text-gray-500">
                      Todas as transações registradas serão classificadas
                      automaticamente como saída de valores.
                    </p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">
                    Bloqueado
                  </span>
                </div>
              </div>

              {/* Amount */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <div className="relative">
                    <TextInput
                      label="Montante"
                      type="number"
                      placeholder="0,00"
                      value={formData.amount}
                      onChange={(e) => onFormChange("amount", e.target.value)}
                      isError={!!errors.amount}
                      required={true}
                      className="pr-1"
                    />
                    <span className="pointer-events-none absolute right-6 top-2/3 -translate-y-1/2 text-sm font-semibold uppercase text-gray-600">
                      kz
                    </span>
                  </div>
                  {errors.amount && (
                    <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
                  )}
                </div>

                {/* Date */}
                <div>
                  <TextInput
                    label="Data e hora"
                    type="datetime-local"
                    step={1}
                    max={maxTransactionDate}
                    value={formData.transactionDate}
                    onChange={(e) =>
                      onFormChange("transactionDate", e.target.value)
                    }
                    onInvalid={handleDateInvalid}
                    onInput={handleDateInput}
                    required={true}
                  />
                  {errors.transactionDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.transactionDate}
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              <TextInput
                label="Descrição"
                type="text"
                placeholder="Ex: Compra no supermercado"
                value={formData.description}
                onChange={(e) => onFormChange("description", e.target.value)}
                isError={!!errors.description}
                required={true}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria
                </label>
                <div className="relative">
                  <select
                    value={formData.category}
                    onChange={(e) => onFormChange("category", e.target.value)}
                    className={`w-full rounded-xl border px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 bg-white transition-colors appearance-none ${
                      errors.category_id ? "border-red-500" : "border-gray-300"
                    }`}
                    required
                  >
                    <option value="">Selecione uma categoria</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <svg
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
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
                {errors.category_id && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.category_id}
                  </p>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 my-6"></div>

            {/* Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <Button
                variant="secondary"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 rounded-lg bg-red-500 px-6 py-3 text-white font-semibold shadow-lg transition-transform hover:scale-[1.01] hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? "Adicionando..." : "Adicionar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// ── ManualTransactionModal ─────────────────────────────────────────────────────

interface ManualTransactionModalProps {
  isOpen: boolean;
  defaults: {
    description: string;
    amount: number | null;
    transactionDate: string;
  } | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: {
    description: string;
    amount: number;
    transactionDate: string;
  }) => void | Promise<void>;
}

const ManualTransactionModal: React.FC<ManualTransactionModalProps> = ({
  isOpen,
  defaults,
  isSubmitting,
  onClose,
  onSubmit,
}) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionDate, setTransactionDate] = useState("");

  useEffect(() => {
    if (defaults) {
      setDescription(defaults.description ?? "");
      setAmount(
        defaults.amount !== null && defaults.amount !== undefined
          ? String(defaults.amount)
          : "",
      );
      setTransactionDate(
        defaults.transactionDate
          ? defaults.transactionDate.slice(0, 19)
          : new Date().toISOString().slice(0, 19),
      );
    }
  }, [defaults, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!description || !amount || !transactionDate) return;
    await onSubmit({ description, amount: Number(amount), transactionDate });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Completar transação
          </h2>
          <p className="text-sm text-gray-500">
            Insira os dados principais para concluir o comprovativo.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <TextInput
            label="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <TextInput
            label="Montante"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="0"
          />
          <TextInput
            label="Data"
            type="datetime-local"
            value={transactionDate}
            onChange={(e) => setTransactionDate(e.target.value)}
            required
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Concluir"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── NotificationToast ──────────────────────────────────────────────────────────

const NotificationToast: React.FC = () => {
  const { notification, closeNotification } = useUiStore();
  const [isMounted, setIsMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (notification) {
      setIsAnimating(true);
    } else {
      timeout = setTimeout(() => setIsAnimating(false), 150);
    }
    return () => clearTimeout(timeout);
  }, [notification]);

  if (!isMounted || (!isAnimating && !notification)) return null;
  if (!notification) return null;

  return createPortal(
    <div
      className={`
        fixed inset-0 z-9999 flex items-center justify-center p-4
        bg-black/40 backdrop-blur-sm
        ${notification ? "animate-backdrop-in" : "animate-backdrop-out pointer-events-none"}
      `}
      onClick={closeNotification}
    >
      <div
        className={`
          relative w-full max-w-md bg-white rounded-3xl shadow-2xl
          ${notification ? "animate-sweetalert-show" : "animate-sweetalert-hide"}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeNotification}
          aria-label="Fechar notificação"
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200"
        >
          <CloseIcon className="w-4 h-4" />
        </button>
        <div className="px-6 py-8 sm:px-8 sm:py-10 text-center">
          <ModalContent
            type={notification.type}
            title={notification.title}
            message={notification.message}
          />
        </div>
      </div>
    </div>,
    document.body,
  );
};

// ── useTransactionForm ─────────────────────────────────────────────────────────

const useTransactionForm = (initialData?: Partial<TransactionFormData>) => {
  const [formData, setFormData] = useState<TransactionFormData>({
    type: "expense",
    userId: "",
    amount: "",
    description: "",
    transactionDate: formatDateTimeLocal(),
    category: "",
    ...initialData,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: TransactionFormField, value: string) => {
    const normalizedValue =
      field === "transactionDate" ? normalizeDateTimePayload(value) : value;
    setFormData((prev) => ({ ...prev, [field]: normalizedValue }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.amount || parseFloat(formData.amount) <= 0)
      newErrors.amount = "Montante deve ser maior que zero";
    if (!formData.description.trim())
      newErrors.description = "Descrição é obrigatória";
    if (!formData.category) newErrors.category_id = "Categoria é obrigatória";
    if (!formData.transactionDate) {
      newErrors.transactionDate = "Data e hora são obrigatórias";
    } else if (isFutureDateTime(formData.transactionDate)) {
      newErrors.transactionDate = "Data/hora não pode estar no futuro";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      type: "expense",
      amount: "",
      userId: "",
      description: "",
      transactionDate: formatDateTimeLocal(),
      category: "",
    });
    setErrors({});
  };

  return { formData, errors, handleChange, validateForm, resetForm };
};

// ── useAddTransactionModal ─────────────────────────────────────────────────────

const useAddTransactionModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string>("");
  const { user } = useUserStore();
  const { add, isRefreshing } = useTransactionStore();
  const { formData, errors, handleChange, validateForm, resetForm } =
    useTransactionForm();

  const openModal = () => {
    setIsOpen(true);
    setSubmitError("");
  };

  const closeModal = () => {
    setIsOpen(false);
    resetForm();
    setSubmitError("");
  };

  const handleSubmit = async (): Promise<boolean> => {
    setSubmitError("");
    if (!validateForm()) return false;
    if (!user) throw Error("invalid user");
    const success = await add({
      ...formData,
      type: "expense",
      amount: parseFloat(formData.amount),
      userId: user.id,
      category: { name: formData.category },
    });
    if (success) closeModal();
    return success;
  };

  const handleFormChange = (field: string, value: string) => {
    handleChange(field as TransactionFormField, value);
  };

  return {
    isOpen,
    isLoading: isRefreshing,
    submitError,
    formData,
    errors,
    openModal,
    closeModal,
    handleChange: handleFormChange,
    handleSubmit,
  };
};

// ── Scan page ──────────────────────────────────────────────────────────────────

const Scan = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [showUploadOptions, setShowUploadOptions] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [manualData, setManualData] = useState<{
    transactionId: string;
    defaults: {
      description?: string;
      amount?: number;
      transactionDate?: string;
      operationNumber?: string;
    };
  } | null>(null);
  const [isManualSubmitting, setIsManualSubmitting] = useState(false);
  const { showNotification } = useUiStore();

  const {
    isOpen: isTransactionModalOpen,
    submitError,
    formData,
    isLoading: isTransactionLoading,
    errors,
    openModal,
    closeModal,
    handleChange,
    handleSubmit,
  } = useAddTransactionModal();

  const toggleUploadOptions = () => setShowUploadOptions((prev) => !prev);

  const handleFileSelect = async (file: File, type: "image" | "document") => {
    if (file.type !== ALLOWED_UPLOAD_MIME) {
      showNotification(
        "error",
        "Formato inválido",
        "Envie apenas comprovativos em PDF.",
      );
      return;
    }
    if (file.size > MAX_UPLOAD_FILE_SIZE_BYTES) {
      showNotification(
        "error",
        "Arquivo muito grande",
        `O PDF deve ter no máximo ${MAX_UPLOAD_FILE_SIZE_MB}MB.`,
      );
      return;
    }
    setIsLoading(true);
    try {
      const result = await TransactionService.processDocumentTransaction(file, {
        documentType: type === "image" ? "IMAGE" : "DOCUMENT",
      });
      const extracted = result.ocr.extractedData ?? {};
      setDocuments((prevDocs) => [
        {
          type: "transaction",
          name: extracted.description ?? file.name,
          description: extracted.description,
          amount: extracted.amount,
          timestamp: extracted.transactionDate,
        },
        ...prevDocs,
      ]);
      showNotification(
        "success",
        "Comprovativo processado",
        "Transação criada automaticamente a partir do OCR.",
      );
    } catch (error) {
      if (error instanceof ManualCompletionRequiredError) {
        setManualData({
          transactionId: error.transactionId,
          defaults: error.defaults,
        });
      } else {
        const message =
          error instanceof Error
            ? error.message
            : "Não foi possível processar o comprovativo.";
        showNotification("error", "Falha no processamento", message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryCloseOrSuccess = () => setShowUploadOptions(false);
  const handleManualModalClose = () => setManualData(null);

  const handleManualModalSubmit = async (values: {
    description: string;
    amount: number;
    transactionDate: string;
  }) => {
    if (!manualData) return;
    setIsManualSubmitting(true);
    try {
      await TransactionService.finalizeManualTransaction(
        manualData.transactionId,
        {
          description: values.description,
          amount: values.amount,
          transactionDate: values.transactionDate,
          operationNumber: manualData.defaults.operationNumber,
          type: "expense",
        },
      );
      setDocuments((prevDocs) => [
        {
          type: "transaction",
          name: values.description,
          description: values.description,
          amount: values.amount,
          timestamp: values.transactionDate,
        },
        ...prevDocs,
      ]);
      showNotification(
        "success",
        "Transação completada",
        "Os dados foram registados manualmente.",
      );
      setManualData(null);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível concluir a transação.";
      showNotification("error", "Erro ao salvar", message);
    } finally {
      setIsManualSubmitting(false);
    }
  };

  const manualFormDefaults = manualData
    ? {
        description: manualData.defaults.description ?? "",
        amount: manualData.defaults.amount ?? null,
        transactionDate:
          manualData.defaults.transactionDate ?? new Date().toISOString(),
      }
    : null;

  const handleManualTransaction = () => {
    if (!showUploadOptions) toggleUploadOptions();
    openModal();
  };

  const handleTransactionSubmit = async () => handleSubmit();

  const transitionBase = "transition-all duration-700 ease-in-out";

  const uploadContainerClasses = showUploadOptions
    ? `flex flex-col items-center ${transitionBase} flex-none pt-4`
    : `flex flex-col items-center justify-center ${transitionBase} flex-1`;

  const mainClasses = `flex-1 mb-0 px-4 pb-6 flex flex-col h-full overflow-y-auto ${
    showUploadOptions ? "" : "justify-center"
  } ${transitionBase}`;

  const contentWrapperClasses = showUploadOptions
    ? "flex flex-col flex-1"
    : "flex flex-col items-center";

  return (
    <>
      {/* Conteúdo Principal */}
      <main className={mainClasses}>
          {isLoading ? (
            <div className="flex flex-1 items-center justify-center h-full">
              <LoadingSpinner />
            </div>
          ) : (
            <div className={contentWrapperClasses}>
              {/* UploadSection */}
              <div className={uploadContainerClasses}>
                <div
                  className={`w-full ${transitionBase} ${
                    showUploadOptions ? "scale-95" : "scale-100"
                  }`}
                >
                  <UploadSection onUploadClick={toggleUploadOptions} />
                </div>
              </div>

              {/* Seção Principal */}
              {showUploadOptions && (
                <div className={`mt-6 flex-1 w-full ${transitionBase}`}>
                  <ScanMainContent
                    documents={documents}
                    showUploadOptions={showUploadOptions}
                    handleFileSelect={handleFileSelect}
                    onCategoryCloseOrSuccess={handleCategoryCloseOrSuccess}
                    onManualClick={handleManualTransaction}
                  />
                </div>
              )}
            </div>
          )}
      </main>

      <NotificationToast />
        <ManualTransactionModal
          isOpen={Boolean(manualData)}
          defaults={manualFormDefaults}
          isSubmitting={isManualSubmitting}
          onClose={handleManualModalClose}
          onSubmit={handleManualModalSubmit}
        />
        <AddTransactionModal
          isOpen={isTransactionModalOpen}
          onClose={closeModal}
          onSubmit={handleTransactionSubmit}
          formData={formData}
          errors={errors}
          isLoading={isTransactionLoading}
          submitError={submitError}
          onFormChange={handleChange}
        />
    </>
  );
};

export default Scan;
