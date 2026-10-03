import ChevronRight from "@/icons/chevron-right";
import Link from "next/link";
import React from "react";
import GoalsItem from "./GoalsItem";
import type { GoalDTO } from "../../types/dto/goal.dto";

interface GoalsSectionProps {
  goals: GoalDTO[];
  isLoading: boolean;
  error: string | null;
}

function GoalsSection({ goals, isLoading, error }: GoalsSectionProps) {
  return (
    <section className="flex p-6 flex-col items-center gap-4 flex-1 h-[640px] rounded-[20px] border border-(--card-barras) bg-(--card) shadow-2xs">
      <header className="flex justify-between items-center self-stretch">
        <h1 className="text-[18px] not-italic font-semibold leading-[155.99%] tracking-[-0.54px] text-(--text-padro)">
          Metas Financeiras
        </h1>
        <Link
          href="/home/goals"
          className="group flex shrink-0 items-center gap-1 whitespace-nowrap text-(--text-description) transition-colors duration-200 hover:text-primary-300"
        >
          <span className="text-[18px] text-right not-italic font-semibold leading-[155.99%] tracking-[-0.54px]">
            Ver todas
          </span>
          <ChevronRight
            stroke="4"
            className="w-5 transition-transform duration-200 ease-out group-hover:translate-x-1"
          />
        </Link>
      </header>
      <div
        className="flex min-h-0 flex-1 flex-col items-start gap-4 self-stretch overflow-y-auto overscroll-contain"
        aria-busy={isLoading}
      >
        {isLoading ? (
          <div
            role="status"
            aria-label="A carregar metas"
            className="flex w-full flex-col gap-4"
          >
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex w-full animate-pulse items-center gap-4 p-2"
              >
                <div className="size-15 shrink-0 rounded-2xl bg-(--bg-filter)" />
                <div className="flex min-w-0 flex-1 flex-col gap-3">
                  <div className="h-4 w-2/3 rounded bg-(--bg-filter)" />
                  <div className="h-3 w-full rounded-full bg-(--bg-filter)" />
                  <div className="h-3 w-1/2 rounded bg-(--bg-filter)" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <p role="alert" className="font-manrope text-sm text-danger-300">
            {error}
          </p>
        ) : goals.length > 0 ? (
          goals.slice(0, 4).map((goal) => <GoalsItem key={goal.id} goal={goal} />)
        ) : (
          <p className="py-6 font-manrope text-sm text-(--text-description)">
            Ainda não existem metas ativas.
          </p>
        )}
      </div>
    </section>
  );
}

export default GoalsSection;
