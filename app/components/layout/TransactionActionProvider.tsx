"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";
import TransactionForm, {
  type TransactionFormValues,
} from "../transaction/TransactionForm";
import { useTransaction } from "@/hooks/use-transaction";
import { useReceipt } from "./ReceiptProvider";
import { toTransactionDateTimeISO } from "app/utils/transaction-date";

type TransactionActionContextValue = {
  openTransactionForm: () => void;
};

const TransactionActionContext =
  createContext<TransactionActionContextValue | null>(null);

export function useTransactionAction() {
  const context = useContext(TransactionActionContext);
  if (!context) {
    throw new Error(
      "useTransactionAction must be used within TransactionActionProvider",
    );
  }
  return context;
}

export default function TransactionActionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname() ?? "";
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { createTransaction } = useTransaction({ autoFetch: false });
  // A barra de progresso dos comprovativos ocupa o fundo do ecrã: quando está
  // visível o FAB sobe por cima dela em vez de ficar escondido por baixo.
  const { trayVisible } = useReceipt();
  const isSupportedPage =
    pathname === "/home" ||
    pathname.startsWith("/home/transactions");

  async function handleSave(values: TransactionFormValues): Promise<boolean> {
    const flow = values.type === "income" ? "INCOME" : "EXPENSE";
    return createTransaction({
      type: flow,
      source: "MANUAL",
      amount: values.amount,
      description: values.description || undefined,
      transactionDate: toTransactionDateTimeISO(values.date, values.time),
      category: values.category ? { name: values.category, flow } : undefined,
    });
  }

  return (
    <TransactionActionContext.Provider
      value={{ openTransactionForm: () => setIsFormOpen(true) }}
    >
      {children}
      {isSupportedPage ? (
        <button
          type="button"
          onClick={() => setIsFormOpen(true)}
          aria-label="Nova transação"
          title="Nova transação"
          className="fixed right-6 z-40 flex size-[58px] items-center justify-center rounded-full bg-(--button-bg) text-white shadow-[0_8px_24px_rgba(5,61,196,0.1)] transition-[bottom,transform] duration-300 ease-out active:scale-95 lg:hidden"
          style={{
            bottom: `calc(${trayVisible ? 162 : 92}px + env(safe-area-inset-bottom))`,
          }}
        >
          <Plus className="size-6" strokeWidth={2.5} aria-hidden="true" />
        </button>
      ) : null}
      <TransactionForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSave}
      />
    </TransactionActionContext.Provider>
  );
}
