"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import { Plus, CheckCircle, AlertCircle, Info, X } from "lucide-react";
import {
  buildGoalCardData,
  useGoalStore,
} from "@/store/goal-store";
import { useCategoryStore } from "@/store/category-store";
import { useUiStore } from "@/store/ui-store";
import { CloseIcon, NoMovementIcon, ObjectiveIcon } from "@/constants/icons";
import EditModal from "@/components/ui/edit-modal";
import type { Goal, GoalPayload, GoalType } from "@/types/dtos/goal.dto";
import { useCurrencyInput } from "@/hooks/use-currency-input";

// ── Constants ─────────────────────────────────────────────────────────────────

const EASE_OUT = [0.22, 1, 0.36, 1] as [number, number, number, number];

// ── Notification Toast (same as home) ─────────────────────────────────────────

const NotificationToast: React.FC = () => {
  const { notification, closeNotification } = useUiStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted || !notification) return null;

  const iconMap = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  };
  const bgMap = {
    success: "bg-emerald-50 text-emerald-600",
    error: "bg-rose-50 text-rose-600",
    info: "bg-blue-50 text-blue-600",
  };

  return createPortal(
    <div className="fixed top-6 right-6 z-[100] w-full max-w-sm pointer-events-auto animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-3 flex items-center gap-3">
        <div className={`p-2 rounded-xl ${bgMap[notification.type]}`}>
          {iconMap[notification.type]}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-900">{notification.title}</p>
          <p className="text-xs text-slate-500 truncate">{notification.message}</p>
        </div>
        <button onClick={closeNotification} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
          <CloseIcon className="w-4 h-4 text-slate-400" />
        </button>
      </div>
    </div>,
    document.body,
  );
};

// ── Small progress ring (inline, right side of row) ───────────────────────────

function Ring({ pct, done }: { pct: number; done: boolean }) {
  const r = 16;
  const c = 2 * Math.PI * r;
  const trackColor = "rgba(15,23,42,0.08)";
  const ringColor = done ? "#10b981" : "#003cc3";

  return (
    <svg width={40} height={40} viewBox="0 0 40 40" className="-rotate-90 flex-shrink-0">
      <circle cx={20} cy={20} r={r} strokeWidth={3.5} stroke={trackColor} fill="none" />
      <circle
        cx={20} cy={20} r={r}
        strokeWidth={3.5}
        strokeLinecap="round"
        stroke={ringColor}
        fill="none"
        style={{
          strokeDasharray: c,
          strokeDashoffset: c - (pct / 100) * c,
          transition: "stroke-dashoffset 1s cubic-bezier(0.22,1,0.36,1)",
        }}
      />
    </svg>
  );
}

// ── Goal row (same pattern as TransactionHighlight in home) ───────────────────

interface GoalRowProps {
  data: ReturnType<typeof buildGoalCardData>;
  index: number;
  onEdit?: () => void;
}

