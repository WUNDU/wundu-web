/**
 * Relatório de análises — port fiel de `wundu/lib/analysis-report.ts`.
 * Todos os valores chegam em cêntimos (Kz × 100); a grelha converte para Kz.
 * Mantém blocos, cores, bordas, fórmulas e textos idênticos ao protótipo.
 */

export type ReportDateRange = { start: string; end: string };
export type ReportLine = { description: string; planned: number | null; actual: number };
export type ReportBlock = {
  name: string;
  color: string;
  border: string;
  lines: ReportLine[];
  planned: number | null;
  actual: number;
  difference: number | null;
};
export type AnalysisReport = {
  title: string;
  range: ReportDateRange;
  months: number;
  income: number;
  expenses: number;
  remaining: number;
  wealth: number;
  ratio: number | null;
  blocks: ReportBlock[];
};
export type ReportCell = string | number | null;

/** Transação adaptada (cêntimos) para o relatório. */
export type ReportTransaction = {
  name: string;
  category: string;
  type: "income" | "expense";
  amount: number;
};

const definitions = [
  { name: "Entradas", color: "BEDCEB", border: "83ACBF" },
  { name: "Despesas essenciais", color: "D4E8C6", border: "9CBE86" },
  { name: "Gastos pessoais e outros", color: "EDD2DE", border: "C496AA" },
  { name: "Investimentos", color: "FBE0C5", border: "DEB184" },
];
const essential = new Set([
  "alimentacao",
  "casa",
  "habitacao",
  "saude",
  "educacao",
  "transportes",
  "transporte",
]);
const investments = new Set(["investimento", "investimentos", "aplicacao", "aplicacoes"]);
const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);

export const categoryKey = (name: string) =>
  name
    .trim()
    .replace(/\s+/g, " ")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-AO");

/** Classification uses recorded categories only. Virtual market trades and goal balances are not expenses. */
export function reportGroup(category: string) {
  const key = categoryKey(category);
  return investments.has(key) ? 3 : essential.has(key) ? 1 : 2;
}

export function buildAnalysisReport(
  transactions: readonly ReportTransaction[],
  categories: readonly { name: string; amount: number }[],
  totals: { income: number; expenses: number; remaining: number; wealth: number },
  range: ReportDateRange,
  budgets: readonly { category: string; amount: number }[] = [],
): AnalysisReport {
  const months =
    (Number(range.end.slice(0, 4)) - Number(range.start.slice(0, 4))) * 12 +
    Number(range.end.slice(5, 7)) -
    Number(range.start.slice(5, 7)) +
    1;
  const monthTitle = new Intl.DateTimeFormat("pt-AO", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(range.end + "T12:00:00Z"));
  const title =
    months === 1
      ? monthTitle[0].toLocaleUpperCase("pt-AO") + monthTitle.slice(1)
      : "Resumo do período";
  const groups: ReportLine[][] = [[], [], [], []];
  const incomeDescriptions = new Map<string, number>();
  for (const transaction of transactions.filter((item) => item.type === "income"))
    incomeDescriptions.set(
      transaction.name,
      (incomeDescriptions.get(transaction.name) ?? 0) + transaction.amount,
    );
  groups[0] = Array.from(
    incomeDescriptions,
    ([description, actual]) => ({ description, planned: null, actual }),
  );
  const names = [
    ...new Set([
      ...categories.map((item) => item.name),
      ...budgets.map((item) => item.category),
    ]),
  ];
  for (const name of names) {
    const budget = budgets.find((item) => item.category === name);
    groups[reportGroup(name)].push({
      description: name,
      planned: budget ? budget.amount * months : null,
      actual: categories.find((item) => item.name === name)?.amount ?? 0,
    });
  }
  const blocks = definitions.map((definition, index) => {
    const lines = groups[index];
    const planned = lines.some((line) => line.planned !== null)
      ? sum(lines.map((line) => line.planned ?? 0))
      : null;
    const actual = sum(lines.map((line) => line.actual));
    // A partial budget cannot imply that an unbudgeted category was allocated zero.
    const difference =
      planned !== null && !lines.some((line) => line.actual > 0 && line.planned === null)
        ? actual - planned
        : null;
    return { ...definition, lines, planned, actual, difference };
  });
  return {
    title,
    range,
    months,
    income: totals.income,
    expenses: totals.expenses,
    remaining: totals.remaining,
    wealth: totals.wealth,
    ratio: totals.income > 0 ? totals.expenses / totals.income : null,
    blocks,
  };
}

