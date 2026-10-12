"use client";

import { useMemo } from "react";
import type { TransactionDTO as ApiTransaction } from "@/types/dtos/transaction.dto";
import type { TransactionCategory } from "app/types/transaction";
import { getCategory } from "app/utils/transaction-map";
import { CATEGORY_CHART_COLORS } from "app/utils/analysis-data";
import { formatAOA, formatAOACompact } from "app/utils/format-AOA";

type CategoryCardProps = {
  transactions: ApiTransaction[];
  loading?: boolean;
};

function CategoryCard({ transactions, loading = false }: CategoryCardProps) {
  const categories = useMemo(() => {
    const totals = new Map<TransactionCategory, number>();
    for (const tx of transactions) {
      if (
        tx.type !== "EXPENSE" ||
        !Number.isFinite(tx.amount) ||
        tx.amount === 0
      ) {
        continue;
      }
      const key = getCategory(tx.category?.name);
      totals.set(key, (totals.get(key) ?? 0) + Math.abs(tx.amount));
    }
    return [...totals.entries()]
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions]);
  const spent = categories.reduce((sum, c) => sum + c.amount, 0);

  const donut = useMemo(() => {
    let offset = 0;
    return categories
      .map((c) => {
        const start = offset;
        offset += (c.amount / spent) * 100;
        return `var(${CATEGORY_CHART_COLORS[c.name]}) ${start}% ${offset}%`;
      })
      .join(",");
  }, [categories, spent]);

  return (
    <section className="flex h-auto flex-col gap-3 self-stretch rounded-xl border border-(--card-barras) bg-(--bg-card) p-4 xl:gap-4 xl:p-6">
      <header className="self-stretch">
        <h1 className="font-manrope text-base font-semibold leading-6 tracking-tight text-(--text-title) xl:text-lg">
          Gastos por categoria
        </h1>
        <p className="font-manrope text-xs font-normal leading-5 text-(--text-description)">
          Onde o teu dinheiro foi gasto.
        </p>
      </header>
      {loading ? (
        <div aria-label="A carregar gastos por categoria">
          <div aria-hidden="true" className="h-48 animate-pulse rounded-xl bg-(--bg-filter)" />
          <span className="sr-only">A carregar gastos por categoria…</span>
        </div>
      ) : categories.length === 0 ? (
        <p className="py-6 text-center font-manrope text-sm text-(--text-description)">
          Regista despesas para veres a distribuição por categoria.
        </p>
      ) : (
        <div className="flex flex-col items-center justify-center gap-6 self-stretch min-[1251px]:flex-row">
          <div
            className="relative hidden size-42 shrink-0 rounded-full md:block"
            role="img"
            aria-label={`Distribuição dos gastos por categoria, total ${formatAOA(spent)}`}
            style={{ background: `conic-gradient(${donut})` }}
          >
            <div className="absolute inset-0 m-auto flex size-32 flex-col items-center justify-center gap-1 rounded-full bg-(--bg-card)">
              <small className="font-manrope text-xs font-normal text-(--text-description)">
                Total de gastos
              </small>
              <strong
                title={formatAOA(spent)}
                className="font-manrope text-sm font-bold text-(--text-title)"
              >
                {formatAOACompact(spent)}
              </strong>
            </div>
          </div>
          <ul className="flex w-full min-w-0 flex-1 flex-col gap-3">
            {categories.map((category) => (
              <li key={category.name} className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex min-w-0 items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="size-3 shrink-0 rounded-full"
                      style={{
                        backgroundColor: `var(${CATEGORY_CHART_COLORS[category.name]})`,
                      }}
                    />
                    <span className="truncate font-manrope text-sm font-semibold text-(--text-title)">
                      {category.name}
                    </span>
                  </span>
                  <span className="shrink-0 font-inter text-sm font-bold text-(--text-description)">
                    {Math.round((category.amount / spent) * 100)}%
                  </span>
                </div>
                <span
                  aria-hidden="true"
                  className="block h-1.5 w-full overflow-hidden rounded-full bg-(--bg-filter) md:hidden"
                >
                  <span
                    className="block h-full rounded-full"
                    style={{
                      width: `${(category.amount / spent) * 100}%`,
                      backgroundColor: `var(${CATEGORY_CHART_COLORS[category.name]})`,
                    }}
                  />
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

export default CategoryCard;
