"use client";

import { motion } from "framer-motion";
import { buildGoalCardData } from "@/store/goal-store";
import { ObjectiveIcon } from "@/constants/icons";

const EASE_OUT = [0.22, 1, 0.36, 1] as [number, number, number, number];

// Same accent palette as mobile GoalItem
const ACCENT_PALETTE = [
  { color: "#F97316", grad: ["#F97316", "#FB923C"] as [string, string], bg: "rgba(249,115,22,0.10)" },
  { color: "#8B5CF6", grad: ["#8B5CF6", "#A78BFA"] as [string, string], bg: "rgba(139,92,246,0.10)" },
  { color: "#10B981", grad: ["#10B981", "#34D399"] as [string, string], bg: "rgba(16,185,129,0.10)" },
  { color: "#3B82F6", grad: ["#3B82F6", "#60A5FA"] as [string, string], bg: "rgba(59,130,246,0.10)" },
  { color: "#EC4899", grad: ["#EC4899", "#F472B6"] as [string, string], bg: "rgba(236,72,153,0.10)" },
];
const DONE_ACCENT = { color: "#10B981", grad: ["#10B981", "#34D399"] as [string, string], bg: "rgba(16,185,129,0.10)" };

function getAccent(title: string) {
  const sum = title.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return ACCENT_PALETTE[sum % ACCENT_PALETTE.length];
}

export interface GoalRowProps {
  data: ReturnType<typeof buildGoalCardData>;
  index: number;
  onEdit?: () => void;
}

export function GoalRow({ data, index, onEdit }: GoalRowProps) {
  const done = data.isCompleted;
  const accent = done ? DONE_ACCENT : getAccent(data.title);
  const pct = Math.min(100, data.percentage);

  const typeLabel = data.goal.type === "SHORT_TERM" ? "Curto prazo" : "Longo prazo";

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.22, ease: EASE_OUT, delay: Math.min(index * 0.05, 0.3) }}
      className="relative bg-white rounded-[20px] p-[18px] cursor-pointer overflow-hidden w-full text-left"
      style={{
        boxShadow: `0 4px 16px ${accent.color}1f`,
      }}
      onClick={onEdit}
      aria-label={`Editar objectivo: ${data.title}`}
    >
      {/* Completed glow pulse */}
      {done && (
        <motion.div
          animate={{ opacity: [0.0, 0.06, 0.0] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-[20px] pointer-events-none"
          style={{ backgroundColor: accent.color }}
        />
      )}

      <div className="flex items-center gap-3.5 relative z-10">
        {/* Icon */}
        <div
          className="w-[52px] h-[52px] flex-shrink-0 rounded-[16px] flex items-center justify-center"
          style={{ backgroundColor: accent.bg }}
        >
          <ObjectiveIcon className="w-[26px] h-[26px]" style={{ color: accent.color }} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
          {/* Title row */}
          <div className="flex items-center justify-between gap-2">
            <p className="text-[15px] font-bold text-slate-900 truncate flex-1 min-w-0">{data.title}</p>
            <div
              className="flex-shrink-0 px-2.5 py-[3px] rounded-full"
              style={{ backgroundColor: accent.bg }}
            >
              <span className="text-[12px] font-black" style={{ color: accent.color }}>{pct}%</span>
            </div>
          </div>

          {/* Saved / target */}
          <p className="text-[11px] font-medium text-slate-500 truncate">
            <span className="font-bold text-slate-600">{data.valorPoupado}</span>
            {" "}de{" "}
            {data.valorAlvo} Kz
            <span
              className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
              style={{ backgroundColor: "rgba(0,0,0,0.04)", color: "#94a3b8" }}
            >
              {typeLabel}
            </span>
          </p>

          {/* Animated progress bar */}
          <div className="w-full h-[7px] rounded-full overflow-hidden" style={{ backgroundColor: "#F1F5F9" }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, ease: EASE_OUT, delay: Math.min(index * 0.05, 0.3) + 0.18 }}
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${accent.grad[0]}, ${accent.grad[1]})` }}
            />
          </div>
        </div>
      </div>
    </motion.button>
  );
}
