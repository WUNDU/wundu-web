"use client";

import React, { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Filter, X, ChevronRight } from "lucide-react";
import { ArrowRotateIcon, CalendarIcon, NoMovementIcon } from "@/constants/icons";
import { useTransaction } from "@/hooks/use-transaction";
import { TransactionDetailPanel } from "@/components/ui/transaction-detail-panel";
import TransactionHighlight from "@/components/home/transaction-highlight";
import type { Document } from "@/types/ui";
import type { TransactionDTO } from "@/types/dtos/transaction.dto";

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

export interface MovementSectionProps {
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

  const { transactions: rawTransactions } = useTransaction();

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
          <div className="pb-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-5 py-3"
                style={{ opacity: 1 - i * 0.15 }}
              >
                <div className="h-[46px] w-[46px] flex-shrink-0 animate-pulse rounded-[15px] bg-slate-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-2/3 animate-pulse rounded-full bg-slate-100" />
                  <div className="h-2.5 w-1/3 animate-pulse rounded-full bg-slate-100" />
                </div>
                <div className="h-8 w-20 animate-pulse rounded-full bg-slate-100" />
              </div>
            ))}
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
                    className={`px-3 py-2.5 rounded-xl text-sm font-semibold border transition-all ${sortField === "date" ? "bg-[#003cc3] border-[#003cc3] text-white shadow-sm" : "bg-white border-slate-200 text-slate-600 hover:border-[#003cc3]/20"}`}
                  >
                    Mais recentes
                  </button>
                  <button
                    onClick={() => { setSortField("amount"); setSortDirection("desc"); }}
                    className={`px-3 py-2.5 rounded-xl text-sm font-semibold border transition-all ${sortField === "amount" ? "bg-[#003cc3] border-[#003cc3] text-white shadow-sm" : "bg-white border-slate-200 text-slate-600 hover:border-[#003cc3]/20"}`}
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

export default MovementSection;
