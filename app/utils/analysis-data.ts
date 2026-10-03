import type { AccountDTO } from "../components/mock/account";
import type { GoalDTO } from "../types/dto/goal.dto";
import type { TransactionDTO } from "../types/dto/transaction.dto";
import type { TransactionCategory } from "../types/transaction";
import type { CategorySlice, GoalShare } from "../components/mock/analysis";

/** Cor do gráfico por categoria (tokens CSS lidos em runtime). */
export const CATEGORY_CHART_COLORS: Record<TransactionCategory, string> = {
  Freelance: "--color-success",
  Lazer: "--color-danger-300",
  Alimentação: "--color-orange",
  Saúde: "--color-secondary-300",
  Habitação: "--color-purple",
  Educação: "--color-info",
  Outros: "--color-primary-300",
  Transporte: "--color-warning",
  Levantamento: "--color-warning",
  Salário: "--color-success",
  Negócio: "--color-success",
  Biscato: "--color-info",
};

const GOAL_CHART_COLORS = [
  "--color-success",
  "--color-info",
  "--color-secondary-300",
  "--color-danger-300",
  "--color-warning",
  "--color-purple",
];

export function getTransactionSummary(transactions: TransactionDTO[]) {
  const income = transactions
    .filter((tx) => tx.type === "income")
    .reduce((sum, tx) => sum + tx.amount, 0);
  const expenses = transactions
    .filter((tx) => tx.type === "expense")
    .reduce((sum, tx) => sum + tx.amount, 0);
  return {
    income,
    expenses,
    balance: income - expenses,
    count: transactions.length,
  };
}

/** Somas mensais (índice 0 = JAN) para sparklines. */
export function getMonthlyFlows(transactions: TransactionDTO[]) {
  const income = new Array<number>(12).fill(0);
  const expenses = new Array<number>(12).fill(0);
  for (const tx of transactions) {
    const month = new Date(tx.date).getMonth();
    if (Number.isNaN(month)) continue;
    if (tx.type === "income") income[month] += tx.amount;
    else expenses[month] += tx.amount;
  }
  return { income, expenses };
}

/** Gastos agrupados por categoria (donut), ordenados por valor. */
export function getExpensesByCategory(
  transactions: TransactionDTO[],
): CategorySlice[] {
  const totals = new Map<string, number>();
  for (const tx of transactions) {
    if (tx.type !== "expense") continue;
    totals.set(tx.category, (totals.get(tx.category) ?? 0) + tx.amount);
  }
  return [...totals.entries()]
    .map(([name, value]) => ({
      name,
      value,
      colorVar:
        CATEGORY_CHART_COLORS[name as TransactionCategory] ??
        "--color-primary-300",
    }))
    .sort((a, b) => b.value - a.value);
}

/** Metas com progresso calculado (anéis). */
export function getGoalShares(goals: GoalDTO[]): GoalShare[] {
  return goals.map((goal, index) => ({
    name: goal.title,
    progress:
      goal.targetAmount > 0
        ? Math.min(
            100,
            Math.round((goal.currentAmount / goal.targetAmount) * 100),
          )
        : 0,
    colorVar: GOAL_CHART_COLORS[index % GOAL_CHART_COLORS.length],
  }));
}

/** Matriz de gastos [período do dia][dia da semana Seg–Dom] + intensidades 0–4. */
export function getSpendingHeat(transactions: TransactionDTO[]) {
  const values: number[][] = Array.from({ length: 3 }, () =>
    new Array<number>(7).fill(0),
  );
  for (const tx of transactions) {
    if (tx.type !== "expense") continue;
    const raw = tx.transactionDate ?? tx.createdAt ?? tx.date;
    if (!raw) continue;
    const date = new Date(raw);
    if (!Number.isFinite(date.getTime())) continue;
    const col = (date.getDay() + 6) % 7;
    const hour = date.getHours();
    const row = hour >= 5 && hour < 12 ? 0 : hour >= 12 && hour < 19 ? 1 : 2;
    values[row][col] += tx.amount;
  }
  const max = values.reduce(
    (top, row) => Math.max(top, ...row),
    0,
  );
  const heat = values.map((row) =>
    row.map((value) => (max > 0 ? Math.round((value / max) * 4) : 0)),
  );
  return { heat, values };
}

/** Património total = soma dos saldos das contas. */
export function getPatrimonyTotal(accounts: AccountDTO[]): number {
  return accounts.reduce((sum, account) => sum + account.balance, 0);
}
