"use client";

import { useMemo, useState } from "react";
import CardViews, { type CardTrend } from "app/components/dashboard/CardViews";
import BalanceHero from "app/components/dashboard/BalanceHero";
import MiniStatCard from "app/components/dashboard/MiniStatCard";
import AiNotify from "app/components/dashboard/AiNotify";
import GoalsSection from "app/components/dashboard/GoalsSection";
import TransactionSection from "app/components/dashboard/TransactionSection";
import FlowCard from "app/components/dashboard/FlowCard";
import CategoryCard from "app/components/dashboard/CategoryCard";
import WeeklyCard from "app/components/dashboard/WeeklyCard";
import PageHeader from "app/components/layout/PageHeader";
import { ArrowDown, ArrowUp, Calendar, ChevronLeft, ChevronRight, Equal, Plus, Wallet } from "lucide-react";
import { useBalance } from "@/hooks/use-balance";
import { useGoal } from "@/hooks/use-goal";
import { useTransaction } from "@/hooks/use-transaction";
import { useTransactionAction } from "app/components/layout/TransactionActionProvider";
import type { Goal } from "@/types/dtos/goal.dto";
import type { TransactionDTO as ApiTransaction } from "@/types/dtos/transaction.dto";
import type { GoalDTO } from "app/types/dto/goal.dto";
import { formatAOA } from "app/utils/format-AOA";
import { getCategory, toAppTransaction } from "app/utils/transaction-map";

function toDashboardGoal(goal: Goal): GoalDTO {
  return {
    id: goal.id,
    title: goal.title,
    description: goal.description,
    type: goal.type,
    targetAmount: goal.targetAmount,
    currentAmount: goal.currentAmount,
    startDate: goal.startDate,
    endDate: goal.endDate,
    category: getCategory(goal.categoryName ?? goal.category?.name),
    categoryId: goal.categoryId ?? goal.category?.id ?? "",
  };
}

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function lastDayOfMonth(year: number, monthIndex: number) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

const PT_MONTHS_SHORT = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
] as const;

/**
 * Variação percentual do mês selecionado vs mês anterior.
 * - Entradas/Gastos/Património: ((atual - anterior) / anterior) × 100
 * - Saldo: denominador em módulo (|anterior|) para a direção financeira
 *   ficar correta com saldos negativos (ex. -3,5M → -4,3M é queda, não subida).
 * Null quando não há base de comparação; 0 quando ambos são zero (manteve-se).
 */
function pctChange(
  current: number,
  previous: number,
  useAbsDenominator = false,
) {
  if (!Number.isFinite(current) || !Number.isFinite(previous)) return null;
  if (previous === 0) return current === 0 ? 0 : null;
  const denominator = useAbsDenominator ? Math.abs(previous) : previous;
  return ((current - previous) / denominator) * 100;
}

