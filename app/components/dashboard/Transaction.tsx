import React from "react";
import type { TransactionItemProps } from "../../types/transaction";
import { transactionTypeConfig } from "../config/transaction-config";
import { transactionCategoryConfig } from "../config/transaction-category-config";
import { formatAOA } from "app/utils/format-AOA";

function Transaction({ transaction }: TransactionItemProps) {
  const typeConfig = transactionTypeConfig[transaction.type];
  const TypeIcon = typeConfig.icon;
  const categoryConfig = transactionCategoryConfig[transaction.category];
  const CategoryIcon = categoryConfig.icon;
  return (
    <article className="flex items-center gap-3 flex-1 self-stretch px-1.5 py-2">
      <div
        className={`flex w-15 h-15 flex-col justify-center items-center aspect-square rounded-2xl ${typeConfig.background}`}
      >
        <TypeIcon
          className={`flex w-8 h-8 justify-center items-center aspect-square shrink-0 px-0.5 py-0 ${typeConfig.color}`}
        />
      </div>

      <div className="flex flex-col items-start gap-1 flex-1 min-w-0">
        <p className="w-full truncate text-[16px] not-italic font-bold leading-normal text-(--title)">
          {transaction.title}
        </p>
        <div
          className={`flex px-2.5 py-1 justify-center items-center gap-2 rounded-lg ${categoryConfig.background}`}
        >
          <CategoryIcon
            className={`flex w-5 p-0.5 flex-col items-center gap-2.5 ${categoryConfig.iconColor ?? categoryConfig.color}`}
          />
          <p
            className={`text-[14px] not-italic font-semibold leading-[155.99%] ${categoryConfig.color}`}
          >
            {transaction.category}
          </p>
        </div>
      </div>
      <div
        className={`flex px-2 py-3 flex-col items-end gap-0.5 rounded-xl ${typeConfig.background}`}
      >
        <p
          className={`text-[14px] not-italic font-bold leading-[155.99%] font-inter  ${typeConfig.color}`}
        >
          {formatAOA(transaction.amount)}
        </p>
      </div>
    </article>
  );
}

export default Transaction;
