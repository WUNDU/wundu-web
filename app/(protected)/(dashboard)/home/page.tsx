"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
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
  TransactionDTO,
  TransactionFormData,
  TransactionFormField,
} from "@/types/dtos/transaction.dto";
import {
  formatDateTimeLocal,
  isFutureDateTime,
  normalizeDateTimePayload,
} from "@/utils/date-time";

import Button from "@/components/ui/button";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Filter,
  X,
  Car,
  UtensilsCrossed,
  Home as LucideHome,
  Heart,
  Gamepad2,
  BookOpen,
  Shirt,
  Smartphone,
  ShoppingCart,
  Flame,
  Wifi,
  Banknote,
  TrendingUp,
  Shield,
  Plane,
  Receipt as LucideReceipt,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";
import {
  CloseIcon,
  NoMovementIcon,
  PlusFileIcon,
  EditIcon,
  CardIcon,
  ArrowRotateIcon,
  CalendarIcon,
} from "@/constants/icons";
import TextInput from "@/components/ui/text-input";
import { formatAOA, maskAOAInput, parseAOA } from "@/lib/currency";
import { TransactionDetailPanel } from "@/components/ui/transaction-detail-panel";

// ── UploadSection ─────────────────────────────────────────────────────────────

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const SECTION_ENTER = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.2, ease: EASE_OUT as [number, number, number, number] },
};

