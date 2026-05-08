"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import type { TransactionDTO, TransactionStatus } from "@/types/dtos/transaction.dto";
import type { LucideIcon } from "lucide-react";
import {
  X,
  Calendar,
  FileText,
  Building2,
  Hash,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Pencil,
  Loader2,
  Check,
} from "lucide-react";
import { formatAOA } from "@/lib/currency";
import { CategorySelect } from "@/components/ui/category-select";
import { useTransactionStore } from "@/store/transaction-store";
import { getCategoryStyle } from "@/utils/category-style";

/* ------------------------------------------------------------------ */
/*  Status config                                                      */
/* ------------------------------------------------------------------ */

const STATUS_CONFIG: Record<string, { label: string; bg: string; color: string; icon: LucideIcon }> = {
  CONFIRMED: { label: "Concluído", bg: "rgba(16,185,129,0.12)", color: "#059669", icon: CheckCircle2 },
  PENDING: { label: "Pendente", bg: "rgba(245,158,11,0.12)", color: "#D97706", icon: AlertCircle },
  NOT_RECOGNIZED: { label: "Não reconhecido", bg: "rgba(239,68,68,0.12)", color: "#DC2626", icon: XCircle },
  ERROR_OCR: { label: "Erro OCR", bg: "rgba(239,68,68,0.12)", color: "#DC2626", icon: XCircle },
  AWAITING_USER_INPUT: { label: "Aguardando", bg: "rgba(245,158,11,0.12)", color: "#D97706", icon: AlertCircle },
};

const DEFAULT_STATUS = STATUS_CONFIG.PENDING;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatDate(d: string) {
  try {
    return new Date(d).toLocaleDateString("pt-AO", { day: "2-digit", month: "long", year: "numeric" });
  } catch {
    return d;
  }
}

