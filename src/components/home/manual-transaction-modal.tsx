"use client";

import React, { useState, useEffect } from "react";
import TextInput from "@/components/ui/text-input";
import Button from "@/components/ui/button";
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
    description: string;
    amount: number;
    transactionDate: string;
  }) => void | Promise<void>;
}

const ManualTransactionModal: React.FC<ManualTransactionModalProps> = ({
  isOpen,
  defaults,
  isSubmitting,
  onClose,
  onSubmit,
}) => {
  const [description, setDescription] = useState("");
  const [displayAmount, setDisplayAmount] = useState("");
  const [dateVal, setDateVal] = useState("");
  const [timeVal, setTimeVal] = useState("");

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
  }, [defaults, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!description || !displayAmount || !transactionDate) return;
    await onSubmit({ description, amount: parseFloat(parseAOA(displayAmount)) || 0, transactionDate });
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
          <TextInput
            label="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <TextInput
            label="Montante"
            type="text"
            inputMode="decimal"
            value={displayAmount}
            onChange={(e) => setDisplayAmount(maskAOAInput(e.target.value))}
            required
            placeholder="0,00"
          />
          <div className="grid grid-cols-2 gap-3">
            <TextInput
              label="Data"
              type="date"
              value={dateVal}
              onChange={(e) => setDateVal(e.target.value)}
              required
            />
            <TextInput
              label="Hora"
              type="time"
              value={timeVal}
              onChange={(e) => setTimeVal(e.target.value)}
              required
            />
          </div>
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
