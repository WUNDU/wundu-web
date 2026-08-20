"use client";
import React from "react";
import { TrendingUp, TrendingDown, CheckCircle2, AlertCircle } from "lucide-react";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
    maximumFractionDigits: 0,
  }).format(value);

export interface IncomeExpenseSummaryCardProps {
  totalIncome: number;
  totalExpense: number;
  periodLabel: string;
  className?: string;
  "data-tutorial"?: string;
}

const IncomeExpenseSummaryCard: React.FC<IncomeExpenseSummaryCardProps> = ({
  totalIncome,
  totalExpense,
  periodLabel,
  className,
  "data-tutorial": dataTutorial,
}) => {
  const totalFlow = totalIncome + totalExpense;
  const incomeRatio = totalFlow > 0 ? totalIncome / totalFlow : 0.5;
  const incomePct = Math.round(incomeRatio * 100);
  const balance = totalIncome - totalExpense;
  const isEmpty = totalIncome === 0 && totalExpense === 0;

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden ${className ?? ""}`} data-tutorial={dataTutorial}>
      <div className="px-4 sm:px-5 pt-4 sm:pt-5 pb-1">
        <h3 className="text-sm sm:text-base font-bold text-slate-800">Receitas vs Despesas</h3>
        <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">{periodLabel}</p>
      </div>

      {isEmpty ? (
        <div className="py-7 text-center text-sm text-slate-400 font-medium">
          Sem movimentos no período
        </div>
      ) : (
        <>
          <div className="flex gap-2.5 px-4 sm:px-5 pt-4">
            <div className="flex-1 flex items-center gap-2.5 rounded-2xl p-3 bg-emerald-50">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-slate-500">Receitas</p>
                <p className="text-sm font-extrabold text-emerald-700 truncate">
                  {formatCurrency(totalIncome)}
                </p>
              </div>
            </div>
            <div className="flex-1 flex items-center gap-2.5 rounded-2xl p-3 bg-red-50">
              <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                <TrendingDown className="w-4 h-4 text-red-500" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-slate-500">Despesas</p>
                <p className="text-sm font-extrabold text-red-600 truncate">
                  {formatCurrency(totalExpense)}
                </p>
              </div>
            </div>
          </div>

          <div className="px-4 sm:px-5 pt-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-emerald-600">{incomePct}% receita</span>
              <span className="text-[11px] font-bold text-red-500">{100 - incomePct}% despesa</span>
            </div>
            <div className="flex h-2 rounded-full overflow-hidden bg-slate-100">
              <div className="bg-emerald-500" style={{ width: `${incomeRatio * 100}%` }} />
              <div className="bg-red-500" style={{ width: `${(1 - incomeRatio) * 100}%` }} />
            </div>
          </div>

          <div className="flex items-center justify-between px-4 sm:px-5 py-4">
            <div className="flex items-center gap-1.5">
              {balance >= 0 ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-500" />
              )}
              <span className="text-xs font-semibold text-slate-500">Saldo do período</span>
            </div>
            <span className={`text-sm font-extrabold ${balance >= 0 ? "text-emerald-700" : "text-red-600"}`}>
              {balance >= 0 ? "+" : "-"}
              {formatCurrency(Math.abs(balance))}
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default IncomeExpenseSummaryCard;
