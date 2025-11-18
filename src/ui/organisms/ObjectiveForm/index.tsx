import { TextInput, Button, Select } from "@/ui/atoms";
import { useObjectiveForm } from "@/hooks/objective/useObjectiveForm";

interface ObjectiveFormProps {
  onSuccess?: () => void;
}

const ObjectiveForm: React.FC<ObjectiveFormProps> = ({ onSuccess }) => {
  const { form, setField, save, status, errorMessage } = useObjectiveForm({ onSuccess });
  const today = new Date().toISOString().split("T")[0];

  const typeOptions = [
    { value: "SHORT_TERM", label: "Curto prazo" },
    { value: "LONG_TERM", label: "Longo prazo" },
  ];

  const categoryOptions = [
    { value: "", label: "Selecione a categoria" },
    { value: "travel", label: "Viagem" },
    { value: "car", label: "Carro" },
    { value: "house", label: "Casa" },
    { value: "education", label: "Educação" },
    { value: "other", label: "Outro" },
  ];

  const isSubmitting = status === "loading";

  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <div className="flex h-full w-full max-w-3xl flex-col rounded-3xl bg-white p-6 md:p-8 shadow-lg border border-gray-100 min-h-0">
        <div className="flex-1 overflow-y-auto pr-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            <TextInput
              label="Nome do objetivo"
              placeholder="Digite o nome do objectivo"
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
              required
              type="text"
            />
            <TextInput
              label="Valor necessário"
              type="number"
              placeholder="Digite o valor"
              value={form.targetAmount}
              onChange={(e) => setField("targetAmount", e.target.value)}
              required
            />

            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-gray-600 text-sm font-medium">Descrição</label>
              <textarea
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300 min-h-[96px]"
                placeholder="Conte-nos mais sobre este objetivo"
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
              />
            </div>

            <div className="flex w-full flex-col gap-2">
              <label className="text-gray-600 text-sm font-medium">
                Data inicial
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setField("startDate", e.target.value)}
                  placeholder="Selecione a data de início"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300 pr-10"
                  min={today}
                  required
                />
                <svg
                  className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
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
            <div className="flex w-full flex-col gap-2">
              <label className="text-gray-600 text-sm font-medium">
                Data final
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setField("endDate", e.target.value)}
                  placeholder="Selecione a data final"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300 pr-10"
                  min={form.startDate || today}
                  required
                />
                <svg
                  className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
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

            <Select
              label="Tipo"
              value={form.type}
              onChange={(e) => setField("type", e.target.value)}
              options={typeOptions}
              required
            />

            <Select
              label="Categoria"
              value={form.categoryId}
              onChange={(e) => setField("categoryId", e.target.value)}
              options={categoryOptions}
              required
            />
          </div>

          {errorMessage && (
            <p className="text-sm text-red-500">
              {errorMessage}
            </p>
          )}
        </div>

        <Button
          onClick={save}
          variant="warning"
          fullWidth
          className="mt-6 rounded-2xl py-4 text-base"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Salvando..." : "Salvar Objectivo"}
        </Button>
      </div>
    </div>
  );
};

export default ObjectiveForm;
