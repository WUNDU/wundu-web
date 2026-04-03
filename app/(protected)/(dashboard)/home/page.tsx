"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Document } from "@/types/ui";
import { LoadingSpinner } from "@/components/ui";
import { StatsSection } from "@/components/layout";

import { useTransactionStore } from "@/store/transaction-store";
import {
  ManualCompletionRequiredError,
  TransactionService,
} from "@/services/transaction.service";
import { useUiStore } from "@/store/ui-store";
import {
  ALLOWED_UPLOAD_MIME,
  MAX_UPLOAD_FILE_SIZE_BYTES,
  MAX_UPLOAD_FILE_SIZE_MB,
} from "@/constants/upload";
import { defaultCategories } from "@/constants/mock-data";
import { Category } from "@/types/dtos/category.dto";
import { createPortal } from "react-dom";
import { useUserStore } from "@/store/user-store";
import type {
  TransactionFormData,
  TransactionFormField,
} from "@/types/dtos/transaction.dto";
import {
  formatDateTimeLocal,
  isFutureDateTime,
  normalizeDateTimePayload,
} from "@/utils/date-time";
import { ModalContent } from "@/components/ui/modal-content";
import Button from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import {
  CloseIcon,
  NoMovementIcon,
  PlusFileIcon,
  EditIcon,
  ReceiptIcon,
  SettingsIcon,
  ArrowRotateIcon,
  PaymentIcon,
  MoneyIcon,
  CalendarIcon,
} from "@/constants/icons";
import TextInput from "@/components/ui/text-input";

// ── UploadSection ─────────────────────────────────────────────────────────────

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

const SentDocumentsSection: React.FC<{
  documents: Document[];
  showOptions: boolean;
  onFileSelect: (file: File, type: "image" | "document") => void;
  onManualClick?: () => void;
}> = ({ documents, showOptions, onFileSelect, onManualClick }) => {
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
    if (isOpen) setIsVisible(true);
    else setIsVisible(false);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && formData.type !== "expense") onFormChange("type", "expense");
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
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}
      onClick={handleClose}
    >
      <div
        className={`bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-lg transform transition-all duration-300 ${isVisible ? "scale-100 translate-y-0 opacity-100" : "scale-95 translate-y-4 opacity-0"}`}
        onClick={(e) => e.stopPropagation()}
      >
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
          {submitError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {submitError}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria
                </label>
                <div className="relative">
                  <select
                    value={formData.category}
                    onChange={(e) => onFormChange("category", e.target.value)}
                    className={`w-full rounded-xl border px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 bg-white transition-colors appearance-none ${errors.category_id ? "border-red-500" : "border-gray-300"}`}
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

interface CategoryScreenProps {
  onCloseOrSuccess?: () => void;
  selectedCategory: Category | null;
  setSelectedCategory: (c: Category | null) => void;
  isCategoryModalOpen: boolean;
  setIsCategoryModalOpen: (open: boolean) => void;
  transactionDescription: string;
  setTransactionDescription: (desc: string) => void;
}

// ---------------------------------------------------------------------------
// TransactionHighlight — inline (was @/shared/components/transaction-highlight)
// ---------------------------------------------------------------------------

interface TransactionHighlightProps {
  title: string;
  description: string;
  amount: number;
  isIncome: boolean;
  category: string;
  timestamp?: string;
  icon: React.ElementType;
  badgeClassName: string;
  gradientClassName: string;
  iconAccentClass?: string;
}

const formatTimestampLabel = (timestamp?: string) => {
  if (!timestamp) return "Agora mesmo";

  let dateLabel: string | null = null;
  let timeLabel: string | null = null;

  const isoMatch = timestamp.match(
    /^(\d{4}-\d{2}-\d{2})(?:[T\s](\d{2}:\d{2})(?::\d{2})?)?/,
  );

  if (isoMatch) {
    const [, datePart, timePart] = isoMatch;
    const dateOnly = new Date(`${datePart}T00:00:00`);
    dateLabel = Number.isNaN(dateOnly.getTime())
      ? datePart
      : dateOnly.toLocaleDateString("pt-AO", {
          day: "2-digit",
          month: "short",
        });
    if (timePart) timeLabel = timePart;
  }

  if (!dateLabel || !timeLabel) {
    const parsedDate = new Date(timestamp);
    if (!Number.isNaN(parsedDate.getTime())) {
      dateLabel = parsedDate.toLocaleDateString("pt-AO", {
        day: "2-digit",
        month: "short",
      });
      timeLabel = parsedDate.toLocaleTimeString("pt-AO", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  }

  if (dateLabel && timeLabel) return `${dateLabel}, ${timeLabel}`;
  if (dateLabel) return dateLabel;
  return timestamp;
};

const TransactionHighlight: React.FC<TransactionHighlightProps> = ({
  title,
  description,
  amount,
  isIncome,
  category,
  timestamp,
  icon: Icon,
  badgeClassName,
  gradientClassName,
  iconAccentClass,
}) => {
  const formattedAmount = new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
    minimumFractionDigits: 2,
  }).format(Math.abs(amount));

  const formattedTimestamp = formatTimestampLabel(timestamp);

  return (
    <article className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white px-3 py-2 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${gradientClassName}`}
      />
      <div className="relative flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-inner ${
                iconAccentClass || "shadow-slate-100"
              }`}
            >
              <Icon className="h-4 w-4 text-slate-800" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-[13px] font-semibold text-gray-900 leading-tight line-clamp-1">
                {title}
              </h3>
              <p className="text-[11px] text-gray-500 leading-tight line-clamp-1">
                {description}
              </p>
              <span className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
                {formattedTimestamp}
              </span>
            </div>
          </div>
          <span
            className={`text-[10px] font-semibold uppercase tracking-wide rounded-full px-2 py-0.5 whitespace-nowrap ${badgeClassName}`}
          >
            {category}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p
            className={`text-sm sm:text-base font-semibold ${
              isIncome ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {isIncome ? "+" : "-"} {formattedAmount}
          </p>
          <div
            className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
              isIncome
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-700"
            }`}
          >
            {isIncome ? "Receita" : "Despesa"}
          </div>
        </div>
      </div>
    </article>
  );
};