function GoalRow({ data, index, onEdit }: GoalRowProps) {
  const done = data.isCompleted;
  const iconBg = done ? "rgba(16,185,129,0.10)" : "rgba(0,60,195,0.08)";
  const iconColor = done ? "#10b981" : "#003cc3";
  const pct = Math.min(100, data.percentage);

  const typeLabel = data.goal.type === "SHORT_TERM" ? "Curto prazo" : "Longo prazo";
  const typeBg  = data.goal.type === "SHORT_TERM" ? "rgba(245,158,11,0.10)" : "rgba(99,102,241,0.10)";
  const typeColor = data.goal.type === "SHORT_TERM" ? "#d97706" : "#6366f1";

  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.18, ease: EASE_OUT, delay: Math.min(index * 0.03, 0.25) }}
      className={`flex items-center gap-3 px-5 py-3 ${!done ? "cursor-pointer hover:bg-slate-50/60 transition-colors" : ""}`}
      onClick={!done ? onEdit : undefined}
    >
      {/* Icon — matches 46×46 rounded-[15px] from home */}
      <div
        className="flex-shrink-0 w-[46px] h-[46px] rounded-[15px] flex items-center justify-center"
        style={{ backgroundColor: iconBg }}
      >
        <ObjectiveIcon className="w-[22px] h-[22px]" style={{ color: iconColor }} />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0 space-y-0.5">
        <p className="text-sm font-bold text-[#1e293b] truncate">{data.title}</p>
        <div className="flex items-center gap-1.5">
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: typeBg, color: typeColor }}
          >
            {typeLabel}
          </span>
          <span className="text-[10px] text-[#94a3b8]">
            {data.valorPoupado} / {data.valorAlvo}
          </span>
        </div>

        {/* Thin progress bar */}
        <div className="w-full h-1 rounded-full bg-[rgba(0,60,195,0.06)] overflow-hidden mt-1">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.2, ease: EASE_OUT, delay: Math.min(index * 0.03, 0.25) + 0.1 }}
            className="h-full rounded-full"
            style={{ backgroundColor: done ? "#10b981" : "#003cc3" }}
          />
        </div>
      </div>

      {/* Right — ring + pct (matches amount pill position from home) */}
      <div className="flex-shrink-0 flex flex-col items-center gap-0.5">
        <Ring pct={pct} done={done} />
        <span
          className="text-[10px] font-extrabold"
          style={{ color: done ? "#10b981" : "#003cc3" }}
        >
          {pct}%
        </span>
      </div>
    </motion.div>
  );
}

// ── New goal modal (same style as ManualTransactionModal in home) ──────────────

interface NewGoalModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

