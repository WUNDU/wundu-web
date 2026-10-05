"use client";

import { useMemo } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import type { TransactionDTO } from "app/types/dto/transaction.dto";
import { groupTransactionsByDate } from "app/utils/group-transactions";
import { transactionCategoryConfig } from "../config/transaction-category-config";
import { formatAOA } from "app/utils/format-AOA";

/** Banco fixo — igual ao da linha desktop (sem fonte de dados para o banco). */
const BANK_LABEL = "BAI";

function transactionTime(transaction: TransactionDTO): string {
  const raw =
    transaction.transactionDate ?? transaction.date ?? transaction.createdAt ?? "";
  const match = /T(\d{2}):(\d{2})/.exec(raw);
  return match ? `${match[1]}:${match[2]}` : "";
}

function MobileTransactionRow({
  transaction,
  onSelect,
}: {
  transaction: TransactionDTO;
  onSelect?: () => void;
}) {
  const isIncome = transaction.type === "income";
  const categoryConfig = transactionCategoryConfig[transaction.category];
  const CategoryIcon = categoryConfig.icon;
  const time = transactionTime(transaction);

  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex w-full items-center gap-3 py-3 text-left"
    >
      <span
        className={`flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl ${
          isIncome ? "bg-success/10" : "bg-danger-300/10"
        }`}
      >
        {isIncome ? (
          <ArrowDown
            className="size-4 text-success-text"
            strokeWidth={2}
            aria-hidden="true"
          />
        ) : (
          <ArrowUp
            className="size-4 text-danger-text"
            strokeWidth={2}
            aria-hidden="true"
          />
        )}
      </span>
      <span className="flex min-w-0 flex-1 flex-col items-start gap-1.5 overflow-hidden">
        <span className="line-clamp-1 self-stretch font-manrope text-sm font-bold text-(--text-title)">
          {transaction.title}
        </span>
        <span className="flex items-center gap-2 overflow-hidden">
          <span
            className={`flex items-center gap-2 rounded-lg px-2.5 py-1 ${categoryConfig.background}`}
          >
            <CategoryIcon
              className={`size-5 shrink-0 p-0.5 ${categoryConfig.iconColor ?? categoryConfig.color}`}
              aria-hidden="true"
            />
            <span
              className={`font-manrope text-sm font-semibold leading-5 ${categoryConfig.color}`}
            >
              {transaction.category}
            </span>
          </span>
          <span className="font-manrope text-xs font-medium text-(--text-description)">
            {BANK_LABEL}
          </span>
        </span>
      </span>
      <span className="flex shrink-0 flex-col items-end gap-1 overflow-hidden">
        <span
          className={`font-manrope text-sm font-bold ${
            isIncome ? "text-success-text" : "text-danger-300"
          }`}
        >
          {isIncome ? "+" : "−"}
          {formatAOA(Math.abs(transaction.amount))}
        </span>
        {time ? (
          <span className="font-manrope text-xs font-medium text-(--text-description)">
            {time}
          </span>
        ) : null}
      </span>
    </button>
  );
}

export default function MobileTransactionList({
  transactions,
  onSelect,
}: {
  transactions: TransactionDTO[];
  onSelect?: (transaction: TransactionDTO) => void;
}) {
  const groups = useMemo(
    () => groupTransactionsByDate(transactions),
    [transactions],
  );

  if (groups.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 self-stretch">
      {groups.map((group) => (
        <div key={group.dateKey} className="flex flex-col self-stretch">
          <p className="px-0 pb-1 pt-3 font-manrope text-xs font-bold text-(--text-description)">
            {group.label}
          </p>
          <div className="flex flex-col items-start justify-start self-stretch rounded-2xl bg-(--bg-card) px-4 pb-2 pt-1">
            {group.items.map((tx, index) => (
              <div key={tx.id} className="self-stretch">
                <MobileTransactionRow
                  transaction={tx}
                  onSelect={onSelect ? () => onSelect(tx) : undefined}
                />
                {index < group.items.length - 1 ? (
                  <div
                    aria-hidden="true"
                    className="h-px self-stretch bg-(--card-barras)"
                  />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
