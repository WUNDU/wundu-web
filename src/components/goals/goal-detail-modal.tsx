"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownCircle, Calendar, Edit2, TrendingUp, X } from "lucide-react";
import { useGoalStore } from "@/store/goal-store";
import { goalService } from "@/services/goal.service";
import { formatAOA, maskAOAInput, parseAOA } from "@/lib/currency";
import type { Goal, GoalProgress } from "@/types/dtos/goal.dto";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

function daysUntil(dateStr: string): number {
  return Math.max(0, Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86_400_000));
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("pt-AO", { day: "2-digit", month: "short", year: "numeric" });
}

// ── Progress ring ─────────────────────────────────────────────────────────────
function ProgressRing({ pct, done }: { pct: number; done: boolean }) {
  const r = 54;
  const c = 2 * Math.PI * r;
  // Start empty, animate to real value on mount
  const [offset, setOffset] = useState(c);
  useEffect(() => {
    const t = setTimeout(() => setOffset(c - (Math.min(pct, 100) / 100) * c), 80);
    return () => clearTimeout(t);
  }, [pct, c]);

  return (
    <div className="relative w-[88px] h-[88px] sm:w-32 sm:h-32 flex-shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128" fill="none">
        <circle cx={64} cy={64} r={r} strokeWidth={10} stroke="rgba(255,255,255,0.10)" />
        <circle cx={64} cy={64} r={r} strokeWidth={10} strokeLinecap="round"
          stroke={done ? "rgba(52,211,153,0.35)" : "rgba(255,212,0,0.35)"}
          style={{ strokeDasharray: c, strokeDashoffset: offset,
            transition: "stroke-dashoffset 1.3s cubic-bezier(0.22,1,0.36,1)" }}
        />
        <circle cx={64} cy={64} r={r} strokeWidth={7} strokeLinecap="round"
          stroke={done ? "#34D399" : "#ffd400"}
          style={{ strokeDasharray: c, strokeDashoffset: offset,
            transition: "stroke-dashoffset 1.3s cubic-bezier(0.22,1,0.36,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
        <span className={`text-[20px] sm:text-[28px] font-black leading-none ${done ? "text-emerald-300" : "text-[#ffd400]"}`}>{pct}%</span>
        <span className="text-[7px] sm:text-[8px] uppercase tracking-[1.4px] sm:tracking-[1.8px] font-bold text-white/40">{done ? "meta!" : "completo"}</span>
      </div>
    </div>
  );
}

// ── Thin progress bar ─────────────────────────────────────────────────────────
function ProgressBar({ pct, done }: { pct: number; done: boolean }) {
  return (
    <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.10)" }}>
      <motion.div
        className="h-full rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(pct,100)}%` }}
        transition={{ duration: 1.2, ease: EASE, delay: 0.2 }}
        style={{ background: done ? "#34D399" : "linear-gradient(90deg, #ffd400, #ff9500)" }}
      />
    </div>
  );
}

// ── Stat chip ─────────────────────────────────────────────────────────────────
function StatChip({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="flex-1 min-w-0 bg-white/[0.07] rounded-2xl px-2 sm:px-3 py-2.5 sm:py-3 flex flex-col gap-1 border border-white/[0.08]">
      <p className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[1.2px] sm:tracking-[1.4px] text-white/40 truncate">{label}</p>
      <p className="text-xs sm:text-sm font-black leading-none truncate" style={{ color: accent }}>{value}</p>
    </div>
  );
}

// ── History row ───────────────────────────────────────────────────────────────
function HistoryRow({ item, index, isLast }: { item: GoalProgress; index: number; isLast: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15, delay: Math.min(index, 8) * 0.04, ease: EASE }}
      className="flex items-stretch gap-3"
    >
      {/* Timeline spine */}
      <div className="flex flex-col items-center gap-0 w-5 flex-shrink-0 pt-1">
        <div className="w-2 h-2 rounded-full bg-[#003cc3] flex-shrink-0 ring-4 ring-[#003cc3]/10" />
        {!isLast && <div className="flex-1 w-px bg-slate-100 mt-1" />}
      </div>

      {/* Content */}
      <div className={`flex-1 min-w-0 flex items-center justify-between gap-2 pb-3 ${isLast ? "" : "border-b border-slate-50"}`}>
        <div className="min-w-0">
          <p className="text-sm font-bold text-[#1e293b] truncate">{formatAOA(item.amount)}</p>
          <p className="text-[11px] text-[#94a3b8] font-medium mt-0.5">{formatDate(item.progressDate)}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <span className="inline-block text-[11px] font-black text-[#003cc3] bg-[rgba(0,60,195,0.07)] px-2.5 py-1 rounded-full">
            {Math.round(item.progressPercent ?? 0)}%
          </span>
          <p className="text-[10px] text-[#94a3b8] mt-1 whitespace-nowrap">{formatAOA(item.accumulatedAmount ?? item.amount)}</p>
        </div>
      </div>
    </motion.div>
  );
}

