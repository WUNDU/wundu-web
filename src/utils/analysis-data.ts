import type { TransactionResponse } from "@/types/dtos/transaction.dto";

export type ChartData = { label: string; amount: number };
export type CategoryData = {
  name: string;
  percentage: number;
  amount: string;
  color: string;
};

const MONTHS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const DAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"];
const HOURS = ["00h", "04h", "08h", "12h", "16h", "20h"];

const CATEGORY_COLORS: Record<string, string> = {
  Restaurantes: "#FFC727",
  Lazer: "#49B58F",
  Educação: "#9C52F1",
  Saúde: "#66A8E3",
  Viagem: "#F97316",
  Casa: "#F97316",
  Veículo: "#10B981",
  Outros: "#23ABA4",
};
const FALLBACK_COLORS = [
  "#FFC727", "#49B58F", "#9C52F1", "#66A8E3",
  "#23ABA4", "#F97316", "#10B981", "#003cc3",
];
const getColor = (name: string, idx: number) =>
  CATEGORY_COLORS[name] ?? FALLBACK_COLORS[idx % FALLBACK_COLORS.length];

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/**
 * Filters expenses by the selected period within the given year.
 * "1D" → same day/month of selected year.
 * "1S" → same week of selected year.
 * "1M" → current month of selected year.
 * "6M" → last 6 months of selected year.
 * "1A" → full selected year.
 */
function filterByPeriod(
  txs: TransactionResponse[],
  year: number,
  filter: string,
): TransactionResponse[] {
  const now = new Date();
  const isCurrentYear = year === now.getFullYear();
  const expenses = txs.filter((t) => t.type === "EXPENSE");

  switch (filter) {
    case "1D": {
      const target = new Date(year, now.getMonth(), now.getDate());
      return expenses.filter((t) => isSameDay(new Date(t.transactionDate), target));
    }
    case "1S": {
      const todayEnd = new Date(year, now.getMonth(), now.getDate(), 23, 59, 59, 999);
      const weekStart = new Date(year, now.getMonth(), now.getDate() - 6, 0, 0, 0, 0);
      return expenses.filter((t) => {
        const d = new Date(t.transactionDate);
        if (d.getFullYear() !== year) return false;
        return d >= weekStart && d <= todayEnd;
      });
    }
    case "1M": {
      return expenses.filter((t) => {
        const d = new Date(t.transactionDate);
        return d.getFullYear() === year && d.getMonth() === now.getMonth();
      });
    }
    case "6M": {
      const endMonth = isCurrentYear ? now.getMonth() : 11;
      const startOffset = endMonth - 5;
      return expenses.filter((t) => {
        const d = new Date(t.transactionDate);
        if (startOffset >= 0) {
          return d.getFullYear() === year && d.getMonth() >= startOffset && d.getMonth() <= endMonth;
        }
        const prevYear = year - 1;
        const prevStart = 12 + startOffset;
        return (
          (d.getFullYear() === prevYear && d.getMonth() >= prevStart) ||
          (d.getFullYear() === year && d.getMonth() <= endMonth)
        );
      });
    }
    case "1A":
    default:
      return expenses.filter(
        (t) => new Date(t.transactionDate).getFullYear() === year,
      );
  }
}

export function getFilteredChartData(
  transactions: TransactionResponse[],
  year: number,
  filter: string,
): ChartData[] {
  const filtered = filterByPeriod(transactions, year, filter);
  const now = new Date();

  switch (filter) {
    case "1D": {
      return HOURS.map((label, i) => {
        const start = i * 4;
        const end = start + 4;
        const amount = filtered
          .filter((t) => {
            const h = new Date(t.transactionDate).getHours();
            return h >= start && h < end;
          })
          .reduce((s, t) => s + t.amount, 0);
        return { label, amount };
      });
    }
    case "1S": {
      const todayInYear = new Date(year, now.getMonth(), now.getDate());
      return Array.from({ length: 7 }).map((_, i) => {
        const day = new Date(year, todayInYear.getMonth(), todayInYear.getDate() - (6 - i));
        const dow = day.getDay();
        const label = DAYS[dow === 0 ? 6 : dow - 1];
        const amount = filtered
          .filter((t) => isSameDay(new Date(t.transactionDate), day))
          .reduce((s, t) => s + t.amount, 0);
        return { label, amount };
      });
    }
    case "1M": {
      return ["Sem 1", "Sem 2", "Sem 3", "Sem 4"].map((label, i) => {
        const start = i * 7 + 1;
        const end = i === 3 ? 32 : start + 7;
        const amount = filtered
          .filter((t) => {
            const d = new Date(t.transactionDate);
            return d.getDate() >= start && d.getDate() < end;
          })
          .reduce((s, t) => s + t.amount, 0);
        return { label, amount };
      });
    }
    case "6M": {
      const endMonth = year === now.getFullYear() ? now.getMonth() : 11;
      return Array.from({ length: 6 }).map((_, i) => {
        const offset = 5 - i;
        const monthIdx = (endMonth - offset + 12) % 12;
        const monthYear = endMonth - offset < 0 ? year - 1 : year;
        const amount = filtered
          .filter((t) => {
            const d = new Date(t.transactionDate);
            return d.getFullYear() === monthYear && d.getMonth() === monthIdx;
          })
          .reduce((s, t) => s + t.amount, 0);
        return { label: MONTHS[monthIdx], amount };
      });
    }
    case "1A":
    default: {
      const monthCount = year < now.getFullYear() ? 12 : now.getMonth() + 1;
      return MONTHS.slice(0, monthCount).map((label, i) => {
        const amount = filtered
          .filter((t) => new Date(t.transactionDate).getMonth() === i)
          .reduce((s, t) => s + t.amount, 0);
        return { label, amount };
      });
    }
  }
}

export function getCategoryData(
  transactions: TransactionResponse[],
  year: number,
  filter: string = "1A",
): CategoryData[] {
  const filtered = filterByPeriod(transactions, year, filter);
  const total = filtered.reduce((s, t) => s + t.amount, 0);
  if (total === 0) return [];

  const groups: Record<string, number> = {};
  for (const t of filtered) {
    const name = t.category?.name ?? "Outros";
    groups[name] = (groups[name] ?? 0) + t.amount;
  }

  return Object.entries(groups)
    .sort((a, b) => b[1] - a[1])
    .map(([name, amount], i) => ({
      name,
      color: getColor(name, i),
      percentage: Math.round((amount / total) * 100),
      amount: amount.toLocaleString("pt-AO"),
    }));
}

export function getTotalAmount(
  transactions: TransactionResponse[],
  year: number,
  filter: string = "1A",
): string {
  const filtered = filterByPeriod(transactions, year, filter);
  return filtered.reduce((s, t) => s + t.amount, 0).toLocaleString("pt-AO");
}
