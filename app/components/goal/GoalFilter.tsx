"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, X } from "lucide-react";
import CheckIcon from "@/icons/check";
import DropmenuSelect from "../transaction/DropmenuSelect";
import FloatingMenu from "../ui/FloatingMenu";

export type GoalSortBy = "progress" | "value" | "endDate" | "title";
export type GoalSortDir = "asc" | "desc";

export type GoalFilterValue = {
  /** Labels de estado (statusFor) seleccionados; vazio = todos. */
  statuses: string[];
  /** Tipos de prazo seleccionados; vazio = todos. */
  types: string[];
  sortBy: GoalSortBy;
  sortDir: GoalSortDir;
};

export const emptyGoalFilters: GoalFilterValue = {
  statuses: [],
  types: [],
  sortBy: "progress",
  sortDir: "desc",
};

const STATUS_OPTIONS = ["Concluído", "Em progresso", "Iniciado", "Pendente"];
const TYPE_OPTIONS = [
  { label: "Curto Prazo", value: "SHORT_TERM" },
  { label: "Longo Prazo", value: "LONG_TERM" },
];

const SORT_FIELD_LABELS: Record<GoalSortBy, string> = {
  progress: "Progresso",
  value: "Valor",
  endDate: "Data limite",
  title: "Título",
};

function dirLabel(sortBy: GoalSortBy, sortDir: GoalSortDir): string {
  if (sortBy === "progress")
    return sortDir === "desc" ? "Maior progresso" : "Menor progresso";
  if (sortBy === "value") return sortDir === "desc" ? "Maior valor" : "Menor valor";
  if (sortBy === "endDate")
    return sortDir === "desc" ? "Mais recente" : "Mais antiga";
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
};

function SortField({
  value,
  options,
  isOpen,
  onToggle,
  onSelect,
  ariaLabel,
  align = "left",
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
      <FloatingMenu
        isOpen={isOpen}
        anchorRef={anchorRef}
        align={align}
      >
        <DropmenuSelect options={options} value={value} isOpen={isOpen} onSelect={onSelect} />
      </FloatingMenu>
    </div>
  );
}

type GoalFilterProps = {
  isOpen: boolean;
  onClose: () => void;
  value: GoalFilterValue;
  onApply: (value: GoalFilterValue) => void;
};

function GoalFilter({ isOpen, onClose, value, onApply }: GoalFilterProps) {
  const [draft, setDraft] = useState<GoalFilterValue>(value);
  const [openSort, setOpenSort] = useState<"field" | "order" | null>(null);

  useEffect(() => {
    if (isOpen) setDraft(value);
  }, [isOpen, value]);

  const toggleStatus = (status: string) =>
    setDraft((current) => ({
      ...current,
      statuses: current.statuses.includes(status)
        ? current.statuses.filter((item) => item !== status)
        : [...current.statuses, status],
    }));

  const toggleType = (type: string) =>
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
      className={`fixed inset-0 z-40 backdrop-blur transition-opacity duration-300 ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
      onClick={onClose}
    >
      <aside
        onClick={(e) => e.stopPropagation()}
        className={`fixed right-0 top-0 z-50 flex h-screen max-h-dvh w-125 max-w-full flex-col items-start border-l border-(--card-barras) bg-(--background) transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
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
            Refine a lista de metas pelos campos abaixo.
          </p>
        </header>

        <section className="flex min-h-0 flex-1 flex-col items-start gap-6 self-stretch overflow-y-auto p-6">
          <div className="flex flex-col items-start gap-2 self-stretch">
            <h3 className="font-manrope text-[14px] font-semibold leading-5 text-(--text-description)">
              STATUS
            </h3>
            <div className="grid grid-cols-2 gap-3 self-stretch">
              {STATUS_OPTIONS.map((status) => (
                <FilterOption
                  key={status}
                  label={status}
                  checked={draft.statuses.includes(status)}
                  onToggle={() => toggleStatus(status)}
                />
              ))}
            </div>
          </div>

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

          <hr className="self-stretch border-0 border-t border-(--card-barras)" />

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
                onSelect={(option) => {
                  const sortBy = (Object.keys(SORT_FIELD_LABELS) as GoalSortBy[]).find(
                    (key) => SORT_FIELD_LABELS[key] === option,
                  );
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
                onSelect={(option) => {
                  const dir: GoalSortDir =
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
            onClick={() => setDraft({ ...emptyGoalFilters })}
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

export default GoalFilter;
