"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Receipt as LucideReceipt, AlertCircle } from "lucide-react";
import { CloseIcon } from "@/constants/icons";
import { maskAOAInput, parseAOA } from "@/lib/currency";
import { formatDateTimeLocal } from "@/utils/date-time";
import type { TransactionFormData } from "@/types/dtos/transaction.dto";

export interface AddTransactionModalProps {
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
    await onSubmit();
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

export default AddTransactionModal;
