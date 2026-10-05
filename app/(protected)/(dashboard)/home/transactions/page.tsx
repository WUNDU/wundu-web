"use client";

import PageHeader from "app/components/layout/PageHeader";
import TransactionCard from "app/components/transaction/TransactionCard";
import { FilterIcon, Grid, MenuIcon, PlusIcon, SearchIcon } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import GroupedTransactionList from "app/components/transaction/grouped-transaction-list";
import MobileTransactionList from "app/components/transaction/MobileTransactionList";
import TransactionForm, {
  type TransactionFormValues,
} from "app/components/transaction/TransactionForm";
import TransactionFilter, {
  DEFAULT_TRANSACTION_FILTERS,
  type TransactionFilters,
} from "app/components/transaction/TransactionFilter";
import TransactionPagination from "app/components/transaction/TransactionPagination";
import type { TransactionDTO } from "app/types/dto/transaction.dto";
import { toAppTransaction } from "app/utils/transaction-map";
import { useTransaction } from "@/hooks/use-transaction";

type TransactionView = "list" | "grid";

const MAX_SEARCH_LENGTH = 100;
const PAGE_SIZE = 10;

/**
 * Data (YYYY-MM-DD) + hora (HH:MM) → datetime ISO completo para a API.
 * Fixa o meio-dia quando a hora for inválida, para o dia não trocar no UTC.
 */
function toDateTimeISO(dateKey: string, time: string): string {
  const match = time.match(/^([01]\d|2[0-3]):([0-5]\d)$/);
  const hours = match ? match[1] : "12";
  const minutes = match ? match[2] : "00";
  return new Date(`${dateKey}T${hours}:${minutes}:00`).toISOString();
}

function compareTransactions(
  a: TransactionDTO,
  b: TransactionDTO,
  filters: TransactionFilters,
) {
  let result: number;
  if (filters.sortField === "Valor") result = a.amount - b.amount;
  else if (filters.sortField === "Nome")
    result = a.title.localeCompare(b.title, "pt-AO");
  else result = (a.date ?? "").localeCompare(b.date ?? "");
  return filters.sortOrder === "Crescente" ? result : -result;
}

