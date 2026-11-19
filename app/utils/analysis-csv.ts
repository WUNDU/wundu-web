/**
 * CSV das análises — port fiel de `analyticsCsv` de `wundu/lib/analytics.ts`.
 * Grelha do relatório (15 colunas) + secções detalhadas, delimitado por `;`,
 * com BOM, `\r\n` e escape contra injeção de fórmulas. Valores em cêntimos.
 */
import { reportGrid, type AnalysisReport } from "./analysis-report";

export type CsvAnalytics = {  transactions: {
    id: string;
    date: string;
    name: string;
    category: string;
    account: string;
    type: "income" | "expense";
    amount: number;
  }[];
  income: number;
  expenses: number;
  net: number;
  wealth: number;
  flow: { key: string; label: string; income: number; expenses: number; balance: number }[];
  wealthSeries: { key: string; value: number }[];
  categories: { name: string; amount: number }[];
  accounts: { id: string; name: string; bank: string; income: number; expenses: number; balance: number }[];
  weekdays: { label: string; amount: number; count: number }[];
  goals: { name: string; target: number; saved: number; progress: number }[];
};

type CsvCell = string | number | { cents: number };

function csvCell(cell: CsvCell) {
  let value: string;
  if (typeof cell === "object") {
    const absolute = Math.abs(cell.cents);
    value = `${cell.cents < 0 ? "-" : ""}${Math.floor(absolute / 100)},${String(absolute % 100).padStart(2, "0")}`;
  } else if (typeof cell === "number") {
    value = String(cell).replace(".", ",");
  } else {
    // Quote escaping alone does not stop formulas when a CSV is opened in a spreadsheet.
    let first = 0;
    while (
      first < cell.length &&
      (cell.charCodeAt(first) <= 32 || cell.charCodeAt(first) === 127 || /\s/u.test(cell[first]))
    )
      first += 1;
    value = "=+-@".includes(cell[first] ?? "\uFFFF") ? `'${cell}` : cell;
  }
  return `"${value.replace(/"/g, '""')}"`;
}

/** A semicolon-delimited report with BOM for Portuguese spreadsheet applications. */
export function analyticsCsv(
  analytics: CsvAnalytics,
  range: { start: string; end: string },
  report: AnalysisReport,
): string {
  const amount = (cents: number): CsvCell => ({ cents });
  const signedAmount = (transaction: { type: string; amount: number }) =>
    transaction.type === "income" ? transaction.amount : -transaction.amount;
  const rows: CsvCell[][] = [
    ["Análises Wundu"],
    ["Período inicial", range.start],
    ["Período final", range.end],
    [],
    ["Resumo", "Valor (Kz)"],
    ["Total de entradas", amount(analytics.income)],
    ["Total de gastos", amount(analytics.expenses)],
    ["Saldo do período", amount(analytics.net)],
    ["Património total", amount(analytics.wealth)],
    [],
    ["Fluxo financeiro", "Entradas (Kz)", "Gastos (Kz)", "Saldo (Kz)"],
    ...analytics.flow.map((point) => [
      point.label.includes("–") ? point.label : point.key,
      amount(point.income),
      amount(point.expenses),
      amount(point.balance),
    ]),
    [],
    ["Evolução do património", "Valor (Kz)"],
    ...analytics.wealthSeries.map((point) => [point.key, amount(point.value)]),
    [],
    ["Categoria", "Gastos (Kz)"],
    ...analytics.categories.map((category) => [category.name, amount(category.amount)]),
    [],
    [
      "Conta",
      "Banco",
      "Entradas do período (Kz)",
      "Gastos do período (Kz)",
      "Saldo até à data final (Kz)",
    ],
    ...analytics.accounts.map((account) => [
      account.name,
      account.bank,
      amount(account.income),
      amount(account.expenses),
      amount(account.balance),
    ]),
    [],
    ["Dia da semana", "Gastos (Kz)", "Transacções"],
    ...analytics.weekdays.map((day) => [day.label, amount(day.amount), day.count]),
    [],
    ["Meta", "Objectivo (Kz)", "Poupado (Kz)", "Progresso (%)"],
    ...analytics.goals.map((goal) => [
      goal.name,
      amount(goal.target),
      amount(goal.saved),
      Math.round(goal.progress * 100) / 100,
    ]),
    [],
    ["Data", "Descrição", "Categoria", "Conta", "Tipo", "Valor (Kz)"],
    ...analytics.transactions.map((transaction) => [
      transaction.date,
      transaction.name,
      transaction.category,
      analytics.accounts.find((account) => account.id === transaction.account)?.name ??
        transaction.account,
      transaction.type === "income" ? "Entrada" : "Gasto",
      amount(signedAmount(transaction)),
    ]),
  ];
  const layout = reportGrid(report).map((row) => row.map((cell) => (cell === null ? "" : cell)));
  return (
    "\uFEFF" +
    [...layout, [], ...rows.slice(1)].map((row) => row.map(csvCell).join(";")).join("\r\n") +
    "\r\n"
  );
}

