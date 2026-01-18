import { useEffect, useState } from "react";
import { Button } from "@/ui/atoms";
import type { TransactionFormData } from "@/types/transaction/transaction_type";
import TextInput from "@/ui/atoms/text-input";
import { useUiStore } from "@/store/ui-store";
import { formatDateTimeLocal } from "@/utils/dateTime";

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

  useEffect(() => {
    if (isOpen && formData.type !== "expense") {
      onFormChange("type", "expense");
    }
  }, [formData.type, isOpen, onFormChange]);

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
        "Sua transação foi registrada com sucesso.",
      );
    }
  };

  if (!isOpen && !isVisible) return null;

  const categories = [
    { id: "food", name: "Alimentação" },
    { id: "transport", name: "Transporte" },
    { id: "housing", name: "Moradia" },
    { id: "health", name: "Saúde" },
    { id: "education", name: "Educação" },
    { id: "leisure", name: "Lazer" },
    { id: "services", name: "Serviços" },
    { id: "others", name: "Outros" },
  ];

  const maxTransactionDate = formatDateTimeLocal();
  const maxTransactionDateLabel = new Date(maxTransactionDate).toLocaleString(
    "pt-AO",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    },
  );

  const handleDateInvalid = (event: React.InvalidEvent<HTMLInputElement>) => {
    event.currentTarget.setCustomValidity(
      `Use uma data e hora iguais ou anteriores a ${maxTransactionDateLabel}.`,
    );
  };

  const handleDateInput = (event: React.FormEvent<HTMLInputElement>) => {
    event.currentTarget.setCustomValidity("");
  };

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
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-5 border-b border-gray-900/20">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                Nova transação
              </p>
              <h2 className="text-lg font-semibold text-white">
                Adicionar despesa
              </h2>
            </div>
            <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
              Despesa
            </span>
          </div>
          <p className="text-sm text-white/70 mt-2">
            Registre gastos e acompanhe o impacto no seu orçamento.
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
              {/* Transaction Summary */}
              <div className="rounded-2xl border border-gray-200 bg-gray-50/60 px-4 py-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Tipo selecionado
                    </p>
                    <p className="text-base font-semibold text-gray-900">
                      Despesa
                    </p>
                    <p className="text-sm text-gray-500">
                      Todas as transações registradas serão classificadas
                      automaticamente como saída de valores.
                    </p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">
                    Bloqueado
                  </span>
                </div>
              </div>

              {/* Amount */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <div className="relative">
                    <TextInput
                      label="Montante"
                      type="number"
                      placeholder="0,00"
                      value={formData.amount}
                      onChange={(e) => onFormChange("amount", e.target.value)}
                      isError={!!errors.amount}
                      required={true}
                      className="pr-1"
                    />
                    <span className="pointer-events-none absolute right-6 top-2/3 -translate-y-1/2 text-sm font-semibold uppercase text-gray-600">
                      kz
                    </span>
                  </div>
                  {errors.amount && (
                    <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
                  )}
                </div>

                {/* Date */}
                <div>
                  <TextInput
                    label="Data e hora"
                    type="datetime-local"
                    step={1}
                    max={maxTransactionDate}
                    value={formData.transactionDate}
                    onChange={(e) =>
                      onFormChange("transactionDate", e.target.value)
                    }
                    onInvalid={handleDateInvalid}
                    onInput={handleDateInput}
                    required={true}
                  />
                  {errors.transactionDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.transactionDate}
                    </p>
                  )}
                </div>
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
                      errors.category_id ? "border-red-500" : "border-gray-300"
                    }`}
                    required
                  >
                    <option value="">Selecione uma categoria</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
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
                className="flex-1 rounded-lg bg-red-500 px-6 py-3 text-white font-semibold shadow-lg transition-transform hover:scale-[1.01] hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
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
