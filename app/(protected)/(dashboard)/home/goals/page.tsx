"use client";

import PageHeader from "app/components/layout/PageHeader";
import GoalItem from "app/components/goal/GoalItem";
import MobileGoalCard from "app/components/goal/MobileGoalCard";
import { formatGoalAmount } from "app/utils/format-goal-amount";
import GoalDetails from "app/components/goal/GoalDetails";
import GoalForm, {
  type GoalFormMode,
  type GoalProgressValues,
  type GoalSaveValues,
} from "app/components/goal/GoalForm";
import GoalFilter, {
  emptyGoalFilters,
  type GoalFilterValue,
} from "app/components/goal/GoalFilter";
import { goalPercent, statusFor } from "app/components/goal/goal-status";
import type { GoalDTO } from "app/types/dto/goal.dto";
import type { Goal } from "@/types/dtos/goal.dto";
import type { TransactionCategory } from "app/types/transaction";
import { useGoal } from "@/hooks/use-goal";
import { FilterIcon, PlusIcon, SearchIcon } from "lucide-react";
import React, { useMemo, useState } from "react";

const MAX_SEARCH_LENGTH = 100;

const GOAL_CATEGORIES: readonly TransactionCategory[] = [
  "Levantamento",
  "Transporte",
  "Freelance",
  "Educação",
  "Salário",
  "Saúde",
  "Outros",
  "Alimentação",
  "Habitação",
  "Lazer",
  "Negócio",
  "Biscato",
];

function getCategory(name?: string | null): TransactionCategory {
  return (
    GOAL_CATEGORIES.find(
      (category) => category.toLocaleLowerCase() === name?.trim().toLocaleLowerCase(),
    ) ?? "Outros"
  );
}

function toAppGoal(goal: Goal, index: number): GoalDTO {
  const categoryName = goal.categoryName ?? goal.category?.name;
  return {
    id: goal.id ?? `api-${index}`,
    title: goal.title?.trim() || categoryName || "Meta",
    description: goal.description ?? undefined,
    type: goal.type === "LONG_TERM" ? "LONG_TERM" : "SHORT_TERM",
    targetAmount: goal.targetAmount,
    currentAmount: goal.currentAmount,
    startDate: goal.startDate ?? "",
    endDate: goal.endDate ?? "",
    category: getCategory(categoryName),
    categoryId: goal.categoryId ?? goal.category?.id ?? "",
  };
}

