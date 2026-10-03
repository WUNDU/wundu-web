import { GoalsIcon } from "@/constants/icons";
import React from "react";
import type { GoalDTO } from "../../types/dto/goal.dto";
import { transactionCategoryConfig } from "../config/transaction-category-config";
import { formatAOA } from "app/utils/format-AOA";
interface GoalsItemProps {
  goal: GoalDTO;
}

function GoalsItem({ goal }: GoalsItemProps) {
  const percent =
    goal.targetAmount > 0
      ? Math.min(
          100,
          Math.round((goal.currentAmount / goal.targetAmount) * 100),
        )
      : 0;
  const isComplete = percent >= 100;
  const categoryConfig = transactionCategoryConfig[goal.category];

  return (
    <article className="flex p-1.5 flex-col justify-start items-stretch gap-3 self-stretch">
      <div className="flex justify-center items-center gap-4 self-stretch">
        <span
          className={`flex w-15 h-15 flex-col justify-center items-center aspect-square rounded-2xl ${categoryConfig.background}`}
        >
          <GoalsIcon
            className={categoryConfig.iconColor ?? categoryConfig.color}
          />
        </span>
        <div className="flex flex-col items-start gap-1 flex-1 min-w-0">
          <div className="flex justify-between items-center gap-2 self-stretch">
            <p className="min-w-0 flex-1 truncate text-[16px] not-italic font-bold leading-normal text-(--text-title)">
              {goal.title}
            </p>
            <span
              className={`flex shrink-0 px-3 py-1 justify-center items-center gap-2.5 rounded-2xl ${categoryConfig.background}`}
            >
              <p
                className={`font-inter leading-normal font-bold tracking-[-0.48px] text-[-16px] ${categoryConfig.color}`}
              >
                {percent}%
              </p>
            </span>
          </div>
          <div className="flex justify-between items-center self-stretch">
            <p className="text-[16px] not-italic font-inter font-medium leading-normal text-(--text-description) tracking-[-0.48px]">
              {formatAOA(goal.currentAmount)}
            </p>
            <p
              className={`font-inter tracking-[-0.48px] text-[-16px] leading-normal ${isComplete ? `${categoryConfig.color} font-bold` : "text-(--text-description) font-medium"} text-right`}
            >
              {isComplete
                ? "Concluído"
                : `Falta ${formatAOA(goal.targetAmount - goal.currentAmount)}`}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

export default GoalsItem;
