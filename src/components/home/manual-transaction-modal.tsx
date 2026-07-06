"use client";

import React, { useState, useEffect } from "react";
import TextInput from "@/components/ui/text-input";
import Button from "@/components/ui/button";
import CategorySelect from "@/components/ui/category-select";
import { formatAOA, maskAOAInput, parseAOA } from "@/lib/currency";

export interface ManualTransactionModalProps {
  isOpen: boolean;
  defaults: {
    description: string;
    amount: number | null;
    transactionDate: string;
  } | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: {
    type: "EXPENSE" | "INCOME";
    description: string;
    amount: number;
    transactionDate: string;
    category: string;
  }) => void | Promise<void>;
}

const ManualTransactionModal: React.FC<ManualTransactionModalProps> = ({
  isOpen,
  defaults,
  isSubmitting,
  onClose,
  onSubmit,
}) => {
  const [type, setType] = useState<"EXPENSE" | "INCOME">("EXPENSE");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [displayAmount, setDisplayAmount] = useState("");
  const [dateVal, setDateVal] = useState("");
  const [timeVal, setTimeVal] = useState("");
  const [fieldErrors, setFieldErrors] = useState({ description: "", amount: "", date: "", category: "" });

  const transactionDate = dateVal && timeVal ? `${dateVal}T${timeVal}:00` : dateVal ? `${dateVal}T00:00:00` : "";

  useEffect(() => {
    if (defaults) {
      setDescription(defaults.description ?? "");
      setDisplayAmount(
        defaults.amount !== null && defaults.amount !== undefined
          ? formatAOA(defaults.amount)
          : "",
      );
      const raw = defaults.transactionDate
        ? defaults.transactionDate.slice(0, 19)
        : new Date().toISOString().slice(0, 19);
      const [d, t = ""] = raw.split("T");
      setDateVal(d ?? "");
      setTimeVal(t.slice(0, 5));
    }
    setFieldErrors({ description: "", amount: "", date: "", category: "" });
  }, [defaults, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setType("EXPENSE");
      setCategory("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const errs = {
      description: description.trim() ? "" : "Insira uma descrição",
      amount: displayAmount.trim() ? "" : "Insira o montante",
      date: dateVal ? "" : "Selecione uma data",
      category: category ? "" : "Selecione uma categoria",
    };
    if (errs.description || errs.amount || errs.date || errs.category) {
      setFieldErrors(errs);
      return;
    }
    await onSubmit({
      type,
      description,
      amount: parseFloat(parseAOA(displayAmount)) || 0,
      transactionDate,
      category,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl bg-white p-4 shadow-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4">
          <h2 className="text-sm font-bold text-gray-900">
            Completar transação
          </h2>
          <p className="text-sm text-gray-500">
            Insira os dados principais para concluir o comprovativo.
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex rounded-xl bg-slate-100 p-1">
            {(["EXPENSE", "INCOME"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`flex-1 rounded-lg py-2 text-xs font-bold transition-colors ${
                  type === t
                    ? t === "EXPENSE"
                      ? "bg-red-500 text-white"
                      : "bg-emerald-500 text-white"
                    : "text-slate-500"
                }`}
              >
                {t === "EXPENSE" ? "Despesa" : "Receita"}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-1">
            <TextInput
              label="Descrição"
              value={description}
              onChange={(e) => { setDescription(e.target.value); setFieldErrors((p) => ({ ...p, description: "" })); }}
              isError={!!fieldErrors.description}
            />
            {fieldErrors.description && (
              <p role="alert" className="text-xs font-semibold text-red-600">{fieldErrors.description}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <TextInput
              label="Montante"
              type="text"
              inputMode="decimal"
              value={displayAmount}
              onChange={(e) => { setDisplayAmount(maskAOAInput(e.target.value)); setFieldErrors((p) => ({ ...p, amount: "" })); }}
              placeholder="0,00"
              isError={!!fieldErrors.amount}
            />
            {fieldErrors.amount && (
              <p role="alert" className="text-xs font-semibold text-red-600">{fieldErrors.amount}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <div className="grid grid-cols-2 gap-3">
              <TextInput
                label="Data"
                type="date"
                value={dateVal}
                onChange={(e) => { setDateVal(e.target.value); setFieldErrors((p) => ({ ...p, date: "" })); }}
                isError={!!fieldErrors.date}
              />
              <TextInput
                label="Hora"
                type="time"
                value={timeVal}
                onChange={(e) => setTimeVal(e.target.value)}
              />
            </div>
            {fieldErrors.date && (
              <p role="alert" className="text-xs font-semibold text-red-600">{fieldErrors.date}</p>
            )}
          </div>
          <CategorySelect
            value={category}
            onChange={(name) => { setCategory(name); setFieldErrors((p) => ({ ...p, category: "" })); }}
            valueType="name"
            flow={type}
            label="Categoria"
            error={fieldErrors.category}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Concluir"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManualTransactionModal;