// ---------------------------------------------------------------------------
// MovementSection — inline (was @/components/ui/movement-section)
// ---------------------------------------------------------------------------

interface MovementSectionProps {
  documents: Document[];
  isLoading?: boolean;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  error?: string | null;
}

type PaletteStyle = {
  gradient: string;
  badge: string;
  accent: string;
};

type PaletteSet = Record<string, PaletteStyle> & { default: PaletteStyle };

const EXPENSE_PALETTE: PaletteSet = {
  Habitação: {
    gradient: "from-orange-50/80 via-transparent to-transparent",
    badge: "bg-orange-100 text-orange-700",
    accent: "shadow-orange-200",
  },
  Alimentação: {
    gradient: "from-rose-50/80 via-transparent to-transparent",
    badge: "bg-rose-100 text-rose-700",
    accent: "shadow-rose-200",
  },
  Saúde: {
    gradient: "from-red-50/80 via-transparent to-transparent",
    badge: "bg-red-100 text-red-700",
    accent: "shadow-red-200",
  },
  Transporte: {
    gradient: "from-sky-50/80 via-transparent to-transparent",
    badge: "bg-sky-100 text-sky-700",
    accent: "shadow-sky-200",
  },
  default: {
    gradient: "from-slate-50/80 via-transparent to-transparent",
    badge: "bg-slate-100 text-slate-700",
    accent: "shadow-slate-200",
  },
};

const INCOME_PALETTE: PaletteSet = {
  Salário: {
    gradient: "from-emerald-50/80 via-transparent to-transparent",
    badge: "bg-emerald-100 text-emerald-700",
    accent: "shadow-emerald-200",
  },
  Investimentos: {
    gradient: "from-teal-50/80 via-transparent to-transparent",
    badge: "bg-teal-100 text-teal-700",
    accent: "shadow-teal-200",
  },
  default: {
    gradient: "from-lime-50/80 via-transparent to-transparent",
    badge: "bg-lime-100 text-lime-700",
    accent: "shadow-lime-200",
  },
};

