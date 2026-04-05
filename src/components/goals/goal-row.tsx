"use client";

import { motion } from "framer-motion";
import { buildGoalCardData } from "@/store/goal-store";
import { ObjectiveIcon } from "@/constants/icons";
import { Ring } from "@/components/goals/ring";

const EASE_OUT = [0.22, 1, 0.36, 1] as [number, number, number, number];

export interface GoalRowProps {
  data: ReturnType<typeof buildGoalCardData>;
  index: number;
  onEdit?: () => void;
}

export function GoalRow({ data, index, onEdit }: GoalRowProps) {
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
