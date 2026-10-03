"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, X } from "lucide-react";
import CheckIcon from "@/icons/check";
import DropmenuCategoria from "./DropmenuCategoria";
import DropmenuSelect from "./DropmenuSelect";
import FloatingMenu from "../ui/FloatingMenu";

export type TransactionTypeFilter = "all" | "income" | "expense";
export type TransactionSortField = "Data" | "Valor" | "Nome";
export type TransactionSortOrder = "Crescente" | "Decrescente";

export type TransactionFilters = {
  type: TransactionTypeFilter;
  category: string;
  sortField: TransactionSortField;
  sortOrder: TransactionSortOrder;
};

export const DEFAULT_TRANSACTION_FILTERS: TransactionFilters = {
  type: "all",
  category: "",
  sortField: "Data",
  sortOrder: "Decrescente",
};

type FilterOptionProps = {
  label: string;
  type?: "checkbox" | "radio";
  name?: string;
  checked?: boolean;
  onChange?: () => void;
};

function FilterOption({ label, type = "checkbox", name, checked, onChange }: FilterOptionProps) {
  return (
    <label className="flex flex-1 cursor-pointer items-center gap-3 rounded-xl border border-(--border-button) bg-(--bg-body) px-4 py-3 transition-colors duration-200 hover:border-(--border-hover)">
      <span className="relative flex size-4 shrink-0 items-center justify-center">
        <input
          type={type}
          name={name}
          checked={checked}
          onChange={onChange}
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

function SortField({ value, options, isOpen, onToggle, onSelect, ariaLabel, align = "left", onClose }: SortFieldProps) {
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

type TransactionFilterProps = {
  isOpen: boolean;
  onClose: () => void;
  value: TransactionFilters;
  onApply: (filters: TransactionFilters) => void;
};

function TransactionFilter({ isOpen, onClose, value, onApply }: TransactionFilterProps) {
  const [draft, setDraft] = useState<TransactionFilters>(value);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [openSort, setOpenSort] = useState<"field" | "order" | null>(null);
  const categoryAnchorRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      setDraft(value);
      setCategoryOpen(false);
      setOpenSort(null);
    }
  }, [isOpen, value]);

  function handleClear() {
    setDraft(DEFAULT_TRANSACTION_FILTERS);
    onApply(DEFAULT_TRANSACTION_FILTERS);
  }

  return (
    <div
      className={`fixed inset-0 z-40 backdrop-blur transition-opacity duration-300 ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
      onClick={onClose}
    >
      <aside
        onClick={(e) => e.stopPropagation()}
        className={`fixed right-0 top-0 z-50 flex h-screen min-h-200 w-125 flex-col items-start border-l border-(--card-barras) bg-(--background) transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
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
          Refine a lista de transações pelos campos abaixo.
        </p>
      </header>

      <section className="flex flex-1 flex-col items-start gap-6 self-stretch overflow-y-auto p-6">
        {/* Tipo */}
        <div className="flex flex-col items-start gap-3 self-stretch">
          <h3 className="font-manrope text-[14px] font-bold leading-5 text-(--text-description)">
            TIPO
          </h3>
          <div className="flex flex-wrap items-start gap-3 self-stretch">
            <FilterOption
              label="Todas"
              type="radio"
              name="tipo"
              checked={draft.type === "all"}
              onChange={() => setDraft((d) => ({ ...d, type: "all" }))}
            />
            <FilterOption
              label="Entrada"
              type="radio"
              name="tipo"
              checked={draft.type === "income"}
              onChange={() => setDraft((d) => ({ ...d, type: "income" }))}
            />
            <FilterOption
              label="Saída"
              type="radio"
              name="tipo"
              checked={draft.type === "expense"}
              onChange={() => setDraft((d) => ({ ...d, type: "expense" }))}
            />
          </div>
        </div>

        {/* Categorias */}
        <div className="flex flex-col items-start gap-2 self-stretch">
          <h3 className="font-manrope text-[14px] font-semibold leading-5 text-(--text-description)">
            CATEGORIAS
          </h3>
          <div className="relative w-full">
            <div className="flex w-full items-center gap-2 rounded-xl border border-(--border-button) bg-(--background) p-3.5 transition-colors duration-200 hover:border-(--border-hover)">
              <button
                type="button"
                ref={categoryAnchorRef}
                onClick={() => setCategoryOpen((v) => !v)}
                aria-expanded={categoryOpen}
                className="flex min-w-0 flex-1 items-center justify-between gap-2 text-left"
              >
                <span
                  className={`truncate font-manrope text-[14px] leading-5 ${
                    draft.category
                      ? "font-medium text-(--text)"
                      : "font-normal text-(--text-description-60)"
                  }`}
                >
                  {draft.category || "Todas as categorias"}
                </span>
                <ChevronDown
                  width={14}
                  className={`shrink-0 text-(--icon) transition-transform duration-200 ${categoryOpen ? "rotate-180" : ""}`}
                />
              </button>
              {draft.category ? (
                <button
                  type="button"
                  onClick={() => setDraft((d) => ({ ...d, category: "" }))}
                  aria-label="Limpar categoria"
                  className="shrink-0 rounded-lg p-1 transition-colors hover:bg-(--bg-filter)"
                >
                  <X width={14} className="text-(--icon)" />
                </button>
              ) : null}
            </div>
            <FloatingMenu isOpen={categoryOpen} anchorRef={categoryAnchorRef} onClose={() => setCategoryOpen(false)}>
              <DropmenuCategoria
                isOpen={categoryOpen}
                onSelect={(category) => {
                  setDraft((d) => ({ ...d, category }));
                  setCategoryOpen(false);
                }}
              />
            </FloatingMenu>
          </div>
        </div>

        <hr className="self-stretch border-0 border-t border-(--card-barras)" />

        {/* Ordenar por */}
        <div className="flex flex-col items-start gap-3 self-stretch">
          <h3 className="font-manrope text-[14px] font-bold leading-5 text-(--text-description)">
            ORDENAR POR
          </h3>
          <div className="flex items-start gap-3 self-stretch">
            <SortField
              ariaLabel="Ordenar por"
              value={draft.sortField}
              options={["Nome", "Data", "Valor"]}
              isOpen={openSort === "field"}
              onToggle={() => setOpenSort((current) => (current === "field" ? null : "field"))}
              onClose={() => setOpenSort(null)}
              onSelect={(option) => {
                setDraft((d) => ({ ...d, sortField: option as TransactionSortField }));
                setOpenSort(null);
              }}
            />
            <SortField
              ariaLabel="Ordem"
              align="right"
              value={draft.sortOrder}
              options={["Crescente", "Decrescente"]}
              isOpen={openSort === "order"}
              onToggle={() => setOpenSort((current) => (current === "order" ? null : "order"))}
              onClose={() => setOpenSort(null)}
              onSelect={(option) => {
                setDraft((d) => ({ ...d, sortOrder: option as TransactionSortOrder }));
                setOpenSort(null);
              }}
            />
          </div>
        </div>
      </section>

      <footer className="flex items-start gap-4 self-stretch border-t border-(--card-barras) p-6">
        <button
          type="button"
          onClick={handleClear}
          className="flex flex-1 items-center justify-center gap-2.5 rounded-2xl border border-(--border-button) p-3.5 transition-colors duration-200 hover:border-(--border-hover)"
        >
          <span className="font-manrope text-[16px] font-bold leading-normal text-(--text-title)">
            Limpar
          </span>
        </button>
        <button
          type="button"
          onClick={() => onApply(draft)}
          className="flex flex-1 items-center justify-center gap-2.5 rounded-2xl bg-primary-300 p-3.5 shadow-[0px_4px_12px_0px_rgba(5,61,196,0.15)] transition-opacity duration-200 hover:opacity-90 active:opacity-80"
        >
          <span className="font-manrope text-[16px] font-bold leading-normal text-base-white">
            Aplicar filtro
          </span>
        </button>
      </footer>
      </aside>
    </div>
  );
}

export default TransactionFilter;
