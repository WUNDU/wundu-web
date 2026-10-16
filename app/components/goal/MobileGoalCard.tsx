"use client";

import { GoalsIcon } from "@/constants/icons";
import type { GoalDTO } from "app/types/dto/goal.dto";
import { formatGoalAmount } from "app/utils/format-goal-amount";
import { goalPercent, statusFor } from "./goal-status";

export default function MobileGoalCard({
  goal,
  onSelect,
}: {
  goal: GoalDTO;
  onSelect?: () => void;
}) {
  const percent = goalPercent(goal);
  const status = statusFor(percent);

  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex w-full flex-col items-start gap-3 rounded-xl border border-(--card-barras) bg-(--bg-card) p-4 text-left"
    >
      <span className="flex items-center gap-3 self-stretch overflow-hidden">
        <span
          className={`flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl ${status.tint}`}
        >
          <GoalsIcon className={`size-5 ${status.color}`} aria-hidden="true" />
        </span>
        <span className="flex min-w-0 flex-1 flex-col items-start gap-1 overflow-hidden">
          <span className="line-clamp-1 self-stretch font-manrope text-sm font-bold text-(--text-title)">
            {goal.title}
          </span>
          <span className="font-manrope text-xs font-medium text-(--text-description)">
            {formatGoalAmount(goal.currentAmount)} de{" "}
            {formatGoalAmount(goal.targetAmount)} Kz
          </span>
        </span>
        <span
          className={`shrink-0 px-2 py-1 font-manrope text-sm font-bold rounded-md ${status.tint} ${status.color}`}
        >
          {percent}%
        </span>
      </span>
      <span
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progresso de ${goal.title}`}
        className="relative h-1.5 self-stretch overflow-hidden rounded-full bg-(--background-variant)"
      >
        <span
          aria-hidden="true"
          className={`absolute left-0 top-0 h-1.5 rounded-full ${status.bar}`}
          style={{ width: `${percent}%` }}
        />
      </span>
      <span className="flex items-center justify-between self-stretch overflow-hidden">
        <span className="rounded-md bg-neutrals-300/10 px-2 py-1 font-manrope text-sm font-bold leading-5 text-(--text-description)">
          {goal.type === "LONG_TERM" ? "Longo prazo" : "Curto Prazo"}
        </span>
        <span className={`font-inter text-base font-bold ${status.color}`}>
          {status.label}
        </span>
      </span>
    </button>
  );
}
