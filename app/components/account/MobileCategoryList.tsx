"use client";

import { transactionCategoryConfig } from "../config/transaction-category-config";
import type { CategoryDTO } from "../mock/category";
import { formatGoalAmount } from "app/utils/format-goal-amount";

function MobileCategoryRow({
  category,
  onSelect,
}: {
  category: CategoryDTO;
  onSelect?: (category: CategoryDTO) => void;
}) {
  const config = transactionCategoryConfig[category.configKey];
  const CategoryIcon = config.icon;
  const isSystem = category.badge === "system";
  return (
    <button
      type="button"
      onClick={onSelect ? () => onSelect(category) : undefined}
      className="flex w-full items-center gap-3 py-3 text-left"
    >
      <span
        aria-hidden="true"
        className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-(--background-variant)"
      >
        <CategoryIcon
          className={`size-4 ${config.iconColor ?? config.color}`}
        />
      </span>
      <span className="flex min-w-0 flex-1 flex-col items-start gap-0.5 overflow-hidden">
        <span className="line-clamp-1 self-stretch font-manrope text-sm font-bold text-(--text-title)">
          {category.name}
        </span>
        <span className="line-clamp-1 self-stretch font-manrope text-xs font-medium text-(--text-description)">
          {category.transactions} transações · {formatGoalAmount(category.spent)}{" "}
          Kz
        </span>
      </span>
      <span
        className={`flex w-28 shrink-0 items-center justify-center gap-2 rounded-lg px-2.5 py-1 font-manrope text-sm font-semibold leading-5 ${
          isSystem
            ? "bg-primary-300/10 text-primary-300"
            : "bg-neutrals-300/10 text-(--text)"
        }`}
      >
        {isSystem ? "Sistema" : "Personalizada"}
      </span>
    </button>
  );
}

export default function MobileCategoryList({
  categories,
  onSelect,
}: {
  categories: CategoryDTO[];
  onSelect?: (category: CategoryDTO) => void;
}) {
  if (categories.length === 0) {
    return (
      <p className="font-manrope text-sm text-(--text-description)">
        Nenhuma categoria encontrada.
      </p>
    );
  }

  return (
    <div className="flex flex-col items-start justify-start self-stretch rounded-2xl bg-(--bg-card) px-4 py-1">
      {categories.map((category, index) => (
        <div key={category.id} className="self-stretch">
          <MobileCategoryRow category={category} onSelect={onSelect} />
          {index < categories.length - 1 ? (
            <div
              aria-hidden="true"
              className="h-px self-stretch bg-(--card-barras)"
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}
