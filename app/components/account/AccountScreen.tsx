"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { Lock, PlusIcon, SearchIcon } from "lucide-react";
import AccountForm, { type AccountFormMode } from "./AccountForm";
import AccountList from "./AccountList";
import CategoryFilter, {
  emptyCategoryFilters,
  type CategoryFilterValue,
} from "./CategoryFilter";
import CategoryForm, {
  type CategoryFormMode,
  type CategoryFormValues,
} from "./CategoryForm";
import CategoryList from "./CategoryList";
import TransactionPagination from "app/components/transaction/TransactionPagination";
import { mockAccounts, type AccountDTO } from "../mock/account";
import type { CategoryBadge, CategoryDTO } from "../mock/category";
import { getCategory } from "app/utils/transaction-map";
import { useCategory } from "@/hooks/use-category";
import { useLimit } from "@/hooks/use-limit";
import { useTransaction } from "@/hooks/use-transaction";
import { useUserStore } from "@/store/user-store";

const MAX_SEARCH_LENGTH = 100;
const CATEGORY_PAGE_SIZE = 8;

export type AccountTab = "Contas" | "Categorias";

const TABS: AccountTab[] = ["Contas", "Categorias"];

const ACCOUNTS_HREF = "/home/accounts";
const CATEGORIES_HREF = "/home/categories";

type AccountScreenProps = {
  /** Tab inicial quando a rota não a define (ex.: rota fora de /home). */
  initialTab?: AccountTab;
};

/**
 * Ecrã de Contas + Categorias.
 *
 * Fonte única de verdade para a tab activa é o URL:
 * - `/home/accounts` → tab "Contas" (sidebar "Contas" activa via Menu)
 * - `/home/categories` → tab "Categorias" (sidebar "Categorias" activa via Menu)
 * - fora dessas rotas as tabs alternam em estado local.
 */
