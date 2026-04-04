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
  ChevronRight,
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
import { CalendarIcon, ArrowRotateIcon, NoMovementIcon } from "@/constants/icons";

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ── Category style helper ───────────────────────────────────────────── */

interface CategoryStyle {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  bg: string;
}

function getCategoryStyle(name: string): CategoryStyle {
  const n = name.toLowerCase();
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

/* ── Date grouping ───────────────────────────────────────────────────── */

function formatDateLabel(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const strip = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diff = (strip(now).getTime() - strip(date).getTime()) / 86_400_000;
  if (diff === 0) return "Hoje";
  if (diff === 1) return "Ontem";
  return date.toLocaleDateString("pt-PT", { day: "numeric", month: "long", year: "numeric" });
}

interface TransactionGroup { dateKey: string; label: string; items: TransactionDTO[] }

function groupByDate(txs: TransactionDTO[]): TransactionGroup[] {
  const map = new Map<string, TransactionDTO[]>();
  for (const tx of txs) {
    const d = tx.transactionDate ? new Date(tx.transactionDate) : new Date(tx.createdAt ?? Date.now());
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(tx);
  }
  return Array.from(map.entries())
    .sort(([a],[b]) => b.localeCompare(a))
    .map(([dateKey, items]) => ({ dateKey, label: formatDateLabel(dateKey), items }));
}

/* ── Transaction row ─────────────────────────────────────────────────── */

function TransactionItem({ tx, index, onClick }: { tx: TransactionDTO; index: number; onClick: () => void }) {
  const isExpense = tx.type === "expense";
  const amountColor = isExpense ? "#EF4444" : "#10B981";
  const amountBg   = isExpense ? "rgba(239,68,68,0.08)" : "rgba(16,185,129,0.08)";
  const categoryName = tx.category?.name || "Outro";
  const { icon: Icon, color, bg } = getCategoryStyle(categoryName);
  const time = tx.transactionDate
    ? new Date(tx.transactionDate).toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" })
    : null;
  const primary   = tx.description?.trim() || categoryName;
  const secondary = tx.description?.trim() ? categoryName : null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.18, ease: EASE_OUT, delay: Math.min(index * 0.03, 0.25) }}
      className="flex items-center gap-3 px-5 py-3 cursor-pointer hover:bg-slate-50/60 transition-colors"
      onClick={onClick}
    >
      <div className="flex-shrink-0 w-[46px] h-[46px] rounded-[15px] flex items-center justify-center" style={{ backgroundColor: bg }}>
        <Icon className="w-[22px] h-[22px]" style={{ color }} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-[#1e293b] truncate leading-snug">{primary}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          {secondary && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: bg, color }}>
              {secondary}
            </span>
          )}
          {time && <span className="text-[10px] text-[#94a3b8]">{time}</span>}
        </div>
      </div>

      <div className="flex-shrink-0 px-2.5 py-1.5 rounded-full" style={{ backgroundColor: amountBg }}>
        <span className="text-[13px] font-extrabold" style={{ color: amountColor }}>
          {isExpense ? "-" : "+"}{formatAOA(Math.abs(tx.amount))}
        </span>
      </div>
    </motion.div>
  );
}

/* ── Filter bottom sheet ─────────────────────────────────────────────── */

type SortField  = "date" | "amount";
type SortDir    = "desc" | "asc";
type TypeFilter = "all" | "expense" | "income";