function page() {
  const {
    notPaginated: apiTransactions,
    isLoadingAll,
    error: transactionsError,
    getAllNotPaginated,
    createTransaction,
    updateTransaction,
    removeTransaction,
  } = useTransaction();
  const [view, setView] = useState<TransactionView>("list");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<TransactionDTO | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<TransactionFilters>(
    DEFAULT_TRANSACTION_FILTERS,
  );
  const [query, setQuery] = useState("");
  const isList = view === "list";
  const remaining = MAX_SEARCH_LENGTH - query.length;
  const normalizedQuery = query.trim().toLowerCase();

  useEffect(() => {
    void getAllNotPaginated();
  }, [getAllNotPaginated]);

  const transactions = useMemo(
    () => (apiTransactions ?? []).map(toAppTransaction),
    [apiTransactions],
  );

  const filteredTransactions = useMemo(() => {
    let list = transactions;
    if (normalizedQuery) {
      list = list.filter((tx) =>
        [tx.title, tx.category, tx.description ?? ""].some((field) =>
          field.toLowerCase().includes(normalizedQuery),
        ),
      );
    }
    if (filters.type !== "all") {
      list = list.filter((tx) => tx.type === filters.type);
    }
    if (filters.category) {
      list = list.filter((tx) => tx.category === filters.category);
    }
    return [...list].sort((a, b) => compareTransactions(a, b, filters));
  }, [transactions, normalizedQuery, filters]);

  const [page, setPage] = useState(1);
  useEffect(() => {
    setPage(1);
  }, [normalizedQuery, filters]);
  const pageCount = Math.max(
    1,
    Math.ceil(filteredTransactions.length / PAGE_SIZE),
  );
  const safePage = Math.min(page, pageCount);
  const pagedTransactions = filteredTransactions.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  async function handleSaveTransaction(
    values: TransactionFormValues,
  ): Promise<boolean> {
    const flow = values.type === "income" ? "INCOME" : "EXPENSE";
    // A API espera datetime ISO completo (ex. "...T12:00:00.000Z");
    // só-dia ("2026-10-03") dá 400.
    const transactionDate = toDateTimeISO(values.date, values.time);
    if (editingTx) {
      const updated = await updateTransaction(editingTx.id, {
        amount: values.amount,
        description: values.description || undefined,
        transactionDate,
        category: values.category ? { name: values.category, flow } : undefined,
      });
      return updated !== null;
    }
    return createTransaction({
      type: values.type === "income" ? "INCOME" : "EXPENSE",
      source: "MANUAL",
      amount: values.amount,
      description: values.description || undefined,
      transactionDate,
      category: values.category ? { name: values.category, flow } : undefined,
    });
  }

  async function handleDeleteTransaction(id: string): Promise<boolean> {
    return removeTransaction(id);
  }

  const isLoading = isLoadingAll && transactions.length === 0;
  const hasActiveFilters =
    filters.type !== "all" ||
    filters.category !== "" ||
    filters.sortField !== DEFAULT_TRANSACTION_FILTERS.sortField ||
    filters.sortOrder !== DEFAULT_TRANSACTION_FILTERS.sortOrder;

  return (
    <>
      <div className="flex h-full flex-col bg-(--background-variant) lg:bg-(--bg-card)">
        <div className="hidden shrink-0 lg:block">
          <PageHeader title="Transações">
            <button
              type="button"
              onClick={() => setIsAddOpen(true)}
              className="group flex w-42.5 h-12.25 cursor-pointer items-center justify-center gap-2 rounded-2xl border border-primary-300 bg-primary-300 px-4 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-primary-400 hover:shadow-[0_4px_14px_rgba(5,61,196,0.35)] active:translate-y-0 active:scale-[0.98]"
            >
              <PlusIcon
                width={16}
                height={16}
                className="text-base-white transition-transform duration-300 ease-out group-hover:rotate-90"
              />
              <span className="font-inter text-[14px] not-italic leading-normal text-base-white">
                Nova Transação
              </span>
            </button>
          </PageHeader>
        </div>
        <div className="flex items-center justify-between self-stretch bg-(--background) px-6 py-4 lg:hidden">
          <h1 className="font-manrope text-2xl font-bold text-(--text-title)">
            Transações
          </h1>
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="flex h-9 items-center justify-center gap-2 rounded-xl bg-(--button-bg) px-4"
          >
            <PlusIcon
              width={16}
              height={16}
              className="shrink-0 text-(--button-icon-yellow)"
            />
            <span className="font-manrope text-xs font-medium text-(--button-fg)">
              Nova
            </span>
          </button>
        </div>
          <section className="hidden py-4 px-8 flex-col justify-center items-center self-stretch gap-4 bg-(--bg-card) lg:flex">
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
                      placeholder={`Consultar ${transactions.length} transações...`}
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
                  <div className="flex items-center">
                    <div className="flex gap-3 items-center">
                      <button
                        type="button"
                        onClick={() => setIsFilterOpen((value) => !value)}
                        aria-expanded={isFilterOpen}
                        className={`group flex h-12 cursor-pointer items-center justify-center gap-1.5 rounded-xl border px-4 py-4.5 inset-shadow-2xs transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-primary-300 hover:bg-primary-300/10 hover:shadow-[0_4px_12px_rgba(5,61,196,0.15)] active:translate-y-0 active:scale-[0.98] ${
                          isFilterOpen || hasActiveFilters
                            ? "border-primary-300 bg-primary-300/10"
                            : "border-(--card-barras) bg-(--background)"
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
                          className={`text-[16px] not-italic font-normal leading-normal text-center transition-colors duration-200 group-hover:text-primary-300 ${
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
                  <div className="flex items-center gap-3 self-stretch">
                    <button
                      type="button"
                      onClick={() => setView("list")}
                      aria-pressed={isList}
                      title="Ver em linha"
                      className={`flex p-2.5 justify-center items-center flex-col self-stretch aspect-square w-12 rounded-lg border-2 transition-colors duration-200 ${
                        isList
                          ? "border-primary-300 bg-(--bg-filter)"
                          : "border-(--card-barras) bg-(--background)"
                      }`}
                    >
                      <MenuIcon
                        width={16}
                        height={16}
                        className={`aspect-square ${isList ? "text-primary-300" : "text-(--icon)"}`}
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => setView("grid")}
                      aria-pressed={!isList}
                      title="Ver em grelha"
                      className={`flex p-2.5 justify-center items-center flex-col self-stretch aspect-square w-12 rounded-lg border-2 transition-colors duration-200 ${
                        !isList
                          ? "border-primary-300 bg-(--bg-filter)"
                          : "border-(--card-barras) bg-(--background)"
                      }`}
                    >
                      <Grid
                        width={16}
                        height={16}
                        className={`aspect-square ${!isList ? "text-primary-300" : "text-(--icon)"}`}
                      />
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
                placeholder={`Pesquisar em ${transactions.length} transações…`}
                aria-label="Pesquisar transações"
                className="min-w-0 flex-1 bg-transparent font-manrope text-sm font-normal leading-5 text-(--text-description) outline-none placeholder:text-slate-600"
              />
            </label>
            <button
              type="button"
              onClick={() => setIsFilterOpen(true)}
              aria-label="Filtrar transações"
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
        {isLoading ? (
          <main className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto bg-(--bg-card) p-8">
            {[0, 1, 2, 3, 4].map((index) => (
              <div
                key={index}
                aria-hidden="true"
                className="h-16 shrink-0 animate-pulse rounded-2xl bg-(--bg-filter)"
              />
            ))}
            <span className="sr-only">A carregar transações…</span>
          </main>
        ) : transactionsError && transactions.length === 0 ? (
          <main className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 bg-(--bg-card) p-8 text-center">
            <p className="font-manrope text-[16px] font-semibold text-(--text-title)">
              Não foi possível carregar as transações.
            </p>
            <p className="font-manrope text-[14px] text-(--text-description)">
              {transactionsError}
            </p>
            <button
              type="button"
              onClick={() => void getAllNotPaginated()}
              className="mt-1 rounded-xl bg-primary-300 px-4 py-2 font-manrope text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Tentar novamente
            </button>
          </main>
        ) : transactions.length === 0 ? (
          <main className="flex min-h-0 flex-1 flex-col items-center justify-center gap-2 bg-(--bg-card) p-8 text-center">
            <p className="font-manrope text-[16px] font-semibold text-(--text-title)">
              Sem transações
            </p>
            <p className="font-manrope text-[14px] text-(--text-description)">
              Registe a primeira transação com o botão “Nova Transação”.
            </p>
          </main>
        ) : filteredTransactions.length === 0 ? (
          <main className="flex min-h-0 flex-1 flex-col items-center justify-center gap-2 bg-(--bg-card) p-8 text-center">
            <p className="font-manrope text-[16px] font-semibold text-(--text-title)">
              Nenhuma transação encontrada
            </p>
            <p className="font-manrope text-[14px] text-(--text-description)">
              Tente outro termo de pesquisa ou ajuste os filtros.
            </p>
          </main>
        ) : isList ? (
          <>
            <main className="hidden min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-8 bg-(--bg-card) lg:flex">
              <GroupedTransactionList
                transactions={pagedTransactions}
                limit={pagedTransactions.length}
                onSelect={setEditingTx}
              />
            </main>
            <main className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-6 pb-8 pt-2 lg:hidden">
              <MobileTransactionList
                transactions={pagedTransactions}
                onSelect={setEditingTx}
              />
            </main>
          </>
        ) : (
          <main className="hidden min-h-0 flex-1 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 p-8 bg-(--bg-card) w-full content-start items-start overflow-y-auto lg:grid">
            {pagedTransactions.map((tx) => (
              <TransactionCard
                key={tx.id}
                transaction={tx}
                onSelect={() => setEditingTx(tx)}
              />
            ))}
          </main>
        )}
        {filteredTransactions.length > 0 && (
          <TransactionPagination
            page={safePage}
            pageCount={pageCount}
            total={filteredTransactions.length}
            pageSize={PAGE_SIZE}
            onChange={setPage}
          />
        )}
      </div>
      <TransactionForm
        isOpen={isAddOpen || editingTx !== null}
        transaction={editingTx}
        onSave={handleSaveTransaction}
        onClose={() => {
          setIsAddOpen(false);
          setEditingTx(null);
        }}
        onDelete={handleDeleteTransaction}
      />
      <TransactionFilter
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        value={filters}
        onApply={(next) => {
          setFilters(next);
          setIsFilterOpen(false);
        }}
      />
    </>
  );
}

export default page;
