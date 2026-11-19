import type { TransactionDTO } from "app/types/dto/transaction.dto";
import type { TransactionGroup } from "app/types/transaction";


const strip = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

/** "2026-09-20" -> Date local (evita desvio de fuso do `new Date("YYYY-MM-DD")` que interpreta como UTC). */
function parseLocal(raw: string): Date {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(raw.trim());
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return new Date(raw);
}

function fullDate(date: Date): string {
  const formatted = date.toLocaleDateString("pt-AO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export function formatGroupLabel(dateInput: string | Date): string {
  const date =
    typeof dateInput === "string" ? parseLocal(dateInput) : dateInput;
  const diff = Math.round(
    (strip(new Date()).getTime() - strip(date).getTime()) / 86_400_000,
  );
  if (diff === 0) return `Hoje, ${fullDate(date)}`;
  if (diff === 1) return `Ontem, ${fullDate(date)}`;
  return fullDate(date);
}

export function groupTransactionsByDate(
  txs: TransactionDTO[],
): TransactionGroup[] {
  const map = new Map<string, TransactionDTO[]>();

  for (const tx of txs) {
    const raw = tx.date ?? tx.transactionDate ?? tx.createdAt ?? "";
    if (!raw) continue;
    const d = parseLocal(raw);
    if (Number.isNaN(d.getTime())) continue;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(tx);
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => b.localeCompare(a)) // mais recentes primeiro
    .map(([dateKey, items]) => ({
      dateKey,
      label: formatGroupLabel(dateKey),
      items,
    }));
}