function formatDateTime(d: string) {
  try {
    return new Date(d).toLocaleString("pt-AO", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch {
    return d;
  }
}

function toDateInputValue(iso: string | undefined): string {
  if (!iso) return "";
  try {
    return new Date(iso).toISOString().split("T")[0];
  } catch {
    return "";
  }
}

/* ------------------------------------------------------------------ */
/*  InfoRow                                                            */
/* ------------------------------------------------------------------ */

function InfoRow({
  icon: Icon,
  label,
  value,
  valueColor,
  valueBg,
  badge,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  valueColor?: string;
  valueBg?: string;
  badge?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 py-3.5">
      <div className="w-9 h-9 rounded-[10px] bg-[#F8FAFC] flex items-center justify-center flex-shrink-0">
        <Icon className="w-[17px] h-[17px] text-[#94a3b8]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-wider mb-0.5">
          {label}
        </p>
        {badge ? (
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[13px] font-bold"
            style={{ backgroundColor: valueBg, color: valueColor }}
          >
            <Icon className="w-[13px] h-[13px]" />
            {value}
          </span>
        ) : (
          <p className="text-sm font-semibold" style={{ color: valueColor ?? "#1e293b" }}>
            {value}
          </p>
        )}
      </div>
    </div>
  );
}

function Divider() {
  return <div className="ml-12 border-t border-slate-100" />;
}

/* ------------------------------------------------------------------ */
/*  Source labels                                                      */
/* ------------------------------------------------------------------ */

const SOURCE_LABELS: Record<string, string> = {
  AUTOMATICO: "Automático",
  MANUAL: "Manual",
  PDF: "PDF",
  IMG: "Imagem",
};

/* ------------------------------------------------------------------ */
/*  Edit form                                                          */
/* ------------------------------------------------------------------ */

interface EditFormState {
  amount: string;
  description: string;
  transactionDate: string;
  categoryName: string;
}

function EditForm({
  tx,
  onSave,
  onCancel,
}: {
  tx: TransactionDTO;
  onSave: (form: EditFormState) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<EditFormState>({
    amount: tx.amount != null ? String(tx.amount) : "",
    description: tx.description ?? "",
    transactionDate: toDateInputValue(tx.transactionDate),
    categoryName: tx.category?.name ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const field = (key: keyof EditFormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(form.amount.replace(",", "."));
    if (!form.amount || isNaN(parsed) || parsed <= 0) {
      setError("Montante inválido.");
      return;
    }
    if (!form.transactionDate) {
      setError("Data obrigatória.");
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await onSave({ ...form, amount: String(parsed) });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao guardar.");
      setSaving(false);
    }
  };

  const inputCls =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#1e293b] focus:outline-none focus:border-[#003cc3]/40 focus:ring-4 focus:ring-[#003cc3]/[0.06] transition-all";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-5 pt-6 pb-8">
      <h3 className="text-sm font-bold text-[#1e293b] mb-1">Editar transação</h3>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-600">Montante (Kz)</label>
        <input
          type="number"
          step="0.01"
          min="0.01"
          value={form.amount}
          onChange={field("amount")}
          className={inputCls}
          placeholder="0.00"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-600">Descrição</label>
        <input
          type="text"
          value={form.description}
          onChange={field("description")}
          className={inputCls}
          placeholder="Descrição da transação"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-600">Data</label>
        <input
          type="date"
          value={form.transactionDate}
          onChange={field("transactionDate")}
          className={inputCls}
        />
      </div>

      <CategorySelect
        valueType="name"
        value={form.categoryName}
        onChange={(v) => setForm((f) => ({ ...f, categoryName: v }))}
        label="Categoria"
        placeholder="Selecione uma categoria"
      />

      {error && (
        <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
      )}

      <div className="flex gap-3 mt-1">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex-1 py-3 rounded-xl bg-[#003cc3] text-sm font-bold text-white hover:bg-[#0033a8] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              A guardar…
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              Guardar
            </>
          )}
        </button>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/*  PanelContent                                                       */
/* ------------------------------------------------------------------ */

function PanelContent({ tx: initialTx, onClose }: { tx: TransactionDTO; onClose: () => void }) {
  const updateStore = useTransactionStore((s) => s.update);
  const [tx, setTx] = useState<TransactionDTO>(initialTx);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setTx(initialTx);
    setIsEditing(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTx.id]);

  const isExpense = tx.type === "EXPENSE";
  const categoryName = tx.category?.name || "Outro";
  const { icon: CategoryIcon } = getCategoryStyle(categoryName);
  const statusCfg = STATUS_CONFIG[tx.status as string] ?? DEFAULT_STATUS;
  const formattedAmount = formatAOA(Math.abs(tx.amount));

  const gradientFrom = isExpense ? "#4c0519" : "#052e16";
  const gradientVia = isExpense ? "#9f1239" : "#065f46";
  const gradientTo = isExpense ? "#be185d" : "#0f766e";

  const handleSave = async (form: EditFormState) => {
    if (!tx.id) return;
    const payload = {
      source: tx.source,
      amount: parseFloat(form.amount),
      description: form.description,
      transactionDate: form.transactionDate
        ? new Date(form.transactionDate + "T12:00:00").toISOString()
        : tx.transactionDate,
      ...(form.categoryName ? { category: { name: form.categoryName } } : {}),
    };
    const updated = await updateStore(tx.id, payload);
    if (updated) {
      setTx({
        ...tx,
        ...payload,
        category: updated.category ?? tx.category,
      });
      setIsEditing(false);
    }
  };

  return (
    <>
      {/* Gradient Header */}
      <div
        className="flex-shrink-0"
        style={{
          background: `linear-gradient(135deg, ${gradientFrom}, ${gradientVia}, ${gradientTo})`,
        }}
      >
        <div className="px-5 pt-5 pb-14">
          {/* Close + Title + Edit + Badge */}
          <div className="flex items-center gap-3 mb-7">
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-[14px] flex items-center justify-center transition-colors"
              style={{
                backgroundColor: "rgba(255,255,255,0.15)",
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: "rgba(255,255,255,0.2)",
              }}
            >
              <X className="w-5 h-5 text-white" />
            </button>
            <span className="flex-1 text-[17px] font-extrabold text-white tracking-tight">
              Detalhes
            </span>
            {tx.id && (
              <button
                onClick={() => setIsEditing((v) => !v)}
                className="w-10 h-10 rounded-[14px] flex items-center justify-center transition-colors"
                style={{
                  backgroundColor: isEditing ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.15)",
                  borderWidth: 1,
                  borderStyle: "solid",
                  borderColor: "rgba(255,255,255,0.2)",
                }}
                title="Editar transação"
              >
                <Pencil className="w-4 h-4 text-white" />
              </button>
            )}
            <span
              className="px-3 py-1.5 rounded-full text-white text-xs font-bold"
              style={{ backgroundColor: "rgba(255,255,255,0.18)" }}
            >
              {isExpense ? "Despesa" : "Receita"}
            </span>
          </div>

          {/* Category Icon */}
          <div className="flex flex-col items-center gap-2 mb-4">
            <div
              className="w-16 h-16 rounded-[22px] flex items-center justify-center"
              style={{
                backgroundColor: "rgba(255,255,255,0.18)",
                borderWidth: 2,
                borderStyle: "solid",
                borderColor: "rgba(255,255,255,0.25)",
              }}
            >
              <CategoryIcon className="w-7 h-7 text-white" />
            </div>
            <span className="text-base font-bold" style={{ color: "rgba(255,255,255,0.85)" }}>
              {categoryName}
            </span>
          </div>

          {/* Amount hero */}
          <p className="text-center text-white font-black text-4xl tracking-tighter leading-tight">
            {isExpense ? "-" : "+"} {formattedAmount}{" "}
            <span className="text-xl font-bold opacity-75">Kz</span>
          </p>

          {/* Date pill */}
          {tx.transactionDate && (
            <div className="flex justify-center mt-2.5">
              <span
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full"
                style={{ backgroundColor: "rgba(255,255,255,0.14)" }}
              >
                <Calendar className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.7)" }} />
                <span className="text-[13px] font-semibold" style={{ color: "rgba(255,255,255,0.8)" }}>
                  {formatDate(tx.transactionDate)}
                </span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Details / Edit Card */}
      <div className="flex-1 overflow-y-auto bg-white rounded-t-[20px] -mt-8 relative z-10">
        <AnimatePresence mode="wait" initial={false}>
          {isEditing ? (
            <motion.div
              key="edit-form"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <EditForm tx={tx} onSave={handleSave} onCancel={() => setIsEditing(false)} />
            </motion.div>
          ) : (
            <motion.div
              key="detail-view"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="px-5 pt-7 pb-12"
            >
              <InfoRow
                icon={statusCfg.icon}
                label="Status"
                value={statusCfg.label}
                valueColor={statusCfg.color}
                valueBg={statusCfg.bg}
                badge
              />
              <Divider />

              {tx.description && (
                <>
                  <InfoRow icon={FileText} label="Descrição" value={tx.description} />
                  <Divider />
                </>
              )}

              {tx.source && (
                <>
                  <InfoRow icon={Building2} label="Fonte" value={SOURCE_LABELS[tx.source] ?? tx.source} />
                  <Divider />
                </>
              )}

              {tx.operationNumber && (
                <>
                  <InfoRow icon={Hash} label="Nº de Operação" value={tx.operationNumber} />
                  <Divider />
                </>
              )}

              {tx.transactionDate && (
                <>
                  <InfoRow icon={Calendar} label="Data da transação" value={formatDate(tx.transactionDate)} />
                  <Divider />
                </>
              )}

              {tx.createdAt && (
                <InfoRow icon={Clock} label="Registado em" value={formatDateTime(tx.createdAt)} valueColor="#94a3b8" />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  TransactionDetailPanel                                             */
/* ------------------------------------------------------------------ */

const PANEL_ENTER: [number, number, number, number] = [0, 0, 0.2, 1];
const PANEL_EXIT:  [number, number, number, number] = [0.4, 0, 1, 1];

export interface TransactionDetailPanelProps {
  transaction: TransactionDTO | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TransactionDetailPanel({ transaction, isOpen, onClose }: TransactionDetailPanelProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (typeof window === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && transaction && (
        <>
          {/* Backdrop */}
          <motion.div
            key="tx-detail-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] bg-black/30"
            onClick={onClose}
          />

          {/* Desktop side panel (lg+) */}
          <motion.div
            key="tx-detail-desktop"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ x: { duration: 0.32, ease: PANEL_ENTER }, opacity: { duration: 0.15 } }}
            className="fixed top-0 right-0 bottom-0 z-[201] w-[400px] bg-white shadow-[0_4px_16px_rgba(0,60,195,0.08)] hidden lg:flex flex-col overflow-hidden"
          >
            <PanelContent tx={transaction} onClose={onClose} />
          </motion.div>

          {/* Mobile full-screen overlay (<lg) */}
          <motion.div
            key="tx-detail-mobile"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%", transition: { duration: 0.22, ease: PANEL_EXIT } }}
            transition={{ duration: 0.35, ease: PANEL_ENTER }}
            className="fixed inset-0 z-[201] bg-[#F1F5FA] flex flex-col lg:hidden overflow-hidden"
          >
            <PanelContent tx={transaction} onClose={onClose} />
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
