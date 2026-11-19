"use client";

import React from "react";
import type { TransactionItemProps } from "../../types/transaction";
import { transactionTypeConfig } from "../config/transaction-config";
import { transactionCategoryConfig } from "../config/transaction-category-config";
import { formatAOA } from "app/utils/format-AOA";
import { useValuesVisibility } from "./values-visibility";

function Transaction({ transaction }: TransactionItemProps) {
  const { mask } = useValuesVisibility();
  const typeConfig = transactionTypeConfig[transaction.type];
  const TypeIcon = typeConfig.icon;
  const categoryConfig = transactionCategoryConfig[transaction.category];
  const CategoryIcon = categoryConfig.icon;
  return (
    <article className="flex items-center gap-3 flex-1 self-stretch p-2">
      <div
        className={`flex size-11 flex-col justify-center items-center aspect-square rounded-xl ${typeConfig.background}`}
      >
        <TypeIcon
          className={`flex size-5 justify-center items-center aspect-square shrink-0 ${typeConfig.color}`}
        />
      </div>

      <div className="flex flex-1 min-w-0 flex-col items-start gap-1 overflow-hidden">
        <p className="w-full truncate font-manrope text-sm font-semibold leading-6 text-(--text-title)">
          {transaction.title}
        </p>
        <div
          className={`flex min-w-0 max-w-full px-2 py-1 justify-center items-center gap-2 rounded-md ${categoryConfig.background}`}
        >
          <CategoryIcon
            className={`flex size-4 shrink-0 flex-col items-center ${categoryConfig.iconColor ?? categoryConfig.color}`}
          />
          <p
            title={transaction.category}
            className={`min-w-0 truncate font-manrope text-sm font-semibold leading-5 ${categoryConfig.color}`}
          >
            {transaction.category}
          </p>
        </div>
      </div>
      <div
        className={`flex shrink-0 p-2 flex-col items-end gap-1 rounded-xl ${typeConfig.background}`}
      >
        <p
          className={`whitespace-nowrap font-inter text-sm font-bold leading-5 ${typeConfig.color}`}
        >
          {mask(formatAOA(transaction.amount))}
        </p>
      </div>
    </article>
  );
}

export default Transaction;