const getPalette = (
  category: string | undefined,
  isIncome: boolean,
): PaletteStyle => {
  const palette = isIncome ? INCOME_PALETTE : EXPENSE_PALETTE;
  return palette[category ?? ""] ?? palette.default;
};

const MovementSection: React.FC<MovementSectionProps> = ({
  documents,
  isLoading,
  isRefreshing,
  onRefresh,
  error,
}) => {
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortField, setSortField] = useState<"date" | "amount">("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const transactionDocuments = useMemo(() => {
    const normalized = documents.map((doc, index) => {
      const amount =
        typeof (doc as any).amount === "number" ? (doc as any).amount : 0;
      const category =
        (doc as any).category ??
        (doc.type === "image"
          ? "Imagem"
          : doc.type === "document"
            ? "Documento"
            : "Movimento");
      const description = (doc as any).description ?? "Movimento registrado";
      const timestamp =
        (doc as any).timestamp ??
        new Date(Date.now() - index * 60 * 1000).toISOString();
      const isIncome =
        typeof (doc as any).isIncome === "boolean"
          ? (doc as any).isIncome
          : amount >= 0;

      return {
        ...(doc as any),
        amount,
        category,
        description,
        timestamp,
        isIncome,
      } as Document;
    });

    const filtered = normalized.filter((doc) => {
      if (categoryFilter === "all") return true;
      return doc.category === categoryFilter;
    });

    return filtered.sort((a, b) => {
      if (sortField === "amount") {
        const amountA = a.amount ?? 0;
        const amountB = b.amount ?? 0;
        return sortDirection === "desc" ? amountB - amountA : amountA - amountB;
      }
      const dateA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
      const dateB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
      return sortDirection === "desc" ? dateB - dateA : dateA - dateB;
    });
  }, [documents, categoryFilter, sortField, sortDirection]);

  useEffect(() => {
    setShowAllTransactions(false);
  }, [transactionDocuments, categoryFilter, sortField, sortDirection]);

  const totalTransactions = transactionDocuments.length;

  const visibleDocuments = useMemo(() => {
    if (showAllTransactions) return transactionDocuments;
    return transactionDocuments.slice(0, 5);
  }, [transactionDocuments, showAllTransactions]);

  const groupedTransactions = useMemo(() => {
    const groups = new Map<number, { label: string; items: Document[] }>();
    const today = new Date();
    const normalize = (d: Date) =>
      new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const todayKey = normalize(today).getTime();
    const yesterdayKey = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 1,
    ).getTime();

    visibleDocuments.forEach((doc) => {
      const ts = doc.timestamp ? new Date(doc.timestamp) : new Date();
      const keyDate = normalize(ts).getTime();
      let label: string;
      if (keyDate === todayKey) {
        label = "Hoje";
      } else if (keyDate === yesterdayKey) {
        label = "Ontem";
      } else {
        label = ts.toLocaleDateString("pt-AO", {
          day: "2-digit",
          month: "short",
        });
      }
      const currentGroup = groups.get(keyDate);
      if (currentGroup) {
        currentGroup.items.push(doc);
      } else {
        groups.set(keyDate, { label, items: [doc] });
      }
    });

    return Array.from(groups.entries())
      .sort((a, b) => b[0] - a[0])
      .map(([, value]) => value);
  }, [visibleDocuments]);

  const categoryOptions = useMemo(() => {
    const options = new Set<string>();
    documents.forEach((doc) => {
      if ((doc as any).category) options.add((doc as any).category as string);
    });
    return Array.from(options.values()).sort();
  }, [documents]);

  if (isLoading) {
    return (
      <section className="flex flex-col flex-1 min-h-0 pb-5 overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-sm font-bold uppercase text-gray-900">
              Últimas transações
            </h2>
            <p className="text-xs text-gray-500">Carregando transações...</p>
          </div>
          <div className="border-2 rounded-full border-gray-200 bg-gray-100 p-1">
            <SettingsIcon className="text-gray-500" />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="text-sm text-gray-500">Buscando dados...</div>
        </div>
      </section>
    );
  }

  const renderHighlight = (doc: Document, index: number) => {
    const isIncome = Boolean(doc.isIncome ?? (doc.amount ?? 0) > 0);
    const palette = getPalette(doc.category, isIncome);
    const IconComponent = isIncome ? MoneyIcon : PaymentIcon;

    return (
      <TransactionHighlight
        key={`${doc.name}-${doc.timestamp ?? index}`}
        title={doc.name}
        description={
          doc.description ??
          (isIncome
            ? "Receita sincronizada automaticamente"
            : "Despesa registrada a partir do comprovativo")
        }
        amount={doc.amount ?? 0}
        isIncome={isIncome}
        category={doc.category ?? (isIncome ? "Receita" : "Despesa")}
        timestamp={doc.timestamp}
        icon={IconComponent}
        badgeClassName={palette.badge}
        gradientClassName={palette.gradient}
        iconAccentClass={palette.accent}
      />
    );
  };

  if (!documents.length) {
    return (
      <section className="flex flex-col flex-1 min-h-full pb-5">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-sm font-bold uppercase text-gray-900">
              Últimas transações
            </h2>
            <p className="text-xs text-gray-500">
              Ainda não há movimentos registrados
            </p>
          </div>
          <div className="border-2 rounded-full border-gray-200 bg-gray-100 p-1">
            <SettingsIcon className="text-gray-500" />
          </div>
        </div>
        <div className="flex flex-1 min-h-0">
          <div className="bg-white rounded-xl my-4 mb-20 md:my-2 p-8 shadow-sm flex flex-col flex-1 min-h-0 items-center justify-center text-center overflow-hidden">
            <div className="flex flex-col items-center gap-2 mb-4">
              <NoMovementIcon className="mx-auto mb-2 text-gray-600" />
              <p className="text-lg font-semibold text-gray-900">
                Nenhum movimento registrado.
              </p>
              <p className="text-sm text-gray-500">
                {error
                  ? error
                  : "Faça upload de um comprovativo ou registre manualmente para visualizar aqui."}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col flex-1 h-full min-h-0 overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-sm font-bold uppercase text-gray-900">
            Últimas transações
          </h2>
          <p className="text-xs text-gray-500">
            Resumo das despesas e receitas recentes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onRefresh?.()}
            className="border rounded-full border-gray-200 bg-gray-50 p-2 text-gray-500 hover:bg-white transition"
            aria-label="Atualizar lista"
          >
            <ArrowRotateIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setIsFilterOpen(true)}
            className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 shadow-sm hover:shadow-md transition-all"
          >
            <Filter className="w-4 h-4" />
            Filtros
          </button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col flex-1 min-h-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto pr-1 space-y-4 py-4">
            {groupedTransactions.map(({ label, items }, groupIndex) => (
              <div key={`${label}-${groupIndex}`} className="space-y-1 px-4">
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500">
                  <CalendarIcon className="w-3 h-3" />
                  <span>{label}</span>
                </div>
                <div className="mt-1 space-y-2 border-t border-gray-100 pt-1">
                  {items.map((doc, index) => renderHighlight(doc, index))}
                </div>
              </div>
            ))}
          </div>

          {totalTransactions > 5 && (
            <div className="border-t border-gray-100 p-4 flex justify-center">
              <Button
                variant="secondary"
                onClick={() => setShowAllTransactions((prev) => !prev)}
                label={
                  showAllTransactions
                    ? "Mostrar menos"
                    : "Ver todos os movimentos"
                }
              />
            </div>
          )}
        </div>
      </div>

      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/20 px-4 transition-opacity duration-300 ${
          isFilterOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!isFilterOpen}
      >
        <div
          className={`w-full max-w-sm rounded-2xl bg-white shadow-2xl border border-gray-100 p-6 transform transition-all duration-300 ${
            isFilterOpen ? "scale-100 translate-y-0" : "scale-90 translate-y-4"
          }`}
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase font-semibold text-gray-400">
                Filtrar
              </p>
              <h3 className="text-lg font-semibold text-gray-800">
                Personalize a visualização
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsFilterOpen(false)}
              className="p-1 rounded-full hover:bg-gray-100"
              aria-label="Fechar filtros"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-2">
                Ordenar por
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <button
                  type="button"
                  onClick={() => {
                    setSortField("date");
                    setSortDirection("desc");
                  }}
                  className={`rounded-xl border px-3 py-2 transition ${
                    sortField === "date"
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  Data (recentes)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSortField("amount");
                    setSortDirection("desc");
                  }}
                  className={`rounded-xl border px-3 py-2 transition ${
                    sortField === "amount"
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  Montante (maior)
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Direção</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSortDirection("desc")}
                  className={`px-3 py-1.5 rounded-full border transition ${
                    sortDirection === "desc"
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-gray-200"
                  }`}
                >
                  Desc
                </button>
                <button
                  type="button"
                  onClick={() => setSortDirection("asc")}
                  className={`px-3 py-1.5 rounded-full border transition ${
                    sortDirection === "asc"
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-gray-200"
                  }`}
                >
                  Asc
                </button>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500 mb-2">
                Categoria
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setCategoryFilter("all")}
                  className={`px-3 py-1.5 text-xs rounded-full border transition ${
                    categoryFilter === "all"
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-gray-200 text-gray-600"
                  }`}
                >
                  Todas
                </button>
                {categoryOptions.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setCategoryFilter(category)}
                    className={`px-3 py-1.5 text-xs rounded-full border transition ${
                      categoryFilter === category
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-gray-200 text-gray-600"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-between text-sm">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-800"
              onClick={() => {
                setSortField("date");
                setSortDirection("desc");
                setCategoryFilter("all");
              }}
            >
              Limpar tudo
            </button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsFilterOpen(false)}
              label="Aplicar"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------------
// CategoryScreen
// ---------------------------------------------------------------------------

const CategoryScreen = ({
  onCloseOrSuccess,
  selectedCategory,
  setSelectedCategory,
  isCategoryModalOpen,
  setIsCategoryModalOpen,
  transactionDescription,
  setTransactionDescription,
}: CategoryScreenProps) => {
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
      {/* Mobile: Tela inteira para definir categoria */}
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
              <div className="flex justify-center mb-8">
                <button className="w-14 h-14 border-2 border-dashed border-blue-300 rounded-full flex items-center justify-center text-blue-500 hover:border-blue-400 hover:text-blue-600 transition-colors">
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
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

      {/* Desktop: Altera o conteúdo com base no estado de sucesso */}
      <div className="hidden md:block mt-2 w-full h-full overflow-y-auto">
        {showSuccessScreen ? (
          <div className="bg-white rounded-2xl shadow-lg w-full p-8 text-center flex flex-col items-center justify-center h-full">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                width="29"
                height="17"
                viewBox="0 0 29 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20.625 0.874725C20.5094 0.758845 20.372 0.666911 20.2208 0.604184C20.0696 0.541457 19.9075 0.509169 19.7438 0.509169C19.5801 0.509169 19.418 0.541457 19.2668 0.604184C19.1156 0.666911 18.9782 0.758845 18.8625 0.874725L11.8125 7.92472L13.575 9.68722L20.625 2.62472C21.1 2.14972 21.1 1.34972 20.625 0.874725ZM25.9251 0.862224L13.575 13.2122L9.22505 8.87472C8.99133 8.641 8.67433 8.5097 8.3438 8.5097C8.01327 8.5097 7.69627 8.641 7.46255 8.87472C7.22883 9.10845 7.09752 9.42544 7.09752 9.75597C7.09752 10.0865 7.22883 10.4035 7.46255 10.6372L12.6875 15.8622C13.175 16.3497 13.9625 16.3497 14.45 15.8622L27.6875 2.63722C27.8034 2.52158 27.8954 2.38422 27.9581 2.233C28.0208 2.08179 28.0531 1.91969 28.0531 1.75597C28.0531 1.59226 28.0208 1.43016 27.9581 1.27894C27.8954 1.12773 27.8034 0.990367 27.6875 0.874725H27.6751C27.5623 0.756727 27.4269 0.662584 27.2771 0.597884C27.1272 0.533184 26.9659 0.499244 26.8027 0.498078C26.6395 0.496912 26.4777 0.528544 26.3269 0.591097C26.1762 0.65365 26.0395 0.745849 25.9251 0.862224ZM0.400049 10.6497L5.62505 15.8747C6.11255 16.3622 6.90005 16.3622 7.38755 15.8747L8.26255 14.9997L2.16255 8.87472C2.04691 8.75884 1.90955 8.66691 1.75833 8.60418C1.60711 8.54146 1.44501 8.50917 1.2813 8.50917C1.11759 8.50917 0.955485 8.54146 0.804268 8.60418C0.653052 8.66691 0.515691 8.75884 0.400049 8.87472C-0.0874512 9.36222 -0.0874512 10.1622 0.400049 10.6497Z"
                  fill="#49B58F"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Categoria definida com sucesso
            </h3>
            <p className="text-sm text-gray-600">
              O movimento "Débito" foi definido na categoria{" "}
              {selectedCategory?.name.toLowerCase()}.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-4">
            <div className="mb-8">
              <h3 className="text-base font-medium text-gray-700 mb-6">
                Categorias padrão
              </h3>
              <div className="rounded-2xl border-2 border-gray-100 p-8">
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
                <div className="flex justify-end-safe mb-8">
                  <button className="w-14 h-14 border-2 border-dashed border-blue-300 rounded-full flex items-center justify-center text-blue-500 hover:border-blue-400 hover:text-blue-600 transition-colors">
                    <svg
                      className="w-7 h-7"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>
                </div>
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
                  className="w-full h-32 p-4 bg-white border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
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
        )}
      </div>

      {/* Modal de sucesso (overlay) */}
      {showSuccessScreen && (
        <div className="md:hidden fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                width="29"
                height="17"
                viewBox="0 0 29 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20.625 0.874725C20.5094 0.758845 20.372 0.666911 20.2208 0.604184C20.0696 0.541457 19.9075 0.509169 19.7438 0.509169C19.5801 0.509169 19.418 0.541457 19.2668 0.604184C19.1156 0.666911 18.9782 0.758845 18.8625 0.874725L11.8125 7.92472L13.575 9.68722L20.625 2.62472C21.1 2.14972 21.1 1.34972 20.625 0.874725ZM25.9251 0.862224L13.575 13.2122L9.22505 8.87472C8.99133 8.641 8.67433 8.5097 8.3438 8.5097C8.01327 8.5097 7.69627 8.641 7.46255 8.87472C7.22883 9.10845 7.09752 9.42544 7.09752 9.75597C7.09752 10.0865 7.22883 10.4035 7.46255 10.6372L12.6875 15.8622C13.175 16.3497 13.9625 16.3497 14.45 15.8622L27.6875 2.63722C27.8034 2.52158 27.8954 2.38422 27.9581 2.233C28.0208 2.08179 28.0531 1.91969 28.0531 1.75597C28.0531 1.59226 28.0208 1.43016 27.9581 1.27894C27.8954 1.12773 27.8034 0.990367 27.6875 0.874725H27.6751C27.5623 0.756727 27.4269 0.662584 27.2771 0.597884C27.1272 0.533184 26.9659 0.499244 26.8027 0.498078C26.6395 0.496912 26.4777 0.528544 26.3269 0.591097C26.1762 0.65365 26.0395 0.745849 25.9251 0.862224ZM0.400049 10.6497L5.62505 15.8747C6.11255 16.3622 6.90005 16.3622 7.38755 15.8747L8.26255 14.9997L2.16255 8.87472C2.04691 8.75884 1.90955 8.66691 1.75833 8.60418C1.60711 8.54146 1.44501 8.50917 1.2813 8.50917C1.11759 8.50917 0.955485 8.54146 0.804268 8.60418C0.653052 8.66691 0.515691 8.75884 0.400049 8.87472C-0.0874512 9.36222 -0.0874512 10.1622 0.400049 10.6497Z"
                  fill="#49B58F"
                />
              </svg>
            </div>
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

const HomeScreen = () => {
  const [pendingDocs, setPendingDocs] = useState<Document[]>([]);
  const [showUploadOptions, setShowUploadOptions] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
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
  const {
    transactions: rawTransactions,
    isLoading: isTransactionsLoading,
    isRefreshing: isTransactionsRefreshing,
    error: transactionsError,
    fetch: fetchTransactions,
    refresh: refreshTransactions,
  } = useTransactionStore();

  const documents = useMemo<Document[]>(
    () => [
      ...pendingDocs,
      ...rawTransactions.map((tx, index) => ({
        type: "transaction" as const,
        name: tx.description || tx.category?.name || `Transação ${index + 1}`,
        description: tx.description ?? undefined,
        amount: tx.amount,
        category: tx.category?.name ?? undefined,
        timestamp: tx.transactionDate,
        isIncome: tx.type === "income",
      })),
    ],
    [rawTransactions, pendingDocs],
  );
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

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleTransactionSubmit = useCallback(async () => {
    const success = await handleSubmit();
    if (success) {
      setPendingDocs([]);
      await refreshTransactions();
    }
    return success;
  }, [handleSubmit, refreshTransactions]);

  const handleOpenTransactionModal = () => {
    openModal();
  };

  const toggleUploadOptions = () => {
    setShowUploadOptions(!showUploadOptions);
  };

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

    setIsUploading(true);
    try {
      const result = await TransactionService.processDocumentTransaction(file, {
        documentType: type === "image" ? "IMAGE" : "DOCUMENT",
      });

      const extracted = result.ocr.extractedData ?? {};
      setPendingDocs((prev) => [
        {
          type: "transaction",
          name: extracted.description ?? file.name,
          description: extracted.description,
          amount: extracted.amount,
          timestamp: extracted.transactionDate,
        },
        ...prev,
      ]);
      showNotification(
        "success",
        "Comprovativo processado",
        "Transação criada automaticamente a partir do OCR.",
      );

      await refreshTransactions();
      setPendingDocs([]);
    } catch (error) {
      if (error instanceof ManualCompletionRequiredError) {
        setManualData({
          transactionId: error.transactionId,
          defaults: error.defaults,
        });
        showNotification(
          "info",
          "Dados incompletos",
          "Revise descrição, montante e data para concluir o comprovativo.",
        );
      } else {
        const message =
          error instanceof Error
            ? error.message
            : "Não foi possível processar o comprovativo.";
        showNotification("error", "Falha no processamento", message);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleCategoryCloseOrSuccess = () => {
    setShowUploadOptions(false);
  };

  const manualFormDefaults = manualData
    ? {
        description: manualData.defaults.description ?? "",
        amount: manualData.defaults.amount ?? null,
        transactionDate:
          manualData.defaults.transactionDate ?? new Date().toISOString(),
      }
    : null;

  const handleManualModalClose = () => {
    setManualData(null);
  };

  const handleManualModalSubmit = async ({
    description,
    amount,
    transactionDate,
  }: {
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
          description,
          amount,
          transactionDate,
          operationNumber: manualData.defaults.operationNumber,
          type: "expense",
        },
      );

      await refreshTransactions();
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

  return (
    <>
      {/* Container principal */}
      <main className="flex-1 mb-0 px-4 pb-6 flex flex-col h-full overflow-hidden">
          {isUploading ? (
            <div className="flex flex-1 items-center justify-center h-full">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              {/* Seção Superior */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-stretch m-0 h-auto transition-all duration-500 ease-out animate-slide-up hover:-translate-y-0.5">
                <div className="md:hidden flex flex-col flex-1">
                  <StatsSection />
                </div>
                <div className="hidden md:flex flex-col flex-1">
                  <UploadSection onUploadClick={toggleUploadOptions} />
                </div>
                <div className="hidden md:flex flex-1 items-center justify-center md:col-span-2">
                  <StatsSection />
                </div>
              </div>

              {/* Seção Principal */}
              <MainContent
                documents={documents}
                showUploadOptions={showUploadOptions}
                handleFileSelect={handleFileSelect}
                onCategoryCloseOrSuccess={handleCategoryCloseOrSuccess}
                onManualClick={handleOpenTransactionModal}
                isTransactionsLoading={isTransactionsLoading}
                isTransactionsRefreshing={isTransactionsRefreshing}
                transactionsError={transactionsError}
                onRefreshTransactions={refreshTransactions}
              />
            </>
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

const MainContent = ({
  documents,
  showUploadOptions,
  handleFileSelect,
  onCategoryCloseOrSuccess,
  onManualClick,
  isTransactionsLoading,
  isTransactionsRefreshing,
  transactionsError,
  onRefreshTransactions,
}: {
  documents: Document[];
  showUploadOptions: boolean;
  handleFileSelect: (file: File, type: "image" | "document") => void;
  onCategoryCloseOrSuccess: () => void;
  onManualClick: () => void;
  isTransactionsLoading: boolean;
  isTransactionsRefreshing: boolean;
  transactionsError: string | null;
  onRefreshTransactions: () => void;
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

  const rightContentDesktop = isCategoryModalOpen ? (
    <CategoryScreen {...categoryProps} />
  ) : (
    <MovementSection
      documents={documents}
      isLoading={isTransactionsLoading}
      isRefreshing={isTransactionsRefreshing}
      onRefresh={onRefreshTransactions}
      error={transactionsError}
    />
  );

  return (
    <>
      <div
        className={`flex flex-col flex-1 min-h-0 mt-3 md:mt-4 transition-all duration-500 ease-out animate-slide-up hover:-translate-y-0.5  ${
          showUploadOptions && "md:grid md:grid-cols-4 md:gap-4 md:h-full"
        }`}
      >
        {!showUploadOptions ? (
          <div className="flex flex-col flex-1 h-full min-h-0">
            {/* Mobile: Sempre MovementSection ou modais como overlay */}
            <div className="md:hidden flex flex-1 flex-col min-h-0">
              <MovementSection
                documents={documents}
                isLoading={isTransactionsLoading}
                isRefreshing={isTransactionsRefreshing}
                onRefresh={onRefreshTransactions}
                error={transactionsError}
              />
            </div>
            {/* Desktop: Substitui por modais se ativos, full width quando !showUploadOptions */}
            <div className="hidden md:block flex-col flex-1 h-full min-h-0">
              {rightContentDesktop}
            </div>
          </div>
        ) : (
          <>
            {/* Mobile: SentDocumentsSection full */}
            <div className="flex flex-col flex-1 h-full md:hidden">
              <SentDocumentsSection
                documents={[]}
                showOptions={true}
                onFileSelect={handleFileSelect}
                onManualClick={onManualClick}
              />
            </div>
            {/* Desktop: SentDocumentsSection sempre visível à esquerda */}
            <div className="md:flex items-start mt-2 h-full hidden">
              <SentDocumentsSection
                documents={[]}
                showOptions={true}
                onFileSelect={handleFileSelect}
                onManualClick={onManualClick}
              />
            </div>
            {/* Desktop: Área direita (substituição da MovementSection) */}
            <div className="sm:flex flex-col flex-1 h-full min-h-0 hidden col-span-3 md:block">
              {rightContentDesktop}
            </div>
          </>
        )}
      </div>
      {/* Mobile: Modais como overlay */}
      <div className="md:hidden">
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

export default HomeScreen;
