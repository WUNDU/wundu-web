"use client";

import { motion } from "framer-motion";
import { getCategoryStyle } from "@/utils/category-style";
import { formatAOA } from "@/lib/currency";
import type { TransactionDTO } from "@/types/dtos/transaction.dto";

const EASE_OUT = [0.22, 1, 0.36, 1] as [number, number, number, number];

export function TransactionItem({ tx, index, onClick }: { tx: TransactionDTO; index: number; onClick: () => void }) {
  const isExpense = tx.type === "expense";
  const amountColor = isExpense ? "#EF4444" : "#10B981";
  const amountBg   = isExpense ? "rgba(239,68,68,0.08)" : "rgba(16,185,129,0.08)";
  const categoryName = tx.category?.name || "Outro";
  const { icon: Icon, color, bg } = getCategoryStyle(categoryName);
  const time = tx.transactionDate
    ? new Date(tx.transactionDate).toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" })
    : null;
  const primary   = tx.description?.trim() || categoryName;
  const secondary = tx.description?.trim() ? categoryName : null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.18, ease: EASE_OUT, delay: Math.min(index * 0.03, 0.25) }}
      className="flex items-center gap-3 px-5 py-3 cursor-pointer hover:bg-slate-50/60 transition-colors"
      onClick={onClick}
    >
      <div className="flex-shrink-0 w-[46px] h-[46px] rounded-[15px] flex items-center justify-center" style={{ backgroundColor: bg }}>
        <Icon className="w-[22px] h-[22px]" style={{ color }} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-[#1e293b] truncate leading-snug">{primary}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          {secondary && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: bg, color }}>
              {secondary}
            </span>
          )}
          {time && <span className="text-[10px] text-[#94a3b8]">{time}</span>}
        </div>
      </div>

      <div className="flex-shrink-0 px-2.5 py-1.5 rounded-full" style={{ backgroundColor: amountBg }}>
        <span className="text-[13px] font-extrabold" style={{ color: amountColor }}>
          {isExpense ? "-" : "+"}{formatAOA(Math.abs(tx.amount))}
        </span>
      </div>
    </motion.div>
  );
}
