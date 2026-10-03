// app/components/dashboard/grouped-transacion-list.tsx
"use client";

import { useMemo } from "react";
import type { TransactionDTO } from "../../types/dto/transaction.dto";
import Transaction from "./Transaction";
import Calendar from "@/icons/calendar";
import { groupTransactionsByDate } from "app/utils/group-transactions";

interface GroupedTransactionListProps {
  transactions: TransactionDTO[];
  /** Nº máximo de transações visíveis (as mais recentes). Resto fica para a página de transações. */
  limit?: number;
}

const MAX_VISIBLE = 4;

export function GroupedTransactionList({
  transactions,
  limit = MAX_VISIBLE,
}: GroupedTransactionListProps) {
  const groups = useMemo(() => {
    const sorted = [...transactions].sort((a, b) =>
      (b.date ?? "").localeCompare(a.date ?? ""),
    );
    return groupTransactionsByDate(sorted.slice(0, limit));
  }, [transactions, limit]);

  if (groups.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 self-stretch">
      {groups.map((group) => (
        <div key={group.dateKey} className="flex flex-col gap-1 self-stretch">
          <div className="flex px-0.5 py-1.5 items-center gap-2 h-8">
            <Calendar height={20} width={18} />
            <p className="text-[14px] not-italic font-semibold leading-[155.99%] text-(--text-title) px-1.5">
              {group.label}
            </p>
          </div>
          {group.items.map((tx) => (
            <Transaction key={tx.id} transaction={tx} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default GroupedTransactionList;
