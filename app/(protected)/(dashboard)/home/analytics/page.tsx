"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Calendar,
  Check,
  ChevronDown,
  Download,
  FileSpreadsheet,
  FileText,
  LoaderCircle,
  X,
} from "lucide-react";
import AnalysisSummaryCard from "app/components/analysis/AnalysisSummaryCard";
import AnalysisEmpty from "app/components/analysis/AnalysisEmpty";
import AnalysisExportPreview from "app/components/analysis/AnalysisExportPreview";
import { PageHeader } from "app/components/layout";
import CashFlowChart from "app/components/analysis/CashFlowChart";
import CategoryDonut from "app/components/analysis/CategoryDonut";
import GoalsComparison from "app/components/analysis/GoalsComparison";
import SpendingHeatmap from "app/components/analysis/SpendingHeatmap";
import FloatingMenu from "app/components/ui/FloatingMenu";
import {
  getExpensesByCategory,
  getGoalShares,
  getSpendingHeat,
  getTransactionSummary,
} from "app/utils/analysis-data";
import { formatAOA } from "app/utils/format-AOA";
import { buildAnalysisReport } from "app/utils/analysis-report";
import { analyticsCsv, flowPoints, wealthPoints, type CsvAnalytics } from "app/utils/analysis-csv";
import type { WorkbookMovement } from "app/utils/analysis-workbook";
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

