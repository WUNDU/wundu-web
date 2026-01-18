import { useState } from "react";
import { useTransactionForm } from "./use-transaction-form";
import { TransactionService } from "@/services/transaction-service";
import type { TransactionFormField } from "@/types/transaction/transaction_type";
import useRegisterContext from "@/contexts/use-register-context";
import { useUiStore } from "@/store/ui-store";

export const useAddTransactionModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string>("");

  const { user } = useRegisterContext();
  const { showNotification } = useUiStore();

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
        type: "expense",
        amount: parseFloat(formData.amount),
        userId: user.id,
        category: {
          name: formData.category,
        },
      });

      closeModal();
      showNotification(
        "success",
        "Transação adicionada",
        "O movimento foi registado com sucesso.",
      );
      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro desconhecido";
      setSubmitError(message);
      showNotification(
        "error",
        "Erro ao adicionar",
        message || "Não foi possível concluir o registo.",
      );
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
