import CheckIcon from "@/icons/check";
import { transactionCategoryConfig } from "../config/transaction-category-config";
import type { CategoryDTO } from "../mock/category";
import { formatAOA } from "../../utils/format-AOA";

type CategoryItemProps = {
  category: CategoryDTO;
  selected?: boolean;
  onToggle?: (category: CategoryDTO) => void;
  onSelect?: (category: CategoryDTO) => void;
};

function CategoryItem({
  category,
  selected = false,
  onToggle,
  onSelect,
}: CategoryItemProps) {
  const config = transactionCategoryConfig[category.configKey];
  const CategoryIcon = config.icon;
  const amountLabel = category.flow === "INCOME" ? "Entradas:" : "Gastos:";

  return (
    <article
      onClick={onSelect ? () => onSelect(category) : undefined}
      onKeyDown={(event) => {
        if (!onSelect) return;
        if (event.target instanceof HTMLInputElement) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(category);
        }
      }}
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
      className={`group flex h-20 items-center justify-start gap-3 self-stretch rounded-3xl bg-(--bg-list) px-4 py-3 outline outline-1 outline-offset-[-1px] outline-(--border-button) transition-all duration-200 hover:outline-(--border-hover) ${
        onSelect ? "cursor-pointer" : ""
      }`}>
      <div className="flex min-w-0 flex-1 items-center justify-start gap-6 px-2 py-1.5">
        {/* Checkbox — marca ao passar o mouse na linha */}
        <span
          onClick={(event) => event.stopPropagation()}
          className="relative flex size-4 shrink-0 items-center justify-center"
        >
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onToggle?.(category)}
            onClick={(event) => event.stopPropagation()}
            aria-label={`Selecionar ${category.name}`}
            className="peer size-4 cursor-pointer appearance-none rounded-sm border border-(--border-hover) bg-transparent transition-colors group-hover:border-primary-300 group-hover:bg-primary-300 checked:border-primary-300 checked:bg-primary-300 focus:outline-none"
          />
          <CheckIcon className="pointer-events-none absolute inset-0 m-auto size-3 text-white opacity-0 transition-opacity group-hover:opacity-100 peer-checked:opacity-100" />
        </span>

        <span
          aria-hidden="true"
          className={`flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl ${config.background}`}
        >
          <CategoryIcon
            className={`size-4 ${config.iconColor ?? config.color}`}
          />
        </span>

        <div className="flex min-w-0 flex-1 flex-col items-start justify-center gap-1 self-stretch">
          <div className="flex items-start justify-between self-stretch">
            <h3 className="min-w-0 flex-1 truncate font-manrope text-lg font-bold leading-7 text-(--text-title)">
              {category.name}
            </h3>
            <dl className="hidden items-center justify-start gap-4 lg:flex">
              <div className="flex h-4 w-28 items-center justify-start gap-0.5">
                <dt className="shrink-0 font-manrope text-sm font-normal leading-5 text-(--text-description)">
                  Transações:
                </dt>
                <dd className="min-w-0 truncate font-manrope text-sm font-semibold leading-5 text-(--text-title)">
                  {category.transactions}
                </dd>
              </div>
              <span aria-hidden="true" className="w-px self-stretch bg-(--text-description)" />
              <div className="flex h-4 w-36 items-center justify-center gap-0.5">
                <dt className="shrink-0 font-manrope text-sm font-normal leading-5 text-(--text-description)">
                  {amountLabel}
                </dt>
                <dd className="min-w-0 truncate font-manrope text-sm font-semibold leading-5 text-(--text-title)">
                  {formatAOA(category.spent)}
                </dd>
              </div>
              <span aria-hidden="true" className="w-px self-stretch bg-(--text-description)" />
              <div className="flex h-4 w-36 items-center justify-start gap-0.5">
                <dt className="shrink-0 font-manrope text-sm font-normal leading-5 text-(--text-description)">
                  Limite:
                </dt>
                <dd className="min-w-0 truncate font-manrope text-sm font-semibold leading-5 text-(--text-title)">
                  {category.limit != null
                    ? formatAOA(category.limit)
                    : "—"}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-start gap-3 px-2 py-1.5">
        <p
          className={`flex w-28 items-center justify-center gap-2 rounded-lg px-2.5 py-1 text-center font-manrope text-sm font-semibold leading-5 ${
            category.badge === "system"
              ? "bg-primary-300/20 text-primary-300"
              : "bg-neutrals-300/10 text-(--text)"
          }`}
        >
          {category.badge === "system" ? "Sistema" : "Personalizada"}
        </p>
      </div>
    </article>
  );
}

export default CategoryItem;
