"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useTransaction } from "@/hooks/use-transaction";
import { useTransactionForm } from "@/hooks/use-transaction-form";
import type { TransactionFormField } from "@/types/dtos/transaction.dto";

export const useAddTransactionModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string>("");
  const { user } = useAuth();
  const { addTransaction: add, isRefreshing } = useTransaction();
  const { formData, errors, handleChange, validateForm, resetForm } =
    useTransactionForm();

  const openModal = () => {
    setIsOpen(true);
    setSubmitError("");
  };

  const closeModal = () => {
    setIsOpen(false);
    resetForm();
    setSubmitError("");
  };

  const handleSubmit = async (): Promise<boolean> => {
    setSubmitError("");
    if (!validateForm()) return false;
    if (!user) throw Error("invalid user");
    const success = await add({
      ...formData,
      source: "MANUAL",
      type: "expense",
      amount: parseFloat(formData.amount),
      userId: user.id,
      category: { name: formData.category },
    });
    if (success) closeModal();
    return success;
  };

  const handleFormChange = (field: string, value: string) => {
    handleChange(field as TransactionFormField, value);
  };

  return {
    isOpen,
    isLoading: isRefreshing,
    submitError,
    formData,
    errors,
    openModal,
    closeModal,
    handleChange: handleFormChange,
    handleSubmit,
  };
};