function AccountScreen({ initialTab = "Contas" }: AccountScreenProps) {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const routeTab: AccountTab | null = pathname.startsWith(CATEGORIES_HREF)
    ? "Categorias"
    : pathname.startsWith(ACCOUNTS_HREF)
      ? "Contas"
      : null;

  const [localTab, setLocalTab] = useState<AccountTab>(initialTab);
  const activeTab = routeTab ?? localTab;

  const selectTab = (tab: AccountTab) => {
    if (tab === activeTab) return;
    if (routeTab) {
      const nextPath = tab === "Contas" ? ACCOUNTS_HREF : CATEGORIES_HREF;
      window.history.pushState(null, "", nextPath);
    } else {
      setLocalTab(tab);
    }
  };

  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<Set<string>>(
    new Set(),
  );
  const [isCategoryFilterOpen, setIsCategoryFilterOpen] = useState(false);
  const [categoryFilters, setCategoryFilters] =
    useState<CategoryFilterValue>(emptyCategoryFilters);
  const [accounts, setAccounts] = useState<AccountDTO[]>(mockAccounts);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<AccountFormMode>("create");
  const [editingAccount, setEditingAccount] = useState<AccountDTO | null>(null);
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [categoryFormMode, setCategoryFormMode] =
    useState<CategoryFormMode>("create");
  const [editingCategory, setEditingCategory] = useState<CategoryDTO | null>(
    null,
  );
  const [categoryPage, setCategoryPage] = useState(1);
  const remaining = MAX_SEARCH_LENGTH - query.length;

  const {
    categories: apiCategories,
    isLoading: isCategoriesLoading,
    error: categoriesError,
    getCategories,
    createCategory,
    updateCategory,
    removeCategory,
  } = useCategory();
  const userRole = useUserStore((s) => s.user?.role);
  const canManageCategories = userRole === "ADMIN";
  const { notPaginated: apiTransactions, getAllNotPaginated } =
    useTransaction();
  const { limits, fetchMultipleLimits, defineLimit } = useLimit();

  async function handleSaveCategory(
    values: CategoryFormValues,
    editing: CategoryDTO | null,
  ): Promise<boolean> {
    if (!editing) {
      const created = await createCategory({
        name: values.name,
        flow: values.flow,
      });
      if (!created) return false;
      if (values.limit != null) {
        return defineLimit({
          categoryId: created.id,
          monthlyLimit: values.limit,
        });
      }
      return true;
    }
    let ok = true;
    if (
      canManageCategories &&
      (values.name !== editing.name || values.flow !== editing.flow)
    ) {
      ok =
        (await updateCategory(editing.id, {
          name: values.name,
          flow: values.flow,
        })) && ok;
    }
    if (values.limit !== (editing.limit ?? null) && values.limit != null) {
      ok =
        (await defineLimit({
          categoryId: editing.id,
          monthlyLimit: values.limit,
        })) && ok;
    }
    return ok;
  }

  async function handleDeleteCategory(id: string): Promise<boolean> {
    return removeCategory(id);
  }

  const openCategoryForm = (
    mode: CategoryFormMode,
    category: CategoryDTO | null,
  ) => {
    setCategoryFormMode(mode);
    setEditingCategory(category);
    setIsCategoryFormOpen(true);
  };

  const closeCategoryForm = () => {
    setIsCategoryFormOpen(false);
    setEditingCategory(null);
  };

  useEffect(() => {
    void getAllNotPaginated();
  }, [getAllNotPaginated]);

  useEffect(() => {
    if (!apiCategories) return;
    fetchMultipleLimits(apiCategories.map((api) => api.id));
  }, [apiCategories, fetchMultipleLimits]);

  useEffect(() => {
    setCategoryPage(1);
  }, [query, activeTab, categoryFilters]);

  /** Estatísticas reais por categoria (a partir das transações). */
  const statsByCategory = useMemo(() => {
    const stats = new Map<string, { count: number; total: number }>();
    for (const tx of apiTransactions ?? []) {
      const key = tx.category?.name?.trim().toLocaleLowerCase();
      if (!key) continue;
      const entry = stats.get(key) ?? { count: 0, total: 0 };
      entry.count += 1;
      entry.total += tx.amount;
      stats.set(key, entry);
    }
    return stats;
  }, [apiTransactions]);

  const categories = useMemo<CategoryDTO[]>(
    () =>
      (apiCategories ?? []).map((api) => {
        const stats = statsByCategory.get(
          api.name.trim().toLocaleLowerCase(),
        ) ?? { count: 0, total: 0 };
        return {
          id: api.id,
          name: api.name,
          configKey: getCategory(api.name),
          flow: api.flow,
          transactions: stats.count,
          spent: stats.total,
          limit: limits[api.id]?.monthlyLimit ?? null,
          badge: (api.userId ? "custom" : "system") as CategoryBadge,
        };
      }),
    [apiCategories, statsByCategory, limits],
  );

  const openForm = (mode: AccountFormMode, account: AccountDTO | null) => {
    setFormMode(mode);
    setEditingAccount(account);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingAccount(null);
  };

  const toggleAccount = (account: AccountDTO) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(account.id)) {
        next.delete(account.id);
      } else {
        next.add(account.id);
      }
      return next;
    });
  };

  const toggleCategory = (category: CategoryDTO) => {
    setSelectedCategoryIds((prev) => {
      const next = new Set(prev);
      if (next.has(category.id)) {
        next.delete(category.id);
      } else {
        next.add(category.id);
      }
      return next;
    });
  };

  const normalizedQuery = query.trim().toLowerCase();
  const filteredAccounts = normalizedQuery
    ? accounts.filter((account) =>
        [account.name, account.kind ?? ""].some((field) =>
          field.toLowerCase().includes(normalizedQuery),
        ),
      )
    : accounts;
  const filteredCategories = normalizedQuery
    ? categories.filter((category) =>
        category.name.toLowerCase().includes(normalizedQuery),
      )
    : categories;
  const typeFilteredCategories = categoryFilters.types.length
    ? filteredCategories.filter((category) =>
        categoryFilters.types.includes(category.badge),
      )
    : filteredCategories;
  const sortedCategories = [...typeFilteredCategories].sort((a, b) => {
    if (categoryFilters.sortBy === "transactions") {
      const diff = a.transactions - b.transactions;
      return categoryFilters.sortDir === "desc" ? -diff : diff;
    }
    if (categoryFilters.sortBy === "value") {
      const diff = a.spent - b.spent;
      return categoryFilters.sortDir === "desc" ? -diff : diff;
    }
    const diff = a.name.localeCompare(b.name, "pt");
    return categoryFilters.sortDir === "asc" ? diff : -diff;
  });
  const categoryPageCount = Math.max(
    1,
    Math.ceil(sortedCategories.length / CATEGORY_PAGE_SIZE),
  );
  const safeCategoryPage = Math.min(categoryPage, categoryPageCount);
  const pagedCategories = sortedCategories.slice(
    (safeCategoryPage - 1) * CATEGORY_PAGE_SIZE,
    safeCategoryPage * CATEGORY_PAGE_SIZE,
  );

  const isAccounts = activeTab === "Contas";
  const isLoadingCategories =
    isCategoriesLoading && categories.length === 0;
  const hasActiveCategoryFilters =
    categoryFilters.types.length > 0 ||
    categoryFilters.sortBy !== emptyCategoryFilters.sortBy ||
    categoryFilters.sortDir !== emptyCategoryFilters.sortDir;

  return (
    <div className="flex h-full flex-col">
      <header className="flex shrink-0 items-center justify-between gap-3 self-stretch border-b border-(--card-barras) bg-(--bg-card) px-8 py-4">
        <nav aria-label="Secções de contas">
          <ul className="flex items-start justify-start">
            {TABS.map((tab) => {
              const isActive = tab === activeTab;
              return (
                <li key={tab} className="flex">
                  <button
                    type="button"
                    onClick={() => selectTab(tab)}
                    aria-current={isActive ? "page" : undefined}
                    className="relative flex flex-col items-center justify-center"
                  >
                    <span
                      className={`flex items-center justify-center gap-2 px-4 pt-4 pb-3.5 text-center font-manrope text-base ${
                        isActive
                          ? "font-bold text-(--text-link)"
                          : "font-medium text-(--text-description-button)"
                      }`}
                    >
                      {tab}
                    </span>
                    {isActive && (
                      <motion.span
                        aria-hidden="true"
                        layoutId="account-category-tab-indicator"
                        className="absolute inset-x-0 bottom-0 h-0.5 bg-(--border-blue)"
                        transition={{
                          duration: reduceMotion ? 0 : 0.2,
                          ease: "easeOut",
                        }}
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <section
          aria-label={
            isAccounts ? "Pesquisa e criação de contas" : "Pesquisa e criação de categorias"
          }
          className="flex items-center justify-start gap-3"
        >
          <form
            role="search"
            aria-label={isAccounts ? "Pesquisar conta" : "Pesquisar categoria"}
            onSubmit={(event) => event.preventDefault()}
            className="flex h-12 w-80 items-center justify-start gap-3 rounded-xl border border-(--border-button) bg-(--background) px-4 transition-colors duration-200 hover:border-primary-300 focus-within:border-primary-300"
          >
            <SearchIcon
              width={16}
              height={16}
              aria-hidden="true"
              className="shrink-0 text-(--text-description)"
            />
            <label htmlFor="account-search" className="sr-only">
              {isAccounts ? "Pesquisar conta" : "Consultar categorias"}
            </label>
            <input
              id="account-search"
              type="search"
              value={query}
              maxLength={MAX_SEARCH_LENGTH}
              onChange={(event) =>
                setQuery(event.target.value.slice(0, MAX_SEARCH_LENGTH))
              }
              placeholder={
                isAccounts ? "Pesquisar conta..." : "Consultar categorias..."
              }
              className="min-w-0 flex-1 bg-transparent font-manrope text-sm font-normal leading-5 text-(--text-description) outline-none placeholder:text-(--text-description)/60 focus:outline-none"
            />
            <output
              aria-live="polite"
              className={`font-manrope text-xs font-normal ${
                remaining === 0
                  ? "text-danger-300"
                  : "text-(--text-description)"
              }`}
            >
              {remaining} /
            </output>
          </form>

          {!isAccounts ? (
            <button
              type="button"
              onClick={() => setIsCategoryFilterOpen(true)}
              aria-expanded={isCategoryFilterOpen}
              className={`group flex h-12 w-28 items-center justify-center gap-1.5 rounded-xl border px-4 py-4 shadow-[inset_0px_0px_4px_0px_rgba(0,0,0,0.02)] transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] ${
                isCategoryFilterOpen || hasActiveCategoryFilters
                  ? "border-primary-300 bg-primary-300/10 hover:shadow-[0_4px_12px_rgba(5,61,196,0.15)]"
                  : "border-(--border-button) bg-(--background) hover:border-primary-300 hover:bg-primary-300/10 hover:shadow-[0_4px_12px_rgba(5,61,196,0.15)]"
              }`}
            >
              <span
                className={`text-center font-manrope text-base font-normal transition-colors duration-200 ${
                  isCategoryFilterOpen || hasActiveCategoryFilters
                    ? "text-primary-300"
                    : "text-(--text-title) group-hover:text-primary-300"
                }`}
              >
                Filtrar
              </span>
            </button>
          ) : null}

          <button
            type="button"
            disabled={isAccounts}
            title={isAccounts ? "Disponível em breve" : undefined}
            onClick={
              isAccounts
                ? undefined
                : () => openCategoryForm("create", null)
            }
            className={`group flex h-12 items-center justify-center gap-3 rounded-2xl border border-primary-300 bg-primary-300 px-4 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-primary-400 hover:shadow-[0_4px_14px_rgba(5,61,196,0.35)] active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-none ${
              isAccounts ? "w-44" : "w-48"
            }`}
          >
            <PlusIcon
              width={16}
              height={16}
              aria-hidden="true"
              className="shrink-0 text-base-white transition-transform duration-300 ease-out group-hover:rotate-90"
            />
            <span className="font-inter text-sm font-semibold whitespace-nowrap text-base-white">
              {isAccounts ? "Adicionar conta" : "Adicionar categoria"}
            </span>
          </button>
        </section>
      </header>

      <div className="relative flex min-h-0 flex-1 flex-col bg-(--background)">
      <main
        inert={isAccounts}
        className={`flex min-h-0 flex-1 flex-col overflow-y-auto px-8 py-4 ${
          isAccounts ? "select-none blur-sm pointer-events-none" : ""
        }`}
      >
        <h1 className="sr-only">{activeTab}</h1>
        {isAccounts ? (
          <AccountList
            accounts={filteredAccounts}
            selectedIds={selectedIds}
            onToggle={toggleAccount}
            onSelect={(account) => openForm("edit", account)}
          />
        ) : isLoadingCategories ? (
          <div
            aria-label="A carregar categorias"
            className="flex min-h-0 w-full flex-1 flex-col items-start justify-start gap-2 self-stretch"
          >
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                aria-hidden="true"
                className="h-20 shrink-0 animate-pulse self-stretch rounded-2xl bg-(--bg-filter)"
              />
            ))}
            <span className="sr-only">A carregar categorias…</span>
          </div>
        ) : categoriesError && categories.length === 0 ? (
          <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
            <p className="font-manrope text-[16px] font-semibold text-(--text-title)">
              Não foi possível carregar as categorias.
            </p>
            <p className="font-manrope text-[14px] text-(--text-description)">
              {categoriesError}
            </p>
            <button
              type="button"
              onClick={() => void getCategories()}
              className="mt-1 rounded-xl bg-primary-300 px-4 py-2 font-manrope text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Tentar novamente
            </button>
          </div>
        ) : categories.length === 0 ? (
          <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-center gap-2 p-8 text-center">
            <p className="font-manrope text-[16px] font-semibold text-(--text-title)">
              Sem categorias
            </p>
            <p className="font-manrope text-[14px] text-(--text-description)">
              Crie a primeira categoria com o botão “Adicionar categoria”.
            </p>
          </div>
        ) : (
          <CategoryList
            categories={pagedCategories}
            selectedIds={selectedCategoryIds}
            onToggle={toggleCategory}
            onSelect={(category) => openCategoryForm("edit", category)}
          />
        )}
      </main>
      {!isAccounts && sortedCategories.length > 0 ? (
        <TransactionPagination
          page={safeCategoryPage}
          pageCount={categoryPageCount}
          total={sortedCategories.length}
          pageSize={CATEGORY_PAGE_SIZE}
          onChange={setCategoryPage}
          itemName="categorias"
          navLabel="Paginação de categorias"
        />
      ) : null}
      {isAccounts ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center p-8">
          <div className="flex w-full max-w-md flex-col items-center gap-3 rounded-3xl border border-(--card-barras) bg-(--bg-card) p-8 text-center shadow-[0px_8px_30px_rgba(2,21,69,0.12)]">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-primary-300/10">
              <Lock width={24} height={24} className="text-primary-300" aria-hidden="true" />
            </span>
            <h2 className="font-manrope text-xl font-bold leading-8 text-(--text-title)">
              Contas em breve
            </h2>
            <p className="font-manrope text-sm leading-5 text-(--text-description)">
              Estamos a ligar as tuas contas. Por enquanto, continua a gerir
              as tuas categorias.
            </p>
            <button
              type="button"
              onClick={() => router.push(CATEGORIES_HREF)}
              className="mt-2 rounded-2xl bg-primary-300 px-6 py-3 font-manrope text-base font-bold text-base-white transition-opacity hover:opacity-90 active:opacity-80"
            >
              Ver categorias
            </button>
          </div>
        </div>
      ) : null}
      </div>
      <AccountForm
        isOpen={isFormOpen}
        mode={formMode}
        account={editingAccount}
        onClose={closeForm}
        onBack={closeForm}
        onSave={(saved) => {
          setAccounts((prev) => {
            const exists = prev.some((item) => item.id === saved.id);
            if (exists) {
              return prev.map((item) => (item.id === saved.id ? saved : item));
            }
            return [...prev, saved];
          });
        }}
        onDelete={(target) => {
          setAccounts((prev) => prev.filter((item) => item.id !== target.id));
          setSelectedIds((prev) => {
            const next = new Set(prev);
            next.delete(target.id);
            return next;
          });
        }}
      />
      <CategoryForm
        isOpen={isCategoryFormOpen}
        onClose={() => setIsCategoryFormOpen(false)}
        onBack={() => setIsCategoryFormOpen(false)}
        onSave={handleSaveCategory}
      />
      <CategoryForm
        isOpen={isCategoryFormOpen}
        mode={categoryFormMode}
        category={editingCategory}
        canManage={canManageCategories}
        onClose={closeCategoryForm}
        onBack={closeCategoryForm}
        onSave={handleSaveCategory}
        onDelete={handleDeleteCategory}
      />
      <CategoryFilter
        isOpen={isCategoryFilterOpen}
        onClose={() => setIsCategoryFilterOpen(false)}
        value={categoryFilters}
        onApply={(value) => {
          setCategoryFilters(value);
          setCategoryPage(1);
          setIsCategoryFilterOpen(false);
        }}
      />
    </div>
  );
}

export default AccountScreen;
