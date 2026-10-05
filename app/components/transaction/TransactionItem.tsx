import React from "react";
import CheckIcon from "@/icons/check";
import type { TransactionItemProps } from "../../types/transaction";
import { transactionTypeConfig } from "../config/transaction-config";
import { transactionCategoryConfig } from "../config/transaction-category-config";
import { formatAOA } from "app/utils/format-AOA";

function TransactionItem({ transaction, onSelect }: TransactionItemProps) {
  const typeConfig = transactionTypeConfig[transaction.type];
  const TypeIcon = typeConfig.icon;
  const categoryConfig = transactionCategoryConfig[transaction.category];
  const CategoryIcon = categoryConfig.icon;
  return (
    <article
      onClick={onSelect}
      onKeyDown={(event) => {
        if (!onSelect) return;
        if (event.target instanceof HTMLInputElement) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect();
        }
      }}
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
      className={`group flex w-full items-center gap-3 px-2 py-1.5 rounded-xl transition-colors duration-200 hover:bg-(--card-bg-hover) lg:gap-4 lg:px-1.5 lg:py-2 ${
        onSelect ? "cursor-pointer" : ""
      }`}
    >
      {/* Checkbox — marca ao passar o mouse na linha (desktop) */}
      <span
        onClick={(event) => event.stopPropagation()}
        className="relative hidden size-4 shrink-0 items-center justify-center lg:flex"
      >
        <input
          type="checkbox"
          className="peer size-4 cursor-pointer appearance-none rounded-sm border border-(--border-hover) bg-transparent transition-colors group-hover:border-primary-300 group-hover:bg-primary-300 checked:border-primary-300 checked:bg-primary-300"
        />
        <CheckIcon className="pointer-events-none absolute inset-0 m-auto size-3 text-white opacity-0 transition-opacity group-hover:opacity-100 peer-checked:opacity-100" />
      </span>

      {/* Ícone */}
      <div
        className={`flex size-14 shrink-0 items-center justify-center rounded-2xl lg:size-10 lg:rounded-xl ${typeConfig.background}`}
      >
        <TypeIcon className={`size-5 lg:size-4 ${typeConfig.color}`} />
      </div>

      {/* Título + data */}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="truncate text-sm font-bold leading-5 text-(--text) lg:text-[16px] lg:leading-normal">
          {transaction.title}
        </p>

        <p className="hidden text-[14px] font-semibold leading-[155.99%] text-(--text-description) lg:block">
          {transaction.description ?? transaction.date}
        </p>

        {/* Linha categoria + valor (mobile) */}
        <div className="flex items-center gap-2 lg:hidden">
          <div
            className={`flex items-center gap-2 rounded-lg px-2.5 py-1 ${categoryConfig.background}`}
          >
            <CategoryIcon
              className={`size-5 shrink-0 p-0.5 ${categoryConfig.iconColor ?? categoryConfig.color}`}
            />
            <p
              className={`text-sm font-semibold leading-5 ${categoryConfig.color}`}
            >
              {transaction.category}
            </p>
          </div>
          <div
            className={`flex h-7 flex-col items-center justify-center gap-0.5 rounded-lg px-3 py-2 ${typeConfig.background}`}
          >
            <p
              className={`text-sm font-bold leading-5 ${typeConfig.color}`}
            >
              {formatAOA(transaction.amount)}
            </p>
          </div>
        </div>
      </div>

      {/* Informações à direita (desktop) */}
      <div className="hidden shrink-0 items-center gap-6 lg:flex">
        {/* Categoria */}
        <div className="flex w-45 shrink-0 items-center justify-end">
          <div
            className={`flex items-center gap-2 rounded-lg px-2.5 py-1 ${categoryConfig.background}`}
          >
            <CategoryIcon
              className={`size-5 shrink-0 p-0.5 ${categoryConfig.iconColor ?? categoryConfig.color}`}
            />

            <p
              className={`text-right text-[14px] font-semibold leading-[155.99%] ${categoryConfig.color}`}
            >
              {transaction.category}
            </p>
          </div>
        </div>

        {/* Banco */}
        <div className="flex w-15 items-center">
          <p className="text-[14px] font-medium leading-[155.99%] tracking-[-0.42px] text-(--text-description)">
            BAI
          </p>
        </div>

        {/* Amount */}
        <div
          className={`flex w-32.5 items-center justify-end rounded-xl px-3 py-2 ${typeConfig.background}`}
        >
          <p
            className={`text-right text-[14px] font-bold leading-[155.99%] ${typeConfig.color}`}
          >
            {formatAOA(transaction.amount)}
          </p>
        </div>
      </div>
    </article>
  );
}

export default TransactionItem;
