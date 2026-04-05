import type { TransactionResponse } from "@/types/dtos/transaction.dto";

const getDateKey = (rawDate: string): string => {
  const parsed = new Date(rawDate);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }
  const fallback = rawDate.split("T")[0].split(" ")[0];
  return fallback || rawDate;
};

export function groupTransactionByDate(
  transactions: TransactionResponse[] | null,
): { title: string; data: TransactionResponse[] }[] {
  const grouped: Record<string, TransactionResponse[]> = {};

  transactions?.forEach((transaction) => {
    const dateKey = getDateKey(transaction.transactionDate);
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(transaction);
  });

  return Object.keys(grouped)
    .sort((a, b) => b.localeCompare(a))
    .map((date) => ({ title: date, data: grouped[date] }));
}

export const formatDateHeader = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Hoje";
  if (date.toDateString() === yesterday.toDateString()) return "Ontem";

  return date.toLocaleDateString("pt-AO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};