function formatHistoryDate(raw?: string | null): string {
  if (!raw) return "—";
  const date = new Date(raw);
  if (!Number.isFinite(date.getTime())) return "—";
  return date.toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function page() {
  const {
    goals: apiGoals,
    isLoading,
    error: goalsError,
    refreshGoals,
    addGoal,
    updateGoal,
    addProgress,
    removeGoal: removeGoalApi,
  } = useGoal();
  const [query, setQuery] = useState("");
  const [detailsGoal, setDetailsGoal] = useState<GoalDTO | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<GoalFormMode>("create");
  const [startDelete, setStartDelete] = useState(false);
  const [editingGoal, setEditingGoal] = useState<GoalDTO | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<GoalFilterValue>(emptyGoalFilters);
  const remaining = MAX_SEARCH_LENGTH - query.length;
  const normalizedQuery = query.trim().toLowerCase();

  const goals = useMemo(
    () => apiGoals.map(toAppGoal),
    [apiGoals],
  );

  const searchedGoals = normalizedQuery
    ? goals.filter((goal) =>
        [goal.title, goal.category, goal.description ?? ""].some((field) =>
          field.toLowerCase().includes(normalizedQuery),
        ),
      )
    : goals;
  const statusFiltered = filters.statuses.length
    ? searchedGoals.filter((goal) =>
        filters.statuses.includes(statusFor(goalPercent(goal)).label),
      )
    : searchedGoals;
  const typeFiltered = filters.types.length
    ? statusFiltered.filter((goal) => filters.types.includes(goal.type))
    : statusFiltered;
  const filteredGoals = [...typeFiltered].sort((a, b) => {
    if (filters.sortBy === "progress") {
      const diff = goalPercent(a) - goalPercent(b);
      return filters.sortDir === "desc" ? -diff : diff;
    }
    if (filters.sortBy === "value") {
      return filters.sortDir === "desc"
        ? b.targetAmount - a.targetAmount
        : a.targetAmount - b.targetAmount;
    }
    if (filters.sortBy === "endDate") {
      const diff = a.endDate.localeCompare(b.endDate);
      return filters.sortDir === "desc" ? -diff : diff;
    }
    const diff = a.title.localeCompare(b.title, "pt");
    return filters.sortDir === "asc" ? diff : -diff;
  });

  const detailsHistory = useMemo(() => {
    if (!detailsGoal) return undefined;
    const api = apiGoals.find((goal) => goal.id === detailsGoal.id);
    const progress = api?.progress ?? [];
    return [...progress]
      .sort((a, b) =>
        (b.progressDate ?? b.createdAt ?? "").localeCompare(
          a.progressDate ?? a.createdAt ?? "",
        ),
      )
      .map((entry) => ({
        amount: entry.amount,
        date: formatHistoryDate(entry.progressDate ?? entry.createdAt),
      }));
  }, [detailsGoal, apiGoals]);

  async function handleSaveGoal(values: GoalSaveValues): Promise<boolean> {
    const payload = {
      title: values.title,
      description: values.description || undefined,
      type: values.type,
      targetAmount: values.targetAmount,
      startDate: values.startDate,
      endDate: values.endDate,
      categoryId: values.categoryId,
    };
    if (editingGoal) return updateGoal(editingGoal.id, payload);
    return addGoal(payload);
  }

  async function handleSaveProgress(
    values: GoalProgressValues,
  ): Promise<boolean> {
    if (!editingGoal) return false;
    return addProgress(editingGoal.id, values.amount, values.date);
  }

  async function handleDeleteGoal(id: string): Promise<boolean> {
    return removeGoalApi(id);
  }

  const openForm = (
    mode: GoalFormMode,
    goal: GoalDTO | null,
    deleteFirst = false,
  ) => {
    setFormMode(mode);
    setEditingGoal(goal);
    setStartDelete(deleteFirst);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingGoal(null);
    setStartDelete(false);
  };

  const hasActiveFilters =
    filters.statuses.length > 0 ||
    filters.types.length > 0 ||
    filters.sortBy !== emptyGoalFilters.sortBy ||
    filters.sortDir !== emptyGoalFilters.sortDir;

  return (
    <div className="flex h-full flex-col bg-(--background-variant) lg:bg-transparent">
      <div className="hidden lg:block">
        <PageHeader title="Metas">
          <button
            type="button"
            onClick={() => openForm("create", null)}
            className="group flex w-42.5 h-12.25 cursor-pointer justify-center items-center gap-3 rounded-2xl border border-primary-300 bg-primary-300 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-primary-400 hover:shadow-[0_4px_14px_rgba(5,61,196,0.35)] active:translate-y-0 active:scale-[0.98]"
          >
            <PlusIcon
              width={16}
              height={16}
              className="text-base-white transition-transform duration-300 ease-out group-hover:rotate-90"
            />
            <span className="text-sm not-italic font-semibold font-inter text-base-white">
              Nova meta
            </span>
          </button>
        </PageHeader>
        </div>
        <div className="flex items-center justify-between self-stretch bg-(--background) px-6 py-4 lg:hidden">
          <h1 className="font-manrope text-2xl font-bold text-(--text-title)">
            Metas
          </h1>
          <button
            type="button"
            onClick={() => openForm("create", null)}
            className="flex h-9 items-center justify-center gap-2 rounded-xl bg-(--button-bg) px-4"
          >
            <PlusIcon
              width={16}
              height={16}
              className="shrink-0 text-(--button-icon-yellow)"
            />
            <span className="font-manrope text-xs font-medium text-(--button-fg)">
              Nova meta
            </span>
          </button>
        </div>
        <section className="shrink-0 hidden py-4 px-8 flex-col justify-center items-center self-stretch gap-4 bg-(--bg-card) lg:flex">
          <div className="flex items-start gap-3 self-stretch">
            <div className="flex p-3 flex-col justify-center items-start gap-4 flex-1 self-stretch rounded-2xl border border-(--border-button) bg-(--bg-filter)">
              <div className="flex items-center gap-3 self-stretch">
                <div className="flex h-12 py-0 px-4 items-center gap-3 flex-1 rounded-xl border border-(--border-button) bg-(--background) transition-colors duration-200 hover:border-primary-300 focus-within:border-primary-300">
                  <SearchIcon
                    width={16}
                    className="shrink-0 text-(--text-description) transition-colors duration-200"
                  />
                  <input
                    type="search"
                    value={query}
                    maxLength={MAX_SEARCH_LENGTH}
                    onChange={(event) =>
                      setQuery(event.target.value.slice(0, MAX_SEARCH_LENGTH))
                    }
                    placeholder={`Consultar ${goals.length} metas...`}
                    className="min-w-0 flex-1 bg-transparent text-[14px] not-italic font-normal leading-[150%] text-(--text-description) outline-none placeholder:text-(--text-description)/60 transition-colors duration-200 focus:outline-none"
                  />
                  <p
                    aria-live="polite"
                    className={`text-[12px] not-italic font-normal leading-normal transition-colors duration-150 ${
                      remaining === 0
                        ? "text-danger-300"
                        : "text-(--text-description)"
                    }`}
                  >
                    {remaining} /
                  </p>
                </div>
                <div className="flex h-9 items-center">
                  <button
                    type="button"
                    onClick={() => setIsFilterOpen((value) => !value)}
                    aria-expanded={isFilterOpen}
                    className={`group flex w-28 h-12 justify-center items-center gap-1.5 px-4 rounded-xl border transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-primary-300 hover:bg-primary-300/10 hover:shadow-[0_4px_12px_rgba(5,61,196,0.15)] active:translate-y-0 active:scale-[0.98] ${
                      isFilterOpen || hasActiveFilters
                        ? "border-primary-300 bg-primary-300/10 shadow-[0_4px_12px_rgba(5,61,196,0.15)]"
                        : "border-(--card-barras) bg-(--background) shadow-[inset_0px_0px_4px_0px_rgba(0,0,0,0.02)]"
                    }`}
                  >
                    <FilterIcon
                      width={16}
                      height={14}
                      className={`shrink-0 transition-all duration-200 ease-out group-hover:-translate-y-0.5 ${
                        isFilterOpen || hasActiveFilters
                          ? "text-primary-300"
                          : "text-(--icon) group-hover:text-primary-300"
                      }`}
                    />
                    <p
                      className={`text-center text-base not-italic font-normal font-manrope transition-colors duration-200 group-hover:text-primary-300 ${
                        isFilterOpen || hasActiveFilters
                          ? "text-primary-300"
                          : "text-(--text-title)"
                      }`}
                    >
                      Filtrar
                    </p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="flex items-center gap-2 self-stretch px-6 py-2 lg:hidden">
          <label className="flex h-12 flex-1 items-center gap-3 rounded-xl border border-(--border-button) bg-(--background) px-4 transition-colors duration-200 focus-within:border-primary-300">
            <SearchIcon
              width={16}
              height={16}
              className="shrink-0 text-slate-600"
            />
            <input
              type="search"
              value={query}
              maxLength={MAX_SEARCH_LENGTH}
              onChange={(event) =>
                setQuery(event.target.value.slice(0, MAX_SEARCH_LENGTH))
              }
              placeholder={`Pesquisar em ${goals.length} metas…`}
              aria-label="Pesquisar metas"
              className="min-w-0 flex-1 bg-transparent font-manrope text-sm font-normal leading-5 text-(--text-description) outline-none placeholder:text-slate-600"
            />
          </label>
          <button
            type="button"
            onClick={() => setIsFilterOpen(true)}
            aria-label="Filtrar metas"
            className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-(--border-button) bg-(--bg-card)"
          >
            <FilterIcon
              width={20}
              height={16}
              className={`shrink-0 ${
                isFilterOpen || hasActiveFilters
                  ? "text-primary-300"
                  : "text-(--icon)"
              }`}
            />
          </button>
        </div>
        {isLoading && goals.length === 0 ? (
          <main className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto bg-(--bg-card) p-8">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                aria-hidden="true"
                className="h-24 shrink-0 animate-pulse rounded-2xl bg-(--bg-filter)"
              />
            ))}
            <span className="sr-only">A carregar metas…</span>
          </main>
        ) : goalsError && goals.length === 0 ? (
          <main className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 bg-(--bg-card) p-8 text-center">
            <p className="font-manrope text-[16px] font-semibold text-(--text-title)">
              Não foi possível carregar as metas.
            </p>
            <p className="font-manrope text-[14px] text-(--text-description)">
              {goalsError}
            </p>
            <button
              type="button"
              onClick={() => refreshGoals()}
              className="mt-1 rounded-xl bg-primary-300 px-4 py-2 font-manrope text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Tentar novamente
            </button>
          </main>
        ) : goals.length === 0 ? (
          <main className="flex min-h-0 flex-1 flex-col items-center justify-center gap-2 bg-(--bg-card) p-8 text-center">
            <p className="font-manrope text-[16px] font-semibold text-(--text-title)">
              Sem metas
            </p>
            <p className="font-manrope text-[14px] text-(--text-description)">
              Crie a primeira meta com o botão “Nova meta”.
            </p>
          </main>
        ) : filteredGoals.length === 0 ? (
          <main className="flex min-h-0 flex-1 flex-col items-center justify-center gap-2 bg-(--bg-card) p-8 text-center">
            <p className="font-manrope text-[16px] font-semibold text-(--text-title)">
              Nenhuma meta encontrada
            </p>
            <p className="font-manrope text-[14px] text-(--text-description)">
              Tente outro termo de pesquisa ou ajuste os filtros.
            </p>
          </main>
        ) : (
          <>
            <main className="hidden min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-8 bg-(--bg-card) lg:flex">
              {filteredGoals.map((goal) => (
                <GoalItem
                  key={goal.id}
                  goal={goal}
                  onSelect={() => setDetailsGoal(goal)}
                />
              ))}
            </main>
            <main className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-6 pb-8 pt-2 lg:hidden">
              <div className="grid grid-cols-2 items-stretch gap-3">
                <div className="flex min-w-0 flex-col items-start gap-1 overflow-hidden rounded-2xl bg-(--bg-card) p-4">
                  <p className="font-manrope text-xs font-medium text-(--text-description)">
                    Total poupado
                  </p>
                  <p
                    className="w-full truncate font-manrope text-lg font-bold text-(--text-title)"
                    title={`${formatGoalAmount(
                      filteredGoals.reduce(
                        (sum, goal) => sum + goal.currentAmount,
                        0,
                      ),
                    )} Kz`}
                  >
                    {formatGoalAmount(
                      filteredGoals.reduce(
                        (sum, goal) => sum + goal.currentAmount,
                        0,
                      ),
                    )}{" "}
                    Kz
                  </p>
                </div>
                <div className="flex min-w-0 flex-col items-start gap-1 overflow-hidden rounded-2xl bg-(--bg-card) p-4">
                  <p className="font-manrope text-xs font-medium text-(--text-description)">
                    Metas ativas
                  </p>
                  <p className="font-manrope text-lg font-bold text-(--text-title)">
                    {
                      filteredGoals.filter(
                        (goal) => goalPercent(goal) < 100,
                      ).length
                    }{" "}
                    de {filteredGoals.length}
                  </p>
                </div>
              </div>
              {filteredGoals.map((goal) => (
                <MobileGoalCard
                  key={goal.id}
                  goal={goal}
                  onSelect={() => setDetailsGoal(goal)}
                />
              ))}
            </main>
          </>
        )}
        <GoalFilter
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          value={filters}
          onApply={(next) => {
            setFilters(next);
            setIsFilterOpen(false);
          }}
        />
        <GoalDetails
          isOpen={detailsGoal !== null}
          goal={detailsGoal}
          history={detailsHistory}
          onClose={() => setDetailsGoal(null)}
          onEdit={(goal) => {
            setDetailsGoal(null);
            openForm("edit", goal);
          }}
          onAddSavings={(goal) => {
            openForm("savings", goal);
          }}
          onDelete={(goal) => {
            setDetailsGoal(null);
            openForm("edit", goal, true);
          }}
        />
        <GoalForm
          isOpen={isFormOpen}
          mode={formMode}
          goal={editingGoal}
          startInDelete={startDelete}
          onClose={closeForm}
          onBack={closeForm}
          onSave={handleSaveGoal}
          onSaveProgress={handleSaveProgress}
          onDelete={handleDeleteGoal}
        />
      </div>
  );
}

export default page;
