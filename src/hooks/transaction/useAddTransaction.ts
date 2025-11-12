import { useState } from "react";
import { useTransactionForm } from "./useTransactionForm";
import { TransactionService } from "@/services/TransactionService";
import type { TransactionFormField } from "@/types/transaction/transaction_type";
import useRegisterContext from "@/contexts/useRegisterContext";

export const useAddTransactionModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string>("");

  console.log("Hook state - isOpen:", isOpen);

  const { user } = useRegisterContext();

  const { formData, errors, handleChange, validateForm, resetForm } =
    useTransactionForm();

  const openModal = () => {
    console.log("Opening modal...");
    setIsOpen(true);
    setSubmitError("");
  };

  const closeModal = () => {
    console.log("Closing modal...");
    setIsOpen(false);
    resetForm();
    setSubmitError("");
  };

  const handleSubmit = async (): Promise<boolean> => {
    setSubmitError("");

    if (!validateForm()) {
      return false;
    }

    setIsLoading(true);

    if (!user) {
      throw Error("invalid user");
    }

    try {
      await TransactionService.add({
        ...formData,
        amount: parseFloat(formData.amount),
        userId: user.id,
        category: {
          name: formData.category,
        },
      });

      closeModal();
      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro desconhecido";
      setSubmitError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormChange = (field: string, value: string) => {
    handleChange(field as TransactionFormField, value);
  };

  return {
    isOpen,
    isLoading,
    submitError,
    formData,
    errors,
    openModal,
    closeModal,
    handleChange: handleFormChange,
    handleSubmit,
  };
};