const MONTHS = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
const WEEKDAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const dateObject = (date: string) => new Date(`${date}T12:00:00.000Z`);
const monthIndex = (date: string) => Number(date.slice(0, 4)) * 12 + Number(date.slice(5, 7)) - 1;
const monthKey = (index: number) =>
  `${String(Math.floor(index / 12)).padStart(4, "0")}-${String((index % 12) + 1).padStart(2, "0")}`;
const later = (a: string, b: string) => (a > b ? a : b);

function addDays(date: string, count: number) {
  const parsed = dateObject(date);
  parsed.setUTCDate(parsed.getUTCDate() + count);
  return parsed.toISOString().slice(0, 10);
}

function monthEnd(index: number) {
  return addDays(`${monthKey(index + 1)}-01`, -1);
}

export type BucketsTransaction = { date: string; type: "income" | "expense"; amount: number };

/** Baldes mensais/anuais do fluxo — port fiel de `flowBuckets` do protótipo. */
export function flowPoints(
  transactions: readonly BucketsTransaction[],
  range: { start: string; end: string },
) {
  const startMonth = monthIndex(range.start);
  const endMonth = monthIndex(range.end);
  const count = endMonth - startMonth + 1;
  const buckets: { key: string; label: string; start: string; end: string }[] = [];
  if (count <= 24) {
    // A single calendar year keeps JAN–DEZ. Cross-year periods retain the year in every label.
    const sameYear = range.start.slice(0, 4) === range.end.slice(0, 4);
    const first = sameYear ? Number(range.end.slice(0, 4)) * 12 : count <= 12 ? endMonth - 11 : startMonth;
    const length = sameYear || count <= 12 ? 12 : count;
    for (let offset = 0; offset < length; offset++) {
      const index = first + offset;
      const key = monthKey(index);
      buckets.push({
        key,
        label: sameYear ? MONTHS[index % 12] : `${MONTHS[index % 12]} ${key.slice(0, 4)}`,
        start: `${key}-01`,
        end: monthEnd(index),
      });
    }
  } else {
    const firstYear = Number(range.start.slice(0, 4));
    const lastYear = Number(range.end.slice(0, 4));
    const step = Math.ceil((lastYear - firstYear + 1) / 24);
    const length = Math.ceil((lastYear - firstYear + 1) / step);
    for (let index = 0; index < length; index++) {
      const first = firstYear + index * step;
      const last = Math.min(lastYear, first + step - 1);
      const key = String(first).padStart(4, "0");
      buckets.push({
        key,
        label: first === last ? key : `${key}–${last}`,
        start: `${key}-01-01`,
        end: `${String(last).padStart(4, "0")}-12-31`,
      });
    }
  }
  return buckets.map((bucket) => {
    const rows = transactions.filter(
      (transaction) => transaction.date >= bucket.start && transaction.date <= bucket.end,
    );
    const income = rows
      .filter((transaction) => transaction.type === "income")
      .reduce((total, transaction) => total + transaction.amount, 0);
    const expenses = rows
      .filter((transaction) => transaction.type === "expense")
      .reduce((total, transaction) => total + transaction.amount, 0);
    return { key: bucket.key, label: bucket.label, income, expenses, balance: income - expenses };
  });
}

/**
 * Série do património (intervalo semanal) — port fiel de `wealthBuckets` +
 * acumulação de `buildAnalytics`. Sem contas ligadas, parte de zero e soma
 * os movimentos, como na wundu sem contas.
 */
export function wealthPoints(
  transactions: readonly BucketsTransaction[],
  range: { start: string; end: string },
) {
  const historical = [...transactions]
    .filter((transaction) => transaction.date <= range.end)
    .sort((a, b) => a.date.localeCompare(b.date));
  const start = later(range.start, addDays(range.end, -6));
  const count =
    Math.round((dateObject(range.end).getTime() - dateObject(start).getTime()) / 86400000) + 1;
  // Start before the first displayed bucket so opening balances and earlier flows remain visible.
  let runningWealth = 0;
  let transactionIndex = 0;
  return Array.from({ length: count }, (_, index) => {
    const date = addDays(start, index);
    while (
      transactionIndex < historical.length &&
      historical[transactionIndex].date <= date
    ) {
      const transaction = historical[transactionIndex];
      runningWealth += transaction.type === "income" ? transaction.amount : -transaction.amount;
      transactionIndex += 1;
    }
    return { key: date, value: runningWealth };
  });
}

export { WEEKDAYS };
