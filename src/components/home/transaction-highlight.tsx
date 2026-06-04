"use client";

import React from "react";
import { motion } from "framer-motion";
import { getCategoryStyle } from "@/utils/category-style";
import { formatAOA } from "@/lib/currency";

export interface TransactionHighlightProps {
  title: string;
  amount: number;
  isIncome: boolean;
  category: string;
  timestamp?: string;
  index: number;
  onClick?: () => void;
}

const TransactionHighlight: React.FC<TransactionHighlightProps> = ({
  title,
  amount,
  isIncome,
  category,
  timestamp,
  index,
  onClick,
}) => {
  const { icon: Icon, color, bg } = getCategoryStyle(category);

  const formattedAmount = formatAOA(Math.abs(amount));

  const timeLabel = timestamp
    ? new Date(timestamp).toLocaleTimeString("pt-AO", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.28,
        ease: "easeOut" as const,
        delay: Math.min(index * 0.055, 0.4),
      }}
      whileHover={{ x: 2, transition: { duration: 0.15 } }}
      className={`flex items-center gap-2 sm:gap-3 px-3 py-2 sm:px-5 sm:py-3${onClick ? " cursor-pointer hover:bg-slate-50/60 transition-colors" : ""}`}
      onClick={onClick}
    >
      <div
        className="flex-shrink-0 flex items-center justify-center w-10 h-10 sm:w-[46px] sm:h-[46px] rounded-[13px] sm:rounded-[15px]"
        style={{ backgroundColor: bg }}
      >
        <Icon className="w-[18px] h-[18px] sm:w-[22px] sm:h-[22px]" style={{ color }} />
      </div>

      <div className="flex-1 min-w-0">
        <p
          className="font-bold leading-tight truncate"
          style={{ color: "#1e293b", fontSize: 14 }}
        >
          {title}
        </p>
        <div className="flex items-center gap-1.5 mt-1">
          <span
            className="inline-block"
            style={{
              backgroundColor: bg,
              color,
              fontSize: 10,
              fontWeight: 700,
              paddingLeft: 8,
              paddingRight: 8,
              paddingTop: 2,
              paddingBottom: 2,
              borderRadius: 20,
            }}
          >
            {category}
          </span>
          {timeLabel && (
            <span style={{ color: "#94a3b8", fontSize: 10 }}>{timeLabel}</span>
          )}
        </div>
      </div>

      <div
        className="flex-shrink-0"
        style={{
          backgroundColor: isIncome
            ? "rgba(16,185,129,0.08)"
            : "rgba(239,68,68,0.08)",
          paddingLeft: 10,
          paddingRight: 10,
          paddingTop: 6,
          paddingBottom: 6,
          borderRadius: 12,
        }}
      >
        <span
          style={{
            fontWeight: 800,
            color: isIncome ? "#10B981" : "#EF4444",
          }}
          className="text-[12px] sm:text-[13px] tabular-nums"
        >
          {isIncome ? "+" : "-"} {formattedAmount}
        </span>
      </div>
    </motion.div>
  );
};

export default TransactionHighlight;
