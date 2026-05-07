"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, CheckCircle2, AlertCircle, XCircle, RefreshCw } from "lucide-react";
import { CloseIcon } from "@/constants/icons";
import { documentService } from "@/services/document.service";
import { useCategoryStore } from "@/store/category-store";
import type { DocumentStatus } from "@/types/dtos/document.dto";

type OcrStatus = DocumentStatus["status"];

interface OcrStatusModalProps {
  isOpen: boolean;
  doc: DocumentStatus | null;
  isPolling: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onRetry: () => void;
}

function statusLabel(status: string): string {
  switch (status?.toUpperCase()) {
    case "PENDING": return "Upload recebido, a aguardar processamento…";
    case "OCR_PROCESSING": return "A analisar documento com IA…";
    case "PROCESSED": return "Documento processado com sucesso!";
    case "NEEDS_MANUAL_CATEGORY": return "Não foi possível identificar a categoria automaticamente.";
    case "DUPLICATE": return "Este ficheiro já foi enviado anteriormente.";
    case "REJECTED_NOT_RECEIPT": return "O ficheiro não parece ser um comprovativo bancário.";
    case "FAILED": return "Não foi possível processar o documento.";
    default: return "A processar…";
  }
}

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const OcrStatusModal: React.FC<OcrStatusModalProps> = ({
  isOpen,
  doc,
  isPolling,
  onClose,
  onSuccess,
  onRetry,
}) => {
  const { categories, fetchActive } = useCategoryStore();
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [isCategorizing, setIsCategorizing] = useState(false);
  const [categorizeError, setCategorizeError] = useState("");

  const status = doc?.status?.toUpperCase() ?? "";
  const needsCategory = status === "NEEDS_MANUAL_CATEGORY";
  const isTerminal = ["PROCESSED", "NEEDS_MANUAL_CATEGORY", "DUPLICATE", "REJECTED_NOT_RECEIPT", "FAILED"].includes(status);

  useEffect(() => {
    if (needsCategory) {
      fetchActive();
    }
  }, [needsCategory, fetchActive]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedCategoryId("");
      setCategorizeError("");
    }
  }, [isOpen]);

  const handleCategorize = async () => {
    if (!doc || !selectedCategoryId) return;
    setIsCategorizing(true);
    setCategorizeError("");
    try {
      await documentService.categorize(doc.id, selectedCategoryId);
      onSuccess();
    } catch {
      setCategorizeError("Erro ao atribuir categoria. Tente novamente.");
    } finally {
      setIsCategorizing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="ocr-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        onClick={(e) => e.target === e.currentTarget && !isPolling && onClose()}
      >
        <motion.div
          key="ocr-panel"
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ duration: 0.22, ease: EASE_OUT }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <p className="text-sm font-bold text-slate-900">Processamento OCR</p>
            {!isPolling && (
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                <CloseIcon className="w-4 h-4 text-slate-500" />
              </button>
            )}
          </div>

          <div className="px-6 py-6 flex flex-col items-center gap-5 text-center">
            {/* Icon */}
            {(isPolling || !isTerminal) && (
              <div className="w-14 h-14 rounded-full bg-[#003cc3]/8 flex items-center justify-center">
                <Loader2 className="w-7 h-7 text-[#003cc3] animate-spin" />
              </div>
            )}
            {status === "PROCESSED" && (
              <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-emerald-500" />
              </div>
            )}
            {(status === "FAILED" || status === "REJECTED_NOT_RECEIPT") && (
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
                <XCircle className="w-7 h-7 text-red-500" />
              </div>
            )}
            {status === "DUPLICATE" && (
              <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center">
                <AlertCircle className="w-7 h-7 text-amber-500" />
              </div>
            )}
            {needsCategory && (
              <div className="w-14 h-14 rounded-full bg-violet-50 flex items-center justify-center">
                <AlertCircle className="w-7 h-7 text-violet-500" />
              </div>
            )}

            {/* Message */}
            <p className="text-sm text-slate-700 font-medium leading-relaxed">
              {statusLabel(status || (isPolling ? "PENDING" : ""))}
            </p>

            {doc?.fileName && (
              <p className="text-xs text-slate-400 truncate max-w-[280px]">{doc.fileName}</p>
            )}

            {/* NEEDS_MANUAL_CATEGORY: category picker */}
            {needsCategory && (
              <div className="w-full flex flex-col gap-3 text-left">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Escolher categoria
                </label>
                <select
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-[#003cc3]/40"
                >
                  <option value="">Selecione uma categoria…</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {categorizeError && (
                  <p className="text-xs text-red-500">{categorizeError}</p>
                )}
                <button
                  onClick={handleCategorize}
                  disabled={!selectedCategoryId || isCategorizing}
                  className="w-full py-3 rounded-xl bg-[#003cc3] text-white text-sm font-bold disabled:opacity-50 hover:bg-[#002ea0] transition-colors"
                >
                  {isCategorizing ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> A confirmar…
                    </span>
                  ) : (
                    "Confirmar categoria"
                  )}
                </button>
              </div>
            )}

            {/* Actions */}
            {status === "PROCESSED" && (
              <button
                onClick={onSuccess}
                className="w-full py-3 rounded-xl bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-600 transition-colors"
              >
                Ver transações
              </button>
            )}

            {status === "FAILED" && (
              <div className="w-full flex flex-col gap-2">
                <button
                  onClick={onRetry}
                  className="w-full py-3 rounded-xl bg-[#003cc3] text-white text-sm font-bold hover:bg-[#002ea0] transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" /> Tentar novamente
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            )}

            {(status === "DUPLICATE" || status === "REJECTED_NOT_RECEIPT") && (
              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-slate-100 text-slate-700 text-sm font-bold hover:bg-slate-200 transition-colors"
              >
                Fechar
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OcrStatusModal;
