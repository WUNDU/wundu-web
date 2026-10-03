import { GoalsIcon } from "@/constants/icons";
import React from "react";
import type { GoalDTO } from "../../types/dto/goal.dto";
import { formatAOA } from "../../utils/format-AOA";
import { goalPercent, statusFor } from "./goal-status";

interface GoalItemProps {
  goal: GoalDTO;
  /** Abre o formulário para editar esta meta. */
  onSelect?: () => void;
}

function GoalItem({ goal, onSelect }: GoalItemProps) {
  const percent = goalPercent(goal);
  const status = statusFor(percent);
  const prazo = goal.type === "LONG_TERM" ? "Longo prazo" : "Curto Prazo";

  return (
    <article
      onClick={onSelect}
      onKeyDown={(event) => {
        if (!onSelect) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect();
        }
      }}
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
      className={`flex justify-center items-center gap-3 self-stretch ${
        onSelect ? "cursor-pointer" : ""
      }`}
    >
      <div className="flex flex-1 self-stretch p-6 flex-col justify-center items-center gap-3 overflow-hidden rounded-[32px] border border-(--border-button) bg-(--bg-card) transition-all duration-200 hover:border-(--border-hover) hover:shadow-[0px_2px_14px_rgba(0,0,0,0.05)]">
        <div className="flex justify-start items-start gap-4 self-stretch">
          <span
            className={`flex size-16 shrink-0 justify-center items-center rounded-2xl ${status.tint}`}
          >
            <GoalsIcon className={status.color} />
          </span>
          <div className="flex flex-1 min-w-0 flex-col justify-start items-start gap-1">
            <div className="flex flex-col justify-start items-start gap-2 self-stretch">
              <div className="flex justify-between items-center gap-3 self-stretch">
                <h2 className="flex-1 min-w-0 truncate text-base font-bold font-manrope leading-normal text-(--text-title)">
                  {goal.title}
                </h2>
                <span
                  className={`flex shrink-0 px-3 py-1 justify-center items-center rounded-2xl ${status.tint}`}
                >
                  <p
                    className={`text-base font-bold font-inter leading-normal ${status.color}`}
                  >
                    {percent}%
                  </p>
                </span>
              </div>
              <div className="flex flex-col justify-start items-start gap-2 self-stretch">
                <div className="flex justify-between items-center gap-3 self-stretch">
                  <div className="flex min-w-0 justify-start items-center gap-3">
                    <div className="flex justify-start items-center gap-2">
                      <p className="text-base font-bold font-inter leading-normal text-(--text-description)">
                        {formatAOA(goal.currentAmount)}
                      </p>
                      <p className="text-right text-base font-medium font-inter leading-normal text-(--text-description)">
                        de
                      </p>
                      <p className="text-right text-base font-medium font-inter leading-normal text-(--text-description)">
                        {formatAOA(goal.targetAmount)}
                      </p>
                    </div>
                    <span className="flex shrink-0 px-2.5 py-1 justify-center items-center rounded-lg bg-neutrals-300/10">
                      <p className="text-sm font-bold font-manrope leading-5 text-(--text-description)">
                        {prazo}
                      </p>
                    </span>
                  </div>
                  <p
                    className={`text-right text-base font-bold font-inter leading-normal ${status.color}`}
                  >
                    {status.label}
                  </p>
                </div>
                <div className="flex flex-col justify-start items-start px-1 self-stretch">
                  <div
                    role="progressbar"
                    aria-valuenow={percent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Progresso de ${goal.title}`}
                    className={`self-stretch h-2.5 rounded-3xl overflow-hidden ${status.tint}`}
                  >
                    <div
                      className={`h-full rounded-3xl ${status.bar}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default GoalItem;
