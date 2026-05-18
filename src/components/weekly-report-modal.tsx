"use client";

import type { TransactionResponse } from "@/types/dtos/transaction.dto";
import { X, TrendingUp, TrendingDown, Sparkles, BarChart2, Calendar } from "lucide-react";
import { useMemo } from "react";

// ── Date helpers ──────────────────────────────────────────────────────────────

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatCurrency(amount: number): string {
  return `${amount.toLocaleString("pt-AO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Kz`;
}

// ── Analytics ─────────────────────────────────────────────────────────────────

interface PeriodStats {
  totalExpense: number;
  totalIncome: number;
  count: number;
  topCategories: { name: string; total: number }[];
  peakHour: number | null;
}

function computeStats(transactions: TransactionResponse[], from: Date, to: Date): PeriodStats {
  const inPeriod = transactions.filter((t) => {
    const d = new Date(t.transactionDate);
    return d >= from && d <= to;
  });

  let totalExpense = 0;
  let totalIncome = 0;
  const hourCount = new Array(24).fill(0);
  const catMap: Record<string, number> = {};

  for (const t of inPeriod) {
    if (t.type === "EXPENSE") {
      totalExpense += t.amount;
      hourCount[new Date(t.transactionDate).getHours()]++;
      const cat = t.category?.name ?? "Outros";
      catMap[cat] = (catMap[cat] ?? 0) + t.amount;
    } else {
      totalIncome += t.amount;
    }
  }

  const topCategories = Object.entries(catMap)
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 3);

  const maxH = Math.max(...hourCount);
  const peakHour = maxH > 0 ? hourCount.indexOf(maxH) : null;

  return {
    totalExpense,
    totalIncome,
    count: inPeriod.filter((t) => t.type === "EXPENSE").length,
    topCategories,
    peakHour,
  };
}

function buildInsight(stats: PeriodStats, prev: PeriodStats, period: "week" | "month"): string {
  if (stats.count === 0) return "Sem despesas registadas neste período.";

  const periodLabel = period === "week" ? "semana" : "mês";
  const diffPct =
    prev.totalExpense > 0
      ? ((stats.totalExpense - prev.totalExpense) / prev.totalExpense) * 100
      : null;

  let text = "";
  if (diffPct === null) {
    text = `Gastaste **${formatCurrency(stats.totalExpense)}** nesta ${periodLabel}.`;
  } else if (diffPct > 10) {
    text = `Gastaste **${formatCurrency(stats.totalExpense)}**, **${diffPct.toFixed(0)}% mais** do que no período anterior. Atenção!`;
  } else if (diffPct < -10) {
    text = `Excelente! **${formatCurrency(stats.totalExpense)}** — **${Math.abs(diffPct).toFixed(0)}% menos** do que antes. 🎉`;
  } else {
    text = `Gastaste **${formatCurrency(stats.totalExpense)}**, semelhante ao período anterior.`;
  }

  if (stats.topCategories[0]) {
    text += ` Maior gasto: **${stats.topCategories[0].name}**.`;
  }
  if (stats.peakHour !== null) {
    text += ` Hora de pico: **${stats.peakHour}h–${stats.peakHour + 1}h**.`;
  }
  return text;
}

function renderInsight(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return (
    <span>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-bold text-[#00216b]">
            {p}
          </strong>
        ) : (
          p
        )
      )}
    </span>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

interface WeeklyReportModalProps {
  period: "week" | "month";
  transactions: TransactionResponse[];
  onClose: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  Alimentação: "#F97316",
  Transporte: "#3B82F6",
  Lazer: "#A855F7",
  Saúde: "#EF4444",
  Educação: "#06B6D4",
  Casa: "#F59E0B",
  Vestuário: "#EC4899",
  Tecnologia: "#6366F1",
  Outros: "#94A3B8",
};

function getCatColor(name: string) {
  return CATEGORY_COLORS[name] ?? CATEGORY_COLORS["Outros"];
}

