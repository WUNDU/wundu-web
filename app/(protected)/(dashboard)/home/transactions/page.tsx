"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTransactionStore } from "@/store/transaction-store";
import type { TransactionDTO } from "@/types/dtos/transaction.dto";
import { TransactionDetailPanel } from "@/components/ui/transaction-detail-panel";
import { formatAOA } from "@/lib/currency";
import {
  ChevronLeft,
  Calendar,
  Search,
  Filter,
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
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Category style helper                                              */
/* ------------------------------------------------------------------ */

interface CategoryStyle {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  bg: string;
}

function getCategoryStyle(categoryName: string): CategoryStyle {
  const n = categoryName.toLowerCase();
  if (n.includes("transport") || n.includes("carro") || n.includes("taxi") || n.includes("uber"))
    return { icon: Car, color: "#3B82F6", bg: "rgba(59,130,246,0.1)" };
  if (n.includes("aliment") || n.includes("comida") || n.includes("restaur") || n.includes("café") || n.includes("cafe"))
    return { icon: UtensilsCrossed, color: "#F97316", bg: "rgba(249,115,22,0.1)" };
  if (n.includes("renda") || n.includes("aluguel") || n.includes("habit") || n.includes("imov"))
    return { icon: Home, color: "#8B5CF6", bg: "rgba(139,92,246,0.1)" };
  if (n.includes("saúde") || n.includes("saude") || n.includes("médic") || n.includes("medic") || n.includes("farmác"))
    return { icon: Heart, color: "#10B981", bg: "rgba(16,185,129,0.1)" };
  if (n.includes("lazer") || n.includes("entret") || n.includes("cinema") || n.includes("jogo"))
    return { icon: Gamepad2, color: "#EC4899", bg: "rgba(236,72,153,0.1)" };
  if (n.includes("educ") || n.includes("escola") || n.includes("curso") || n.includes("livro"))
    return { icon: BookOpen, color: "#0EA5E9", bg: "rgba(14,165,233,0.1)" };
  if (n.includes("vestuário") || n.includes("roupa") || n.includes("moda"))
    return { icon: Shirt, color: "#F59E0B", bg: "rgba(245,158,11,0.1)" };
  if (n.includes("tecnol") || n.includes("tel") || n.includes("celul"))
    return { icon: Smartphone, color: "#6366F1", bg: "rgba(99,102,241,0.1)" };
  if (n.includes("mercado") || n.includes("superm") || n.includes("compra"))
    return { icon: ShoppingCart, color: "#14B8A6", bg: "rgba(20,184,166,0.1)" };
  if (n.includes("combustível") || n.includes("combustivel") || n.includes("gasolina"))
    return { icon: Flame, color: "#EF4444", bg: "rgba(239,68,68,0.1)" };
  if (n.includes("internet") || n.includes("comunic"))
    return { icon: Wifi, color: "#06B6D4", bg: "rgba(6,182,212,0.1)" };
  if (n.includes("salário") || n.includes("salario") || n.includes("rendimento"))
    return { icon: Banknote, color: "#10B981", bg: "rgba(16,185,129,0.1)" };
  if (n.includes("invest"))
    return { icon: TrendingUp, color: "#003cc3", bg: "rgba(0,60,195,0.1)" };
  if (n.includes("seguro"))
    return { icon: Shield, color: "#64748b", bg: "rgba(100,116,139,0.1)" };
  if (n.includes("viagem") || n.includes("férias") || n.includes("ferias"))
    return { icon: Plane, color: "#8B5CF6", bg: "rgba(139,92,246,0.1)" };
  return { icon: Receipt, color: "#00216b", bg: "rgba(0,33,107,0.08)" };
}

/* ------------------------------------------------------------------ */
/*  Date grouping helpers                                              */
/* ------------------------------------------------------------------ */

function formatDateLabel(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();

  const strip = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const today = strip(now);
  const target = strip(date);
  const diff = (today.getTime() - target.getTime()) / 86_400_000;

  if (diff === 0) return "Hoje";
  if (diff === 1) return "Ontem";
  return date.toLocaleDateString("pt-PT", { day: "numeric", month: "long", year: "numeric" });
}

interface TransactionGroup {
  dateKey: string;
  label: string;
  items: TransactionDTO[];
}

function groupByDate(transactions: TransactionDTO[]): TransactionGroup[] {
  const map = new Map<string, TransactionDTO[]>();

  for (const tx of transactions) {
    const d = tx.transactionDate ? new Date(tx.transactionDate) : new Date(tx.createdAt ?? Date.now());
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(tx);
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([dateKey, items]) => ({
      dateKey,
      label: formatDateLabel(dateKey),
      items,
    }));
}

/* ------------------------------------------------------------------ */
/*  Transaction item                                                   */
/* ------------------------------------------------------------------ */

function TransactionItem({ transaction, index, onClick }: { transaction: TransactionDTO; index: number; onClick?: () => void }) {
  const isExpense = transaction.type === "expense";
  const sign = isExpense ? "-" : "+";
  const amountColor = isExpense ? "#EF4444" : "#10B981";
  const amountBg = isExpense ? "rgba(239,68,68,0.08)" : "rgba(16,185,129,0.08)";
  const categoryName = transaction.category?.name || "Outro";
  const { icon: CategoryIcon, color, bg } = getCategoryStyle(categoryName);

  const time = transaction.transactionDate
    ? new Date(transaction.transactionDate).toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" })
    : null;

  const primaryLabel = transaction.description?.trim() || categoryName;
  const secondaryLabel = transaction.description?.trim() ? categoryName : null;

  const formattedAmount = formatAOA(Math.abs(transaction.amount));

  return (
    <motion.div
      initial={{ opacity: 0, x: 32 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1], delay: Math.min(index * 0.055, 0.5) }}
    >
      <div
        className={`flex items-center gap-2 sm:gap-3 py-2 px-3 sm:py-3 sm:px-5${onClick ? " cursor-pointer hover:bg-slate-50/60 transition-colors" : ""}`}
        onClick={onClick}
      >
        <div
          className="flex-shrink-0 w-10 h-10 sm:w-[46px] sm:h-[46px] rounded-[13px] sm:rounded-[15px] flex items-center justify-center"
          style={{ backgroundColor: bg }}
        >
          <CategoryIcon className="w-[18px] h-[18px] sm:w-[22px] sm:h-[22px]" style={{ color }} />
        </div>

        <div className="flex-1 min-w-0 space-y-0.5">
          <p className="text-sm font-bold text-[#1e293b] truncate">{primaryLabel}</p>
          <div className="flex items-center gap-1.5">
            {secondaryLabel && (
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: bg, color }}
              >
                {secondaryLabel}
              </span>
            )}
            {time && <span className="text-[10px] text-[#94a3b8]">{time}</span>}
          </div>
        </div>

        <div
          className="flex-shrink-0 px-2.5 py-1.5 rounded-full min-w-[44px] text-center"
          style={{ backgroundColor: amountBg }}
        >
          <span className="text-[12px] sm:text-[13px] font-extrabold" style={{ color: amountColor }}>
            {sign}{formattedAmount}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Filter modal                                                       */
