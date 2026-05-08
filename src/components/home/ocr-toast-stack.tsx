"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle, AlertCircle, Loader2, X, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { useCategoryStore } from "@/store/category-store";
import type { DocQueueEntry } from "@/hooks/use-document-queue";

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

function statusLabel(status: string): string {
  switch (status?.toUpperCase()) {
    case "PENDING": return "Upload recebido…";
    case "OCR_PROCESSING": return "A analisar com IA…";
    case "PROCESSED": return "Processado com sucesso!";
    case "NEEDS_MANUAL_CATEGORY": return "Categoria necessária";
    case "DUPLICATE": return "Ficheiro duplicado";
    case "REJECTED_NOT_RECEIPT": return "Não é um comprovativo";
    case "FAILED": return "Falha no processamento";
    default: return "A processar…";
  }
}

interface ToastCardProps {
  entry: DocQueueEntry;
  onDismiss: (id: string) => void;
  onCategorize: (id: string, categoryId: string) => void;
  onRetry: (id: string) => void;
}

const ToastCard: React.FC<ToastCardProps> = ({ entry, onDismiss, onCategorize, onRetry }) => {
  const { categories, fetchActive } = useCategoryStore();
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [expanded, setExpanded] = useState(false);
  const status = entry.status?.toUpperCase();
  const isTerminal = ["PROCESSED", "NEEDS_MANUAL_CATEGORY", "DUPLICATE", "REJECTED_NOT_RECEIPT", "FAILED"].includes(status);
  const needsCategory = status === "NEEDS_MANUAL_CATEGORY";

  useEffect(() => {
    if (needsCategory) {
      fetchActive();
      setExpanded(true);
    }
  }, [needsCategory, fetchActive]);

  // Auto-dismiss PROCESSED after 5s
  useEffect(() => {
    if (status === "PROCESSED") {
      const t = setTimeout(() => onDismiss(entry.id), 5000);
      return () => clearTimeout(t);
    }
  }, [status, entry.id, onDismiss]);

  const icon = () => {
    if (entry.isPolling || !isTerminal) {
      return <Loader2 className="w-4 h-4 text-[#003cc3] animate-spin flex-shrink-0" />;
    }
    if (status === "PROCESSED") return <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />;
    if (status === "NEEDS_MANUAL_CATEGORY") return <AlertCircle className="w-4 h-4 text-violet-500 flex-shrink-0" />;
    if (status === "DUPLICATE") return <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />;
    return <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />;
  };

  const borderColor = () => {
    if (!isTerminal || entry.isPolling) return "border-[#003cc3]/20";
    if (status === "PROCESSED") return "border-emerald-200";
    if (status === "NEEDS_MANUAL_CATEGORY") return "border-violet-200";
    if (status === "DUPLICATE") return "border-amber-200";
    return "border-red-200";
  };

  const shortName = entry.fileName.length > 22
    ? entry.fileName.slice(0, 19) + "…"
    : entry.fileName;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 60, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.96 }}
      transition={{ duration: 0.22, ease: EASE_OUT }}
      className={`w-[300px] bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border ${borderColor()} overflow-hidden`}
    >
      {/* Header row */}
      <div className="flex items-center gap-2.5 px-3.5 py-3">
        {icon()}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-[#1e293b] truncate leading-tight">{shortName}</p>
          <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">{statusLabel(status)}</p>
        </div>
        <div className="flex items-center gap-1">
          {needsCategory && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
            >
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}
          {isTerminal && !needsCategory && (
            <button
              onClick={() => onDismiss(entry.id)}
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Retry for failed */}
      {(status === "FAILED" || status === "REJECTED_NOT_RECEIPT") && (
        <div className="px-3.5 pb-3 flex gap-2">
          <button
            onClick={() => onRetry(entry.id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#003cc3] text-white text-[11px] font-bold hover:bg-[#002ea0] transition-colors"
          >
            <RefreshCw className="w-3 h-3" /> Tentar novamente
          </button>
          <button
            onClick={() => onDismiss(entry.id)}
            className="px-3 py-2 rounded-xl bg-slate-100 text-slate-500 text-[11px] font-bold hover:bg-slate-200 transition-colors"
          >
            Fechar
          </button>
        </div>
      )}

      {/* Duplicate / Rejected close */}
      {status === "DUPLICATE" && (
        <div className="px-3.5 pb-3">
          <button
            onClick={() => onDismiss(entry.id)}
            className="w-full py-2 rounded-xl bg-slate-100 text-slate-600 text-[11px] font-bold hover:bg-slate-200 transition-colors"
          >
            Fechar
          </button>
        </div>
      )}

      {/* NEEDS_MANUAL_CATEGORY: expandable category picker */}
      <AnimatePresence initial={false}>
        {needsCategory && expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: EASE_OUT }}
            className="overflow-hidden"
          >
            <div className="px-3.5 pb-3.5 flex flex-col gap-2 border-t border-slate-100 pt-3">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Escolher categoria</p>
              <select
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#003cc3]/40"
              >
                <option value="">Selecionar…</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              {entry.categorizeError && (
                <p className="text-[10px] text-red-500">{entry.categorizeError}</p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => onCategorize(entry.id, selectedCategoryId)}
                  disabled={!selectedCategoryId || entry.isCategorizing}
                  className="flex-1 py-2 rounded-xl bg-[#003cc3] text-white text-[11px] font-bold disabled:opacity-50 hover:bg-[#002ea0] transition-colors"
                >
                  {entry.isCategorizing ? (
                    <span className="flex items-center justify-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" /> A confirmar…
                    </span>
                  ) : "Confirmar"}
                </button>
                <button
                  onClick={() => onDismiss(entry.id)}
                  className="px-3 py-2 rounded-xl bg-slate-100 text-slate-500 text-[11px] font-bold hover:bg-slate-200 transition-colors"
                >
                  Ignorar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Processing progress bar */}
      {entry.isPolling && (
        <div className="h-0.5 bg-slate-100 overflow-hidden">
          <motion.div
            className="h-full bg-[#003cc3]/40"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
          />
        </div>
      )}
    </motion.div>
  );
};

interface OcrToastStackProps {
  entries: DocQueueEntry[];
  onDismiss: (id: string) => void;
  onCategorize: (id: string, categoryId: string) => void;
  onRetry: (id: string) => void;
}

const OcrToastStack: React.FC<OcrToastStackProps> = ({
  entries,
  onDismiss,
  onCategorize,
  onRetry,
}) => {
  if (entries.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-[200] flex flex-col gap-2 items-end">
      <AnimatePresence initial={false}>
        {entries.map((entry) => (
          <ToastCard
            key={entry.id}
            entry={entry}
            onDismiss={onDismiss}
            onCategorize={onCategorize}
            onRetry={onRetry}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default OcrToastStack;
