"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import type { TransactionDTO, TransactionStatus } from "@/types/dtos/transaction.dto";
import type { LucideIcon } from "lucide-react";
import {
  X,
  Car,
  UtensilsCrossed,
  Home,
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
  Receipt,
  Calendar,
  FileText,
  Building2,
  Hash,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { formatAOA } from "@/lib/currency";

/* ------------------------------------------------------------------ */
/*  Category styles (matching home page)                               */
/* ------------------------------------------------------------------ */

type CategoryStyle = { icon: LucideIcon; color: string; bg: string };

const CATEGORY_STYLES: { pattern: RegExp; style: CategoryStyle }[] = [
  { pattern: /transport|carro|taxi|uber/i, style: { icon: Car, color: "#3B82F6", bg: "rgba(59,130,246,0.1)" } },
  { pattern: /alimenta|comida|restaur|café/i, style: { icon: UtensilsCrossed, color: "#F97316", bg: "rgba(249,115,22,0.1)" } },
  { pattern: /habita|renda|aluguel|imov|morad/i, style: { icon: Home, color: "#8B5CF6", bg: "rgba(139,92,246,0.1)" } },
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

const DEFAULT_STYLE: CategoryStyle = { icon: Receipt, color: "#00216b", bg: "rgba(0,33,107,0.08)" };

function getCategoryStyle(category: string): CategoryStyle {
  return CATEGORY_STYLES.find(({ pattern }) => pattern.test(category))?.style ?? DEFAULT_STYLE;
}

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
/*  Panel content (shared between desktop & mobile)                    */
/* ------------------------------------------------------------------ */

function PanelContent({ tx, onClose }: { tx: TransactionDTO; onClose: () => void }) {
  const isExpense = tx.type === "expense";
  const categoryName = tx.category?.name || "Outro";
  const { icon: CategoryIcon } = getCategoryStyle(categoryName);
  const statusCfg = STATUS_CONFIG[tx.status as string] ?? DEFAULT_STATUS;

  const formattedAmount = formatAOA(Math.abs(tx.amount));

  const gradientFrom = isExpense ? "#4c0519" : "#052e16";
  const gradientVia = isExpense ? "#9f1239" : "#065f46";
  const gradientTo = isExpense ? "#be185d" : "#0f766e";

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
          {/* Close + Title + Badge */}
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

      {/* Details Card */}
      <div className="flex-1 overflow-y-auto bg-white rounded-t-[20px] -mt-8 relative z-10">
        <div className="px-5 pt-7 pb-12">
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
              <InfoRow icon={Building2} label="Fonte" value={tx.source} />
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
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  TransactionDetailPanel                                             */
/* ------------------------------------------------------------------ */

const PANEL_ENTER: [number, number, number, number] = [0, 0, 0.2, 1];   // smooth decelerate in
const PANEL_EXIT:  [number, number, number, number] = [0.4, 0, 1, 1];   // accelerate out

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
            transition={{
              x: {
                duration: 0.32,
                ease: PANEL_ENTER,
              },
              opacity: { duration: 0.15 },
            }}
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