export function WeeklyReportModal({ period, transactions, onClose }: WeeklyReportModalProps) {
  const today = new Date();

  const { from, to, prevFrom, prevTo, label } = useMemo(() => {
    if (period === "week") {
      const ws = startOfWeek(today);
      const we = addDays(ws, 6);
      const pws = addDays(ws, -7);
      const pwe = addDays(ws, -1);
      const fmt = (d: Date) => d.toLocaleDateString("pt-AO", { day: "2-digit", month: "short" });
      return { from: ws, to: we, prevFrom: pws, prevTo: pwe, label: `${fmt(ws)} – ${fmt(we)}` };
    } else {
      const ms = startOfMonth(today);
      const me = endOfMonth(today);
      const pms = startOfMonth(new Date(today.getFullYear(), today.getMonth() - 1, 1));
      const pme = endOfMonth(pms);
      const fmt = (d: Date) => d.toLocaleDateString("pt-AO", { month: "long", year: "numeric" });
      return { from: ms, to: me, prevFrom: pms, prevTo: pme, label: fmt(today) };
    }
  }, [period]);

  const stats = useMemo(() => computeStats(transactions, from, to), [transactions, from, to]);
  const prev = useMemo(() => computeStats(transactions, prevFrom, prevTo), [transactions, prevFrom, prevTo]);
  const insight = useMemo(() => buildInsight(stats, prev, period), [stats, prev, period]);

  const balance = stats.totalIncome - stats.totalExpense;
  const isPositive = balance >= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div
          className="rounded-t-2xl p-6 text-white relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #00216b, #003cc3)" }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.15)" }}
          >
            <X size={16} />
          </button>
          <div className="flex items-center gap-2 mb-1">
            {period === "week" ? <BarChart2 size={16} className="opacity-75" /> : <Calendar size={16} className="opacity-75" />}
            <span className="text-xs font-semibold opacity-75">
              {period === "week" ? "Resumo Semanal" : "Resumo Mensal"}
            </span>
          </div>
          <p className="text-sm opacity-60 mb-1">{label}</p>
          <p className="text-3xl font-black">{formatCurrency(stats.totalExpense)}</p>
          <p className="text-xs opacity-60 mt-1">total gasto</p>

          {/* Diff badge */}
          {prev.totalExpense > 0 && (() => {
            const d = ((stats.totalExpense - prev.totalExpense) / prev.totalExpense) * 100;
            const up = d >= 0;
            return (
              <div
                className="inline-flex items-center gap-1 mt-3 px-2 py-1 rounded-full text-xs font-bold"
                style={{ background: up ? "rgba(239,68,68,0.2)" : "rgba(34,197,94,0.2)", color: up ? "#FCA5A5" : "#86EFAC" }}
              >
                {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {up ? "+" : ""}{d.toFixed(1)}% vs período anterior
              </div>
            );
          })()}
        </div>

        <div className="p-5 space-y-5">
          {/* Insight */}
          <div className="bg-blue-50 rounded-xl p-4 border-l-4 border-[#003cc3]">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} className="text-[#003cc3]" />
              <span className="text-xs font-bold text-[#00216b]">Análise do período</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{renderInsight(insight)}</p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 rounded-xl p-3 text-center">
              <p className="text-xs text-slate-400 font-semibold">Receitas</p>
              <p className="text-sm font-black text-emerald-500 mt-1">+{formatCurrency(stats.totalIncome)}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 text-center">
              <p className="text-xs text-slate-400 font-semibold">Saldo</p>
              <p className={`text-sm font-black mt-1 ${isPositive ? "text-emerald-500" : "text-red-500"}`}>
                {isPositive ? "+" : ""}{formatCurrency(balance)}
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 text-center">
              <p className="text-xs text-slate-400 font-semibold">Transacções</p>
              <p className="text-sm font-black text-[#003cc3] mt-1">{stats.count}</p>
            </div>
          </div>

          {/* Top categories */}
          {stats.topCategories.length > 0 && (
            <div>
              <p className="text-xs font-bold text-[#00216b] mb-3">Por categoria</p>
              <div className="space-y-3">
                {stats.topCategories.map((cat, i) => (
                  <div key={cat.name}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-semibold text-slate-700">{cat.name}</span>
                      <span className="text-xs font-bold" style={{ color: getCatColor(cat.name) }}>
                        {formatCurrency(cat.total)}
                      </span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-1.5 rounded-full transition-all duration-700"
                        style={{
                          width: `${((cat.total / stats.topCategories[0].total) * 100).toFixed(0)}%`,
                          backgroundColor: getCatColor(cat.name),
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Peak hour */}
          {stats.peakHour !== null && (
            <div className="flex items-center gap-3 bg-purple-50 rounded-xl p-4">
              <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-lg">🕐</span>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold">Hora de pico</p>
                <p className="text-sm font-black text-purple-700">
                  {stats.peakHour}:00 – {stats.peakHour + 1}:00
                </p>
              </div>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl font-bold text-white text-sm"
            style={{ background: "linear-gradient(135deg, #00216b, #003cc3)" }}
          >
            Fechar relatório
          </button>
        </div>
      </div>
    </div>
  );
}
