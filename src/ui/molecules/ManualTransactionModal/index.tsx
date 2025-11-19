"use client";

import { useEffect, useState } from "react";
import { Button } from "@/ui/atoms";
import TextInput from "@/ui/atoms/TextInput";

interface ManualTransactionModalProps {
  isOpen: boolean;
  defaults:
    | {
        description: string;
        amount: number | null;
        transactionDate: string;
      }
    | null;
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
  const [amount, setAmount] = useState("");
  const [transactionDate, setTransactionDate] = useState("");

  useEffect(() => {
    if (defaults) {
      setDescription(defaults.description ?? "");
      setAmount(defaults.amount !== null && defaults.amount !== undefined ? String(defaults.amount) : "");
      setTransactionDate(
        defaults.transactionDate
          ? defaults.transactionDate.slice(0, 19)
          : new Date().toISOString().slice(0, 19)
      );
    }
  }, [defaults, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!description || !amount || !transactionDate) {
      return;
    }
    await onSubmit({
      description,
      amount: Number(amount),
      transactionDate,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Completar transação</h2>
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
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="0"
          />

          <TextInput
            label="Data"
            type="datetime-local"
            value={transactionDate}
            onChange={(e) => setTransactionDate(e.target.value)}
            required
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
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
