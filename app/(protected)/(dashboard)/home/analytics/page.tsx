"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Calendar, ChevronDown, Download, Plus } from "lucide-react";
import AnalysisSummaryCard from "app/components/analysis/AnalysisSummaryCard";
import AnalysisCarousel from "app/components/analysis/AnalysisCarousel";
import AnalysisEmpty from "app/components/analysis/AnalysisEmpty";
import { PageHeader } from "app/components/layout";
import CashFlowChart from "app/components/analysis/CashFlowChart";
import CategoryDonut from "app/components/analysis/CategoryDonut";
import GoalsComparison from "app/components/analysis/GoalsComparison";
import SpendingHeatmap from "app/components/analysis/SpendingHeatmap";
import DropmenuSelect from "app/components/transaction/DropmenuSelect";
import FloatingMenu from "app/components/ui/FloatingMenu";
import {
  getExpensesByCategory,
  getGoalShares,
  getSpendingHeat,
  getTransactionSummary,
} from "app/utils/analysis-data";
import { formatAOA } from "app/utils/format-AOA";
import { getCategory, toAppTransaction } from "app/utils/transaction-map";
import { useGoal } from "@/hooks/use-goal";
import { useTransaction } from "@/hooks/use-transaction";
import type { Goal } from "@/types/dtos/goal.dto";
import type { GoalDTO } from "app/types/dto/goal.dto";
import type { TransactionDTO } from "app/types/dto/transaction.dto";

const TABS = [
  "Visão geral",
  "Fluxo Financeiro",
  "Património",
  "Categorias",
  "Contas",
  "Mapa",
  "Metas",
] as const;

type AnalysisTab = (typeof TABS)[number];

const PERIOD_OPTIONS = ["Todo período", "Últimos 12 meses", "Este ano"] as const;
type AnalysisPeriod = "all" | "12m" | "year";
const PERIOD_BY_LABEL: Record<(typeof PERIOD_OPTIONS)[number], AnalysisPeriod> = {
  "Todo período": "all",
  "Últimos 12 meses": "12m",
  "Este ano": "year",
};
const PERIOD_LABEL: Record<AnalysisPeriod, (typeof PERIOD_OPTIONS)[number]> = {
  all: "Todo período",
  "12m": "Últimos 12 meses",
  year: "Este ano",
};