const UploadSection: React.FC<{ onUploadClick: () => void }> = ({
  onUploadClick,
}) => (
  <motion.div
    {...SECTION_ENTER}
    whileHover={{ transition: { duration: 0.18, ease: EASE_OUT } }}
    className="group relative flex flex-col items-center justify-center p-3 sm:p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-[#ffd400]/60 transition-colors duration-300 cursor-pointer w-full h-full min-h-0 sm:min-h-[140px] overflow-hidden"
    onClick={onUploadClick}
    role="button"
    tabIndex={0}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-[#ffd400]/12 via-transparent to-[#003cc3]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <div className="relative z-10 flex flex-col items-center gap-2 sm:gap-3">
      <div className="relative p-3 bg-[#ffd400]/18 rounded-xl group-hover:bg-[#ffd400]/24 transition-colors duration-300 shadow-sm">
        <PlusFileIcon className="w-6 h-6 text-[#003cc3]" />
      </div>
      <p className="text-sm font-semibold text-slate-900 tracking-tight">
        Adicionar Transação
      </p>
    </div>
  </motion.div>
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
    <div className="flex flex-col gap-3 sm:gap-4">
      <button
        type="button"
        onClick={handleButtonClick}
        className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 border-2 border-dashed border-[rgba(0,60,195,0.15)] bg-[rgba(0,60,195,0.025)] rounded-xl text-left hover:bg-[rgba(0,60,195,0.04)] transition-colors"
      >
        <div className="flex-shrink-0 w-11 h-11 sm:w-14 sm:h-14 flex items-center justify-center bg-gradient-to-br from-[#003cc3] to-[#001a66] rounded-[13px] sm:rounded-[15px]">
          <CardIcon className="w-6 h-6 text-[#ffd400]" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">Enviar Comprovativo</p>
          <p className="text-xs text-slate-400">PDF do seu banco</p>
        </div>
      </button>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-xs text-slate-400 font-medium">ou</span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      <button
        type="button"
        onClick={handleManualButtonClick}
        className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3 text-left hover:bg-slate-100 transition-colors"
      >
        <EditIcon className="w-5 h-5 text-slate-500" />
        <div>
          <p className="text-sm font-bold text-slate-900">Lançamento Manual</p>
          <p className="text-xs text-slate-400">Registar manualmente</p>
        </div>
      </button>

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

const CATEGORIES = [
  { id: "food",      name: "Alimentação" },
  { id: "transport", name: "Transporte"  },
  { id: "housing",   name: "Moradia"     },
  { id: "health",    name: "Saúde"       },
  { id: "education", name: "Educação"    },
  { id: "leisure",   name: "Lazer"       },
  { id: "services",  name: "Serviços"    },
  { id: "others",    name: "Outros"      },
];

const inputCls = (hasError: boolean) =>
  `w-full rounded-xl border px-4 py-3 text-sm text-[#1e293b] placeholder:text-slate-400 bg-slate-50 focus:outline-none focus:bg-white transition-all ${
    hasError
      ? "border-red-300 focus:border-red-400"
      : "border-slate-200 focus:border-[#003cc3]/40"
  }`;

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
  const [amountDisplay, setAmountDisplay] = useState("");
  const { showNotification } = useUiStore();

  useEffect(() => {
    if (!isOpen) setAmountDisplay("");
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && formData.type !== "expense") onFormChange("type", "expense");
  }, [formData.type, isOpen, onFormChange]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskAOAInput(e.target.value);
    setAmountDisplay(masked);
    onFormChange("amount", parseAOA(masked));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onSubmit();
    if (success) {
      showNotification("success", "Transação Adicionada!", "Registada com sucesso.");
    }
  };

  const maxTransactionDate = formatDateTimeLocal();
  const maxLabel = new Date(maxTransactionDate).toLocaleString("pt-AO", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });

  const handleDateInvalid = (e: React.InvalidEvent<HTMLInputElement>) => {
    e.currentTarget.setCustomValidity(`Use uma data e hora iguais ou anteriores a ${maxLabel}.`);
  };
  const handleDateInput = (e: React.FormEvent<HTMLInputElement>) => {
    e.currentTarget.setCustomValidity("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/40"
          onClick={onClose}
        >
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white w-full sm:max-w-md max-h-[92dvh] overflow-y-auto rounded-t-[24px] sm:rounded-[20px] shadow-[0_8px_40px_rgba(0,60,195,0.16)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* drag handle – mobile only */}
            <div className="flex justify-center pt-3 pb-1 sm:hidden">
              <div className="w-10 h-1 rounded-full bg-slate-200" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[13px] bg-gradient-to-br from-[#003cc3] to-[#001a66] flex items-center justify-center shadow-sm">
                  <LucideReceipt className="w-4 h-4 text-[#ffd400]" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#1e293b] leading-tight">Nova Transação</h2>
                  <p className="text-xs text-slate-400">Registe um novo gasto</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-red-50 text-red-500 border border-red-100">
                  Despesa
                </span>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-[#1e293b] hover:bg-slate-100 transition-colors"
                >
                  <CloseIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-5 pt-5 pb-6 space-y-4">
              {/* Error */}
              {submitError && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-xl">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{submitError}</p>
                </div>
              )}

              {/* Amount + Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">Montante</label>
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder="0,00"
                      value={amountDisplay}
                      onChange={handleAmountChange}
                      required
                      className={`${inputCls(!!errors.amount)} pr-10`}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">
                      Kz
                    </span>
                  </div>
                  {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">Data e hora</label>
                  <input
                    type="datetime-local"
                    step={1}
                    max={maxTransactionDate}
                    value={formData.transactionDate}
                    onChange={(e) => onFormChange("transactionDate", e.target.value)}
                    onInvalid={handleDateInvalid}
                    onInput={handleDateInput}
                    required
                    className={`${inputCls(!!errors.transactionDate)} px-3`}
                  />
                  {errors.transactionDate && (
                    <p className="text-red-500 text-xs mt-1">{errors.transactionDate}</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">Descrição</label>
                <input
                  type="text"
                  placeholder="Ex: Compra no supermercado"
                  value={formData.description}
                  onChange={(e) => onFormChange("description", e.target.value)}
                  required
                  className={inputCls(!!errors.description)}
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                )}
              </div>

              {/* Category chips */}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">Categoria</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {CATEGORIES.map((cat) => {
                    const sel = formData.category === cat.name;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => onFormChange("category", cat.name)}
                        className={`rounded-xl py-2.5 px-1 text-[11px] font-semibold text-center transition-all ${
                          sel
                            ? "bg-[rgba(0,60,195,0.08)] border border-[#003cc3]/25 text-[#003cc3]"
                            : "bg-slate-50 border border-slate-200 text-slate-500 hover:border-[#003cc3]/20 hover:text-[#003cc3]"
                        }`}
                      >
                        {cat.name}
                      </button>
                    );
                  })}
                </div>
                {errors.category_id && (
                  <p className="text-red-500 text-xs mt-1">{errors.category_id}</p>
                )}
              </div>

              {/* Actions */}
              <div className="h-px bg-slate-100" />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 rounded-xl bg-gradient-to-br from-[#003cc3] to-[#001a66] px-4 py-3 text-sm font-bold text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                >
                  {isLoading ? "A adicionar…" : "Adicionar"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
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
  const [displayAmount, setDisplayAmount] = useState("");
  const [transactionDate, setTransactionDate] = useState("");

  useEffect(() => {
    if (defaults) {
      setDescription(defaults.description ?? "");
      setDisplayAmount(
        defaults.amount !== null && defaults.amount !== undefined
          ? formatAOA(defaults.amount)
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
    if (!description || !displayAmount || !transactionDate) return;
    await onSubmit({ description, amount: parseFloat(parseAOA(displayAmount)) || 0, transactionDate });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl bg-white p-4 shadow-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4">
          <h2 className="text-sm font-bold text-gray-900">
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
            type="text"
            inputMode="decimal"
            value={displayAmount}
            onChange={(e) => setDisplayAmount(maskAOAInput(e.target.value))}
            required
            placeholder="0,00"
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
// getCategoryStyle — mobile-matching category color/icon mapping
// ---------------------------------------------------------------------------

type CategoryStyle = { icon: LucideIcon; color: string; bg: string };

const CATEGORY_STYLES: { pattern: RegExp; style: CategoryStyle }[] = [
  { pattern: /transport|carro|taxi|uber/i, style: { icon: Car, color: "#3B82F6", bg: "rgba(59,130,246,0.1)" } },
  { pattern: /alimenta|comida|restaur|café/i, style: { icon: UtensilsCrossed, color: "#F97316", bg: "rgba(249,115,22,0.1)" } },
  { pattern: /habita|renda|aluguel|imov|morad/i, style: { icon: LucideHome, color: "#8B5CF6", bg: "rgba(139,92,246,0.1)" } },
  { pattern: /saúde|médic|farmác/i, style: { icon: Heart, color: "#10B981", bg: "rgba(16,185,129,0.1)" } },
  { pattern: /lazer|entret|cinema|jogo/i, style: { icon: Gamepad2, color: "#EC4899", bg: "rgba(236,72,153,0.1)" } },
  { pattern: /educa|escola|curso|livro/i, style: { icon: BookOpen, color: "#0EA5E9", bg: "rgba(14,165,233,0.1)" } },
  { pattern: /vestuário|roupa|moda/i, style: { icon: Shirt, color: "#F59E0B", bg: "rgba(245,158,11,0.1)" } },
  { pattern: /tecnolog|tel|celul/i, style: { icon: Smartphone, color: "#6366F1", bg: "rgba(99,102,241,0.1)" } },
  { pattern: /mercado|superm|compra/i, style: { icon: ShoppingCart, color: "#14B8A6", bg: "rgba(20,184,166,0.1)" } },
  { pattern: /combust|gasolina/i, style: { icon: Flame, color: "#EF4444", bg: "rgba(239,68,68,0.1)" } },
  { pattern: /internet|comunic/i, style: { icon: Wifi, color: "#06B6D4", bg: "rgba(6,182,212,0.1)" } },
  { pattern: /salário|rendimento/i, style: { icon: Banknote, color: "#10B981", bg: "rgba(16,185,129,0.1)" } },
  { pattern: /investimento/i, style: { icon: TrendingUp, color: "#003cc3", bg: "rgba(0,60,195,0.1)" } },
  { pattern: /seguro/i, style: { icon: Shield, color: "#64748b", bg: "rgba(100,116,139,0.1)" } },
  { pattern: /viagem|férias/i, style: { icon: Plane, color: "#8B5CF6", bg: "rgba(139,92,246,0.1)" } },
];

const DEFAULT_CATEGORY_STYLE: CategoryStyle = {
  icon: LucideReceipt,
  color: "#00216b",
  bg: "rgba(0,33,107,0.08)",
};

const getCategoryStyle = (category: string): CategoryStyle => {
  const match = CATEGORY_STYLES.find(({ pattern }) => pattern.test(category));
  return match?.style ?? DEFAULT_CATEGORY_STYLE;
};

// ---------------------------------------------------------------------------
// TransactionHighlight — mobile-matching design
// ---------------------------------------------------------------------------

interface TransactionHighlightProps {
  title: string;
  amount: number;
  isIncome: boolean;
  category: string;
  timestamp?: string;
  index: number;
  onClick?: () => void;
}

const TransactionHighlight: React.FC<TransactionHighlightProps> = ({
  title,
  amount,
  isIncome,
  category,
  timestamp,
  index,
  onClick,
}) => {
  const { icon: Icon, color, bg } = getCategoryStyle(category);

  const formattedAmount = formatAOA(Math.abs(amount));

  const timeLabel = timestamp
    ? new Date(timestamp).toLocaleTimeString("pt-AO", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.2,
        ease: "easeOut" as const,
        delay: Math.min(index * 0.03, 0.25),
      }}
      className={`flex items-center gap-2 sm:gap-3 px-3 py-2 sm:px-5 sm:py-3${onClick ? " cursor-pointer hover:bg-slate-50/60 transition-colors" : ""}`}
      onClick={onClick}
    >
      <div
        className="flex-shrink-0 flex items-center justify-center w-10 h-10 sm:w-[46px] sm:h-[46px] rounded-[13px] sm:rounded-[15px]"
        style={{ backgroundColor: bg }}
      >
        <Icon className="w-[18px] h-[18px] sm:w-[22px] sm:h-[22px]" style={{ color }} />
      </div>

      <div className="flex-1 min-w-0">
        <p
          className="font-bold leading-tight truncate"
          style={{ color: "#1e293b", fontSize: 14 }}
        >
          {title}
        </p>
        <div className="flex items-center gap-1.5 mt-1">
          <span
            className="inline-block"
            style={{
              backgroundColor: bg,
              color,
              fontSize: 10,
              fontWeight: 700,
              paddingLeft: 8,
              paddingRight: 8,
              paddingTop: 2,
              paddingBottom: 2,
              borderRadius: 20,
            }}
          >
            {category}
          </span>
          {timeLabel && (
            <span style={{ color: "#94a3b8", fontSize: 10 }}>{timeLabel}</span>
          )}
        </div>
      </div>

      <div
        className="flex-shrink-0"
        style={{
          backgroundColor: isIncome
            ? "rgba(16,185,129,0.08)"
            : "rgba(239,68,68,0.08)",
          paddingLeft: 10,
          paddingRight: 10,
          paddingTop: 6,
          paddingBottom: 6,
          borderRadius: 20,
        }}
      >
        <span
          style={{
            fontWeight: 800,
            color: isIncome ? "#10B981" : "#EF4444",
          }}
          className="text-[12px] sm:text-[13px]"
        >
          {isIncome ? "+" : "-"} {formattedAmount}
        </span>
      </div>
    </motion.div>
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

const MovementSection: React.FC<MovementSectionProps> = ({
  documents,
  isLoading,
  isRefreshing,
  onRefresh,
  error,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortField, setSortField] = useState<"date" | "amount">("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionDTO | null>(null);

  const { transactions: rawTransactions } = useTransactionStore();

  const handleTransactionClick = useCallback((doc: Document) => {
    const found = rawTransactions.find(
      (tx) => tx.amount === doc.amount && tx.transactionDate === doc.timestamp,
    );
    if (found) setSelectedTransaction(found);
  }, [rawTransactions]);

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

  const totalTransactions = transactionDocuments.length;

  const visibleDocuments = useMemo(() => {
    return transactionDocuments.slice(0, 10);
  }, [transactionDocuments]);

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
        <div className="bg-white rounded-[20px] shadow-[0_4px_16px_rgba(0,60,195,0.08)] overflow-hidden">
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <h2 className="font-bold text-[#1e293b]" style={{ fontSize: 16 }}>
              Transações
            </h2>
          </div>
          <div className="flex flex-1 items-center justify-center py-12">
            <div className="text-sm text-slate-400">Buscando dados...</div>
          </div>
        </div>
      </section>
    );
  }

  if (!documents.length) {
    return (
      <section className="flex flex-col flex-1 min-h-full pb-5">
        <div className="bg-white rounded-[20px] shadow-[0_4px_16px_rgba(0,60,195,0.08)] overflow-hidden">
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <h2 className="font-bold text-[#1e293b]" style={{ fontSize: 16 }}>
              Transações
            </h2>
          </div>
          <div className="flex flex-col items-center justify-center py-12 text-center px-5">
            <NoMovementIcon className="mx-auto mb-3 text-slate-300" />
            <p className="text-base font-semibold text-slate-900">
              Nenhum movimento registrado.
            </p>
            <p className="text-sm text-slate-400 mt-1.5">
              {error
                ? error
                : "Faça upload de um comprovativo ou registre manualmente para visualizar aqui."}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: EASE_OUT }}
      className="flex flex-col gap-3"
    >
      <div className="bg-white rounded-[20px] shadow-[0_4px_16px_rgba(0,60,195,0.08)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h2 className="font-bold text-[#1e293b]" style={{ fontSize: 16 }}>
            Transações
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onRefresh?.()}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-[#003cc3] hover:border-[#003cc3]/20 transition-all duration-300"
              aria-label="Atualizar lista"
            >
              <ArrowRotateIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setIsFilterOpen(true)}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-[#003cc3] hover:border-[#003cc3]/20 transition-all duration-300"
            >
              <Filter className="w-4 h-4" />
            </button>
            {totalTransactions > 10 && (
              <Link
                href="/home/transactions"
                className="inline-flex items-center gap-1 bg-[rgba(0,60,195,0.08)] text-[#003cc3] text-xs font-bold px-2.5 py-1.5 rounded-full hover:bg-[rgba(0,60,195,0.12)] transition-colors"
              >
                Ver todas
                <ChevronRight className="w-3 h-3" />
              </Link>
            )}
          </div>
        </div>

        {/* Transaction list */}
        <div className="pb-3">
          {groupedTransactions.map(({ label, items }, groupIndex) => (
            <div key={`${label}-${groupIndex}`}>
              <div className="px-5 py-2">
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5"
                  style={{ backgroundColor: "rgba(0,60,195,0.06)" }}
                >
                  <CalendarIcon className="w-[11px] h-[11px] text-[#003cc3]" />
                  <span className="text-[#003cc3] font-bold text-xs">
                    {label}
                  </span>
                </span>
              </div>
              {items.map((doc, index) => {
                const isIncome = Boolean(
                  doc.isIncome ?? (doc.amount ?? 0) > 0,
                );
                return (
                  <React.Fragment
                    key={`${doc.name}-${doc.timestamp ?? index}-${index}`}
                  >
                    <TransactionHighlight
                      title={doc.name}
                      amount={doc.amount ?? 0}
                      isIncome={isIncome}
                      category={
                        doc.category ?? (isIncome ? "Receita" : "Despesa")
                      }
                      timestamp={doc.timestamp}
                      index={groupIndex * 10 + index}
                      onClick={() => handleTransactionClick(doc)}
                    />
                    {index < items.length - 1 && (
                      <div
                        className="h-px mx-5"
                        style={{
                          backgroundColor: "rgba(0,33,107,0.05)",
                        }}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          ))}

          {totalTransactions === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3">
                <NoMovementIcon className="w-6 h-6 text-slate-200" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">
                Nenhuma transação encontrada
              </h3>
              <p className="text-sm text-slate-400 mt-1.5">
                Tente ajustar seus filtros ou faça um novo upload.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Filter Modal */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: EASE_OUT }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/45"
          >
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.22, ease: EASE_OUT }}
              className="w-full max-w-md bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
            >
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Filtros</h3>
                <p className="text-xs text-slate-500">Personalize sua visualização</p>
              </div>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="p-2 rounded-xl hover:bg-slate-200 text-slate-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
                <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 block">Ordenar por</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => { setSortField("date"); setSortDirection("desc"); }}
                    className={`px-3 py-2.5 rounded-xl text-sm font-semibold border transition-all ${sortField === "date" ? "bg-amber-600 border-amber-600 text-white shadow-sm" : "bg-white border-slate-200 text-slate-600 hover:border-amber-200"}`}
                  >
                    Mais recentes
                  </button>
                  <button
                    onClick={() => { setSortField("amount"); setSortDirection("desc"); }}
                    className={`px-3 py-2.5 rounded-xl text-sm font-semibold border transition-all ${sortField === "amount" ? "bg-amber-600 border-amber-600 text-white shadow-sm" : "bg-white border-slate-200 text-slate-600 hover:border-amber-200"}`}
                  >
                    Maior valor
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 block">Categorias</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setCategoryFilter("all")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${categoryFilter === "all" ? "bg-slate-900 border-slate-900 text-white" : "bg-slate-50 border-slate-100 text-slate-500 hover:bg-white hover:border-slate-200"}`}
                  >
                    Todas
                  </button>
                  {categoryOptions.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${categoryFilter === cat ? "bg-slate-900 border-slate-900 text-white" : "bg-slate-50 border-slate-100 text-slate-500 hover:bg-white hover:border-slate-200"}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex gap-3">
              <button
                onClick={() => { setSortField("date"); setSortDirection("desc"); setCategoryFilter("all"); }}
                className="flex-1 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
              >
                Limpar
              </button>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="flex-1 px-3 py-2.5 rounded-xl bg-[#003cc3] text-white text-sm font-bold hover:bg-[#0033a8] transition-colors shadow-sm"
              >
                Aplicar
              </button>
            </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <TransactionDetailPanel
        transaction={selectedTransaction}
        isOpen={selectedTransaction !== null}
        onClose={() => setSelectedTransaction(null)}
      />
    </motion.div>
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
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);

  const handleCategorySelect = (category: Category) =>
    setSelectedCategory(category);

  const handleSave = () => {
    if (selectedCategory && transactionDescription.trim()) {
      setShowSuccessScreen(true);
      setTimeout(() => {
        setShowSuccessScreen(false);
        setIsCategoryModalOpen(false);
        setSelectedCategory(null);
        setTransactionDescription("");
        onCloseOrSuccess?.();
      }, 2000);
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
            <h2 className="text-base font-semibold text-gray-900">Categorias</h2>
            <div className="w-10"></div>
          </div>
          <div className="p-4 bg-gray-100 rounded-xl">
            <div className="bg-white rounded-xl p-4">
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-4">
                  Categorias padrão
                </h3>
                <div className="flex flex-wrap gap-3">
                  {defaultCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(category)}
                      className={`px-5 py-3 rounded-full text-sm font-medium transition-all ${
                        selectedCategory?.id === category.id
                          ? "bg-yellow-400 text-white shadow-sm scale-105"
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

      {/* Desktop: Altera o conteúdo com base no estado de sucesso */}
      <div className="hidden md:block mt-2 w-full h-full overflow-y-auto">
        {showSuccessScreen ? (
          <div className="bg-white rounded-xl shadow-sm w-full p-4 text-center flex flex-col items-center justify-center h-full">
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
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Categoria definida com sucesso
            </h3>
            <p className="text-sm text-gray-600">
              O movimento "Débito" foi definido na categoria{" "}
              {selectedCategory?.name.toLowerCase()}.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl p-4">
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-4">
                Categorias padrão
              </h3>
              <div className="rounded-xl border-2 border-gray-100 p-4">
                <div className="flex flex-wrap gap-3">
                  {defaultCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(category)}
                      className={`px-5 py-3 rounded-full text-sm font-medium transition-all ${
                        selectedCategory?.id === category.id
                          ? "bg-yellow-400 text-white shadow-sm scale-105"
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
          <div className="bg-white rounded-xl shadow-sm w-full max-w-sm p-4 text-center">
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
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
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

  const iconMap = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  };

  const bgMap = {
    success: "bg-emerald-50 text-emerald-600",
    error: "bg-rose-50 text-rose-600",
    info: "bg-blue-50 text-blue-600",
  };

  return createPortal(
    <div className="fixed top-6 right-6 z-[100] w-full max-w-sm animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-auto">
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-3 flex items-center gap-3">
        <div className={`p-2 rounded-xl ${bgMap[notification.type]}`}>
          {iconMap[notification.type]}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-900">{notification.title}</p>
          <p className="text-xs text-slate-500 truncate">{notification.message}</p>
        </div>
        <button onClick={closeNotification} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
          <CloseIcon className="w-4 h-4 text-slate-400" />
        </button>
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
  const { user } = useUserStore();
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
    <div className="w-full max-w-[1360px] mx-auto flex flex-col gap-3">
      {/* Header da Página */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: EASE_OUT }}
        className="flex flex-col gap-1"
      >
        <h2 className="text-sm font-bold text-slate-900 tracking-tight">
          Olá, {user?.name?.split(" ")[0] || "Usuário"}! 👋
        </h2>
        <p className="text-sm text-slate-500 font-medium">
          Aqui está o que está acontecendo com suas finanças hoje.
        </p>
      </motion.div>

      {isUploading ? (
        <div className="flex flex-1 items-center justify-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {/* Grid de Cards Superiores - Alinhados e Proporcionais */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
            <div className="lg:col-span-4 flex">
              <UploadSection onUploadClick={toggleUploadOptions} />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: EASE_OUT, delay: 0.08 }}
              className="lg:col-span-8 flex"
            >
              <StatsSection />
            </motion.div>
          </div>

          {/* Seção de Conteúdo Principal */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: EASE_OUT, delay: 0.12 }}
            className="min-h-[320px] lg:min-h-[360px]"
          >
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
          </motion.div>
        </div>
      )}

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
    </div>
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
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
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
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: EASE_OUT }}
      className="flex flex-col xl:flex-row gap-3 items-start h-full"
    >
      <AnimatePresence initial={false}>
        {showUploadOptions && (
          <motion.div
            key="upload-options-panel"
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -14 }}
            transition={{ duration: 0.24, ease: EASE_OUT }}
            className="w-full xl:w-[300px] flex-shrink-0"
          >
            <div className="bg-white rounded-xl border border-slate-100 p-3 lg:p-4 shadow-sm">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-[0.14em] mb-4 text-center lg:text-left">
                Opções de Envio
              </h3>
              <UploadOptions
                onFileSelect={handleFileSelect}
                onManualClick={onManualClick}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex-1 min-w-0 w-full h-full">
        <AnimatePresence mode="wait" initial={false}>
          {isCategoryModalOpen ? (
            <motion.div
              key="category-panel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.18, ease: EASE_OUT }}
              className="h-full"
            >
              <CategoryScreen {...categoryProps} />
            </motion.div>
          ) : (
            <motion.div
              key="movement-panel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2, ease: EASE_OUT }}
              className="h-full"
            >
              <MovementSection
                documents={documents}
                isLoading={isTransactionsLoading}
                isRefreshing={isTransactionsRefreshing}
                onRefresh={onRefreshTransactions}
                error={transactionsError}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default HomeScreen;
