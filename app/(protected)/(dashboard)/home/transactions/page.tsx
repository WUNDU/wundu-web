"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTransaction } from "@/hooks/use-transaction";
import type { TransactionDTO } from "@/types/dtos/transaction.dto";
import { TransactionDetailPanel } from "@/components/ui/transaction-detail-panel";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  X,
} from "lucide-react";
import { CalendarIcon, ArrowRotateIcon, NoMovementIcon } from "@/constants/icons";
import { TransactionItem } from "@/components/transactions/transaction-item";
import { FilterModal } from "@/components/transactions/filter-modal";
import type { SortField, SortDir, TypeFilter } from "@/components/transactions/filter-modal";
import { groupByDate } from "@/utils/transaction-groups";
import posthog from "posthog-js";

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function TransactionsPage() {
  const { transactions, isLoading, getTransactions: fetch } = useTransaction();

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

  const handleSetSortField = useCallback((field: SortField) => {
    setSortField(field);
    posthog.capture("transaction_filter_applied", { sort_field: field, sort_dir: sortDir, type_filter: typeFilter });
  }, [sortDir, typeFilter]);

  const handleSetSortDir = useCallback((dir: SortDir) => {
    setSortDir(dir);
    posthog.capture("transaction_filter_applied", { sort_field: sortField, sort_dir: dir, type_filter: typeFilter });
  }, [sortField, typeFilter]);

  const handleSetTypeFilter = useCallback((type: TypeFilter) => {
    setTypeFilter(type);
    posthog.capture("transaction_filter_applied", { sort_field: sortField, sort_dir: sortDir, type_filter: type });
  }, [sortField, sortDir]);

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
        sortField={sortField} setSortField={handleSetSortField}
        sortDir={sortDir} setSortDir={handleSetSortDir}
        typeFilter={typeFilter} setTypeFilter={handleSetTypeFilter}
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
