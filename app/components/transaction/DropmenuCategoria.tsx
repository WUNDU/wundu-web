"use client";

import { Plus, Search } from "lucide-react";
import React, { useMemo, useState } from "react";
import { transactionCategoryConfig } from "../config/transaction-category-config";
import type { TransactionCategory } from "../../types/transaction";
import { categoryVisual, type CategoryFlow } from "../../utils/category-visual";
import { useCategory } from "@/hooks/use-category";

type DropmenuCategoriaProps = {
  isOpen: boolean;
  onSelect?: (category: string) => void;
  /** Quando definido, lista só categorias deste fluxo (evita CATEGORY_FLOW_MISMATCH). */
  flow?: "INCOME" | "EXPENSE";
  /** Chamado ao clicar em "Nova categoria" (abre o form lateral de categorias). */
  onAddCategory?: () => void;
};

type CategoryIcon = React.ComponentType<{
  className?: string;
  width?: number;
}>;

const staticCategories = Object.keys(
  transactionCategoryConfig,
) as TransactionCategory[];

function DropmenuCategoria({ isOpen, onSelect, flow, onAddCategory }: DropmenuCategoriaProps) {
  const [query, setQuery] = useState("");
  const { categories: apiCategories } = useCategory();

  const items = useMemo(() => {
    const customs = (apiCategories ?? [])
      .filter(
        (api) =>
          !staticCategories.some(
            (name) => name.toLowerCase() === api.name.trim().toLowerCase(),
          ),
      )
      .map((api) => ({ name: api.name, flow: api.flow as CategoryFlow }));
    return [
      ...staticCategories.map((name) => ({
        name,
        flow: transactionCategoryConfig[name].flow as CategoryFlow,
      })),
      ...customs,
    ];
  }, [apiCategories]);

  if (!isOpen) return null;

  const filtered = items.filter(
    (item) =>
      (!flow || item.flow === flow) &&
      item.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <article className="flex w-full flex-col items-start rounded-2xl border border-(--card-barras) bg-(--background) lg:w-112">
      <header className="flex py-3 px-4 items-center gap-3 self-stretch border-b border-(--card-barras) transition-colors duration-200 hover:border-primary-300 focus-within:border-primary-300">
        <Search width={16} className="text-(--text-description)/60" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Pesquisar"
          className="font-manrope text-sm font-medium leading-5 bg-transparent outline-none flex-1 text-(--text-description) placeholder:text-(--text-description)/60"
        />
      </header>
      <section className="flex h-52 p-2 items-start self-stretch overflow-y-auto">
        <ul className="flex flex-col items-start gap-2 flex-1">
          {filtered.map((item) => {
            const visual = categoryVisual(item.name, item.flow);
            const Icon = visual.icon as CategoryIcon;
            const color = visual.color;
            const iconColor = visual.iconColor ?? color;
            const background = visual.background;
            return (
              <li
                key={`${item.flow}:${item.name}`}
                className="flex flex-col items-start self-stretch"
              >
                <button
                  type="button"
                  onClick={() => onSelect?.(item.name)}
                  className="group relative flex h-8 py-1 px-2.5 items-center gap-2 self-stretch rounded-lg w-full text-left"
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
                  <span className="relative font-manrope text-sm font-semibold leading-5">
                    <span className="text-(--text)">
                      {item.name}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 ${color}`}
                    >
                      {item.name}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
          {onAddCategory ? (
            <li className="flex flex-col items-start self-stretch border-t border-(--card-barras) pt-2">
              <button
                type="button"
                onClick={onAddCategory}
                className="group flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-primary-300/10 active:scale-[0.98]"
              >
                <Plus
                  width={20}
                  className="shrink-0 text-primary-300"
                />
                <span className="font-manrope text-sm font-bold leading-5 text-primary-300">
                  Nova categoria
                </span>
              </button>
            </li>
          ) : (
            <li className="flex py-3 px-4 items-center gap-3 self-stretch border-t border-(--card-barras)">
              <Plus
                width={20}
                className="flex justify-center items-center aspect-square text-neutrals-300"
              />
              <p className="text-(--text-description) font-manrope text-sm font-medium leading-5">
                Nova categoria
              </p>
            </li>
          )}
        </ul>
      </section>
    </article>
  );
}

export default DropmenuCategoria;
