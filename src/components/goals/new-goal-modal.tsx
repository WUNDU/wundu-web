"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useGoal } from "@/hooks/use-goal";
import { useCurrencyInput } from "@/hooks/use-currency-input";
import type { GoalPayload, GoalType } from "@/types/dtos/goal.dto";
import { captureEvent } from "@/lib/analytics";
import CategorySelect from "@/components/ui/category-select";

const EASE_OUT = [0.22, 1, 0.36, 1] as [number, number, number, number];

export interface NewGoalModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function NewGoalModal({ onClose, onSuccess }: NewGoalModalProps) {
  const [title, setTitle]           = useState("");
  const [startDate, setStartDate]   = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate]       = useState("");
  const [type, setType]             = useState<GoalType>("SHORT_TERM");
  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading]       = useState(false);
  const { displayValue: targetDisplay, numericValue: targetNumeric, onChange: onTargetChange } = useCurrencyInput();

  const { addGoal: add } = useGoal();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // auto-type
  useEffect(() => {
    if (!startDate || !endDate) return;
    const days = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86_400_000);
    if (!isNaN(days)) setType(days <= 60 ? "SHORT_TERM" : "LONG_TERM");
  }, [startDate, endDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const targetAmount = parseFloat(targetNumeric) || 0;
    const ok = await add({
      title,
      targetAmount,
      startDate,
      endDate,
      type,
      categoryId,
    } as GoalPayload);
    if (ok) {
      captureEvent("goal_created", {
        goal_type: type,
        target_amount: targetAmount,
        has_category: Boolean(categoryId),
      });
      onSuccess();
    } else {
      setLoading(false);
    }
  };

  const inputCls = "w-full text-sm rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-secondary focus:ring-2 focus:ring-secondary/15 outline-none transition-colors";
  const labelCls = "block text-xs font-bold text-slate-500 mb-1.5";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-goal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ duration: 0.2, ease: EASE_OUT }}
        className="w-full max-w-md bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col max-h-[92dvh] sm:max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 id="new-goal-title" className="text-sm font-bold text-slate-900">Novo Objectivo</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          <div>
            <label htmlFor="new-goal-title-input" className={labelCls}>Título</label>
            <input id="new-goal-title-input" type="text" value={title} onChange={e => setTitle(e.target.value)}
              placeholder="Ex: Fundo de emergência" className={inputCls} required />
          </div>

          <div>
            <label htmlFor="new-goal-amount" className={labelCls}>Montante alvo (AOA)</label>
            <input id="new-goal-amount" type="text" inputMode="decimal" value={targetDisplay}
              onChange={onTargetChange} placeholder="0,00"
              className={inputCls} required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="new-goal-start" className={labelCls}>Data início</label>
              <input id="new-goal-start" type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                className={inputCls} required />
            </div>
            <div>
              <label htmlFor="new-goal-end" className={labelCls}>Data fim</label>
              <input id="new-goal-end" type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
                className={inputCls} required />
            </div>
          </div>

          {/* Type pills */}
          <div>
            <label className={labelCls}>Tipo</label>
            <div className="flex gap-2">
              {(["SHORT_TERM", "LONG_TERM"] as const).map(t => (
                <button key={t} type="button"
                  onClick={() => setType(t)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors ${
                    type === t ? "bg-secondary text-white" : "bg-[rgba(0,60,195,0.06)] text-secondary"
                  }`}
                >
                  {t === "SHORT_TERM" ? "Curto prazo" : "Longo prazo"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <CategorySelect
              label="Categoria"
              value={categoryId}
              onChange={setCategoryId}
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-3 rounded-xl bg-secondary text-white text-sm font-bold hover:bg-secondary-dark transition-colors shadow-sm disabled:opacity-60">
              {loading ? "A criar..." : "Criar"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
