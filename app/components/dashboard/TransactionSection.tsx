import ChevronRight from "@/icons/chevron-right";
import Link from "next/link";
import React from "react";
import { GroupedTransactionList } from "./grouped-transacion-list";
import type { TransactionDTO } from "../../types/dto/transaction.dto";

interface TransactionSectionProps {
  transactions: TransactionDTO[];
  isLoading: boolean;
  error: string | null;
  totalElements: number;
}

function TransactionSection({
  transactions,
  isLoading,
  error,
  totalElements,
}: TransactionSectionProps) {
  return (
    <section className="flex h-[640px] flex-col gap-4 flex-1 items-center rounded-[20px] border border-(--card-barras) bg-(--card) shadow-2xs p-6">
      <header className="flex justify-between items-center self-stretch">
        <h1 className="text-[18px] not-italic font-semibold leading-[155.99%] tracking-[-0.54px] text-(--text-padro)">
          Transações recentes
        </h1>
        <Link
          href="/home/transactions"
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
      <article
        className="flex min-h-0 flex-1 flex-col items-start gap-4 self-stretch overflow-y-auto overscroll-contain"
        aria-busy={isLoading}
      >
        {isLoading ? (
          <div
            role="status"
            aria-label="A carregar transações"
            className="flex w-full flex-col gap-3"
          >
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="flex animate-pulse items-center gap-3 rounded-xl p-2"
              >
                <div className="size-14 shrink-0 rounded-2xl bg-(--bg-filter)" />
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <div className="h-4 w-2/3 rounded bg-(--bg-filter)" />
                  <div className="h-3 w-1/3 rounded bg-(--bg-filter)" />
                </div>
                <div className="h-8 w-24 rounded-lg bg-(--bg-filter)" />
              </div>
            ))}
          </div>
        ) : error ? (
          <p role="alert" className="font-manrope text-sm text-danger-300">
            {error}
          </p>
        ) : transactions.length > 0 ? (
          <GroupedTransactionList transactions={transactions} limit={7} />
        ) : (
          <p className="py-6 font-manrope text-sm text-(--text-description)">
            {totalElements === 0
              ? "Ainda não existem transações registadas."
              : "Não foi possível encontrar transações recentes."}
          </p>
        )}
      </article>
    </section>
  );
}

export default TransactionSection;
