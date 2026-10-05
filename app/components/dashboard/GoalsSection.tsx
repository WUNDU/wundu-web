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
    <section className="flex h-auto flex-col items-center gap-3 self-stretch rounded-[20px] border border-(--card-barras) bg-(--card) p-4 shadow-2xs sm:p-5 xl:h-[640px] xl:gap-4 xl:p-6">
      <header className="flex justify-between items-center self-stretch">
        <h1 className="text-base not-italic font-semibold leading-[155.99%] tracking-[-0.54px] text-(--text-padro) xl:text-[18px]">
          Metas Financeiras
        </h1>
        <Link
          href="/home/goals"
          className="group flex shrink-0 items-center gap-1 whitespace-nowrap text-(--text-description) transition-colors duration-200 hover:text-primary-300"
        >
          <span className="text-right text-sm not-italic font-semibold leading-[155.99%] tracking-[-0.54px] xl:text-[18px]">
            Ver todas
          </span>
          <ChevronRight
            stroke="4"
            className="w-4 transition-transform duration-200 ease-out group-hover:translate-x-1 xl:w-5"
          />
        </Link>
      </header>
      <div
        className="flex min-h-0 flex-1 flex-col items-start gap-3 self-stretch overflow-visible overscroll-contain xl:gap-4 xl:overflow-y-auto"
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
