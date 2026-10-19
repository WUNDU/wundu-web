"use client";

import React from "react";

type TransactionTypeToggleProps = {
  value: "expense" | "income";
  onChange: (next: "expense" | "income") => void;
  className?: string;
};

/** Selector "Gastos | Receitas" reutilizado no formulário e no modo comprovativo. */
export default function TransactionTypeToggle({
  value,
  onChange,
  className = "",
}: TransactionTypeToggleProps) {
  return (
    <div
      className={`relative flex p-1 items-start gap-1 rounded-xl border border-(--card-barras) bg-(--background) w-full ${className}`}
    >
      <span
        aria-hidden="true"
        className={`absolute top-1 bottom-1 left-1 w-[calc(50%-6px)] rounded-xl transition-transform duration-300 ease-out ${value === "income" ? "translate-x-[calc(100%+4px)] bg-primary-300/20" : "translate-x-0 bg-danger-300/10"}`}
      />
      <button
        type="button"
        onClick={() => onChange("expense")}
        aria-pressed={value === "expense"}
        className="relative flex py-2.5 px-4 justify-center items-center flex-1 self-stretch rounded-xl hover:bg-neutrals-300/10 active:bg-neutrals-300/20 active:scale-95 transition-all lg:py-3"
      >
        <p
          className={`${value === "expense" ? "text-danger-300" : "text-(--text-title)"} font-manrope text-sm font-medium leading-6 transition-colors lg:text-base`}
        >
          Gastos
        </p>
      </button>
      <button
        type="button"
        onClick={() => onChange("income")}
        aria-pressed={value === "income"}
        className="relative flex py-2.5 px-4 justify-center items-center flex-1 self-stretch rounded-xl hover:bg-neutrals-300/10 active:bg-neutrals-300/20 active:scale-95 transition-all lg:py-3"
      >
        <p
          className={`${value === "income" ? "text-primary-300" : "text-(--text-title)"} font-manrope text-sm font-medium leading-6 transition-colors lg:text-base`}
        >
          Receitas
        </p>
      </button>
    </div>
  );
}
