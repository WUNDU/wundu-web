"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tag, Plus, Loader2, Globe, User, FolderPlus,
  X, Wallet, CheckCircle2, Pencil, ShieldAlert,
} from "lucide-react";
import { useCategoryStore } from "@/store/category-store";
import { useLimitStore } from "@/store/limit-store";
import { useUserStore } from "@/store/user-store";
import { getCategoryStyle } from "@/utils/category-style";
import type { Category } from "@/types/dtos/category.dto";

// ─── Limit dialog ─────────────────────────────────────────────────────────────
// Converts digit string (cents) → "1 000,00" display
function centsToDisplay(cents: string): string {
  const n = cents.replace(/\D/g, "");
  if (!n || n === "0") return "";
  const padded = n.padStart(3, "0");
  const intPart = padded.slice(0, -2).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  const decPart = padded.slice(-2);
  return `${intPart},${decPart}`;
}

function displayToAmount(cents: string): number {
  return parseInt(cents.replace(/\D/g, "") || "0", 10) / 100;
}

function amountToCents(amount: number): string {
  return Math.round(amount * 100).toString();
}

function LimitDialog({
  open,
  categoryName,
  currentLimit,
  onClose,
  onConfirm,
}: {
  open: boolean;
  categoryName: string;
  currentLimit?: number;
  onClose: () => void;
  onConfirm: (amount: number) => void;
}) {
  // cents as string of digits
  const [cents, setCents] = useState(currentLimit ? amountToCents(currentLimit) : "");

  useEffect(() => {
    if (open) setCents(currentLimit ? amountToCents(currentLimit) : "");
  }, [open, currentLimit]);

  const amount = displayToAmount(cents);
  const canConfirm = amount > 0;
  const displayValue = centsToDisplay(cents);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      setCents((c) => c.slice(0, -1));
      return;
    }
    if (e.key === "Enter" && canConfirm) { onConfirm(amount); return; }
    if (e.key === "Escape") { onClose(); return; }
    const digit = e.key;
    if (/^\d$/.test(digit)) {
      e.preventDefault();
      setCents((c) => (c + digit).replace(/^0+/, "") || "0");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="relative w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: "spring", damping: 30, stiffness: 450, mass: 0.8 }}
          >
            {/* Header stripe */}
            <div className="bg-gradient-to-r from-[#001a4d] to-[#003cc3] px-6 py-5 flex items-start justify-between">
              <div>
                <h3 className="text-white font-black text-lg tracking-tight">Definir Limite</h3>
                <p className="text-white/60 text-sm font-medium mt-0.5">{categoryName}</p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">
                  Limite Mensal (KZ)
                </label>
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus-within:border-[#003cc3]/40 focus-within:bg-white transition-all">
                  <Wallet className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <input
                    autoFocus
                    inputMode="numeric"
                    value={displayValue}
                    onChange={() => {/* controlled via onKeyDown */}}
                    onKeyDown={handleKey}
                    placeholder="0,00"
                    className="flex-1 text-sm text-[#1e293b] bg-transparent outline-none placeholder:text-slate-400 font-semibold tracking-wide"
                  />
                </div>
              </div>

              <button
                onClick={() => canConfirm && onConfirm(amount)}
                disabled={!canConfirm}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#001a4d] to-[#003cc3] text-white font-bold rounded-2xl disabled:opacity-40 hover:opacity-90 active:opacity-80 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                Confirmar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Category card (system, with limit) ──────────────────────────────────────
function SystemCategoryCard({
  cat,
  limit,
  onSetLimit,
  index,
}: {
  cat: Category;
  limit?: { monthlyLimit: number };
  onSetLimit: () => void;
  index: number;
}) {
  const { icon: Icon, color, bg } = getCategoryStyle(cat.name);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center gap-3 p-4 rounded-2xl border bg-white hover:shadow-[0_4px_16px_rgba(0,60,195,0.08)] transition-all duration-200 group"
      style={{ borderColor: color + "22" }}
    >
      {/* Icon */}
      <div
        className="w-10 h-10 rounded-[13px] flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: bg }}
      >
        <Icon className="w-4.5 h-4.5" style={{ color }} />
      </div>

      {/* Name + limit */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-[#1e293b] truncate">{cat.name}</p>
        {limit ? (
          <p className="text-xs font-semibold mt-0.5" style={{ color: "#10b981" }}>
            KZ {limit.monthlyLimit.toLocaleString("pt-AO")}/mês
          </p>
        ) : (
          <p className="text-xs text-slate-400 font-medium mt-0.5">Sem limite</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: bg, color }}
        >
          SISTEMA
        </span>
        <button
          onClick={onSetLimit}
          className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-xl border transition-all duration-150 hover:scale-105 active:scale-95"
          style={{
            color,
            borderColor: color + "40",
            backgroundColor: bg,
          }}
        >
          {limit ? <Pencil className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
          {limit ? "Editar" : "Limite"}
        </button>
      </div>
    </motion.div>
  );
}

// ─── Custom category card ─────────────────────────────────────────────────────
function CustomCategoryCard({ cat, index }: { cat: Category; index: number }) {
  const { icon: Icon, color, bg } = getCategoryStyle(cat.name);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center gap-3 p-4 rounded-2xl border bg-white hover:shadow-[0_4px_16px_rgba(0,60,195,0.08)] transition-all duration-200"
      style={{ borderColor: color + "30" }}
    >
      <div
        className="w-10 h-10 rounded-[13px] flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: bg }}
      >
        <Icon className="w-4.5 h-4.5" style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-[#1e293b] truncate">{cat.name}</p>
        <p className="text-xs text-slate-400 font-medium mt-0.5">Categoria personalizada</p>
      </div>
      <span
        className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: bg, color }}
      >
        PESSOAL
      </span>
    </motion.div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function CategoriesPage() {
  const { categories, isLoading, hasFetched, fetchActive, create } = useCategoryStore();
  const { limits, define, fetchLimit } = useLimitStore();
  const userId = useUserStore((s) => s.user?.id);

  const [tab, setTab] = useState<"sistema" | "custom">("sistema");
  const [newName, setNewName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [limitTarget, setLimitTarget] = useState<Category | null>(null);

  useEffect(() => {
    if (!hasFetched) fetchActive();
  }, [hasFetched, fetchActive]);

  // Fetch limits for all system categories
  useEffect(() => {
    if (!userId || !categories.length) return;
    categories
      .filter((c) => !c.userId)
      .forEach((c) => fetchLimit(userId, c.id));
  }, [userId, categories]);

  const systemCategories = categories.filter((c) => !c.userId);
  const myCategories = categories.filter((c) => !!c.userId);

  const handleCreate = async () => {
    const name = newName.trim();
    if (!name) return;
    if (categories.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
      setCreateError(`"${name}" já existe.`);
      return;
    }
    setIsCreating(true);
    setCreateError("");
    const created = await create({ name });
    setIsCreating(false);
    if (created) {
      setNewName("");
      setTab("custom");
    } else {
      setCreateError("Não foi possível criar. Tente novamente.");
    }
  };

  const handleConfirmLimit = useCallback(
    async (amount: number) => {
      if (!limitTarget || !userId) return;
      const ok = await define({ userId, categoryId: limitTarget.id, monthlyLimit: amount });
      if (ok) setLimitTarget(null);
    },
    [limitTarget, userId, define],
  );

  const getLimitKey = (categoryId: string) =>
    userId ? limits[`${userId}_${categoryId}`] : undefined;

  return (
    <motion.div
      className="max-w-[800px] mx-auto px-4 pb-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 pt-4 pb-5">
        <div className="w-10 h-10 rounded-[13px] bg-gradient-to-br from-[#003cc3] to-[#001a66] flex items-center justify-center shadow-sm flex-shrink-0">
          <Tag className="w-5 h-5 text-[#ffd400]" />
        </div>
        <div className="flex-1">
          <h1 className="text-base font-black text-slate-900 tracking-tight">Categorias</h1>
          <p className="text-sm text-slate-500 font-medium">Gira categorias e limites mensais</p>
        </div>
      </div>

      {/* ── Tab switcher ────────────────────────────────────────────────── */}
      <div className="flex gap-1 p-1 bg-slate-100 rounded-2xl mb-5">
        {(["sistema", "custom"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
              tab === t
                ? "bg-white text-[#001a4d] shadow-sm"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {t === "sistema" ? (
              <span className="flex items-center justify-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                Sistema
                <span className="text-[10px] font-bold bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded-full">
                  {systemCategories.length}
                </span>
              </span>
            ) : (
              <span className="flex items-center justify-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                Personalizadas
                <span className="text-[10px] font-bold bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded-full">
                  {myCategories.length}
                </span>
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Sistema tab ─────────────────────────────────────────────────── */}
      {tab === "sistema" && (
        <AnimatePresence mode="wait">
          <motion.div
            key="sistema"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.15 }}
            className="space-y-3"
          >
            {/* Info banner */}
            <div className="flex items-start gap-3 bg-[rgba(0,60,195,0.05)] border border-[#003cc3]/10 rounded-2xl px-4 py-3">
              <ShieldAlert className="w-4 h-4 text-[#003cc3] mt-0.5 flex-shrink-0" />
              <p className="text-xs text-[#003cc3] font-medium leading-relaxed">
                Categorias de sistema são somente leitura. Podes definir um{" "}
                <span className="font-bold">limite mensal</span> por categoria para controlar os gastos.
              </p>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
              </div>
            ) : (
              <div className="space-y-2">
                {systemCategories.map((cat, i) => (
                  <SystemCategoryCard
                    key={cat.id}
                    cat={cat}
                    limit={getLimitKey(cat.id)}
                    onSetLimit={() => setLimitTarget(cat)}
                    index={i}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {/* ── Personalizadas tab ──────────────────────────────────────────── */}
      {tab === "custom" && (
        <AnimatePresence mode="wait">
          <motion.div
            key="custom"
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.15 }}
            className="space-y-4"
          >
            {/* Create new */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,60,195,0.06)] p-5">
              <div className="flex items-center gap-2 mb-3">
                <FolderPlus className="w-4 h-4 text-[#003cc3]" />
                <h2 className="text-sm font-bold text-[#1e293b]">Nova categoria</h2>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => { setNewName(e.target.value); setCreateError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                  placeholder="Ex: Viagens, Animais..."
                  maxLength={30}
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-[#1e293b] placeholder:text-slate-400 focus:outline-none focus:border-[#003cc3]/40 focus:bg-white transition-all"
                />
                <button
                  onClick={handleCreate}
                  disabled={!newName.trim() || isCreating}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-[#ffd400] text-[#1e293b] rounded-xl text-sm font-bold hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all whitespace-nowrap"
                >
                  {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Criar
                </button>
              </div>
              {createError && <p className="text-red-500 text-xs mt-2">{createError}</p>}
            </div>

            {/* List */}
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
              </div>
            ) : myCategories.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-16 text-slate-400">
                <FolderPlus className="w-10 h-10 opacity-25" />
                <p className="text-sm font-medium">Ainda não tens categorias personalizadas.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {myCategories.map((cat, i) => (
                  <CustomCategoryCard key={cat.id} cat={cat} index={i} />
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {/* ── Limit dialog ────────────────────────────────────────────────── */}
      <LimitDialog
        open={!!limitTarget}
        categoryName={limitTarget?.name ?? ""}
        currentLimit={limitTarget ? getLimitKey(limitTarget.id)?.monthlyLimit : undefined}
        onClose={() => setLimitTarget(null)}
        onConfirm={handleConfirmLimit}
      />
    </motion.div>
  );
}

