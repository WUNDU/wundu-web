// app/components/transaction/grouped-transaction-list.tsx
"use client";

import { useMemo } from "react";
import type { TransactionDTO } from "../../types/dto/transaction.dto";
import { groupTransactionsByDate } from "../../utils/group-transactions";
import TransactionItem from "./TransactionItem";
import Calendar from "@/icons/calendar";

interface GroupedTransactionListProps {
  transactions: TransactionDTO[];
  /** Nº máximo de transações visíveis (as mais recentes). */
  limit?: number;
  /** Chamado ao clicar numa transação (modo de edição). */
  onSelect?: (transaction: TransactionDTO) => void;
}

const MAX_VISIBLE = 10;

export function GroupedTransactionList({
  transactions,
  limit = MAX_VISIBLE,
  onSelect,
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
            <TransactionItem
              key={tx.id}
              transaction={tx}
              onSelect={onSelect ? () => onSelect(tx) : undefined}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default GroupedTransactionList;
