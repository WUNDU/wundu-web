"use client";

import { CalendarDays } from "lucide-react";
import Link from "next/link";
import type { TransactionDTO as ApiTransaction } from "@/types/dtos/transaction.dto";
import { formatAOA } from "app/utils/format-AOA";

type WeeklyCardProps = {
  transactions: ApiTransaction[];
  currentWeekStart: string;
  previousWeekStart: string;
  today: string;
  loading?: boolean;
  error?: string | null;
};

function WeeklyCard({
  transactions,
  currentWeekStart,
  previousWeekStart,
  today,
  loading = false,
  error,
}: WeeklyCardProps) {
  let currentWeekSpent = 0;
  let previousWeekSpent = 0;

  for (const transaction of transactions) {
    if (transaction.type !== "EXPENSE" || !Number.isFinite(transaction.amount)) {
      continue;
    }

    const date = (
      transaction.transactionDate ?? transaction.createdAt
    )?.slice(0, 10);
    if (!date) continue;

    if (date >= currentWeekStart && date <= today) {
      currentWeekSpent += Math.abs(transaction.amount);
    } else if (date >= previousWeekStart && date < currentWeekStart) {
      previousWeekSpent += Math.abs(transaction.amount);
    }
  }

  return (
    <section className="flex h-auto flex-col gap-3 self-stretch rounded-xl border border-(--card-barras) bg-(--bg-card) p-4 xl:gap-4 xl:p-6">
      <header className="flex items-center justify-between gap-3 self-stretch">
        <div>
          <h2 className="flex items-center gap-2 font-manrope text-base font-semibold leading-6 tracking-tight text-(--text-title) xl:text-lg">
            <CalendarDays className="size-5 shrink-0" aria-hidden="true" />
            Resumo semanal
          </h2>
          <p className="font-manrope text-xs font-normal leading-5 text-(--text-description)">
            Gastos registados no período.
          </p>
        </div>
        <Link
          href="/home/transactions"
          className="group flex shrink-0 items-center gap-1 whitespace-nowrap text-(--text-description) transition-colors hover:text-primary-300"
        >
          <span className="font-manrope text-sm font-semibold leading-5 tracking-tight">
            Ver transações
          </span>
        </Link>
      </header>

      {error ? (
        <p role="alert" className="font-manrope text-sm text-danger-300">
          {error}
        </p>
      ) : loading ? (
        <div
          role="status"
          aria-label="A carregar resumo semanal"
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          {[0, 1].map((item) => (
            <div
              key={item}
              aria-hidden="true"
              className="h-20 animate-pulse rounded-xl bg-(--bg-filter)"
            />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-(--background-variant) p-4">
              <span className="font-manrope text-sm text-(--text-description)">
                Esta semana, até hoje
              </span>
              <strong className="mt-2 block font-manrope text-xl font-bold text-(--text-title)">
                {formatAOA(currentWeekSpent)}
              </strong>
            </div>
            <div className="rounded-xl bg-(--background-variant) p-4">
              <span className="font-manrope text-sm text-(--text-description)">
                Semana anterior completa
              </span>
              <strong className="mt-2 block font-manrope text-xl font-bold text-(--text-title)">
                {formatAOA(previousWeekSpent)}
              </strong>
            </div>
          </div>
          <p className="font-manrope text-xs leading-5 text-(--text-description)">
            As semanas têm durações diferentes. Compara os valores tendo em
            conta os dias incluídos.
          </p>
        </>
      )}
    </section>
  );
}

export default WeeklyCard;
