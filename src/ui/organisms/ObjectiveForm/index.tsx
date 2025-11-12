import { TextInput } from "@/ui/atoms";
import { Button } from "@/ui/atoms";
import { Select } from "@/ui/atoms";
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
  const isDateInput = !!form.dueDate;

  return (
    <div className="flex flex-col gap-6 h-full min-h-0">
      {/* Adicione min-h-0 e flex-1 para controlar o overflow */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 min-h-0 overflow-auto">
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
          type="text"
          placeholder="Digite o valor"
          value={form.targetValue}
          onChange={(e) => setField("targetValue", e.target.value)}
          required
        />

        <div className="relative flex w-full flex-col gap-2">
          <label className="text-gray-600">Data limite</label>
          <input
            type={isDateInput ? "date" : "text"}
            placeholder="Selecione a data"
            value={form.dueDate}
            onChange={(e) => setField("dueDate", e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
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
        />
      </div>

      <Button onClick={save}>Salvar Objectivo</Button>
    </div>
  );
};

export default ObjectiveForm;
