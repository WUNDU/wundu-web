import { useState, useEffect } from "react";
import type { AddTransactionModalProps } from "@/src/types/modal";

// Modal Component
const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    description: "",
    transaction_date: new Date().toISOString().split("T")[0],
    category_id: "",
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave({
        ...formData,
        amount: parseFloat(formData.amount) || 0,
      });
    }
    handleClose();
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
      // Reset form when closing
      setFormData({
        type: "expense",
        amount: "",
        description: "",
        transaction_date: new Date().toISOString().split("T")[0],
        category_id: "",
      });
    }, 300);
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
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 bg-opacity-50 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
    >
      <div
        className={`bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all duration-300 ${
          isVisible
            ? "scale-100 translate-y-0 opacity-100"
            : "scale-95 translate-y-4 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              Adicionar Transação Manual
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Preencha os dados da transação
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Tipo de Transação */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Transação
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleChange("type", "income")}
                    className={`p-3 rounded-lg border-2 transition-all duration-300 ease-in-out ${
                      formData.type === "income"
                        ? "border-green-500 bg-green-50 text-green-700 shadow-md scale-105"
                        : "border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-sm"
                    }`}
                  >
                    <div className="font-medium">Receita</div>
                    <div className="text-xs opacity-75">Entrada de valor</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange("type", "expense")}
                    className={`p-3 rounded-lg border-2 transition-all duration-300 ease-in-out ${
                      formData.type === "expense"
                        ? "border-red-500 bg-red-50 text-red-700 shadow-md scale-105"
                        : "border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-sm"
                    }`}
                  >
                    <div className="font-medium">Despesa</div>
                    <div className="text-xs opacity-75">Saída de valor</div>
                  </button>
                </div>
              </div>

              {/* Valor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => handleChange("amount", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                    placeholder="0.00"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">€</span>
                  </div>
                </div>
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                  placeholder="Ex: Compra no supermercado"
                  required
                />
              </div>

              {/* Data */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data da Transação
                </label>
                <input
                  type="date"
                  value={formData.transaction_date}
                  onChange={(e) =>
                    handleChange("transaction_date", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>

              {/* Categoria */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria
                </label>
                <div className="relative">
                  <select
                    value={formData.category_id}
                    onChange={(e) =>
                      handleChange("category_id", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white transition-all duration-300"
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
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none transition-transform duration-300"
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
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-8 flex flex-col-reverse md:flex-row gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 hover:shadow-md transition-all duration-300 transform hover:scale-105"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={`flex-1 px-6 py-3 text-white rounded-lg font-medium hover:shadow-md transition-all duration-300 transform hover:scale-105 ${
                  formData.type === "income"
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                Adicionar Transação
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTransactionModal;
