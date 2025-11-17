import { TextInput, Button, Select } from "@/ui/atoms";
import { useObjectiveForm } from "@/hooks/objective/useObjectiveForm";

const ObjectiveForm: React.FC = () => {
  const { form, setField, save } = useObjectiveForm((data) => {
    console.log("Salvar Objetivo:", data);
  });

  const priorityOptions = [
    { value: "", label: "Selecione o tipo de prioridade" },
    { value: "low", label: "Baixa" },
    { value: "medium", label: "Média" },
    { value: "high", label: "Alta" },
  ];

  const categoryOptions = [
    { value: "", label: "Selecione a categoria" },
    { value: "travel", label: "Viagem" },
    { value: "car", label: "Carro" },
    { value: "house", label: "Casa" },
    { value: "education", label: "Educação" },
    { value: "other", label: "Outro" },
  ];

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex h-full w-full flex-col rounded-3xl bg-white p-6 shadow-lg border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 flex-1">
          <TextInput
            label="Nome do objetivo"
            placeholder="Digite o nome do objectivo"
            value={form.objectiveName}
            onChange={(e) => setField("objectiveName", e.target.value)}
            required
            type="text"
          />
          <TextInput
            label="Valor necessário"
            type="number"
            placeholder="Digite o valor"
            value={form.targetValue}
            onChange={(e) => setField("targetValue", e.target.value)}
            required
          />

          <div className="flex w-full flex-col gap-2">
            <label className="text-gray-600 text-sm font-medium">
              Data limite
            </label>
            <div className="relative">
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setField("dueDate", e.target.value)}
                placeholder="Selecione a data"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300 pr-10"
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
            label="Prioridade"
            value={form.priority}
            onChange={(e) => setField("priority", e.target.value)}
            options={priorityOptions}
            required
          />

          <Select
            label="Categoria"
            value={form.category}
            onChange={(e) => setField("category", e.target.value)}
            options={categoryOptions}
            required
            className="md:col-start-1"
          />
        </div>

        <Button
          onClick={save}
          variant="warning"
          fullWidth
          className="mt-6 rounded-2xl py-4 text-base"
        >
          Salvar Objectivo
        </Button>
      </div>
    </div>
  );
};

export default ObjectiveForm;