/** Fifteen columns: four three-column blocks separated by one empty column. Values are numeric kwanzas. */
export function reportGrid(report: AnalysisReport): ReportCell[][] {
  const rows: ReportCell[][] = Array.from(
    { length: 16 + Math.max(16, ...report.blocks.map((block) => block.lines.length)) },
    () => Array<ReportCell>(15).fill(null),
  );
  const put = (row: number, column: number, value: ReportCell) => {
    rows[row][column] = value;
  };
  const kwanzas = (value: number | null) => (value === null ? null : value / 100);
  put(0, 0, "Análises Wundu");
  put(0, 4, report.title);
  put(1, 0, `${report.range.start} a ${report.range.end} · Valores em Kz`);
  put(3, 0, "RESUMO TOTAL REALIZADO");
  put(3, 4, "Entradas");
  put(3, 6, kwanzas(report.income));
  put(3, 8, "% Realizado");
  put(
    3,
    10,
    report.ratio === null ? "Sem entradas" : `${(report.ratio * 100).toFixed(1)}%`,
  );
  report.blocks.slice(1).forEach((block, index) => {
    put(4 + index, 0, block.name);
    put(4 + index, 2, kwanzas(block.actual));
  });
  put(5, 4, "Total realizado");
  put(5, 6, kwanzas(report.expenses));
  put(7, 4, "Resta");
  put(7, 6, kwanzas(report.remaining));
  put(8, 0, "Património total");
  put(8, 2, kwanzas(report.wealth));
  put(
    10,
    0,
    "Orçamentos mensais por categoria. Entradas previstas não são registadas na aplicação.",
  );
  put(
    11,
    0,
    `${report.months} ${report.months === 1 ? "mês incluído" : "meses incluídos"}. Meses parciais usam o orçamento mensal completo; campos sem orçamento ficam em branco.`,
  );
  report.blocks.forEach((block, index) => {
    const column = index * 4;
    put(13, column, block.name);
    put(14, column, "Total orçado");
    put(14, column + 2, kwanzas(block.planned));
    put(15, column, "Total realizado");
    put(15, column + 2, kwanzas(block.actual));
  });
  const table: ReportCell[][] = [];
  const header = Array<ReportCell>(15).fill(null);
  report.blocks.forEach((_, index) => {
    header[index * 4] = "Descrição";
    header[index * 4 + 1] = "Orçado (Kz)";
    header[index * 4 + 2] = "Realizado (Kz)";
  });
  const difference = Array<ReportCell>(15).fill(null);
  report.blocks.forEach((block, index) => {
    difference[index * 4] = "Diferença (realizado − orçado)";
    difference[index * 4 + 2] = kwanzas(block.difference);
  });
  table.push(difference, Array<ReportCell>(15).fill(null), header);
  for (
    let index = 0;
    index < Math.max(16, ...report.blocks.map((block) => block.lines.length));
    index++
  ) {
    const row = Array<ReportCell>(15).fill(null);
    report.blocks.forEach((block, blockIndex) => {
      const line = block.lines[index];
      if (line) {
        row[blockIndex * 4] = line.description;
        row[blockIndex * 4 + 1] = kwanzas(line.planned);
        row[blockIndex * 4 + 2] = kwanzas(line.actual);
      }
    });
    table.push(row);
  }
  const total = Array<ReportCell>(15).fill(null);
  report.blocks.forEach((block, index) => {
    total[index * 4] = "Total";
    total[index * 4 + 1] = kwanzas(block.planned);
    total[index * 4 + 2] = kwanzas(block.actual);
  });
  return [...rows.slice(0, 16), ...table, total];
}