/* ------------------------------------------------------------------ */

type SortField = "date" | "amount";
type SortDir = "desc" | "asc";
type TypeFilter = "all" | "expense" | "income";

function FilterModal({
  open,
  onClose,
  sortField,
  setSortField,
  sortDir,
  setSortDir,
  typeFilter,
  setTypeFilter,
}: {
  open: boolean;
  onClose: () => void;
  sortField: SortField;
  setSortField: (v: SortField) => void;
  sortDir: SortDir;
  setSortDir: (v: SortDir) => void;
  typeFilter: TypeFilter;
  setTypeFilter: (v: TypeFilter) => void;
}) {
  if (!open) return null;

  const pillBase = "px-3 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer";
  const pillActive = "bg-[#003cc3] text-white";
  const pillInactive = "bg-[rgba(0,60,195,0.06)] text-[#003cc3]";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="filter-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/30"
          onClick={onClose}
        >
          <motion.div
            key="filter-panel"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md bg-white rounded-t-[24px] p-6 pb-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-extrabold text-[#1e293b]">Filtros</h3>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
                <X className="w-5 h-5 text-[#64748b]" />
              </button>
            </div>

            {/* Type filter */}
            <p className="text-xs font-bold text-[#64748b] mb-2">Tipo</p>
            <div className="flex gap-2 mb-5">
              {([["all", "Todos"], ["expense", "Despesas"], ["income", "Receitas"]] as const).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setTypeFilter(val)}
                  className={`${pillBase} ${typeFilter === val ? pillActive : pillInactive}`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Sort field */}
            <p className="text-xs font-bold text-[#64748b] mb-2">Ordenar por</p>
            <div className="flex gap-2 mb-5">
              {([["date", "Data"], ["amount", "Valor"]] as const).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setSortField(val)}
                  className={`${pillBase} ${sortField === val ? pillActive : pillInactive}`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Sort direction */}
            <p className="text-xs font-bold text-[#64748b] mb-2">Direção</p>
            <div className="flex gap-2">
              {([["desc", "Mais recente"], ["asc", "Mais antigo"]] as const).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setSortDir(val)}
                  className={`${pillBase} ${sortDir === val ? pillActive : pillInactive}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function TransactionsPage() {
  const { transactions, isLoading, fetch } = useTransactionStore();

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionDTO | null>(null);

  const handleTransactionClick = useCallback((tx: TransactionDTO) => {
    setSelectedTransaction(tx);
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const filtered = useMemo(() => {
    let list = [...transactions];

    if (typeFilter !== "all") list = list.filter((t) => t.type === typeFilter);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.description?.toLowerCase().includes(q) ||
          t.category?.name?.toLowerCase().includes(q),
      );
    }

    list.sort((a, b) => {
      if (sortField === "amount") {
        return sortDir === "desc" ? b.amount - a.amount : a.amount - b.amount;
      }
      const dA = new Date(a.transactionDate ?? a.createdAt ?? 0).getTime();
      const dB = new Date(b.transactionDate ?? b.createdAt ?? 0).getTime();
      return sortDir === "desc" ? dB - dA : dA - dB;
    });

    return list;
  }, [transactions, typeFilter, search, sortField, sortDir]);

  const groups = useMemo(() => groupByDate(filtered), [filtered]);

  /* running index across all groups for stagger animation */
  let runningIndex = 0;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#f8fafc]">
        <div className="flex items-center justify-between px-5 pt-4 pb-3">
          <Link href="/home" className="p-1.5 -ml-1.5 rounded-full hover:bg-white/80 transition-colors">
            <ChevronLeft className="w-5 h-5 text-[#1e293b]" />
          </Link>
          <h1 className="text-base font-extrabold text-[#1e293b]">Transações</h1>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowSearch((v) => !v)}
              className="p-1.5 rounded-full hover:bg-white/80 transition-colors"
            >
              <Search className="w-5 h-5 text-[#1e293b]" />
            </button>
            <button
              onClick={() => setFilterOpen(true)}
              className="p-1.5 rounded-full hover:bg-white/80 transition-colors"
            >
              <Filter className="w-5 h-5 text-[#1e293b]" />
            </button>
          </div>
        </div>

        {/* Search bar */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden px-5 pb-3"
            >
              <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-[0_2px_8px_rgba(0,60,195,0.06)]">
                <Search className="w-4 h-4 text-[#94a3b8] flex-shrink-0" />
                <input
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Pesquisar transações…"
                  className="flex-1 text-sm text-[#1e293b] placeholder:text-[#94a3b8] outline-none bg-transparent"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="p-0.5">
                    <X className="w-4 h-4 text-[#94a3b8]" />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="px-4 pb-8">
        {isLoading ? (
          <div className="bg-white rounded-[20px] shadow-[0_4px_16px_rgba(0,60,195,0.08)] overflow-hidden">
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-8 h-8 border-[3px] border-[#003cc3] border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-[#64748b] font-medium">A carregar…</span>
            </div>
          </div>
        ) : groups.length === 0 ? (
          <div className="bg-white rounded-[20px] shadow-[0_4px_16px_rgba(0,60,195,0.08)] overflow-hidden">
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <div className="rounded-[18px] bg-[#f1f5f9] p-6">
                <Receipt className="w-10 h-10 text-[#94a3b8]" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-[#1e293b] font-extrabold text-lg">Nenhuma transação</p>
                <p className="text-[#64748b] text-[13px] leading-5 px-6">
                  As suas transações aparecerão aqui assim que as criar.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-[20px] shadow-[0_4px_16px_rgba(0,60,195,0.08)] overflow-hidden">
            {groups.map((group, gi) => {
              const sectionStart = runningIndex;
              return (
                <div key={group.dateKey}>
                  {/* Date header */}
                  <div className="flex items-center justify-between px-5 pt-3.5 pb-2">
                    <div className="flex items-center gap-1.5 bg-[rgba(0,60,195,0.06)] px-2.5 py-1.5 rounded-full">
                      <Calendar className="w-[11px] h-[11px] text-[#003cc3]" />
                      <span className="text-[#003cc3] font-bold text-xs">{group.label}</span>
                    </div>
                    <span className="text-[#94a3b8] text-[11px]">
                      {group.items.length} {group.items.length === 1 ? "transação" : "transações"}
                    </span>
                  </div>

                  {/* Items */}
                  {group.items.map((tx, i) => {
                    const idx = runningIndex++;
                    return (
                      <React.Fragment key={tx.id ?? `${group.dateKey}-${i}`}>
                        {i > 0 && <div className="h-px mx-5 bg-[rgba(0,33,107,0.05)]" />}
                        <TransactionItem transaction={tx} index={idx} onClick={() => handleTransactionClick(tx)} />
                      </React.Fragment>
                    );
                  })}

                  {/* Section spacing */}
                  {gi < groups.length - 1 && <div className="h-2" />}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Filter modal */}
      <FilterModal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        sortField={sortField}
        setSortField={setSortField}
        sortDir={sortDir}
        setSortDir={setSortDir}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
      />

      {/* Transaction detail panel */}
      <TransactionDetailPanel
        transaction={selectedTransaction}
        isOpen={selectedTransaction !== null}
        onClose={() => setSelectedTransaction(null)}
      />
    </div>
  );
}
