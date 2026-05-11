"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tag, Plus, Loader2, Globe, User, FolderPlus,
  X, Wallet, CheckCircle2, Pencil, ShieldAlert,
  BarChart3, AlertTriangle,
} from "lucide-react";
import { useCategoryStore } from "@/store/category-store";
import { useLimitStore } from "@/store/limit-store";
import { useUserStore } from "@/store/user-store";
import { useTransactionStore } from "@/store/transaction-store";
import { getCategoryStyle } from "@/utils/category-style";
import { formatCurrency } from "@/utils/format-currency";
import type { Category } from "@/types/dtos/category.dto";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function centsToDisplay(c: string): string {
  const n = c.replace(/\D/g, "");
  if (!n || n === "0") return "";
  const p = n.padStart(3, "0");
  return `${p.slice(0, -2).replace(/\B(?=(\d{3})+(?!\d))/g, " ")},${p.slice(-2)}`;
}
function displayToAmount(c: string) { return parseInt(c.replace(/\D/g, "") || "0", 10) / 100; }
function amountToCents(a: number) { return Math.round(a * 100).toString(); }
function progressColor(pct: number) {
  if (pct >= 100) return "#ef4444";
  if (pct >= 80) return "#f59e0b";
  return "#10b981";
}

// ─── Limit dialog ─────────────────────────────────────────────────────────────
function LimitDialog({
  open, categoryName, currentLimit, onClose, onConfirm,
}: {
  open: boolean; categoryName: string; currentLimit?: number;
  onClose: () => void; onConfirm: (amount: number) => void;
}) {
  const [cents, setCents] = useState(currentLimit ? amountToCents(currentLimit) : "");
  useEffect(() => { if (open) setCents(currentLimit ? amountToCents(currentLimit) : ""); }, [open, currentLimit]);
  const amount = displayToAmount(cents);
  const canConfirm = amount > 0;

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Backspace") { e.preventDefault(); setCents((c) => c.slice(0, -1)); return; }
    if (e.key === "Enter" && canConfirm) { onConfirm(amount); return; }
    if (e.key === "Escape") { onClose(); return; }
    if (/^\d$/.test(e.key)) { e.preventDefault(); setCents((c) => (c + e.key).replace(/^0+/, "") || "0"); }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}>
          <motion.div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
          <motion.div className="relative w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: "spring", damping: 30, stiffness: 450, mass: 0.8 }}>
            <div className="bg-gradient-to-r from-[#001a4d] to-[#003cc3] px-6 py-5 flex items-start justify-between">
              <div>
                <h3 className="text-white font-black text-lg tracking-tight">Definir Limite</h3>
                <p className="text-white/60 text-sm font-medium mt-0.5">{categoryName}</p>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Limite Mensal (KZ)</label>
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus-within:border-[#003cc3]/40 focus-within:bg-white transition-all">
                  <Wallet className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <input autoFocus inputMode="numeric" value={centsToDisplay(cents)}
                    onChange={() => {}} onKeyDown={handleKey} placeholder="0,00"
                    className="flex-1 text-sm text-[#1e293b] bg-transparent outline-none placeholder:text-slate-400 font-semibold tracking-wide" />
                </div>
              </div>
              <button onClick={() => canConfirm && onConfirm(amount)} disabled={!canConfirm}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#001a4d] to-[#003cc3] text-white font-bold rounded-2xl disabled:opacity-40 hover:opacity-90 active:opacity-80 transition-all">
                <CheckCircle2 className="w-4 h-4" />Confirmar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Resumo tab ───────────────────────────────────────────────────────────────
function ResumoTab({
  monthlySpendByName,
  systemCategories,
  myCategories,
  getLimitKey,
  onSetLimit,
}: {
  monthlySpendByName: Record<string, number>;
  systemCategories: Category[];
  myCategories: Category[];
  getLimitKey: (id: string) => { monthlyLimit: number } | undefined;
  onSetLimit: (cat: Category) => void;
}) {
  const total = Object.values(monthlySpendByName).reduce((s, v) => s + v, 0);
  const sorted = Object.entries(monthlySpendByName)
    .filter(([k, v]) => k !== "__none__" && v > 0)
    .sort((a, b) => b[1] - a[1]);

  // categories with limit and spending — for alert section
  const atRisk = systemCategories.filter((c) => {
    const limit = getLimitKey(c.id);
    const spent = monthlySpendByName[c.name] ?? 0;
    if (!limit || spent === 0) return false;
    return (spent / limit.monthlyLimit) >= 0.8;
  });

  return (
    <motion.div key="resumo" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 8 }} transition={{ duration: 0.15 }} className="space-y-4">

      {/* Total card */}
      <div className="bg-gradient-to-br from-[#001a4d] to-[#003cc3] rounded-2xl p-5 text-white">
        <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Total gasto este mês</p>
        <p className="text-3xl font-black tracking-tight">KZ {formatCurrency(total)}</p>
        <p className="text-white/50 text-xs font-medium mt-1">
          {sorted.length} categori{sorted.length !== 1 ? "as" : "a"} com actividade
        </p>
      </div>

      {/* Alerts — at-risk limits */}
      {atRisk.length > 0 && (
        <div className="space-y-2">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">⚠️ Limites em risco</p>
          {atRisk.map((cat) => {
            const limit = getLimitKey(cat.id)!;
            const spent = monthlySpendByName[cat.name] ?? 0;
            const pct = Math.min(Math.round((spent / limit.monthlyLimit) * 100), 100);
            const col = progressColor(pct);
            const { icon: Icon, bg } = getCategoryStyle(cat.name);
            return (
              <div key={cat.id} className="flex items-center gap-3 bg-white rounded-2xl border p-4"
                style={{ borderColor: col + "40" }}>
                <div className="w-9 h-9 rounded-[11px] flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bg }}>
                  <Icon className="w-4 h-4" style={{ color: col }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-bold text-[#1e293b]">{cat.name}</p>
                    <span className="text-xs font-bold" style={{ color: col }}>{pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <motion.div className="h-full rounded-full" initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }} transition={{ duration: 0.5, ease: "easeOut" }}
                      style={{ backgroundColor: col }} />
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium mt-1">
                    KZ {formatCurrency(spent)} de KZ {formatCurrency(limit.monthlyLimit)}
                  </p>
                </div>
                <button onClick={() => onSetLimit(cat)}
                  className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center transition-all flex-shrink-0">
                  <Pencil className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Breakdown list */}
      {sorted.length > 0 ? (
        <div className="space-y-2">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Distribuição</p>
          {sorted.map(([name, amount], i) => {
            const pct = total > 0 ? Math.round((amount / total) * 100) : 0;
            const { icon: Icon, color, bg } = getCategoryStyle(name);
            return (
              <motion.div key={name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03, duration: 0.18 }}
                className="flex items-center gap-3 bg-white rounded-2xl border border-slate-100 p-3.5 hover:shadow-[0_2px_12px_rgba(0,60,195,0.06)] transition-all">
                <div className="w-9 h-9 rounded-[11px] flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bg }}>
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-bold text-[#1e293b] truncate">{name}</p>
                    <p className="text-sm font-black text-[#1e293b] ml-2 flex-shrink-0">KZ {formatCurrency(amount)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <motion.div className="h-full rounded-full" initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }} transition={{ duration: 0.45, ease: "easeOut", delay: i * 0.04 }}
                        style={{ backgroundColor: color }} />
                    </div>
                    <span className="text-[10px] font-bold flex-shrink-0" style={{ color }}>{pct}%</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 py-16 text-slate-400">
          <BarChart3 className="w-10 h-10 opacity-20" />
          <p className="text-sm font-medium">Sem despesas registadas este mês.</p>
        </div>
      )}
    </motion.div>
  );
}

// ─── System category card ─────────────────────────────────────────────────────
function SystemCategoryCard({
  cat, limit, spent, onSetLimit, index,
}: {
  cat: Category; limit?: { monthlyLimit: number }; spent: number;
  onSetLimit: () => void; index: number;
}) {
  const { icon: Icon, color, bg } = getCategoryStyle(cat.name);
  const monthlyLimit = limit?.monthlyLimit ?? 0;
  const pct = monthlyLimit > 0 ? Math.min(Math.round((spent / monthlyLimit) * 100), 100) : 0;
  const barColor = progressColor(pct);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white rounded-2xl border p-4 hover:shadow-[0_4px_16px_rgba(0,60,195,0.08)] transition-all duration-200"
      style={{ borderColor: color + "22" }}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-[13px] flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bg }}>
          <Icon className="w-4.5 h-4.5" style={{ color }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-[#1e293b] truncate">{cat.name}</p>
          {spent > 0 ? (
            <p className="text-xs font-semibold mt-0.5 text-slate-500">KZ {formatCurrency(spent)} gastos este mês</p>
          ) : (
            <p className="text-xs text-slate-300 font-medium mt-0.5">Sem actividade este mês</p>
          )}
        </div>
        <button onClick={onSetLimit}
          className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1.5 rounded-xl border transition-all hover:scale-105 active:scale-95 flex-shrink-0"
          style={{ color, borderColor: color + "40", backgroundColor: bg }}>
          {limit ? <Pencil className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
          {limit ? "Editar" : "Limite"}
        </button>
      </div>
      {monthlyLimit > 0 && (
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] text-slate-400 font-medium">
              KZ {formatCurrency(spent)} <span className="text-slate-300">/ KZ {formatCurrency(monthlyLimit)}</span>
            </span>
            <span className="text-[10px] font-bold" style={{ color: barColor }}>{pct}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <motion.div className="h-full rounded-full" initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.04 }}
              style={{ backgroundColor: barColor }} />
          </div>
          {pct >= 80 && (
            <div className="flex items-center gap-1 mt-1.5">
              <AlertTriangle className="w-3 h-3" style={{ color: barColor }} />
              <span className="text-[10px] font-bold" style={{ color: barColor }}>
                {pct >= 100 ? "Limite atingido!" : "A aproximar do limite"}
              </span>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

// ─── Custom category card ─────────────────────────────────────────────────────
function CustomCategoryCard({ cat, spent, index }: { cat: Category; spent: number; index: number }) {
  const { icon: Icon, color, bg } = getCategoryStyle(cat.name);
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white rounded-2xl border p-4 hover:shadow-[0_4px_16px_rgba(0,60,195,0.08)] transition-all duration-200"
      style={{ borderColor: color + "30" }}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-[13px] flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bg }}>
          <Icon className="w-4.5 h-4.5" style={{ color }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-[#1e293b] truncate">{cat.name}</p>
          {spent > 0 ? (
            <p className="text-xs font-semibold mt-0.5" style={{ color }}>KZ {formatCurrency(spent)} gastos este mês</p>
          ) : (
            <p className="text-xs text-slate-300 font-medium mt-0.5">Sem actividade este mês</p>
          )}
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0" style={{ backgroundColor: bg, color }}>
          PESSOAL
        </span>
      </div>
    </motion.div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function CategoriesPage() {
  const { categories, isLoading, hasFetched, fetchActive, create } = useCategoryStore();
  const { limits, define, fetchLimit } = useLimitStore();
  const userId = useUserStore((s) => s.user?.id);
  const { notPaginated, hasFetchedAll, getAllNotPaginated } = useTransactionStore();

  const [tab, setTab] = useState<"resumo" | "sistema" | "custom">("resumo");
  const [newName, setNewName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [limitTarget, setLimitTarget] = useState<Category | null>(null);

  useEffect(() => { if (!hasFetched) fetchActive(); }, [hasFetched, fetchActive]);
  useEffect(() => { if (!hasFetchedAll) getAllNotPaginated(); }, [hasFetchedAll, getAllNotPaginated]);
  useEffect(() => {
    if (!categories.length) return;
    categories.filter((c) => !c.userId).forEach((c) => fetchLimit(c.id));
  }, [categories]);

  const monthlySpendByName = useMemo(() => {
    const now = new Date();
    const result: Record<string, number> = {};
    (notPaginated ?? []).forEach((t) => {
      if (t.type !== "EXPENSE") return;
      const d = new Date(t.transactionDate);
      if (d.getMonth() !== now.getMonth() || d.getFullYear() !== now.getFullYear()) return;
      const name = t.category?.name ?? "__none__";
      result[name] = (result[name] ?? 0) + t.amount;
    });
    return result;
  }, [notPaginated]);

  const systemCategories = categories.filter((c) => !c.userId);
  const myCategories = categories.filter((c) => !!c.userId);
  const getLimitKey = (id: string) => limits[id];

  const handleCreate = async () => {
    const name = newName.trim();
    if (!name) return;
    if (categories.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
      setCreateError(`"${name}" já existe.`); return;
    }
    setIsCreating(true); setCreateError("");
    const created = await create({ name });
    setIsCreating(false);
    if (created) { setNewName(""); }
    else setCreateError("Não foi possível criar. Tente novamente.");
  };

  const handleConfirmLimit = useCallback(async (amount: number) => {
    if (!limitTarget) return;
    const ok = await define({ categoryId: limitTarget.id, monthlyLimit: amount });
    if (ok) setLimitTarget(null);
  }, [limitTarget, define]);

  const TABS = [
    { id: "resumo" as const, label: "Resumo", icon: BarChart3 },
    { id: "sistema" as const, label: "Sistema", icon: Globe },
    { id: "custom" as const, label: "Personalizadas", icon: User },
  ];

  return (
    <motion.div className="max-w-[800px] mx-auto px-4 pb-8"
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 pt-4 pb-4">
        <div className="w-10 h-10 rounded-[13px] bg-gradient-to-br from-[#003cc3] to-[#001a66] flex items-center justify-center shadow-sm flex-shrink-0">
          <Tag className="w-5 h-5 text-[#ffd400]" />
        </div>
        <div>
          <h1 className="text-base font-black text-slate-900 tracking-tight">Categorias</h1>
          <p className="text-sm text-slate-500 font-medium capitalize">
            {new Date().toLocaleDateString("pt-AO", { month: "long", year: "numeric" })}
          </p>
        </div>
      </div>

      {/* ── 3-tab switcher ──────────────────────────────────────────────── */}
      <div className="flex gap-1 p-1 bg-slate-100 rounded-2xl mb-5">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 ${
              tab === id ? "bg-white text-[#001a4d] shadow-sm" : "text-slate-400 hover:text-slate-600"
            }`}>
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* ── Tab content ─────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {tab === "resumo" && (
          <ResumoTab
            monthlySpendByName={monthlySpendByName}
            systemCategories={systemCategories}
            myCategories={myCategories}
            getLimitKey={getLimitKey}
            onSetLimit={setLimitTarget}
          />
        )}

        {tab === "sistema" && (
          <motion.div key="sistema" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }} transition={{ duration: 0.15 }} className="space-y-3">
            <div className="flex items-start gap-3 bg-[rgba(0,60,195,0.04)] border border-[#003cc3]/10 rounded-2xl px-4 py-3">
              <ShieldAlert className="w-4 h-4 text-[#003cc3] mt-0.5 flex-shrink-0" />
              <p className="text-xs text-[#003cc3] font-medium leading-relaxed">
                Categorias de sistema são somente leitura. Define um <span className="font-bold">limite mensal</span> para monitorar os gastos.
              </p>
            </div>
            {isLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-slate-400" /></div>
            ) : (
              <div className="space-y-2">
                {systemCategories.map((cat, i) => (
                  <SystemCategoryCard key={cat.id} cat={cat}
                    limit={getLimitKey(cat.id)}
                    spent={monthlySpendByName[cat.name] ?? 0}
                    onSetLimit={() => setLimitTarget(cat)}
                    index={i} />
                ))}
              </div>
            )}
          </motion.div>
        )}

        {tab === "custom" && (
          <motion.div key="custom" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.15 }} className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,60,195,0.06)] p-5">
              <div className="flex items-center gap-2 mb-3">
                <FolderPlus className="w-4 h-4 text-[#003cc3]" />
                <h2 className="text-sm font-bold text-[#1e293b]">Nova categoria</h2>
              </div>
              <div className="flex gap-2">
                <input type="text" value={newName}
                  onChange={(e) => { setNewName(e.target.value); setCreateError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                  placeholder="Ex: Viagens, Animais..." maxLength={30}
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-[#1e293b] placeholder:text-slate-400 focus:outline-none focus:border-[#003cc3]/40 focus:bg-white transition-all" />
                <button onClick={handleCreate} disabled={!newName.trim() || isCreating}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-[#ffd400] text-[#1e293b] rounded-xl text-sm font-bold hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all whitespace-nowrap">
                  {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Criar
                </button>
              </div>
              {createError && <p className="text-red-500 text-xs mt-2">{createError}</p>}
            </div>
            {isLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-slate-400" /></div>
            ) : myCategories.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-16 text-slate-400">
                <FolderPlus className="w-10 h-10 opacity-25" />
                <p className="text-sm font-medium">Ainda não tens categorias personalizadas.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {myCategories.map((cat, i) => (
                  <CustomCategoryCard key={cat.id} cat={cat}
                    spent={monthlySpendByName[cat.name] ?? 0} index={i} />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Limit dialog ────────────────────────────────────────────────── */}
      <LimitDialog open={!!limitTarget} categoryName={limitTarget?.name ?? ""}
        currentLimit={limitTarget ? getLimitKey(limitTarget.id)?.monthlyLimit : undefined}
        onClose={() => setLimitTarget(null)} onConfirm={handleConfirmLimit} />
    </motion.div>
  );
}
