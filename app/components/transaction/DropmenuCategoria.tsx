import { Plus, Search } from "lucide-react";
import React, { useState } from "react";
import { transactionCategoryConfig } from "../config/transaction-category-config";
import type { TransactionCategory } from "../../types/transaction";
import { MoneyIcon } from "@/constants/icons";

type DropmenuCategoriaProps = {
  isOpen: boolean;
  onSelect?: (category: string) => void;
  /** Quando definido, lista só categorias deste fluxo (evita CATEGORY_FLOW_MISMATCH). */
  flow?: "INCOME" | "EXPENSE";
};

type CategoryIcon = React.ComponentType<{
  className?: string;
  width?: number;
}>;

const categories = Object.keys(
  transactionCategoryConfig,
) as TransactionCategory[];

function DropmenuCategoria({ isOpen, onSelect, flow }: DropmenuCategoriaProps) {
  const [query, setQuery] = useState("");

  if (!isOpen) return null;

  const filtered = categories.filter(
    (category) =>
      (!flow || transactionCategoryConfig[category].flow === flow) &&
      category.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <article className="flex w-full flex-col items-start rounded-2xl border border-(--card-barras) bg-(--background) lg:w-113">
      <header className="flex py-3 px-4 items-center gap-3 self-stretch border-b border-(--card-barras) transition-colors duration-200 hover:border-primary-300 focus-within:border-primary-300">
        <Search width={16} className="text-(--text-description)/60" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Pesquisar"
          className="font-manrope text-[14px] not-italic font-medium leading-[155.99%] tracking-[-0.42px] bg-transparent outline-none flex-1 text-(--text-description) placeholder:text-(--text-description)/60"
        />
      </header>
      <section className="flex h-52 p-2 items-start self-stretch overflow-y-auto">
        <ul className="flex flex-col items-start gap-2 flex-1">
          {filtered.map((category) => {
            const config = transactionCategoryConfig[category];
            const Icon = (config?.icon ?? MoneyIcon) as CategoryIcon;
            const color = config?.color ?? "text-success";
            const iconColor = config?.iconColor ?? color;
            const background = config?.background ?? "bg-success/10";
            return (
              <li
                key={category}
                className="flex flex-col items-start self-stretch"
              >
                <button
                  type="button"
                  onClick={() => onSelect?.(category)}
                  className="group relative flex h-7.5 py-1 px-2.5 items-center gap-2 self-stretch rounded-lg w-full text-left"
                >
                  <span
                    aria-hidden="true"
                    className={`absolute inset-0 rounded-lg opacity-0 transition-opacity group-hover:opacity-100 ${background}`}
                  />
                  <span className="relative flex items-center">
                    <Icon className="text-(--icon)" width={20} />
                    <span
                      aria-hidden="true"
                      className={`absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 ${iconColor}`}
                    >
                      <Icon width={20} />
                    </span>
                  </span>
                  <span className="relative font-manrope text-[14px] not-italic font-semibold leading-[155.99%]">
                    <span className="text-(--text)">
                      {category}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 ${color}`}
                    >
                      {category}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
          <li className="flex py-3 px-4 items-center gap-3 self-stretch border-t border-(--card-barras)">
            <Plus
              width={20}
              className="flex p-[1.116px_1px_0.884px_1px] justify-center items-center aspect-square text-neutral-300"
            />
            <p className="text-(--text-description) font-manrope text-[14px] not-italic font-medium leading-[155.99%] tracking-[-0.42px]">
              Nova categoria
            </p>
          </li>
        </ul>
      </section>
    </article>
  );
}

export default DropmenuCategoria;
