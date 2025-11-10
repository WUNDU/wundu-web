export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const TransactionValidation = {
  validateAmount: (amount: string): string => {
    if (!amount) return "Montante é obrigatório";
    if (parseFloat(amount) <= 0) return "Montante deve ser maior que zero";
    return "";
  },

  validateDescription: (description: string): string => {
    if (!description.trim()) return "Descrição é obrigatória";
    if (description.length < 2) return "Descrição muito curta";
    return "";
  },

  validateCategory: (categoryId: string): string => {
    if (!categoryId) return "Categoria é obrigatória";
    return "";
  },

  validateForm: (formData: {
    amount: string;
    description: string;
    category_id: string;
  }): ValidationResult => {
    const errors = {
      amount: TransactionValidation.validateAmount(formData.amount),
      description: TransactionValidation.validateDescription(
        formData.description
      ),
      category_id: TransactionValidation.validateCategory(formData.category_id),
    };

    const isValid = Object.values(errors).every((error) => error === "");

    return { isValid, errors };
  },
};