// ── Add savings sheet ─────────────────────────────────────────────────────────
function AddSavingsSheet({
  goalTitle,
  onClose,
  onSave,
}: {
  goalTitle: string;
  onClose: () => void;
  onSave: (amount: number, date: string) => Promise<void>;
}) {
  const [display, setDisplay] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 120); }, []);

  const numeric = parseFloat(parseAOA(display));
  const canSave = numeric > 0;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplay(maskAOAInput(e.target.value));
  };

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    await onSave(numeric, date);
    setSaving(false);
  };

  return (
    <>
      {/* Backdrop over modal body */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 z-10 bg-black/25"
        onClick={onClose}
      />

      {/* Sheet */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ duration: 0.3, ease: EASE }}
        className="absolute inset-x-0 bottom-0 z-20 rounded-t-[28px] overflow-hidden"
        style={{ boxShadow: "0 -8px 40px rgba(0,26,102,0.22)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Blue hero ── */}
        <div
          className="px-5 pt-4 pb-7"
          style={{ background: "linear-gradient(160deg, #0048f0 0%, #001880 100%)" }}
        >
          {/* Handle */}
          <div className="flex justify-center mb-5">
            <div className="w-9 h-1 rounded-full bg-white/20" />
          </div>

          {/* Title row */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[1.6px] text-white/40 mb-0.5">
                Adicionar poupança
              </p>
              <p className="text-sm font-black text-white leading-tight truncate max-w-[200px] sm:max-w-[260px]">
                {goalTitle}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
            >
              <X className="w-4 h-4 text-white/70" />
            </button>
          </div>

          {/* Amount input */}
          <div className="flex items-baseline justify-center gap-2.5">
            <span className="text-lg font-bold text-white/30 leading-none select-none">Kz</span>
            <input
              ref={inputRef}
              type="text"
              inputMode="decimal"
              value={display}
              onChange={handleAmountChange}
              placeholder="0,00"
              className="text-[42px] sm:text-[50px] font-black text-white text-center bg-transparent outline-none tracking-tight min-w-0 w-full max-w-[260px]"
              style={{ caretColor: "#ffd400" }}
            />
          </div>

          {/* Animated underline */}
          <div className="flex justify-center mt-3">
            <div
              className="h-[2px] rounded-full transition-all duration-300"
              style={{
                width: canSave ? "72px" : "44px",
                background: canSave ? "#ffd400" : "rgba(255,255,255,0.18)",
              }}
            />
          </div>

          {/* Amount validation hint */}
          <p className="text-center text-[11px] font-semibold mt-2.5 transition-colors duration-200"
            style={{ color: canSave ? "rgba(255,212,0,0.7)" : "rgba(255,255,255,0.25)" }}>
            {canSave ? `${display} Kz a registar` : "Insere o valor poupado"}
          </p>
        </div>

        {/* ── White body ── */}
        <div className="bg-white px-5 pt-5 pb-6 space-y-4">
          {/* Date picker */}
          <div className="flex items-center gap-3 rounded-2xl px-4 py-3.5 border border-slate-100"
            style={{ backgroundColor: "#f8fafc" }}>
            <div
              className="w-9 h-9 rounded-[11px] flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "rgba(0,60,195,0.07)" }}
            >
              <Calendar className="w-4 h-4 text-[#003cc3]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-[1.2px] text-[#94a3b8] mb-0.5">
                Data da poupança
              </p>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="text-sm font-bold text-[#1e293b] bg-transparent outline-none w-full"
              />
            </div>
          </div>

          {/* CTA */}
          <motion.button
            whileTap={{ scale: canSave ? 0.97 : 1 }}
            onClick={handleSave}
            disabled={!canSave || saving}
            className="w-full py-4 rounded-2xl text-sm font-black text-white flex items-center justify-center gap-2 transition-opacity disabled:opacity-35"
            style={{ background: "linear-gradient(135deg, #003cc3 0%, #001a66 100%)" }}
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white/70 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <ArrowDownCircle className="w-4 h-4" />
                Confirmar poupança
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </>
  );
}

// ── Main modal ────────────────────────────────────────────────────────────────

export interface GoalDetailModalProps {
  goal: Goal;
  onClose: () => void;
  onEdit: () => void;
  onProgressAdded: () => void;
}

export function GoalDetailModal({ goal: initialGoal, onClose, onEdit, onProgressAdded }: GoalDetailModalProps) {
  const [goal, setGoal] = useState<Goal>(initialGoal);
  const [loadingGoal, setLoadingGoal] = useState(true);
  const [showSheet, setShowSheet] = useState(false);
  const addProgress = useGoalStore((s) => s.addProgress);

  const refreshGoal = useCallback(async () => {
    try {
      const fresh = await goalService.getById(goal.id);
      setGoal(fresh);
    } catch {}
    setLoadingGoal(false);
  }, [goal.id]);

  useEffect(() => { refreshGoal(); }, [refreshGoal]);

  const pct = Math.max(0, Math.min(100, Math.round(
    goal.progressPercentage ?? (goal.currentAmount / goal.targetAmount) * 100
  )));
  const done = pct >= 100;
  const missing = Math.max(0, goal.targetAmount - goal.currentAmount);
  const daysLeft = daysUntil(goal.endDate);
  const dailySuggestion = daysLeft > 0 ? missing / daysLeft : 0;

  const history = [...(goal.progress ?? [])].sort(
    (a, b) => new Date(b.progressDate).getTime() - new Date(a.progressDate).getTime()
  );

  const handleSave = async (amount: number, date: string) => {
    const ok = await addProgress(goal.id, amount, date);
    if (ok) {
      setShowSheet(false);
      await refreshGoal();
      onProgressAdded();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/55 p-0 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 48 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 48 }}
        transition={{ duration: 0.28, ease: EASE }}
        className="relative w-full sm:max-w-md bg-white sm:rounded-[26px] rounded-t-[28px] shadow-2xl max-h-[92dvh] sm:max-h-[94vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="flex-shrink-0 flex justify-center pt-3 pb-0 sm:hidden">
          <div className="w-9 h-1 rounded-full bg-white/30" />
        </div>

        {/* ── Hero ── */}
        <div
          className="flex-shrink-0 relative overflow-hidden px-4 sm:px-6 pt-4 sm:pt-5 pb-5 sm:pb-6"
          style={{ background: "linear-gradient(135deg, #0048f0 0%, #002db8 55%, #001880 100%)" }}
        >
          {/* Orbs */}
          <div className="pointer-events-none absolute -top-12 -right-12 w-48 h-48 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.03)" }} />
          <div className="pointer-events-none absolute -bottom-8 -left-8 w-36 h-36 rounded-full" style={{ backgroundColor: "rgba(255,212,0,0.05)" }} />

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
          >
            <X className="w-4 h-4 text-white/75" />
          </button>

          {/* Ring + info */}
          <div className="relative z-10 flex items-center gap-3 sm:gap-5 mb-4 sm:mb-5">
            <ProgressRing pct={pct} done={done} />
            <div className="flex-1 min-w-0">
              <p className="text-[9px] uppercase tracking-[1.6px] font-bold text-white/40 mb-1">Objectivo</p>
              <h2 className="text-base sm:text-[18px] font-black text-white leading-tight truncate">{goal.title}</h2>
              {goal.description && (
                <p className="text-[11px] text-white/40 mt-1 line-clamp-2">{goal.description}</p>
              )}
              <div className="mt-2 sm:mt-3 flex items-baseline gap-1.5 min-w-0">
                <span className="text-[17px] sm:text-[22px] font-black text-white leading-none truncate">{formatAOA(goal.currentAmount)}</span>
                <span className="text-[10px] sm:text-xs text-white/35 font-semibold whitespace-nowrap">/ {formatAOA(goal.targetAmount)} Kz</span>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <ProgressBar pct={pct} done={done} />

          {/* Stats row — inside hero */}
          <div className="flex gap-2 mt-3 sm:mt-4">
            <StatChip label="Falta" value={formatAOA(missing)} accent="#ff6b6b" />
            <StatChip label="Dias" value={String(daysLeft)} accent="#7dd3fc" />
            <StatChip label="Por dia" value={dailySuggestion > 0 ? formatAOA(dailySuggestion) : "—"} accent="#fbbf24" />
          </div>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 min-h-0 overflow-y-auto bg-white">

          {/* Add savings CTA */}
          {!done && (
            <div className="px-5 pt-4 pb-1">
              <button
                onClick={() => setShowSheet(true)}
                className="w-full py-3.5 rounded-2xl text-sm font-black text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98]"
                style={{ background: "linear-gradient(135deg, #003cc3, #001a66)" }}
              >
                <ArrowDownCircle className="w-4 h-4" />
                Adicionar poupança
              </button>
            </div>
          )}

          {/* Savings history */}
          <div className="px-5 pt-4 pb-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-[#003cc3]" />
              <h3 className="text-sm font-bold text-[#1e293b]">Histórico de poupança</h3>
              {history.length > 0 && (
                <span className="ml-auto text-[10px] font-bold text-[#94a3b8] bg-slate-100 px-2 py-0.5 rounded-full">
                  {history.length}
                </span>
              )}
            </div>

            {loadingGoal ? (
              <div className="flex justify-center py-8">
                <div className="w-5 h-5 border-2 border-[#003cc3] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : history.length === 0 ? (
              <div className="flex flex-col items-center py-8 gap-2">
                <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-slate-200" />
                </div>
                <p className="text-sm text-[#94a3b8] font-semibold">Sem poupanças registadas</p>
                <p className="text-xs text-[#cbd5e1]">Adiciona a primeira poupança acima</p>
              </div>
            ) : (
              <div>
                {history.map((item, i) => (
                  <HistoryRow key={item.id} item={item} index={i} isLast={i === history.length - 1} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex-shrink-0 px-5 py-3 border-t border-slate-100 flex gap-2 bg-white">
          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-[#003cc3] bg-[rgba(0,60,195,0.06)] hover:bg-[rgba(0,60,195,0.10)] transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
            Editar
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-xs font-bold text-[#64748b] bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Fechar
          </button>
        </div>

        {/* ── Add savings sheet (slides up inside modal) ── */}
        <AnimatePresence>
          {showSheet && (
            <AddSavingsSheet
              goalTitle={goal.title}
              onClose={() => setShowSheet(false)}
              onSave={handleSave}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
