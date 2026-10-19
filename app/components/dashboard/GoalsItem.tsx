"use client";

import { GoalsIcon } from "@/constants/icons";
import React from "react";
import type { GoalDTO } from "../../types/dto/goal.dto";
import { formatAOA } from "app/utils/format-AOA";
import { goalPercent, statusFor } from "../goal/goal-status";
import { useValuesVisibility } from "./values-visibility";

interface GoalsItemProps {
  goal: GoalDTO;
}

function GoalsItem({ goal }: GoalsItemProps) {
  const { mask } = useValuesVisibility();
  const percent = goalPercent(goal);
  const status = statusFor(percent);
  const isComplete = percent >= 100;

  return (
    <article className="flex p-1.5 flex-col justify-start items-stretch gap-3 self-stretch">
      <div className="flex justify-center items-center gap-4 self-stretch">
        <span
          className={`flex size-11 flex-col justify-center items-center aspect-square rounded-xl ${status.tint}`}
        >
          <GoalsIcon className={status.color} />
        </span>
        <div className="flex flex-col items-start gap-1 flex-1 min-w-0">
          <div className="flex justify-between items-center gap-2 self-stretch">
            <p className="min-w-0 flex-1 truncate font-manrope text-sm font-bold leading-6 text-(--text-title)">
              {goal.title}
            </p>
            <span
              className={`flex shrink-0 px-2 py-1 justify-center items-center gap-2 rounded-md ${status.tint}`}
            >
              <p
                className={`font-inter leading-6 font-bold text-sm ${status.color}`}
              >
                {percent}%
              </p>
            </span>
          </div>
          <div className="flex justify-between items-center self-stretch">
            <p className="font-inter text-sm font-medium leading-6 text-(--text-description)">
              {mask(formatAOA(goal.currentAmount))}
            </p>
            <p
              className={`font-inter text-sm leading-6 ${isComplete ? `${status.color} font-bold` : "text-(--text-description) font-medium"} text-right`}
            >
              {isComplete
                ? "Concluído"
                : `Falta ${mask(formatAOA(goal.targetAmount - goal.currentAmount))}`}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

export default GoalsItem;
