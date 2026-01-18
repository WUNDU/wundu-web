import React from "react";
import { Transaction } from "@/shared/components/transaction";
import { TransactionsListProps } from "@/types/panel";

export const TransactionsList: React.FC<TransactionsListProps> = ({
  transactions,
}) => {
  return (
    <div className="mt-6 p-4 bg-gray-100 rounded-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Categorias</h2>
        <span className="text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m19.5 8.25-7.5 7.5-7.5-7.5"
            />
          </svg>
        </span>
      </div>
      <div className="mt-4">
        {transactions.map((tx, index) => (
          <Transaction key={index} {...tx} />
        ))}
      </div>
    </div>
  );
};
