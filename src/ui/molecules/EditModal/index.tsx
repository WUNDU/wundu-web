import { useEffect, useState } from "react";
import type { EditModalProps } from "@/types/modal";

const sanitizeCurrencyInput = (value?: string | number | null) => {
  if (value === undefined || value === null) return "";
  if (typeof value === "number") return value.toString();
  return value.replace(/[^\\d]/g, "");
};

const formatDateDisplay = (value?: string) => {
  if (!value) return "";
  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toLocaleDateString("pt-AO");
  }
  return value;
};

const buildInitialFormData = (objective?: any) => ({
  nome: objective?.title || "",
  valorNecessario: sanitizeCurrencyInput(
    objective?.valorAlvo ?? objective?.targetAmount ?? ""
  ),
  valorArrecadado: sanitizeCurrencyInput(
    objective?.valorPoupado ?? objective?.currentAmount ?? ""
  ),
  dataLimite: formatDateDisplay(objective?.dataLimite ?? objective?.endDate ?? ""),
  categoria: objective?.categoria ?? objective?.categoryId ?? "",
  prioridade: objective?.prioridade ?? "Alta",
});

const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  objective,
}) => {
  const [formData, setFormData] = useState(() => buildInitialFormData(objective));

  useEffect(() => {
    setFormData(buildInitialFormData(objective));
  }, [objective]);

  if (!isOpen || !objective) return null;

  const categoryOptions = [
    { value: "", label: "Selecione a categoria" },
    { value: "travel", label: "Viagem" },
    { value: "car", label: "Carro" },
    { value: "house", label: "Casa" },
    { value: "education", label: "Educação" },
    { value: "other", label: "Outro" },
  ];

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/10 bg-opacity-50">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="p-6 md:p-8">
          {/* Header */}
          <h2 className="text-xl md:text-2xl font-bold text-center mb-6 md:mb-8">
            Editar objectivo financeiro
          </h2>

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Nome do objetivo */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do objetivo
              </label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => handleChange("nome", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Comprar uma moto"
              />
            </div>

            {/* Valor necessário */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor necessário
              </label>
              <input
                type="text"
                value={formData.valorNecessario}
                onChange={(e) =>
                  handleChange("valorNecessario", e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="800.000"
              />
            </div>

            {/* Data limite */}
            <div className="hidden md:col-span-1 md:block">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data limite
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.dataLimite}
                  onChange={(e) => handleChange("dataLimite", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="01/01/2026"
                />
                <svg
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
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

            {/* Valor arrecadado */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor arrecadado
              </label>
              <input
                type="text"
                value={formData.valorArrecadado}
                onChange={(e) =>
                  handleChange("valorArrecadado", e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="400.000"
              />
            </div>

            {/* Categoria */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria
              </label>
              <div className="relative">
                <select
                  value={formData.categoria}
                  onChange={(e) => handleChange("categoria", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                >
                  {categoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <svg
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
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

            {/* Prioridade */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prioridade
              </label>
              <div className="relative">
                <select
                  value={formData.prioridade}
                  onChange={(e) => handleChange("prioridade", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                >
                  <option value="Alta">Alta</option>
                  <option value="Média">Média</option>
                  <option value="Baixa">Baixa</option>
                </select>
                <svg
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
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
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-6 py-3 bg-yellow-400 text-white rounded-lg font-medium hover:bg-yellow-500 transition-colors"
            >
              Salvar Alterações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
