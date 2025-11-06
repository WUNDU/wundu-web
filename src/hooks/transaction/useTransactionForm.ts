// src/hooks/useTransactionForm.ts
import type {
  TransactionFormData,
  TransactionFormField,
} from "@/src/types/transaction/transaction_type";
import { useState } from "react";

export const useTransactionForm = (
  initialData?: Partial<TransactionFormData>
) => {
  const [formData, setFormData] = useState<TransactionFormData>({
    type: "expense",
    userId: "",
    amount: "",
    description: "",
    transactionDate: new Date().toISOString().split("T")[0],
    category: "",
    ...initialData,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Agora aceita TransactionFormField como tipo para o field
  const handleChange = (field: TransactionFormField, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // ... restante do código permanece igual
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Montante deve ser maior que zero";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Descrição é obrigatória";
    }

    if (!formData.category) {
      newErrors.category_id = "Categoria é obrigatória";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      type: "expense",
      amount: "",
      userId: "",
      description: "",
      transactionDate: new Date().toISOString().split("T")[0],
      category: "",
    });
    setErrors({});
  };

  return {
    formData,
    errors,
    handleChange,
    validateForm,
    resetForm,
  };
};
