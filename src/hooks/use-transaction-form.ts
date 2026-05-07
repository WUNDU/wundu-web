"use client";

import { useState } from "react";
import type {
  TransactionFormData,
  TransactionFormField,
} from "@/types/dtos/transaction.dto";
import {
  formatDateTimeLocal,
  isFutureDateTime,
  normalizeDateTimePayload,
} from "@/utils/date-time";

export const useTransactionForm = (initialData?: Partial<TransactionFormData>) => {
  const [formData, setFormData] = useState<TransactionFormData>({
    type: "EXPENSE",
    userId: "",
    amount: "",
    description: "",
    transactionDate: formatDateTimeLocal(),
    category: "",
    ...initialData,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: TransactionFormField, value: string) => {
    const normalizedValue =
      field === "transactionDate" ? normalizeDateTimePayload(value) : value;
    setFormData((prev) => ({ ...prev, [field]: normalizedValue }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.amount || parseFloat(formData.amount) <= 0)
      newErrors.amount = "Montante deve ser maior que zero";
    if (!formData.description.trim())
      newErrors.description = "Descrição é obrigatória";
    if (!formData.category) newErrors.category = "Categoria é obrigatória";
    if (!formData.transactionDate) {
      newErrors.transactionDate = "Data e hora são obrigatórias";
    } else if (isFutureDateTime(formData.transactionDate)) {
      newErrors.transactionDate = "Data/hora não pode estar no futuro";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      type: "EXPENSE",
      amount: "",
      userId: "",
      description: "",
      transactionDate: formatDateTimeLocal(),
      category: "",
    });
    setErrors({});
  };

  return { formData, errors, handleChange, validateForm, resetForm };
};
