import React from "react";
import type { TransactionItemProps } from "../../types/transaction";
import { transactionTypeConfig } from "../config/transaction-config";
import { transactionCategoryConfig } from "../config/transaction-category-config";
import { formatAOA } from "app/utils/format-AOA";
import { formatTransactionDate } from "app/utils/format-transaction-date";

interface TransactionCardProps extends TransactionItemProps {
  description?: string;
  accountName?: string;
}

function TransactionCard({
  transaction,
  description = "Transferência recebida da holding interna...",
  accountName = "BAI",
  onSelect,
}: TransactionCardProps) {
  const typeConfig = transactionTypeConfig[transaction.type];
  const TypeIcon = typeConfig.icon;

  const categoryConfig = transactionCategoryConfig[transaction.category];
  const CategoryIcon = categoryConfig.icon;

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
      className={`flex w-full flex-col items-start gap-4 rounded-xl p-6 border border-(--card-barras) bg-(--bg-card) transition-colors duration-200 hover:border-(--border-hover) ${
        onSelect ? "cursor-pointer" : ""
      }`}
    >
      <header className="flex items-center self-stretch justify-between">
        <div
          className={`flex w-10 h-10 justify-center items-center aspect-square rounded-xl ${typeConfig.background}`}
        >
          <TypeIcon className={`w-4 h-4 ${typeConfig.color}`} />
        </div>
        <p
          className={`font-inter leading-6 font-bold text-lg ${typeConfig.color}`}
        >
          {typeConfig.sign} {formatAOA(transaction.amount)}
        </p>
      </header>
      <p className="font-manrope text-base font-semibold leading-6 text-(--text)">
        {transaction.title}
      </p>
      <p className="text-(--text-description) font-manrope text-sm font-normal leading-6">
        {transaction.description ?? description}
      </p>
      <hr className="w-full border-0 border-t border-(--card-barras)" />
      <aside className="flex justify-between w-full items-center">
        <div className="flex items-center gap-2.5 self-stretch">
          <div
            className={`flex py-1 px-2 justify-center items-center gap-2 rounded-md ${categoryConfig.background}`}
          >
            <CategoryIcon
              className={`size-4 ${categoryConfig.iconColor ?? categoryConfig.color}`}
            />
            <p
              className={`font-manrope text-sm font-semibold leading-5 ${categoryConfig.color}`}
            >
              {transaction.category}
            </p>
          </div>
          <p className="font-manrope text-sm font-medium leading-6 text-(--text-description)">
            {accountName}
          </p>
        </div>
        <p className="text-(--text-description) font-manrope text-xs font-medium leading-5">
          {formatTransactionDate(transaction.date)}
        </p>
      </aside>
    </article>
  );
}

export default TransactionCard;
