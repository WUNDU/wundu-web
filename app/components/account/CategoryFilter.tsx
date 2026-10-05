"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, X } from "lucide-react";
import CheckIcon from "@/icons/check";
import DropmenuSelect from "../transaction/DropmenuSelect";
import FloatingMenu from "../ui/FloatingMenu";
import type { CategoryBadge } from "../mock/category";

export type CategorySortBy = "name" | "transactions" | "value";
export type CategorySortDir = "asc" | "desc";

export type CategoryFilterValue = {
  /** Badges seleccionados ("system" | "custom"); vazio = todos. */
  types: CategoryBadge[];
  sortBy: CategorySortBy;
  sortDir: CategorySortDir;
};

export const emptyCategoryFilters: CategoryFilterValue = {
  types: [],
  sortBy: "value",
  sortDir: "desc",
};

const TYPE_OPTIONS: { label: string; value: CategoryBadge }[] = [
  { label: "Sistema", value: "system" },
  { label: "Personalizada", value: "custom" },
];

const SORT_FIELD_LABELS: Record<CategorySortBy, string> = {
  name: "Nome",
  transactions: "Transações",
  value: "Valor",
};

function dirLabel(sortBy: CategorySortBy, sortDir: CategorySortDir): string {
  if (sortBy === "transactions")
    return sortDir === "desc" ? "Mais transações" : "Menos transações";
  if (sortBy === "value")
    return sortDir === "desc" ? "Maior valor" : "Menor valor";
  return sortDir === "asc" ? "A – Z" : "Z – A";
}

type FilterOptionProps = {
  label: string;
  checked: boolean;
  onToggle: () => void;
};

function FilterOption({ label, checked, onToggle }: FilterOptionProps) {
  return (
    <label className="flex flex-1 cursor-pointer items-center gap-3 rounded-xl border border-(--border-button) bg-(--bg-body) px-4 py-3 transition-colors duration-200 hover:border-(--border-hover)">
      <span className="relative flex size-4 shrink-0 items-center justify-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={onToggle}
          className="peer size-4 appearance-none rounded-sm border-[1.5px] border-(--border-hover) bg-(--background) transition-colors checked:border-primary-300 checked:bg-primary-300"
        />
        <CheckIcon className="pointer-events-none absolute inset-0 m-auto size-3 text-base-white opacity-0 transition-opacity peer-checked:opacity-100" />
      </span>
      <span className="truncate font-manrope text-[16px] font-medium leading-normal text-(--text-title)">
        {label}
      </span>
    </label>
  );
}

type SortFieldProps = {
  value: string;
  options: string[];
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (value: string) => void;
  ariaLabel: string;
  align?: "left" | "right";
  onClose?: () => void;
};