/** Magnitude da percentagem — a direção vai na seta do badge. */
function formatPct(value: number) {
  const formatted = new Intl.NumberFormat("pt-AO", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(Math.abs(value));
  return `${formatted}%`;
}

/** Direção da variação para a UI: > 0 → up, < 0 → down, = 0 → flat (=). */
function trendOf(value: number): CardTrend {
  if (Math.abs(value) < 0.05) return "flat";
  return value > 0 ? "up" : "down";
}

/**
 * Texto do badge: magnitude da percentagem quando calculável, "—" neutro
 * quando não há base de comparação (ex. mês anterior sem movimento). A seta
 * (up/down/=) vai no `trend` e reflete o sinal da variação — neutra quanto a
 * "bom/ruim"; o significado vem da métrica do card.
 */
function badgeText(pct: number | null, loading: boolean) {
  if (loading) return "";
  if (pct === null) return "—";
  return formatPct(pct);
}

/** Agrupa os últimos dias do período por data para manter as séries alinhadas. */
function getDailySeries(
  transactions: ApiTransaction[],
  type: "income" | "expense" | "balance",
  startDate: string,
  endDate: string,
) {
  const [year, month, day] = endDate.split("-").map(Number);
  const end = new Date(year, month - 1, day);
  const chartStart = new Date(end);
  chartStart.setDate(end.getDate() - 6);
  const start = new Date(`${startDate}T00:00:00`);
  if (chartStart < start) chartStart.setTime(start.getTime());

  const dates: string[] = [];
  const labels: string[] = [];
  const totals = new Map<string, number>();

  for (
    const date = new Date(chartStart);
    date <= end;
    date.setDate(date.getDate() + 1)
  ) {
    const key = toDateKey(date);
    dates.push(key);
    labels.push(
      key === toDateKey(new Date())
        ? `Hoje, ${new Intl.DateTimeFormat("pt-AO", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }).format(date)}`
        : `${PT_MONTHS_SHORT[date.getMonth()]} ${date.getDate()}`,
    );
    totals.set(key, 0);
  }

  for (const transaction of transactions) {
    const rawDate = transaction.transactionDate ?? transaction.createdAt;
    const date = rawDate?.slice(0, 10);
    if (!date || !totals.has(date) || !Number.isFinite(transaction.amount)) {
      continue;
    }
    if (type === "income" && transaction.type !== "INCOME") continue;
    if (type === "expense" && transaction.type !== "EXPENSE") continue;

    const amount = Math.abs(transaction.amount) *
      (type === "balance" && transaction.type === "EXPENSE" ? -1 : 1);
    totals.set(date, (totals.get(date) ?? 0) + amount);
  }

  return {
    data: dates.map((date) => totals.get(date) ?? 0),
    labels,
  };
}

function Page() {
  const { openTransactionForm } = useTransactionAction();
  const now = new Date();
  const currentKey = now.getFullYear() * 12 + now.getMonth();
  // Mês selecionado no filtro do cabeçalho (por omissão, o mês atual).
  const [selected, setSelected] = useState(() => ({
    y: now.getFullYear(),
    m: now.getMonth(),
  }));
  const isCurrentMonth =
    selected.y === now.getFullYear() && selected.m === now.getMonth();

  function shiftMonth(delta: -1 | 1) {
    const target = selected.y * 12 + selected.m + delta;
    // Não permite navegar para meses futuros.
    if (target > currentKey) return;
    setSelected({
      y: Math.floor(target / 12),
      m: ((target % 12) + 12) % 12,
    });
  }

  const monthStart = toDateKey(new Date(selected.y, selected.m, 1));
  const monthEnd = isCurrentMonth
    ? toDateKey(now)
    : toDateKey(
        new Date(
          selected.y,
          selected.m,
          lastDayOfMonth(selected.y, selected.m),
        ),
      );
  const currentWeekStartDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - ((now.getDay() + 6) % 7),
  );
  const previousWeekStartDate = new Date(currentWeekStartDate);
  previousWeekStartDate.setDate(previousWeekStartDate.getDate() - 7);
  const currentWeekStart = toDateKey(currentWeekStartDate);
  const previousWeekStart = toDateKey(previousWeekStartDate);
  const today = toDateKey(now);
  const prevMonthDate = new Date(selected.y, selected.m - 1, 1);
  const prevStart = toDateKey(prevMonthDate);
  // Compara o período selecionado com o mês anterior completo. Assim,
  // movimentos ocorridos após o mesmo dia do mês anterior também entram
  // na base e o rótulo continua a identificar o mês comparado.
  const prevLastDay = lastDayOfMonth(
    prevMonthDate.getFullYear(),
    prevMonthDate.getMonth(),
  );
  const prevEnd = toDateKey(
    new Date(
      prevMonthDate.getFullYear(),
      prevMonthDate.getMonth(),
      prevLastDay,
    ),
  );
  const prevMonthName = (() => {
    const raw = new Intl.DateTimeFormat("pt-AO", { month: "long" }).format(
      prevMonthDate,
    );
    return raw.charAt(0).toLocaleUpperCase("pt-AO") + raw.slice(1);
  })();
  const comparisonLabel = `vs ${prevMonthName}`;
  const monthLabel = new Intl.DateTimeFormat("pt-AO", {
    month: "long",
    year: "numeric",
  }).format(new Date(selected.y, selected.m, 1));
  const { data: balance, isLoading: isBalanceLoading, error: balanceError } =
    useBalance(monthStart, monthEnd);
  const {
    data: prevBalance,
    isLoading: isPrevBalanceLoading,
    error: prevBalanceError,
  } = useBalance(prevStart, prevEnd);
  const {
    goals: apiGoals,
    isLoading: areGoalsLoading,
    error: goalsError,
  } = useGoal();
  const {
    transactions: apiTransactions,
    notPaginated: periodTransactions,
    isLoadingAll: isPeriodTransactionsLoading,
    totalElements,
    isLoading: areTransactionsLoading,
    error: transactionsError,
  } = useTransaction({
    range: { startDate: monthStart, endDate: monthEnd },
  });
  const {
    notPaginated: weeklyApiTransactions,
    isLoadingAll: isWeeklyTransactionsLoading,
    error: weeklyTransactionsError,
  } = useTransaction({
    range: { startDate: previousWeekStart, endDate: today },
  });

  const transactions = useMemo(
    () => apiTransactions.map(toAppTransaction),
    [apiTransactions],
  );
  const activeApiGoals = useMemo(
    () => apiGoals.filter((goal) => goal.status === "ACTIVE" || goal.status === "AT_RISK"),
    [apiGoals],
  );
  const goals = useMemo(
    () => activeApiGoals.map(toDashboardGoal),
    [activeApiGoals],
  );
  const monthlyTransactions = periodTransactions ?? [];
  const incomeSeries = useMemo(
    () => getDailySeries(monthlyTransactions, "income", monthStart, monthEnd),
    [monthlyTransactions, monthStart, monthEnd],
  );
  const expenseSeries = useMemo(
    () => getDailySeries(monthlyTransactions, "expense", monthStart, monthEnd),
    [monthlyTransactions, monthStart, monthEnd],
  );
  const balanceSeries = useMemo(
    () => getDailySeries(monthlyTransactions, "balance", monthStart, monthEnd),
    [monthlyTransactions, monthStart, monthEnd],
  );
  const incomeChart = incomeSeries.data;
  const expenseChart = expenseSeries.data;
  const incomePct =
    balance && prevBalance
      ? pctChange(balance.totalIncome, prevBalance.totalIncome)
      : null;
  const expensePct =
    balance && prevBalance
      ? pctChange(balance.totalExpense, prevBalance.totalExpense)
      : null;
  const balancePct =
    balance && prevBalance
      ? pctChange(balance.balance, prevBalance.balance, true)
      : null;
  const isCardsLoading = isBalanceLoading || isPrevBalanceLoading;
  const errorMessages = [
    balanceError || prevBalanceError
      ? "Não foi possível carregar o resumo financeiro."
      : null,
    transactionsError ? "Não foi possível carregar as transações." : null,
    goalsError ? "Não foi possível carregar as metas." : null,
  ].filter(Boolean);

  return (
    <div className="flex h-full flex-col">
      <div className="hidden lg:block">
        <PageHeader title="Dashboard">
        <div className="flex items-center gap-3">
        <div className="flex items-center justify-center gap-1 rounded-xl border border-(--border-button) bg-(--bg-card) px-2 py-1.5">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            className="flex size-8 items-center justify-center rounded-lg text-primary-300 transition-colors hover:bg-(--menu-bg-hover) disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Ver mês anterior"
          >
            <ChevronLeft className="size-5" strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={() => setSelected({ y: now.getFullYear(), m: now.getMonth() })}
            className="flex items-center justify-center gap-3 rounded-lg px-2 py-1 transition-colors hover:bg-(--menu-bg-hover)"
            aria-label="Voltar ao mês atual"
            title={isCurrentMonth ? "Mês atual" : "Voltar ao mês atual"}
          >
            <Calendar className="size-5 text-primary-300" />
            <p className="font-manrope text-base font-medium text-(--text-title) capitalize">
              {monthLabel}
            </p>
          </button>
          <button
            type="button"
            onClick={() => shiftMonth(1)}
            disabled={isCurrentMonth}
            className="flex size-8 items-center justify-center rounded-lg text-primary-300 transition-colors hover:bg-(--menu-bg-hover) disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Ver mês seguinte"
          >
            <ChevronRight className="size-5" strokeWidth={2} />
          </button>
        </div>
        <button
          type="button"
          onClick={openTransactionForm}
          className="group flex h-12 items-center justify-center gap-2 rounded-xl border border-primary-300 bg-primary-300 px-5 transition-colors duration-200 hover:bg-primary-400 active:opacity-90"
        >
          <Plus className="size-4 text-base-white transition-transform duration-300 ease-out group-hover:rotate-90" aria-hidden="true" />
          <span className="font-inter text-sm leading-6 text-base-white">
            Nova Transação
          </span>
        </button>
        </div>
      </PageHeader>
      </div>
      <main className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto bg-(--bg-card) px-6 pb-8 pt-4 lg:gap-5 lg:p-8">
        {errorMessages.length > 0 && (
          <div
            role="alert"
            className="rounded-xl border border-danger-300/30 bg-danger-300/5 px-4 py-3 font-manrope text-sm text-danger-300"
          >
            {errorMessages.join(" ")} Atualize a página para tentar novamente.
          </div>
        )}
        <div className="hidden grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid xl:grid-cols-4">
          <CardViews
            property1="Default"
            title="Entradas"
            value={isCardsLoading ? "A carregar…" : balance ? formatAOA(balance.totalIncome) : "—"}
            change={badgeText(incomePct, isCardsLoading)}
            trend={incomePct === null ? undefined : trendOf(incomePct)}
            comparison={comparisonLabel}
            chartData={periodTransactions ? incomeChart : []}
            chartLabels={incomeSeries.labels}
            chartLabel={
              isPeriodTransactionsLoading
                ? "A carregar entradas diárias"
                : "Entradas diárias nos últimos sete dias do período"
            }
            className="min-w-0! max-w-none!"
          />
          <CardViews
            property1="Variant6"
            title="Gastos"
            value={isCardsLoading ? "A carregar…" : balance ? formatAOA(balance.totalExpense) : "—"}
            change={badgeText(expensePct, isCardsLoading)}
            trend={expensePct === null ? undefined : trendOf(expensePct)}
            trendPolarity="lower-is-better"
            comparison={comparisonLabel}
            chartData={periodTransactions ? expenseChart : []}
            chartLabels={expenseSeries.labels}
            chartLabel={
              isPeriodTransactionsLoading
                ? "A carregar gastos diários"
                : "Gastos diários nos últimos sete dias do período"
            }
            className="min-w-0! max-w-none!"
          />
          <CardViews
            property1="Variant8"
            title="Saldo do mês"
            value={isCardsLoading ? "A carregar…" : balance ? formatAOA(balance.balance) : "—"}
            change={badgeText(balancePct, isCardsLoading)}
            trend={balancePct === null ? undefined : trendOf(balancePct)}
            comparison={comparisonLabel}
            chartData={periodTransactions ? balanceSeries.data : []}
            chartLabels={balanceSeries.labels}
            chartLabel={
              isPeriodTransactionsLoading
                ? "A carregar saldo diário"
                : "Saldo líquido diário nos últimos sete dias do período"
            }
            className="min-w-0! max-w-none!"
          />
          <CardViews
            property1="Variant7"
            title="Património"
            value="—"
            change=""
            comparison="Dados de contas indisponíveis"
            chartData={[]}
            chartLabel="Sem dados de património disponíveis"
            className="min-w-0! max-w-none!"
          />
        </div>
        <div className="grid grid-cols-2 items-stretch gap-4 lg:hidden">
          <BalanceHero
            className="col-span-2"
            value={
              isCardsLoading
                ? "A carregar…"
                : balance
                  ? formatAOA(balance.balance)
                  : "—"
            }
            change={
              isCardsLoading || balancePct === null
                ? ""
                : formatPct(balancePct)
            }
            trend={
              balancePct === null ? undefined : trendOf(balancePct)
            }
            comparison={comparisonLabel}
            loading={isCardsLoading}
          />
          <MiniStatCard
            icon={ArrowDown}
            label="Entradas"
            value={
              isCardsLoading
                ? "A carregar…"
                : balance
                  ? formatAOA(balance.totalIncome)
                  : "—"
            }
            change={
              isCardsLoading || incomePct === null ? "" : formatPct(incomePct)
            }
            trend={incomePct === null ? undefined : trendOf(incomePct)}
            tone={{ background: "bg-success/10", text: "text-success" }}
            chartColor="green"
            chartData={periodTransactions ? incomeChart : []}
            chartLabels={incomeSeries.labels}
            chartLabel="Entradas diárias nos últimos sete dias do período"
          />
          <MiniStatCard
            icon={ArrowUp}
            label="Gastos"
            value={
              isCardsLoading
                ? "A carregar…"
                : balance
                  ? formatAOA(balance.totalExpense)
                  : "—"
            }
            change={
              isCardsLoading || expensePct === null
                ? ""
                : formatPct(expensePct)
            }
            trend={expensePct === null ? undefined : trendOf(expensePct)}
            trendPolarity="lower-is-better"
            tone={{
              background: "bg-danger-300/10",
              text: "text-danger-300",
            }}
            chartColor="red"
            chartData={periodTransactions ? expenseChart : []}
            chartLabels={expenseSeries.labels}
            chartLabel="Gastos diários nos últimos sete dias do período"
          />
          <MiniStatCard
            icon={Equal}
            label="Saldo do mês"
            value={
              isCardsLoading
                ? "A carregar…"
                : balance
                  ? formatAOA(balance.balance)
                  : "—"
            }
            change={
              isCardsLoading || balancePct === null
                ? ""
                : formatPct(balancePct)
            }
            trend={balancePct === null ? undefined : trendOf(balancePct)}
            tone={{
              background: "bg-warning/10",
              text: "text-warning",
            }}
            chartColor="yellow"
            chartData={periodTransactions ? balanceSeries.data : []}
            chartLabels={balanceSeries.labels}
            chartLabel="Saldo líquido diário nos últimos sete dias do período"
          />
          <MiniStatCard
            icon={Wallet}
            label="Património"
            value="—"
            change=""
            tone={{ background: "bg-primary-300/10", text: "text-primary-300" }}
            chartColor="blue"
            chartData={[]}
            chartLabel="Sem dados de património disponíveis"
          />
          <div className="col-span-2">
            <TransactionSection
              transactions={transactions}
              isLoading={areTransactionsLoading}
              error={transactionsError}
              totalElements={totalElements}
            />
          </div>
          <div className="col-span-2">
            <GoalsSection
              goals={goals}
              isLoading={areGoalsLoading}
              error={goalsError}
            />
          </div>
          <div className="col-span-2 lg:col-span-1">
            <FlowCard
              transactions={monthlyTransactions}
              year={selected.y}
              month={selected.m}
              loading={isPeriodTransactionsLoading}
            />
          </div>
          <div className="col-span-2 lg:col-span-1">
            <CategoryCard
              transactions={monthlyTransactions}
              loading={isPeriodTransactionsLoading}
            />
          </div>
          <div className="col-span-2">
            <WeeklyCard
              transactions={weeklyApiTransactions ?? []}
              currentWeekStart={currentWeekStart}
              previousWeekStart={previousWeekStart}
              today={today}
              loading={isWeeklyTransactionsLoading}
              error={weeklyTransactionsError}
            />
          </div>
          <AiNotify className="col-span-2" />
        </div>
        <div className="hidden items-stretch gap-5 lg:grid lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
          <TransactionSection
            transactions={transactions}
            isLoading={areTransactionsLoading}
            error={transactionsError}
            totalElements={totalElements}
          />
          <GoalsSection goals={goals} isLoading={areGoalsLoading} error={goalsError} />
          <FlowCard
            transactions={monthlyTransactions}
            year={selected.y}
            month={selected.m}
            loading={isPeriodTransactionsLoading}
          />
          <CategoryCard
            transactions={monthlyTransactions}
            loading={isPeriodTransactionsLoading}
          />
          <div className="col-span-2">
            <WeeklyCard
              transactions={weeklyApiTransactions ?? []}
              currentWeekStart={currentWeekStart}
              previousWeekStart={previousWeekStart}
              today={today}
              loading={isWeeklyTransactionsLoading}
              error={weeklyTransactionsError}
            />
          </div>
          <AiNotify className="col-span-2" />
        </div>
      </main>
    </div>
  );
}

export default Page;