const MONTHS_SHORT = [
  "JAN", "FEV", "MAR", "ABR", "MAI", "JUN",
  "JUL", "AGO", "SET", "OUT", "NOV", "DEZ",
];

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function inPeriod(dateStr: string | undefined, period: AnalysisPeriod, now: Date): boolean {
  if (period === "all") return true;
  if (!dateStr) return false;
  const time = new Date(dateStr).getTime();
  if (!Number.isFinite(time)) return false;
  if (period === "year") {
    return time >= new Date(now.getFullYear(), 0, 1).getTime();
  }
  return time >= new Date(now.getFullYear(), now.getMonth() - 11, 1).getTime();
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

function exportTransactionsCSV(transactions: TransactionDTO[]) {
  const header = "data;tipo;categoria;descrição;valor (Kz)";
  const lines = transactions.map((tx) =>
    [
      tx.date,
      tx.type === "income" ? "Entrada" : "Saída",
      tx.category,
      (tx.description ?? tx.title).replace(/[\r\n;]+/g, " ").trim(),
      String(tx.amount).replace(".", ","),
    ].join(";"),
  );
  const blob = new Blob(["\ufeff" + [header, ...lines].join("\n")], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `transacoes-${toDateKey(new Date())}.csv`;
  anchor.click();
  URL.revokeObjectURL(url);
}

function page() {
  const [activeTab, setActiveTab] = useState<AnalysisTab>("Visão geral");
  /* Conteúdo visível (atrasado 160ms para o fade-out antes da troca) */
  const [shownTab, setShownTab] = useState<AnalysisTab>("Visão geral");
  const [switching, setSwitching] = useState(false);
  const switchTimer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (switchTimer.current !== null)
        window.clearTimeout(switchTimer.current);
    },
    [],
  );

  const selectTab = (tab: AnalysisTab) => {
    setActiveTab(tab);
    if (tab === shownTab) return;
    if (switchTimer.current !== null)
      window.clearTimeout(switchTimer.current);
    setSwitching(true);
    switchTimer.current = window.setTimeout(() => {
      setShownTab(tab);
      setSwitching(false);
    }, 160);
  };

  const fadeCls = switching
    ? "pointer-events-none -translate-y-1 opacity-0"
    : "translate-y-0 opacity-100";

  const [period, setPeriod] = useState<AnalysisPeriod>("all");
  const [periodOpen, setPeriodOpen] = useState(false);
  const periodAnchorRef = useRef<HTMLButtonElement>(null);

  const {
    notPaginated: apiTransactions,
    isLoadingAll,
    error: transactionsError,
    getAllNotPaginated,
  } = useTransaction();
  const {
    goals: apiGoals,
    isLoading: goalsLoading,
    error: goalsError,
    refreshGoals,
  } = useGoal();

  useEffect(() => {
    void getAllNotPaginated();
  }, [getAllNotPaginated]);

  const now = new Date();
  const transactions = useMemo(
    () => (apiTransactions ?? []).map(toAppTransaction),
    [apiTransactions],
  );
  const filtered = useMemo(
    () => transactions.filter((tx) => inPeriod(tx.date, period, now)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [transactions, period],
  );

  /* Derivações do período selecionado */
  const summary = useMemo(() => getTransactionSummary(filtered), [filtered]);
  const monthly = useMemo(() => {
    const months: string[] = [];
    const keys: string[] = [];
    for (let k = 11; k >= 0; k--) {
      const date = new Date(now.getFullYear(), now.getMonth() - k, 1);
      keys.push(`${date.getFullYear()}-${date.getMonth()}`);
      months.push(MONTHS_SHORT[date.getMonth()]);
    }
    const income = new Array<number>(12).fill(0);
    const expenses = new Array<number>(12).fill(0);
    for (const tx of filtered) {
      if (!tx.date) continue;
      const date = new Date(tx.date);
      if (!Number.isFinite(date.getTime())) continue;
      const index = keys.indexOf(`${date.getFullYear()}-${date.getMonth()}`);
      if (index < 0) continue;
      if (tx.type === "income") income[index] += tx.amount;
      else expenses[index] += tx.amount;
    }
    return { months, income, expenses };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered]);
  const monthlyNet = useMemo(
    () => monthly.income.map((value, i) => value - monthly.expenses[i]),
    [monthly],
  );
  const categories = useMemo(
    () => getExpensesByCategory(filtered),
    [filtered],
  );
  const heat = useMemo(() => getSpendingHeat(filtered), [filtered]);
  const appGoals = useMemo(() => apiGoals.map(toAppGoal), [apiGoals]);
  const goalShares = useMemo(() => getGoalShares(appGoals), [appGoals]);

  const isLoading =
    (isLoadingAll || goalsLoading) &&
    transactions.length === 0 &&
    appGoals.length === 0;
  const loadError =
    transactions.length === 0 && appGoals.length === 0
      ? (transactionsError ?? goalsError)
      : null;

  return (
    <div className="flex h-full flex-col bg-(--background-variant) lg:bg-(--bg-card)">
        <div className="hidden shrink-0 lg:block">
          <PageHeader title="Análises">
            <div className="relative">
              <button
                type="button"
                ref={periodAnchorRef}
                onClick={() => setPeriodOpen((value) => !value)}
                aria-expanded={periodOpen}
                aria-label="Selecionar período"
                className="flex h-12 w-auto min-w-48 items-center justify-center gap-3 rounded-2xl border border-(--border-button) bg-(--background) px-4 py-2"
              >
                <Calendar
                  className="size-4 shrink-0 text-(--icon)"
                  aria-hidden="true"
                />
                <span className="flex flex-1 items-center gap-1 whitespace-nowrap font-manrope text-base font-semibold text-(--text-title)">
                  {PERIOD_LABEL[period]}
                </span>
                <ChevronDown
                  className="size-3.5 shrink-0 text-(--icon)"
                  aria-hidden="true"
                />
              </button>
              <FloatingMenu
                isOpen={periodOpen}
                anchorRef={periodAnchorRef}
                align="right"
                onClose={() => setPeriodOpen(false)}
              >
                <DropmenuSelect
                  options={[...PERIOD_OPTIONS]}
                  value={PERIOD_LABEL[period]}
                  isOpen={periodOpen}
                  onSelect={(label) => {
                    setPeriod(
                      PERIOD_BY_LABEL[
                        label as (typeof PERIOD_OPTIONS)[number]
                      ] ?? "all",
                    );
                    setPeriodOpen(false);
                  }}
                />
              </FloatingMenu>
            </div>
            <button
              type="button"
              onClick={() => exportTransactionsCSV(filtered)}
              className="flex h-12 w-32 items-center justify-center gap-3 rounded-2xl border border-(--border-button) bg-(--background) px-4 py-2 transition-colors hover:border-primary-300"
            >
              <Download
                className="size-5 shrink-0 text-(--icon)"
                aria-hidden="true"
              />
              <span className="font-manrope text-base font-semibold text-(--text-title)">
                Exportar
              </span>
            </button>
          </PageHeader>
          <section
            aria-label="Navegação das análises"
            className="hidden flex-col items-start justify-center gap-2.5 self-stretch border-b border-(--card-barras) bg-(--bg-card) px-8 py-4 lg:flex"
          >
            <nav
              aria-label="Secções de análises"
              className="flex items-start justify-start"
            >
              {TABS.map((tab) => {
                const isActive = tab === activeTab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => selectTab(tab)}
                    aria-current={isActive ? "page" : undefined}
                    className="flex flex-col items-center justify-center"
                  >
                    <span
                      className={`flex items-center justify-center gap-2 px-4 pb-3.5 pt-4 text-center font-manrope text-base ${
                        isActive
                          ? "font-bold text-(--text-link)"
                          : "font-medium text-(--text-description-button)"
                      }`}
                    >
                      {tab}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`h-0.5 self-stretch ${
                        isActive ? "bg-(--border-blue)" : "bg-transparent"
                      }`}
                    />
                  </button>
                );
              })}
            </nav>
          </section>
        </div>
        <div className="flex items-center justify-between self-stretch bg-(--background) px-6 py-4 lg:hidden">
          <h1 className="font-manrope text-2xl font-bold text-(--text-title)">
            Análises
          </h1>
          <button
            type="button"
            onClick={() => exportTransactionsCSV(filtered)}
            className="flex h-9 items-center justify-center gap-2 rounded-xl bg-(--button-bg) px-4"
          >
            <Plus
              width={16}
              height={16}
              className="shrink-0 text-(--button-icon-yellow)"
              aria-hidden="true"
            />
            <span className="font-manrope text-xs font-medium text-(--button-fg)">
              Exportar
            </span>
          </button>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto px-6 pb-3 pt-3 lg:hidden">
          {TABS.map((tab) => {
            const isActive = tab === activeTab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => selectTab(tab)}
                aria-current={isActive ? "page" : undefined}
                className={`shrink-0 rounded-2xl px-3.5 py-2 font-manrope text-sm ${
                  isActive
                    ? "bg-primary-300 font-bold text-white"
                    : "bg-(--background-variant) font-semibold text-(--text-title)"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
        <main className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain bg-(--background-variant) px-6 pb-8 pt-2 lg:bg-(--bg-card) lg:p-8">
          {isLoading ? (
            <section aria-label="A carregar análises" className="grid grid-cols-1 content-start items-start gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[0, 1, 2, 3].map((index) => (
                <div
                  key={index}
                  aria-hidden="true"
                  className="h-69 shrink-0 animate-pulse rounded-3xl bg-(--bg-filter)"
                />
              ))}
              <span className="sr-only">A carregar análises…</span>
            </section>
          ) : loadError ? (
            <section aria-label="Erro" className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
              <p className="font-manrope text-[16px] font-semibold text-(--text-title)">
                Não foi possível carregar as análises.
              </p>
              <p className="font-manrope text-[14px] text-(--text-description)">
                {loadError}
              </p>
              <button
                type="button"
                onClick={() => {
                  void getAllNotPaginated();
                  refreshGoals();
                }}
                className="mt-1 rounded-xl bg-primary-300 px-4 py-2 font-manrope text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                Tentar novamente
              </button>
            </section>
          ) : (
          <>
          {shownTab === "Visão geral" && (
          <AnalysisCarousel label="Resumo do período" className="lg:hidden">
            <AnalysisSummaryCard
              title="Total de Entradas"
              value={formatAOA(summary.income)}
              color="green"
              icon="down"
              chartData={monthly.income}
              className="min-w-0! max-w-none!"
            />
            <AnalysisSummaryCard
              title="Total de Gastos"
              value={formatAOA(summary.expenses)}
              color="red"
              icon="down"
              chartData={monthly.expenses}
              className="min-w-0! max-w-none!"
            />
            <AnalysisSummaryCard
              title="Saldo do período"
              value={formatAOA(summary.balance)}
              color="yellow"
              icon="equals"
              chartData={monthlyNet}
              className="min-w-0! max-w-none!"
            />
            <AnalysisSummaryCard
              title="Património Total"
              value="—"
              color="blue"
              icon="wallet"
              chartData={[]}
              className="min-w-0! max-w-none!"
            />
          </AnalysisCarousel>
          )}
          {shownTab === "Visão geral" && (
          <section
            aria-label="Resumo do período"
            className={`hidden grid-cols-1 content-start items-start gap-4 transition-all duration-200 ease-out sm:grid-cols-2 lg:grid xl:grid-cols-4 ${fadeCls}`}
          >
            <AnalysisSummaryCard
            title="Total de Entradas"
            value={formatAOA(summary.income)}
            color="green"
            icon="down"
            chartData={monthly.income}
            className="min-w-0! max-w-none!"
          />
          <AnalysisSummaryCard
            title="Total de Gastos"
            value={formatAOA(summary.expenses)}
            color="red"
            icon="down"
            chartData={monthly.expenses}
            className="min-w-0! max-w-none!"
          />
          <AnalysisSummaryCard
            title="Saldo do período"
            value={formatAOA(summary.balance)}
            color="yellow"
            icon="equals"
            chartData={monthlyNet}
            className="min-w-0! max-w-none!"
          />
          <AnalysisSummaryCard
            title="Património Total"
            value="—"
            color="blue"
            icon="wallet"
            chartData={[]}
            className="min-w-0! max-w-none!"
          />
          </section>
          )}
          {shownTab === "Visão geral" ? (
          <section
            aria-label="Gráficos"
            className={`grid grid-cols-1 content-start items-stretch gap-4 transition-all duration-200 ease-out xl:grid-cols-2 ${fadeCls}`}
          >
            <CashFlowChart
              months={monthly.months}
              income={monthly.income}
              expenses={monthly.expenses}
            />
            <AnalysisEmpty
              title="Evolução do património"
              description="Património ao longo do tempo."
              message="Sem histórico de património. Os saldos das contas ainda não estão ligados."
            />
            <div className="hidden lg:contents">
              <CategoryDonut data={categories} />
            </div>
            <div className="hidden lg:contents">
              <AnalysisEmpty
                title="Distribuição das contas"
                description="De onde vem o teu dinheiro."
                message="Nenhuma conta ligada. Liga uma conta para veres a distribuição."
              />
            </div>
            <div className="hidden lg:contents">
              <SpendingHeatmap heat={heat.heat} values={heat.values} />
            </div>
            <div className="hidden lg:contents">
              <GoalsComparison shares={goalShares} />
            </div>
          </section>
          ) : (
          <section
            aria-label={shownTab}
            className={`grid grid-cols-1 content-start items-stretch gap-4 transition-all duration-200 ease-out ${fadeCls}`}
          >
            {shownTab === "Fluxo Financeiro" && (
              <CashFlowChart
                months={monthly.months}
                income={monthly.income}
                expenses={monthly.expenses}
              />
            )}
            {shownTab === "Património" && (
              <AnalysisEmpty
                title="Evolução do património"
                description="Património ao longo do tempo."
                message="Sem histórico de património. Os saldos das contas ainda não estão ligados."
              />
            )}
            {shownTab === "Categorias" && (
              <CategoryDonut data={categories} />
            )}
            {shownTab === "Contas" && (
              <AnalysisEmpty
                title="Distribuição das contas"
                description="De onde vem o teu dinheiro."
                message="Nenhuma conta ligada. Liga uma conta para veres a distribuição."
              />
            )}
            {shownTab === "Mapa" && (
              <SpendingHeatmap heat={heat.heat} values={heat.values} />
            )}
            {shownTab === "Metas" && (
              <GoalsComparison shares={goalShares} />
            )}
          </section>
          )}
          </>
          )}
        </main>
      </div>
  );
}

export default page;
