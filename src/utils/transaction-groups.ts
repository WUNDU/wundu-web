import type { TransactionDTO } from "@/types/dtos/transaction.dto";

export interface TransactionGroup {
  dateKey: string;
  label: string;
  items: TransactionDTO[];
}

export function formatDateLabel(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const strip = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diff = (strip(now).getTime() - strip(date).getTime()) / 86_400_000;
  if (diff === 0) return "Hoje";
  if (diff === 1) return "Ontem";
  return date.toLocaleDateString("pt-PT", { day: "numeric", month: "long", year: "numeric" });
}

export function groupByDate(txs: TransactionDTO[]): TransactionGroup[] {
  const map = new Map<string, TransactionDTO[]>();
  for (const tx of txs) {
    const d = tx.transactionDate ? new Date(tx.transactionDate) : new Date(tx.createdAt ?? Date.now());
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(tx);
  }
  return Array.from(map.entries())
    .sort(([a],[b]) => b.localeCompare(a))
    .map(([dateKey, items]) => ({ dateKey, label: formatDateLabel(dateKey), items }));
}