function FilterModal({
  open, onClose,
  sortField, setSortField,
  sortDir, setSortDir,
  typeFilter, setTypeFilter,
}: {
  open: boolean; onClose: () => void;
  sortField: SortField; setSortField: (v: SortField) => void;
  sortDir: SortDir; setSortDir: (v: SortDir) => void;
  typeFilter: TypeFilter; setTypeFilter: (v: TypeFilter) => void;
}) {
  const pill = (active: boolean) =>
    `px-3 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
      active ? "bg-[#003cc3] text-white" : "bg-[rgba(0,60,195,0.06)] text-[#003cc3]"
    }`;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="bd"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/30"
          onClick={onClose}
        >
          <motion.div
            key="panel"
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ duration: 0.18, ease: EASE_OUT }}
            className="w-full max-w-md bg-white rounded-t-[24px] p-6 pb-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-extrabold text-[#1e293b]">Filtros</h3>
              <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-100 transition-colors">
                <X className="w-5 h-5 text-[#64748b]" />
              </button>
            </div>

            <p className="text-xs font-bold text-[#64748b] mb-2">Tipo</p>
            <div className="flex gap-2 mb-5">
              {([["all","Todos"],["expense","Despesas"],["income","Receitas"]] as const).map(([v,l]) => (
                <button key={v} onClick={() => setTypeFilter(v)} className={pill(typeFilter === v)}>{l}</button>
              ))}
            </div>

            <p className="text-xs font-bold text-[#64748b] mb-2">Ordenar por</p>
            <div className="flex gap-2 mb-5">
              {([["date","Data"],["amount","Valor"]] as const).map(([v,l]) => (
                <button key={v} onClick={() => setSortField(v)} className={pill(sortField === v)}>{l}</button>
              ))}
            </div>

            <p className="text-xs font-bold text-[#64748b] mb-2">Direção</p>
            <div className="flex gap-2">
              {([["desc","Mais recente"],["asc","Mais antigo"]] as const).map(([v,l]) => (
                <button key={v} onClick={() => setSortDir(v)} className={pill(sortDir === v)}>{l}</button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Page ────────────────────────────────────────────────────────────── */

export default function TransactionsPage() {
  const { transactions, isLoading, fetch } = useTransactionStore();

  const [search, setSearch]               = useState("");
  const [showSearch, setShowSearch]       = useState(false);
  const [filterOpen, setFilterOpen]       = useState(false);
  const [sortField, setSortField]         = useState<SortField>("date");
  const [sortDir, setSortDir]             = useState<SortDir>("desc");
  const [typeFilter, setTypeFilter]       = useState<TypeFilter>("all");
  const [selected, setSelected]           = useState<TransactionDTO | null>(null);

  useEffect(() => { fetch(); }, [fetch]);

  const filtered = useMemo(() => {
    let list = [...transactions];
    if (typeFilter !== "all") list = list.filter(t => t.type === typeFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(t =>
        t.description?.toLowerCase().includes(q) ||
        t.category?.name?.toLowerCase().includes(q),
      );
    }
    list.sort((a, b) => {
      if (sortField === "amount") return sortDir === "desc" ? b.amount - a.amount : a.amount - b.amount;
      const dA = new Date(a.transactionDate ?? a.createdAt ?? 0).getTime();
      const dB = new Date(b.transactionDate ?? b.createdAt ?? 0).getTime();
      return sortDir === "desc" ? dB - dA : dA - dB;
    });
    return list;
  }, [transactions, typeFilter, search, sortField, sortDir]);

  const groups = useMemo(() => groupByDate(filtered), [filtered]);

  const handleRefresh = useCallback(() => fetch(), [fetch]);

  let runningIdx = 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: EASE_OUT }}
      className="flex flex-col gap-3 pb-6"
    >
      {/* ── Top card: back + title + actions ─────────────────────────── */}
      <div className="bg-white rounded-[20px] shadow-[0_4px_16px_rgba(0,60,195,0.08)] overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-4">
          <Link
            href="/home"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-[#003cc3] hover:border-[#003cc3]/20 transition-all duration-200"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>

          <h1 className="flex-1 text-base font-bold text-[#1e293b]">Transações</h1>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-[#003cc3] hover:border-[#003cc3]/20 transition-all duration-200"
              aria-label="Atualizar"
            >
              <ArrowRotateIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowSearch(v => !v)}
              className={`p-2 rounded-xl border transition-all duration-200 ${
                showSearch
                  ? "bg-[rgba(0,60,195,0.08)] border-[#003cc3]/20 text-[#003cc3]"
                  : "bg-white border-slate-200 text-slate-400 hover:text-[#003cc3] hover:border-[#003cc3]/20"
              }`}
              aria-label="Pesquisar"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              onClick={() => setFilterOpen(true)}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-[#003cc3] hover:border-[#003cc3]/20 transition-all duration-200"
              aria-label="Filtros"
            >
              <Filter className="w-4 h-4" />
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
              transition={{ duration: 0.2, ease: EASE_OUT }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4">
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus-within:border-[#003cc3]/40 focus-within:bg-white transition-all duration-150">
                  <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <input
                    autoFocus
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Pesquisar por descrição ou categoria…"
                    className="flex-1 text-sm text-[#1e293b] placeholder:text-slate-400 outline-none bg-transparent"
                  />
                  {search && (
                    <button onClick={() => setSearch("")} className="p-0.5 text-slate-400 hover:text-slate-600">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active filters summary */}
        {(typeFilter !== "all" || sortField !== "date" || sortDir !== "desc") && (
          <div className="flex items-center gap-2 px-4 pb-3 flex-wrap">
            {typeFilter !== "all" && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-[rgba(0,60,195,0.08)] text-[#003cc3]">
                {typeFilter === "expense" ? "Despesas" : "Receitas"}
                <button onClick={() => setTypeFilter("all")}><X className="w-3 h-3" /></button>
              </span>
            )}
            {(sortField !== "date" || sortDir !== "desc") && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-[rgba(0,60,195,0.08)] text-[#003cc3]">
                {sortField === "amount" ? "Por valor" : "Por data"} · {sortDir === "desc" ? "↓" : "↑"}
                <button onClick={() => { setSortField("date"); setSortDir("desc"); }}><X className="w-3 h-3" /></button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── Transaction list card ────────────────────────────────────── */}
      {isLoading ? (
        <div className="bg-white rounded-[20px] shadow-[0_4px_16px_rgba(0,60,195,0.08)] overflow-hidden">
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-8 h-8 border-[3px] border-[#003cc3] border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-slate-400 font-medium">A carregar…</span>
          </div>
        </div>
      ) : groups.length === 0 ? (
        <div className="bg-white rounded-[20px] shadow-[0_4px_16px_rgba(0,60,195,0.08)] overflow-hidden">
          <div className="flex flex-col items-center justify-center py-16 gap-4 text-center px-5">
            <NoMovementIcon className="w-12 h-12 text-slate-300" />
            <div>
              <p className="text-base font-bold text-slate-900">Nenhuma transação encontrada</p>
              <p className="text-sm text-slate-400 mt-1">
                {search ? "Tente outro termo de pesquisa." : "As suas transações aparecerão aqui."}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-[20px] shadow-[0_4px_16px_rgba(0,60,195,0.08)] overflow-hidden">
          {/* Summary bar */}
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <h2 className="font-bold text-[#1e293b]" style={{ fontSize: 16 }}>
              {filtered.length} {filtered.length === 1 ? "transação" : "transações"}
            </h2>
            <div className="flex items-center gap-1.5 bg-[rgba(0,60,195,0.06)] px-2.5 py-1.5 rounded-full">
              <ChevronRight className="w-3 h-3 text-[#003cc3]" />
              <span className="text-[#003cc3] font-bold text-xs">Lista completa</span>
            </div>
          </div>

          {/* Groups */}
          <div className="pb-3">
            {groups.map((group, gi) => (
              <div key={group.dateKey}>
                {/* Date badge */}
                <div className="px-5 py-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 bg-[rgba(0,60,195,0.06)]">
                    <CalendarIcon className="w-[11px] h-[11px] text-[#003cc3]" />
                    <span className="text-[#003cc3] font-bold text-xs">{group.label}</span>
                    <span className="text-[#003cc3]/50 text-[10px] font-medium">
                      · {group.items.length}
                    </span>
                  </span>
                </div>

                {/* Items */}
                {group.items.map((tx, i) => {
                  const idx = runningIdx++;
                  return (
                    <React.Fragment key={tx.id ?? `${group.dateKey}-${i}`}>
                      {i > 0 && <div className="h-px mx-5 bg-[rgba(0,33,107,0.05)]" />}
                      <TransactionItem tx={tx} index={idx} onClick={() => setSelected(tx)} />
                    </React.Fragment>
                  );
                })}

                {gi < groups.length - 1 && <div className="h-2" />}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter modal */}
      <FilterModal
        open={filterOpen} onClose={() => setFilterOpen(false)}
        sortField={sortField} setSortField={setSortField}
        sortDir={sortDir} setSortDir={setSortDir}
        typeFilter={typeFilter} setTypeFilter={setTypeFilter}
      />

      {/* Detail panel */}
      <TransactionDetailPanel
        transaction={selected}
        isOpen={selected !== null}
        onClose={() => setSelected(null)}
      />
    </motion.div>
  );
}