const PERIOD_OPTIONS = [
  "Todo período",
  "Este mês",
  "Mês passado",
  "Este ano",
  "Personalizado",
] as const;
type AnalysisPeriod = "all" | "month" | "last-month" | "year" | "custom";
const PERIOD_BY_LABEL: Record<(typeof PERIOD_OPTIONS)[number], AnalysisPeriod> = {
  "Todo período": "all",
  "Este mês": "month",
  "Mês passado": "last-month",
  "Este ano": "year",
  Personalizado: "custom",
};
const PERIOD_LABEL: Record<AnalysisPeriod, (typeof PERIOD_OPTIONS)[number]> = {
  all: "Todo período",
  month: "Este mês",
  "last-month": "Mês passado",
  year: "Este ano",
  custom: "Personalizado",
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

/** Primeiros 10 chars (YYYY-MM-DD) para comparar com o intervalo. */
function dateKeyOf(raw: string | undefined): string {
  return (raw ?? "").slice(0, 10);
}

function dateLabel(value: string) {
  const parsed = new Date(`${value}T12:00:00`);
  if (!Number.isFinite(parsed.getTime())) return value;
  return new Intl.DateTimeFormat("pt-AO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

function resolveRange(
  transactions: TransactionDTO[],
  period: AnalysisPeriod,
  now: Date,
  custom: { start: string; end: string },
): { start: string; end: string } {
  const todayKey = toDateKey(now);
  if (period === "custom") {
    return {
      start: custom.start,
      end: custom.end <= todayKey ? custom.end : todayKey,
    };
  }
  if (period === "month") return { start: todayKey.slice(0, 7) + "-01", end: todayKey };
  if (period === "last-month") {
    const first = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const year = first.getFullYear();
    const month = String(first.getMonth() + 1).padStart(2, "0");
    const lastDay = new Date(year, first.getMonth() + 1, 0).getDate();
    return {
      start: `${year}-${month}-01`,
      end: `${year}-${month}-${String(lastDay).padStart(2, "0")}`,
    };
  }
  if (period === "year") return { start: `${now.getFullYear()}-01-01`, end: todayKey };
  const dates = transactions
    .map((tx) => dateKeyOf(tx.date))
    .filter((key) => /^\d{4}-\d{2}-\d{2}$/.test(key) && key <= todayKey)
    .sort();
  return { start: dates[0] ?? `${now.getFullYear()}-01-01`, end: todayKey };
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

function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  return url;
}

function PeriodControl({
  period,
  onSelect,
  draft,
  onDraft,
  onApplyCustom,
  validCustom,
  todayKey,
  compact = false,
  menuAlign,
}: {
  period: AnalysisPeriod;
  onSelect: (period: AnalysisPeriod) => void;
  draft: { start: string; end: string };
  onDraft: (draft: { start: string; end: string }) => void;
  onApplyCustom: () => void;
  validCustom: boolean;
  todayKey: string;
  compact?: boolean;
  menuAlign?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);
  return (
    <div className="relative">
      <button
        type="button"
        ref={anchorRef}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label="Selecionar período"
        className={
          compact
            ? "flex h-12 w-auto min-w-0 max-w-full flex-none items-center justify-center gap-2 rounded-xl border border-(--border-button) bg-(--background) px-4"
            : "flex h-12 w-auto min-w-48 items-center justify-center gap-3 rounded-xl border border-(--border-button) bg-(--background) px-4"
        }
      >
        <Calendar
          className="size-4 shrink-0 text-(--icon)"
          aria-hidden="true"
        />
        <span
          className={
            compact
              ? "flex min-w-0 flex-1 items-center gap-1 truncate font-manrope text-sm font-semibold text-(--text-title)"
              : "flex flex-1 items-center gap-1 whitespace-nowrap font-manrope text-base font-semibold text-(--text-title)"
          }
        >
          {PERIOD_LABEL[period]}
        </span>
        <ChevronDown
          className="size-3.5 shrink-0 text-(--icon)"
          aria-hidden="true"
        />
      </button>
      <FloatingMenu
        isOpen={open}
        anchorRef={anchorRef}
        align={menuAlign ?? (compact ? "left" : "right")}
        matchWidth={false}
        onClose={() => setOpen(false)}
      >
        <div className="flex w-64 flex-col gap-1 rounded-2xl border border-(--card-barras) bg-(--background) p-2 sm:w-72">
          <p className="px-2.5 pb-1 pt-1.5 font-manrope text-sm font-bold text-(--text-title)">
            Período da análise
          </p>
          <ul className="flex flex-col items-stretch gap-1">
            {PERIOD_OPTIONS.map((label) => {
              const value = PERIOD_BY_LABEL[label];
              const isActive = value === period;
              return (
                <li key={label} className="flex flex-col items-stretch">
                  <button
                    type="button"
                    onClick={() => {
                      if (value === "custom") {
                        onDraft(draft);
                        setCustomOpen(true);
                      } else {
                        onSelect(value);
                        setOpen(false);
                        setCustomOpen(false);
                      }
                    }}
                    className={`flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left transition-colors duration-150 hover:bg-(--bg-filter) ${
                      isActive ? "bg-primary-300/10" : ""
                    }`}
                  >
                    <span
                      className={`truncate font-manrope text-sm font-semibold leading-5 ${
                        isActive ? "text-primary-300" : "text-(--text)"
                      }`}
                    >
                      {label}
                    </span>
                    {isActive && (
                      <Check
                        className="size-4 shrink-0 text-primary-300"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
          {customOpen && (
            <form
              className="flex flex-col gap-2 border-t border-(--card-barras) p-2.5"
              onSubmit={(event) => {
                event.preventDefault();
                if (!validCustom) return;
                onApplyCustom();
                setOpen(false);
                setCustomOpen(false);
              }}
            >
              <label className="flex flex-col gap-1 font-manrope text-sm font-semibold text-(--text-title)">
                De
                <input
                  type="date"
                  required
                  min="0001-01-01"
                  max={draft.end || todayKey}
                  value={draft.start}
                  onChange={(event) =>
                    onDraft({ ...draft, start: event.target.value })
                  }
                  className="h-10 rounded-lg border border-(--border-button) bg-(--background) px-2.5 font-manrope text-sm font-normal"
                />
              </label>
              <label className="flex flex-col gap-1 font-manrope text-sm font-semibold text-(--text-title)">
                Até
                <input
                  type="date"
                  required
                  min={draft.start}
                  max={todayKey}
                  value={draft.end}
                  onChange={(event) =>
                    onDraft({ ...draft, end: event.target.value })
                  }
                  className="h-10 rounded-lg border border-(--border-button) bg-(--background) px-2.5 font-manrope text-sm font-normal"
                />
              </label>
              {!validCustom && (
                <p role="status" className="font-manrope text-xs text-danger-300">
                  Escolhe datas válidas até hoje, com o fim após o início.
                </p>
              )}
              <button
                type="submit"
                disabled={!validCustom}
                className="mt-1 rounded-xl bg-primary-300 px-4 py-2 font-manrope text-sm font-semibold text-base-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                Aplicar período
              </button>
            </form>
          )}
        </div>
      </FloatingMenu>
    </div>
  );
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
  const [exportOpen, setExportOpen] = useState(false);
  const [exportBusy, setExportBusy] = useState(false);
  const [exportReady, setExportReady] = useState<{
    url: string;
    filename: string;
  } | null>(null);

  const now = new Date();
  const todayKey = toDateKey(now);
  const [custom, setCustom] = useState({ start: todayKey.slice(0, 7) + "-01", end: todayKey });
  const [draft, setDraft] = useState(custom);
  const validCustom =
    /^\d{4}-\d{2}-\d{2}$/.test(draft.start) &&
    /^\d{4}-\d{2}-\d{2}$/.test(draft.end) &&
    draft.start <= draft.end &&
    draft.end <= todayKey;

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

  const transactions = useMemo(
    () => (apiTransactions ?? []).map(toAppTransaction),
    [apiTransactions],
  );
  const range = useMemo(
    () => resolveRange(transactions, period, now, custom),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [transactions, period, custom],
  );
  const filtered = useMemo(
    () =>
      transactions.filter((tx) => {
        const key = dateKeyOf(tx.date);
        return key >= range.start && key <= range.end;
      }),
    [transactions, range],
  );
  const rangeCaption = `${dateLabel(range.start)} — ${dateLabel(range.end)}`;

  /* Derivações do período selecionado */
  const summary = useMemo(() => getTransactionSummary(filtered), [filtered]);
  const monthly = useMemo(() => {
    const months: string[] = [];
    const keys: string[] = [];
    for (let k = 11; k >= 0; k--) {
      const date = new Date(now.getFullYear(), now.getMonth() - k, 1);
      keys.push(
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
      );
      months.push(MONTHS_SHORT[date.getMonth()]);
    }
    const income = new Array<number>(12).fill(0);
    const expenses = new Array<number>(12).fill(0);
    for (const tx of filtered) {
      if (!tx.date) continue;
      const date = new Date(tx.date);
      if (!Number.isFinite(date.getTime())) continue;
      const index = keys.indexOf(
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
      );
      if (index < 0) continue;
      if (tx.type === "income") income[index] += tx.amount;
      else expenses[index] += tx.amount;
    }
    return { months, keys, income, expenses };
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
  const fmt = (value: number) => formatAOA(value);

  /* Exportação (diálogo como na wundu) */
  const [exportFormat, setExportFormat] = useState<"csv" | "xlsx">("csv");
  const exportDisabled = filtered.length === 0;

  /** Analítica em cêntimos para o relatório/CSV/Excel, tal como na wundu. */
  const toCents = (value: number) => Math.round(value * 100);
  const csvAnalytics: CsvAnalytics = useMemo(() => {
    const centsTransactions = filtered
      .map((tx) => ({
        id: tx.id,
        date: dateKeyOf(tx.date),
        name: (tx.description ?? tx.title).trim() || tx.category,
        category: tx.category,
        account: "—",
        type: tx.type,
        amount: toCents(tx.amount),
      }))
      .filter((tx) => /^\d{4}-\d{2}-\d{2}$/.test(tx.date))
      .sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
    const income = centsTransactions
      .filter((tx) => tx.type === "income")
      .reduce((total, tx) => total + tx.amount, 0);
    const expenses = centsTransactions
      .filter((tx) => tx.type === "expense")
      .reduce((total, tx) => total + tx.amount, 0);
    const totals = new Map<string, number>();
    for (const tx of centsTransactions) {
      if (tx.type !== "expense") continue;
      totals.set(tx.category, (totals.get(tx.category) ?? 0) + tx.amount);
    }
    const categories = [...totals.entries()]
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount || a.name.localeCompare(b.name, "pt"));
    const weekdays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((label) => ({
      label,
      amount: 0,
      count: 0,
    }));
    for (const tx of centsTransactions) {
      if (tx.type !== "expense") continue;
      const day = (new Date(`${tx.date}T12:00:00Z`).getUTCDay() + 6) % 7;
      weekdays[day].amount += tx.amount;
      weekdays[day].count += 1;
    }
    return {
      transactions: centsTransactions,
      income,
      expenses,
      net: income - expenses,
      wealth: 0,
      flow: flowPoints(centsTransactions, range),
      wealthSeries: wealthPoints(
        transactions.map((tx) => ({
          date: dateKeyOf(tx.date),
          type: tx.type,
          amount: toCents(tx.amount),
        })),
        range,
      ),
      categories,
      accounts: [],
      weekdays,
      goals: appGoals.map((goal, index) => ({
        name: goal.title?.trim() || `Meta ${index + 1}`,
        target: toCents(goal.targetAmount),
        saved: toCents(goal.currentAmount),
        progress:
          goal.targetAmount > 0
            ? Math.min(100, Math.max(0, (goal.currentAmount / goal.targetAmount) * 100))
            : 0,
      })),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered, transactions, appGoals, range]);
  const analysisReport = useMemo(
    () =>
      buildAnalysisReport(
        csvAnalytics.transactions,
        csvAnalytics.categories,
        {
          income: csvAnalytics.income,
          expenses: csvAnalytics.expenses,
          remaining: csvAnalytics.net,
          wealth: csvAnalytics.wealth,
        },
        range,
      ),
    [csvAnalytics, range],
  );
  const workbookMovements: WorkbookMovement[] = useMemo(
    () =>
      csvAnalytics.transactions.map((tx) => ({
        date: tx.date,
        name: tx.name,
        category: tx.category,
        account: "—",
        type: tx.type,
        amount: tx.amount,
        time: "",
        note: "",
      })),
    [csvAnalytics],
  );
  const csvText = useMemo(
    () => analyticsCsv(csvAnalytics, range, analysisReport),
    [csvAnalytics, range, analysisReport],
  );
  useEffect(
    () => () => {
      if (exportReady) URL.revokeObjectURL(exportReady.url);
    },
    [exportReady],
  );
  async function handleExport() {
    if (exportDisabled || exportBusy) return;
    setExportBusy(true);
    setExportReady(null);
    try {
      if (exportReady) URL.revokeObjectURL(exportReady.url);
      const filename = `wundu-analises-${range.start}-${range.end}.${exportFormat}`;
      let url: string;
      if (exportFormat === "xlsx") {
        const { createAnalysisXlsx } = await import("app/utils/analysis-workbook");
        const bytes = await createAnalysisXlsx(analysisReport, workbookMovements);
        url = downloadBlob(
          filename,
          new Blob([new Uint8Array(bytes)], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          }),
        );
      } else {
        url = downloadBlob(
          filename,
          new Blob([csvText], {
            type: "text/csv;charset=utf-8;",
          }),
        );
      }
      setExportReady({ url, filename });
    } finally {
      setExportBusy(false);
    }
  }

  function applyCustom() {
    if (!validCustom) return;
    setCustom({ ...draft });
    setPeriod("custom");
  }

  return (
    <div className="flex h-full flex-col bg-(--bg-card)">
        <div className="hidden shrink-0 lg:block">
          <PageHeader title="Análises">
            <PeriodControl
              period={period}
              onSelect={setPeriod}
              draft={draft}
              onDraft={setDraft}
              onApplyCustom={applyCustom}
              validCustom={validCustom}
              todayKey={todayKey}
            />
            <button
              type="button"
              onClick={() => {
                setExportReady(null);
                setExportOpen(true);
              }}
              disabled={exportDisabled}
              title="Configurar exportação"
              className="flex h-12 w-32 items-center justify-center gap-2 rounded-xl border border-(--border-button) bg-(--background) px-4 transition-colors hover:border-primary-300 disabled:cursor-not-allowed disabled:opacity-50"
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
                      className={`flex items-center justify-center gap-2 px-4 pb-3 pt-4 text-center font-manrope text-base ${
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
        <div className="shrink-0 lg:hidden">
          <div className="flex items-center justify-between gap-2 px-6 pb-3 pt-3">
            <div className="flex min-w-0 items-center gap-2">
              <PeriodControl
                period={period}
                onSelect={setPeriod}
                draft={draft}
                onDraft={setDraft}
                onApplyCustom={applyCustom}
                validCustom={validCustom}
                todayKey={todayKey}
                compact
              />
            </div>
            <button
              type="button"
              onClick={() => {
                setExportReady(null);
                setExportOpen(true);
              }}
              disabled={exportDisabled}
              title="Configurar exportação"
              className="flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl border border-(--border-button) bg-(--background) px-4 transition-colors hover:border-primary-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download
                width={16}
                height={16}
                className="shrink-0 text-(--icon)"
                aria-hidden="true"
              />
              <span className="whitespace-nowrap font-manrope text-sm font-semibold text-(--text-title)">
                Exportar
              </span>
            </button>
          </div>
          <section
            aria-label="Navegação das análises"
            className="flex flex-col items-stretch justify-center gap-0 self-stretch border-b border-(--card-barras) bg-(--bg-card) px-6"
          >
            <nav
              aria-label="Secções de análises"
              className="flex items-start justify-start overflow-x-auto overscroll-x-contain"
            >
              {TABS.map((tab) => {
                const isActive = tab === activeTab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => selectTab(tab)}
                    aria-current={isActive ? "page" : undefined}
                    className="flex shrink-0 flex-col items-center justify-center"
                  >
                    <span
                      className={`flex items-center justify-center gap-2 whitespace-nowrap px-3 pb-2.5 pt-3 text-center font-manrope text-sm ${
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
        <main className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain bg-(--bg-card) px-6 pb-8 pt-2 lg:p-8">
          <div
            className="flex items-center justify-between gap-3 font-manrope text-xs text-(--text-description) sm:text-sm"
            aria-live="polite"
          >
            <span>{rangeCaption}</span>
            {isLoading ? (
              <span role="status">A carregar os teus dados…</span>
            ) : (
              <span>
                {filtered.length}{" "}
                {filtered.length === 1 ? "movimento" : "movimentos"}
              </span>
            )}
          </div>
          {isLoading ? (
            <section aria-label="A carregar análises" className="grid grid-cols-1 content-start items-start gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[0, 1, 2, 3].map((index) => (
                <div
                  key={index}
                  aria-hidden="true"
                  className="h-44 shrink-0 animate-pulse rounded-xl bg-(--bg-filter)"
                />
              ))}
              <span className="sr-only">A carregar análises…</span>
            </section>
          ) : loadError ? (
            <section aria-label="Erro" className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
              <p className="font-manrope text-base font-semibold text-(--text-title)">
                Não foi possível carregar as análises.
              </p>
              <p className="font-manrope text-sm text-(--text-description)">
                {loadError}
              </p>
              <button
                type="button"
                onClick={() => {
                  void getAllNotPaginated();
                  refreshGoals();
                }}
                className="mt-1 rounded-xl bg-primary-300 px-4 py-2 font-manrope text-sm font-semibold text-base-white transition-opacity hover:opacity-90"
              >
                Tentar novamente
              </button>
            </section>
          ) : (
          <>
          {shownTab === "Visão geral" && (
          <section
            aria-label="Resumo do período"
            className={`grid grid-cols-2 content-start items-start gap-3 transition-all duration-200 ease-out sm:gap-4 lg:grid xl:grid-cols-4 ${fadeCls}`}
          >
            <AnalysisSummaryCard
            title="Total de Entradas"
            value={fmt(summary.income)}
            color="green"
            icon="down"
            chartData={monthly.income}
            className="min-w-0! max-w-none!"
          />
          <AnalysisSummaryCard
            title="Total de Gastos"
            value={fmt(summary.expenses)}
            color="red"
            icon="down"
            chartData={monthly.expenses}
            className="min-w-0! max-w-none!"
          />
          <AnalysisSummaryCard
            title="Saldo do período"
            value={fmt(summary.balance)}
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
            <CategoryDonut data={categories} />
            <AnalysisEmpty
              title="Distribuição das contas"
              description="De onde vem o teu dinheiro."
              message="Nenhuma conta ligada. Liga uma conta para veres a distribuição."
            />
            <SpendingHeatmap heat={heat.heat} values={heat.values} />
            <GoalsComparison shares={goalShares} />
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
            {shownTab === "Categorias" && <CategoryDonut data={categories} />}
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
            {shownTab === "Metas" && <GoalsComparison shares={goalShares} />}
          </section>
          )}
          </>
          )}
        </main>
        {exportOpen && (
          <div
            className="fixed inset-0 z-80 flex items-end justify-center bg-black/50 p-4 sm:items-center"
            role="dialog"
            aria-modal="true"
            aria-label="Exportar análises"
            onClick={() => {
              if (!exportBusy) setExportOpen(false);
            }}
          >
            <div
              className="flex max-h-[90dvh] w-full max-w-4xl flex-col gap-4 overflow-y-auto rounded-2xl border border-(--card-barras) bg-(--background) p-5 sm:p-6"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-manrope text-xl font-bold text-(--text-title)">
                    Exportar análises
                  </h2>
                  <p className="mt-1 font-manrope text-sm text-(--text-description)">
                    Resumo financeiro e blocos de orçamento organizados como a tua folha de controlo.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (!exportBusy) setExportOpen(false);
                  }}
                  aria-label="Fechar exportação"
                  className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-(--border-button)"
                >
                  <X width={16} height={16} aria-hidden="true" />
                </button>
              </div>
              <div
                role="radiogroup"
                aria-label="Formato do relatório"
                className="grid grid-cols-1 gap-2 sm:grid-cols-2"
              >
                <button
                  type="button"
                  role="radio"
                  aria-checked={exportFormat === "csv"}
                  disabled={exportBusy}
                  onClick={() => {
                    setExportFormat("csv");
                    setExportReady(null);
                  }}
                  className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition-colors ${
                    exportFormat === "csv"
                      ? "border-primary-300 bg-primary-300/10"
                      : "border-(--card-barras)"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-(--background)"
                  >
                    <FileText width={22} height={22} className="text-primary-300" />
                  </span>
                  <span className="font-manrope text-base font-semibold text-(--text-title)">
                    CSV
                    <small className="block font-manrope text-xs font-normal text-(--text-description)">
                      Dados organizados em colunas
                    </small>
                  </span>
                  <span
                    aria-hidden="true"
                    className={`ml-auto size-4 shrink-0 rounded-full border ${
                      exportFormat === "csv"
                        ? "border-[5px] border-primary-300"
                        : "border-(--card-barras)"
                    }`}
                  />
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={exportFormat === "xlsx"}
                  disabled={exportBusy}
                  onClick={() => {
                    setExportFormat("xlsx");
                    setExportReady(null);
                  }}
                  className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition-colors ${
                    exportFormat === "xlsx"
                      ? "border-primary-300 bg-primary-300/10"
                      : "border-(--card-barras)"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-(--background)"
                  >
                    <FileSpreadsheet width={22} height={22} className="text-primary-300" />
                  </span>
                  <span className="font-manrope text-base font-semibold text-(--text-title)">
                    Excel (.xlsx)
                    <small className="block font-manrope text-xs font-normal text-(--text-description)">
                      Cores, gráficos, bordas e fórmulas
                    </small>
                  </span>
                  <span
                    aria-hidden="true"
                    className={`ml-auto size-4 shrink-0 rounded-full border ${
                      exportFormat === "xlsx"
                        ? "border-[5px] border-primary-300"
                        : "border-(--card-barras)"
                    }`}
                  />
                </button>
              </div>
              <p className="font-manrope text-xs leading-6 text-(--text-description)">
                {exportFormat === "csv"
                  ? "O CSV mantém os blocos lado a lado, mas não guarda cores, gráficos ou bordas. Para o aspecto completo abaixo, escolhe Excel."
                  : "O Excel inclui gráficos editáveis ligados às células, fórmulas automáticas e os movimentos detalhados numa segunda folha."}
              </p>
              <AnalysisExportPreview report={analysisReport} format={exportFormat} csv={csvText} />
              <p className="font-manrope text-xs leading-6 text-(--text-description)">
                Orçamentos por categoria: {analysisReport.months}{" "}
                {analysisReport.months === 1 ? "mês incluído" : "meses incluídos"}.
                Meses parciais usam o orçamento mensal completo. Campos sem orçamento
                ficam em branco no ficheiro.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {exportReady ? (
                  <a
                    href={exportReady.url}
                    download={exportReady.filename}
                    className="flex items-center gap-2 font-manrope text-sm font-semibold text-primary-300"
                  >
                    <Download width={16} height={16} aria-hidden="true" />
                    Descarregar novamente
                  </a>
                ) : (
                  <span className="font-manrope text-xs text-(--text-description)">
                    {filtered.length} {filtered.length === 1 ? "movimento" : "movimentos"} · valores em Kz
                  </span>
                )}
                <button
                  type="button"
                  disabled={exportBusy || exportDisabled}
                  onClick={handleExport}
                  className="flex items-center justify-center gap-2 rounded-xl bg-primary-300 px-4 py-2.5 font-manrope text-sm font-semibold text-base-white transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {exportBusy ? (
                    <LoaderCircle width={18} height={18} className="animate-spin" aria-hidden="true" />
                  ) : (
                    <Download width={18} height={18} aria-hidden="true" />
                  )}
                  {exportBusy
                    ? "A preparar…"
                    : exportFormat === "csv"
                      ? "Exportar CSV"
                      : "Exportar Excel"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
  );
}

export default page;
