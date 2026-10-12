"use client";

import { useMemo } from "react";
import type { TransactionDTO as ApiTransaction } from "@/types/dtos/transaction.dto";
import { formatAOA } from "app/utils/format-AOA";

type FlowCardProps = {
  transactions: ApiTransaction[];
  year: number;
  month: number;
  loading?: boolean;
};

type Bucket = { label: string; income: number; expense: number };

/** 4 janelas do mês (01–07, 08–14, 15–21, 22–fim) como no protótipo. */
function bucketize(transactions: ApiTransaction[], year: number, month: number): Bucket[] {
  const days = new Date(year, month + 1, 0).getDate();
  const buckets: Bucket[] = [
    { label: "01–07", income: 0, expense: 0 },
    { label: "08–14", income: 0, expense: 0 },
    { label: "15–21", income: 0, expense: 0 },
    { label: `22–${String(days).padStart(2, "0")}`, income: 0, expense: 0 },
  ];
  for (const tx of transactions) {
    const raw = tx.transactionDate ?? tx.createdAt;
    const date = raw?.slice(0, 10);
    const day = Number(date?.slice(8, 10));
    if (
      !date?.startsWith(`${year}-${String(month + 1).padStart(2, "0")}-`) ||
      !Number.isInteger(day) ||
      day < 1 ||
      day > days
    ) {
      continue;
    }
    if (!Number.isFinite(tx.amount)) continue;
    const index = day <= 7 ? 0 : day <= 14 ? 1 : day <= 21 ? 2 : 3;
    if (tx.type === "INCOME") buckets[index].income += Math.abs(tx.amount);
    else buckets[index].expense += Math.abs(tx.amount);
  }
  return buckets;
}

function FlowCard({ transactions, year, month, loading = false }: FlowCardProps) {
  const buckets = useMemo(
    () => bucketize(transactions, year, month),
    [transactions, year, month],
  );
  const peak = Math.max(
    1,
    ...buckets.flatMap((b) => [b.income, b.expense]),
  );
  const hasData = buckets.some((b) => b.income > 0 || b.expense > 0);

  return (
    <section className="flex h-auto flex-col gap-3 self-stretch rounded-xl border border-(--card-barras) bg-(--bg-card) p-4 xl:gap-4 xl:p-6">
      <header className="flex items-center justify-between gap-3 self-stretch">
        <div className="min-w-0">
          <h1 className="font-manrope text-base font-semibold leading-6 tracking-tight text-(--text-title) xl:text-lg">
            Entradas e gastos
          </h1>
          <p className="font-manrope text-xs font-normal leading-5 text-(--text-description)">
            Movimentos ao longo do mês.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span aria-hidden="true" className="size-2 rounded-full bg-success" />
            <span className="font-manrope text-xs font-semibold text-(--text-description)">
              Entradas
            </span>
          </span>
          <span className="flex items-center gap-1.5">
            <span aria-hidden="true" className="size-2 rounded-full bg-danger-300" />
            <span className="font-manrope text-xs font-semibold text-(--text-description)">
              Gastos
            </span>
          </span>
        </div>
      </header>
      {loading ? (
        <div aria-label="A carregar fluxo financeiro">
          <div aria-hidden="true" className="h-48 animate-pulse rounded-xl bg-(--bg-filter)" />
          <span className="sr-only">A carregar fluxo financeiro…</span>
        </div>
      ) : !hasData ? (
        <p className="py-6 text-center font-manrope text-sm text-(--text-description)">
          Sem movimentos neste mês.
        </p>
      ) : (
        <div
          className="flex items-stretch gap-2 self-stretch"
          role="img"
          aria-label={buckets
            .map(
              (b) =>
                `${b.label}: entradas ${formatAOA(b.income)}, gastos ${formatAOA(b.expense)}`,
            )
            .join(". ")}
        >
          {buckets.map((bucket) => (
            <div key={bucket.label} className="flex min-w-0 flex-1 flex-col items-center gap-2">
              <div className="flex h-[170px] w-full items-end justify-center gap-1 sm:h-48 sm:gap-2">
                <span
                  title={`Entradas: ${formatAOA(bucket.income)}`}
                  style={{ height: `${(bucket.income / peak) * 100}%` }}
                  className="w-[22px] rounded-t-sm bg-success sm:w-7"
                />
                <span
                  title={`Gastos: ${formatAOA(bucket.expense)}`}
                  style={{ height: `${(bucket.expense / peak) * 100}%` }}
                  className="w-[22px] rounded-t-sm bg-danger-300 sm:w-7"
                />
              </div>
              <small className="font-manrope text-xs font-medium text-(--text-description)">
                {bucket.label}
              </small>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default FlowCard;
