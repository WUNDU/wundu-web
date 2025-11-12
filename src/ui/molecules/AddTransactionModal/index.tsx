import { useEffect, useState } from "react";
import { Button } from "@/ui/atoms";
import type { TransactionFormData } from "@/types/transaction/transaction_type";
import TextInput from "@/ui/atoms/TextInput";
import { useUiStore } from "@/store/uiStore";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => Promise<boolean>;
  formData: TransactionFormData;
  errors: Record<string, string>;
  isLoading: boolean;
  submitError: string;
  onFormChange: (field: string, value: string) => void;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  errors,
  isLoading,
  submitError,
  onFormChange,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const { showNotification } = useUiStore();
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onSubmit();

    if (success) {
      showNotification(
        "success",
        "Transação Adicionada!",
        "Sua transação foi registrada com sucesso."
      );
    }
  };

  if (!isOpen && !isVisible) return null;

  const categories = [
    { id: "1", name: "Alimentação" },
    { id: "2", name: "Transporte" },
    { id: "3", name: "Moradia" },
    { id: "4", name: "Saúde" },
    { id: "5", name: "Educação" },
    { id: "6", name: "Lazer" },
    { id: "7", name: "Salário" },
    { id: "8", name: "Investimentos" },
  ];

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
    >
      <div
        className={`bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-lg transform transition-all duration-300 ${
          isVisible
            ? "scale-100 translate-y-0 opacity-100"
            : "scale-95 translate-y-4 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Adicionar Transação
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Preencha os dados da transação
          </p>
        </div>

        <div className="p-6">
          {/* Error Message */}
          {submitError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              {/* Transaction Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Tipo de Transação
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => onFormChange("type", "income")}
                    className={`p-4 rounded-lg border transition-all duration-200 ${
                      formData.type === "income"
                        ? "border-green-500 bg-green-500 text-white shadow-sm"
                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <div className="font-medium text-sm">Receita</div>
                    <div className="text-xs opacity-90 mt-1">
                      Entrada de valor
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => onFormChange("type", "expense")}
                    className={`p-4 rounded-lg border transition-all duration-200 ${
                      formData.type === "expense"
                        ? "border-red-500 bg-red-500 text-white shadow-sm"
                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <div className="font-medium text-sm">Despesa</div>
                    <div className="text-xs opacity-90 mt-1">
                      Saída de valor
                    </div>
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-200 my-2"></div>

              {/* Amount */}
              <TextInput
                label="Montante"
                type="number"
                placeholder="0,00"
                value={formData.amount}
                onChange={(e) => onFormChange("amount", e.target.value)}
                isError={!!errors.amount}
                required={true}
              />
              {errors.amount && (
                <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
              )}
              <div className="flex justify-end -mt-4">
                <span className="text-sm text-gray-500">kz</span>
              </div>

              {/* Description */}
              <TextInput
                label="Descrição"
                type="text"
                placeholder="Ex: Compra no supermercado"
                value={formData.description}
                onChange={(e) => onFormChange("description", e.target.value)}
                isError={!!errors.description}
                required={true}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}

              {/* Date */}
              <TextInput
                label="Data e Hora"
                type="date"
                value={formData.transactionDate}
                onChange={(e) =>
                  onFormChange("transactionDate", e.target.value)
                }
                required={true}
                placeholder={""}
              />

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria
                </label>
                <div className="relative">
                  <select
                    value={formData.category}
                    onChange={(e) => onFormChange("category", e.target.value)}
                    className={`w-full rounded-xl border px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 bg-white transition-colors appearance-none ${
                      errors.category ? "border-red-500" : "border-gray-300"
                    }`}
                    required
                  >
                    <option value="">Selecione uma categoria</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <svg
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
                {errors.category_id && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.category_id}
                  </p>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 my-6"></div>

            {/* Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <Button
                variant="secondary"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <button
                type="submit"
                disabled={isLoading}
                className={`flex-1 rounded-lg px-6 py-3 text-white font-semibold shadow-lg transition-colors hover:scale-101 disabled:opacity-50 disabled:cursor-not-allowed ${
                  formData.type === "income"
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {isLoading ? "Adicionando..." : "Adicionar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTransactionModal;