function SortField({
  value,
  options,
  isOpen,
  onToggle,
  onSelect,
  ariaLabel,
  align = "left",
  onClose,
}: SortFieldProps) {
  const anchorRef = useRef<HTMLButtonElement>(null);
  return (
    <div className="relative flex-1">
      <button
        type="button"
        ref={anchorRef}
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-(--border-button) bg-(--bg-body) px-3.5 py-3 text-left transition-colors duration-200 hover:border-(--border-hover)"
      >
        <span className="truncate font-manrope text-[16px] font-medium leading-normal text-(--text)">
          {value}
        </span>
        <ChevronDown
          width={14}
          className={`shrink-0 text-(--icon) transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <FloatingMenu isOpen={isOpen} anchorRef={anchorRef} align={align} onClose={onClose}>
        <DropmenuSelect options={options} value={value} isOpen={isOpen} onSelect={onSelect} />
      </FloatingMenu>
    </div>
  );
}

type CategoryFilterProps = {
  isOpen: boolean;
  onClose: () => void;
  value: CategoryFilterValue;
  onApply: (value: CategoryFilterValue) => void;
};

function CategoryFilter({ isOpen, onClose, value, onApply }: CategoryFilterProps) {
  const [draft, setDraft] = useState<CategoryFilterValue>(value);
  const [openSort, setOpenSort] = useState<"field" | "order" | null>(null);

  useEffect(() => {
    if (isOpen) {
      setDraft(value);
      setOpenSort(null);
    }
  }, [isOpen, value]);

  const toggleType = (type: CategoryBadge) =>
    setDraft((current) => ({
      ...current,
      types: current.types.includes(type)
        ? current.types.filter((item) => item !== type)
        : [...current.types, type],
    }));

  const orderOptions = [
    dirLabel(draft.sortBy, "desc"),
    dirLabel(draft.sortBy, "asc"),
  ];

  return (
    <div
      className={`fixed inset-0 z-[60] bg-sky-950/40 backdrop-blur transition-opacity duration-300 lg:bg-transparent ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
      onClick={onClose}
    >
      <aside
        onClick={(event) => event.stopPropagation()}
        className={`fixed inset-x-0 bottom-0 top-auto z-50 max-h-[calc(100dvh-3rem)] flex w-full max-w-full flex-col items-start rounded-t-3xl border-t border-(--card-barras) bg-(--background) transition-transform duration-300 ease-out lg:inset-x-auto lg:bottom-auto lg:left-auto lg:right-0 lg:top-0 lg:h-screen lg:max-h-dvh lg:w-125 lg:rounded-none lg:border-l lg:border-t-0 ${isOpen ? "translate-x-0 translate-y-0 lg:translate-x-0" : "translate-x-0 translate-y-full lg:translate-x-full lg:translate-y-0"}}`}
      >
        <div
          aria-hidden="true"
          className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-xs bg-zinc-300 lg:hidden"
        />
        <header className="flex flex-col items-start gap-2 self-stretch border-b border-(--card-barras) p-6">
          <div className="flex items-center justify-between self-stretch">
            <h2 className="font-manrope text-[18px] font-bold leading-7 text-(--text-title)">
              Filtros e ordenação
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar filtros"
              className="rounded-lg p-1 transition-colors duration-200 hover:bg-(--bg-filter)"
            >
              <X width={20} className="text-(--icon)" />
            </button>
          </div>
          <p className="font-manrope text-[14px] font-normal leading-5 text-(--text-description)">
            Refine a lista de categorias pelos campos abaixo.
          </p>
        </header>

        <section className="flex min-h-0 flex-1 flex-col items-start gap-6 self-stretch overflow-y-auto p-6">
          <div className="flex flex-col items-start gap-3 self-stretch">
            <h3 className="font-manrope text-[14px] font-bold leading-5 text-(--text-description)">
              TIPO
            </h3>
            <div className="grid grid-cols-2 gap-3 self-stretch">
              {TYPE_OPTIONS.map((type) => (
                <FilterOption
                  key={type.value}
                  label={type.label}
                  checked={draft.types.includes(type.value)}
                  onToggle={() => toggleType(type.value)}
                />
              ))}
            </div>
          </div>

          <hr className="h-px w-full text-(--card-barras)" />

          <div className="flex flex-col items-start gap-3 self-stretch">
            <h3 className="font-manrope text-[14px] font-bold leading-5 text-(--text-description)">
              ORDENAR POR
            </h3>
            <div className="flex items-start gap-3 self-stretch">
              <SortField
                ariaLabel="Ordenar por"
                value={SORT_FIELD_LABELS[draft.sortBy]}
                options={Object.values(SORT_FIELD_LABELS)}
                isOpen={openSort === "field"}
                onToggle={() =>
                  setOpenSort((current) => (current === "field" ? null : "field"))
                }
                onClose={() => setOpenSort(null)}
                onSelect={(option) => {
                  const sortBy = (
                    Object.keys(SORT_FIELD_LABELS) as CategorySortBy[]
                  ).find((key) => SORT_FIELD_LABELS[key] === option);
                  if (sortBy) setDraft((current) => ({ ...current, sortBy }));
                  setOpenSort(null);
                }}
              />
              <SortField
                ariaLabel="Ordem"
                align="right"
                value={dirLabel(draft.sortBy, draft.sortDir)}
                options={orderOptions}
                isOpen={openSort === "order"}
                onToggle={() =>
                  setOpenSort((current) => (current === "order" ? null : "order"))
                }
                onClose={() => setOpenSort(null)}
                onSelect={(option) => {
                  const dir: CategorySortDir =
                    option === dirLabel(draft.sortBy, "desc") ? "desc" : "asc";
                  setDraft((current) => ({ ...current, sortDir: dir }));
                  setOpenSort(null);
                }}
              />
            </div>
          </div>
        </section>

        <footer className="flex shrink-0 items-start gap-4 self-stretch border-t border-(--card-barras) p-6">
          <button
            type="button"
            onClick={() => setDraft({ ...emptyCategoryFilters })}
            className="flex flex-1 items-center justify-center gap-2.5 rounded-2xl border border-(--border-button) p-3.5 transition-colors duration-200 hover:border-(--border-hover)"
          >
            <span className="font-manrope text-[16px] font-bold leading-normal text-(--text-title)">
              Limpar
            </span>
          </button>
          <button
            type="button"
            onClick={() => {
              onApply(draft);
              onClose();
            }}
            className="flex flex-1 items-center justify-center gap-2.5 rounded-2xl bg-primary-300 p-3.5 text-base-white shadow-[0px_4px_12px_0px_rgba(5,61,196,0.15)] transition-opacity duration-200 hover:opacity-90 active:opacity-80"
          >
            <span className="font-manrope text-[16px] font-bold leading-normal">
              Aplicar filtro
            </span>
          </button>
        </footer>
      </aside>
    </div>
  );
}

export default CategoryFilter;
