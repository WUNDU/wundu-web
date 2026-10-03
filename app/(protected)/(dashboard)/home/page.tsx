"use client";

import { useMemo, useState } from "react";
import CardViews, { type CardTrend } from "app/components/dashboard/CardViews";
import GoalsSection from "app/components/dashboard/GoalsSection";
import TransactionSection from "app/components/dashboard/TransactionSection";
import PageHeader from "app/components/layout/PageHeader";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useBalance } from "@/hooks/use-balance";
import { useGoal } from "@/hooks/use-goal";
import { useTransaction } from "@/hooks/use-transaction";
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

/** Meses abreviados fixos — o `month: "short"` do Intl devolve número em `pt-AO`. */
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

/** Rótulo curto de data para o tooltip (ex. "Nov 9"). */
function shortDateLabel(raw?: string | null) {
  if (!raw) return "";
  const date = new Date(raw);
  if (!Number.isFinite(date.getTime())) return "";
  return `${PT_MONTHS_SHORT[date.getMonth()]} ${date.getDate()}`;
}

function getRecentSeries(
  transactions: ApiTransaction[],
  type: "income" | "expense",
) {
  const items = transactions
    .filter((transaction) => (transaction.type === "INCOME") === (type === "income"))
    .slice(0, 7)
    .reverse();
  return {
    data: items.map((transaction) => transaction.amount),
    labels: items.map((transaction) =>
      shortDateLabel(transaction.transactionDate ?? transaction.createdAt),
    ),
  };
}

function Page() {
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
  const prevMonthDate = new Date(selected.y, selected.m - 1, 1);
  const prevStart = toDateKey(prevMonthDate);
  // Comparação justa: mês incompleto (atual) compara-se com o mesmo
  // intervalo do mês anterior (ex. 1–3 out vs 1–3 set); mês fechado
  // compara mês completo vs mês anterior completo.
  const prevLastDay = lastDayOfMonth(
    prevMonthDate.getFullYear(),
    prevMonthDate.getMonth(),
  );
  const prevEndDay = isCurrentMonth
    ? Math.min(now.getDate(), prevLastDay)
    : prevLastDay;
  const prevEnd = toDateKey(
    new Date(
      prevMonthDate.getFullYear(),
      prevMonthDate.getMonth(),
      prevEndDay,
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
    totalElements,
    isLoading: areTransactionsLoading,
    error: transactionsError,
  } = useTransaction();

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
  const monthlyTransactions = useMemo(() => {
    const start = new Date(selected.y, selected.m, 1).getTime();
    const end = new Date(selected.y, selected.m + 1, 1).getTime();
    return apiTransactions.filter((transaction) => {
      const raw = transaction.transactionDate ?? transaction.createdAt;
      if (!raw) return false;
      const time = new Date(raw).getTime();
      return Number.isFinite(time) && time >= start && time < end;
    });
  }, [apiTransactions, selected]);
  const incomeSeries = useMemo(
    () => getRecentSeries(monthlyTransactions, "income"),
    [monthlyTransactions],
  );
  const expenseSeries = useMemo(
    () => getRecentSeries(monthlyTransactions, "expense"),
    [monthlyTransactions],
  );
  const incomeChart = incomeSeries.data;
  const expenseChart = expenseSeries.data;
  const saldoLabels = incomeSeries.labels.length
    ? incomeSeries.labels
    : expenseSeries.labels;
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
      <PageHeader title="Dashboard">
        <div className="flex items-center justify-center gap-1 rounded-2xl border border-(--border-button) bg-(--bg-card) px-2 py-1.5">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            className="flex size-8 items-center justify-center rounded-xl text-primary-300 transition-colors hover:bg-(--menu-bg-hover) disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Ver mês anterior"
          >
            <ChevronLeft className="size-5" strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={() => setSelected({ y: now.getFullYear(), m: now.getMonth() })}
            className="flex items-center justify-center gap-3 rounded-xl px-2 py-1 transition-colors hover:bg-(--menu-bg-hover)"
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
            className="flex size-8 items-center justify-center rounded-xl text-primary-300 transition-colors hover:bg-(--menu-bg-hover) disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Ver mês seguinte"
          >
            <ChevronRight className="size-5" strokeWidth={2} />
          </button>
        </div>
      </PageHeader>
      <main className="flex min-h-0 flex-1 flex-col gap-8 overflow-y-auto p-8">
        {errorMessages.length > 0 && (
          <div
            role="alert"
            className="rounded-xl border border-danger-300/30 bg-danger-300/5 px-4 py-3 font-manrope text-sm text-danger-300"
          >
            {errorMessages.join(" ")} Atualize a página para tentar novamente.
          </div>
        )}
        <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <CardViews
            property1="Default"
            title="Entradas"
            value={isCardsLoading ? "A carregar…" : balance ? formatAOA(balance.totalIncome) : "—"}
            change={badgeText(incomePct, isCardsLoading)}
            trend={incomePct === null ? undefined : trendOf(incomePct)}
            comparison={comparisonLabel}
            chartData={incomeChart}
            chartLabels={incomeSeries.labels}
            chartLabel="Montantes das entradas recentes"
            className="min-w-0! max-w-none!"
          />
          <CardViews
            property1="Variant6"
            title="Gastos"
            value={isCardsLoading ? "A carregar…" : balance ? formatAOA(balance.totalExpense) : "—"}
            change={badgeText(expensePct, isCardsLoading)}
            trend={expensePct === null ? undefined : trendOf(expensePct)}
            comparison={comparisonLabel}
            chartData={expenseChart}
            chartLabels={expenseSeries.labels}
            chartLabel="Montantes dos gastos recentes"
            className="min-w-0! max-w-none!"
          />
          <CardViews
            property1="Variant8"
            title="Saldo do mês"
            value={isCardsLoading ? "A carregar…" : balance ? formatAOA(balance.balance) : "—"}
            change={badgeText(balancePct, isCardsLoading)}
            trend={balancePct === null ? undefined : trendOf(balancePct)}
            comparison={comparisonLabel}
            chartData={incomeChart.map((value, index) => value - (expenseChart[index] ?? 0))}
            chartLabels={saldoLabels}
            chartLabel="Saldo calculado sobre as entradas e gastos recentes"
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
        <div className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-2">
          <TransactionSection
            transactions={transactions}
            isLoading={areTransactionsLoading}
            error={transactionsError}
            totalElements={totalElements}
          />
          <GoalsSection goals={goals} isLoading={areGoalsLoading} error={goalsError} />
        </div>
      </main>
    </div>
  );
}

export default Page;