function NewGoalModal({ onClose, onSuccess }: NewGoalModalProps) {
  const [title, setTitle]           = useState("");
  const [startDate, setStartDate]   = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate]       = useState("");
  const [type, setType]             = useState<GoalType>("SHORT_TERM");
  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading]       = useState(false);
  const { displayValue: targetDisplay, numericValue: targetNumeric, onChange: onTargetChange } = useCurrencyInput();

  const { add } = useGoalStore();
  const { categories, fetch: fetchCats } = useCategoryStore();

  useEffect(() => { fetchCats(); }, [fetchCats]);

  // auto-type
  useEffect(() => {
    if (!startDate || !endDate) return;
    const days = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86_400_000);
    if (!isNaN(days)) setType(days <= 60 ? "SHORT_TERM" : "LONG_TERM");
  }, [startDate, endDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const ok = await add({
      title,
      targetAmount: parseFloat(targetNumeric) || 0,
      startDate,
      endDate,
      type,
      categoryId,
    } as GoalPayload);
    if (ok) onSuccess();
    else setLoading(false);
  };

  const inputCls = "w-full text-sm rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[#1e293b] placeholder-[#94a3b8] focus:border-[#003cc3] focus:ring-2 focus:ring-[#003cc3]/15 outline-none transition-colors";
  const labelCls = "block text-xs font-bold text-[#64748b] mb-1.5";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ duration: 0.2, ease: EASE_OUT }}
        className="w-full max-w-md bg-white rounded-2xl shadow-sm overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="text-sm font-bold text-[#1e293b]">Novo Objectivo</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5 text-[#64748b]" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className={labelCls}>Título</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)}
              placeholder="Ex: Fundo de emergência" className={inputCls} required />
          </div>

          <div>
            <label className={labelCls}>Montante alvo (AOA)</label>
            <input type="text" inputMode="decimal" value={targetDisplay}
              onChange={onTargetChange} placeholder="0,00"
              className={inputCls} required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Data início</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                className={inputCls} required />
            </div>
            <div>
              <label className={labelCls}>Data fim</label>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
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
                    type === t ? "bg-[#003cc3] text-white" : "bg-[rgba(0,60,195,0.06)] text-[#003cc3]"
                  }`}
                >
                  {t === "SHORT_TERM" ? "Curto prazo" : "Longo prazo"}
                </button>
              ))}
            </div>
          </div>

          {categories.length > 0 && (
            <div>
              <label className={labelCls}>Categoria</label>
              <select value={categoryId} onChange={e => setCategoryId(e.target.value)}
                className={inputCls}>
                <option value="">Selecionar...</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-xl text-sm font-bold text-[#64748b] hover:bg-slate-50 transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-3 rounded-xl bg-[#003cc3] text-white text-sm font-bold hover:bg-[#0033a8] transition-colors shadow-sm disabled:opacity-60">
              {loading ? "A criar..." : "Criar"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function GoalsPage() {
  const { goals, isLoading, fetch, refresh } = useGoalStore();
  const [showNew, setShowNew]         = useState(false);
  const [editTarget, setEditTarget]   = useState<Goal | null>(null);

  useEffect(() => { fetch(); }, [fetch]);

  const items = useMemo(() => goals.map(buildGoalCardData), [goals]);
  const active    = items.filter(g => !g.isCompleted);
  const completed = items.filter(g => g.isCompleted);

  const handleNewSuccess = useCallback(() => {
    setShowNew(false);
    refresh();
  }, [refresh]);

  const handleEditClose = useCallback(() => setEditTarget(null), []);
  const handleEditUpdated = useCallback(() => { setEditTarget(null); refresh(); }, [refresh]);

  return (
    <div className="w-full max-w-[1360px] mx-auto flex flex-col gap-3">

      {/* Page header — same style as home */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: EASE_OUT }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            Objectivos Financeiros
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            Acompanhe e gira os seus objectivos de poupança.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowNew(true)}
          className="flex items-center gap-1.5 bg-[#003cc3] text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-sm hover:bg-[#0033a8] transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Novo objectivo
        </motion.button>
      </motion.div>

      {/* Active goals */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: EASE_OUT, delay: 0.08 }}
      >
        <div className="bg-white rounded-[20px] shadow-[0_4px_16px_rgba(0,60,195,0.08)] overflow-hidden">
          {/* Section header */}
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <h3 className="font-bold text-[#1e293b]" style={{ fontSize: 16 }}>
              Em andamento
            </h3>
            <span className="text-xs text-[#94a3b8]">
              {active.length} {active.length === 1 ? "objectivo" : "objectivos"}
            </span>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12 gap-3">
              <div className="w-6 h-6 border-[2.5px] border-[#003cc3] border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-[#64748b]">A carregar...</span>
            </div>
          ) : active.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3 px-5 text-center pb-8">
              <NoMovementIcon className="w-10 h-10 text-slate-200" />
              <p className="text-sm font-semibold text-slate-700">Nenhum objectivo em andamento.</p>
              <p className="text-xs text-[#94a3b8]">Crie um objectivo para começar a poupar.</p>
            </div>
          ) : (
            <div className="pb-3">
              {active.map((g, i) => (
                <React.Fragment key={g.id}>
                  <GoalRow
                    data={g}
                    index={i}
                    onEdit={() => setEditTarget(g.goal)}
                  />
                  {i < active.length - 1 && (
                    <div className="h-px mx-5" style={{ backgroundColor: "rgba(0,33,107,0.05)" }} />
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Completed goals */}
      {completed.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: EASE_OUT, delay: 0.14 }}
        >
          <div className="bg-white rounded-[20px] shadow-[0_4px_16px_rgba(0,60,195,0.08)] overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <h3 className="font-bold text-[#1e293b]" style={{ fontSize: 16 }}>
                Concluídos
              </h3>
              <span className="text-xs text-[#94a3b8]">
                {completed.length} {completed.length === 1 ? "objectivo" : "objectivos"}
              </span>
            </div>
            <div className="pb-3">
              {completed.map((g, i) => (
                <React.Fragment key={g.id}>
                  <GoalRow data={g} index={i} />
                  {i < completed.length - 1 && (
                    <div className="h-px mx-5" style={{ backgroundColor: "rgba(0,33,107,0.05)" }} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {showNew && (
          <NewGoalModal onClose={() => setShowNew(false)} onSuccess={handleNewSuccess} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editTarget && (
          <EditModal
            isOpen={Boolean(editTarget)}
            onClose={handleEditClose}
            onUpdated={handleEditUpdated}
            objective={editTarget}
          />
        )}
      </AnimatePresence>

      <NotificationToast />
    </div>
  );
}
