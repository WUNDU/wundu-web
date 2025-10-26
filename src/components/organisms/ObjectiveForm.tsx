import { useState } from "react";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import Select from "../atoms/Select";

const ObjectiveForm: React.FC = () => {
  const [objectiveName, setObjectiveName] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('');
  const [category, setCategory] = useState('');

  const priorityOptions = [
    { value: '', label: 'Selecione o tipo de prioridade' },
    { value: 'low', label: 'Baixa' },
    { value: 'medium', label: 'Média' },
    { value: 'high', label: 'Alta' },
  ];

  const categoryOptions = [
    { value: '', label: 'Selecione a categoria' },
    { value: 'travel', label: 'Viagem' },
    { value: 'car', label: 'Carro' },
    { value: 'house', label: 'Casa' },
    { value: 'education', label: 'Educação' },
    { value: 'other', label: 'Outro' },
  ];

  const handleSaveObjective = () => {
    // Lógica para salvar o objetivo aqui
    console.log('Salvar Objetivo:', {
      objectiveName,
      targetValue,
      dueDate,
      priority,
      category,
    });
  };

  const [isDateInput, setIsDateInput] = useState(false);

  return (
    <div className="flex flex-col gap-6 h-full min-h-0">
      {/* Adicione min-h-0 e flex-1 para controlar o overflow */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 min-h-0 overflow-auto">
        <Input
          label="Nome do objetivo"
          placeholder="Digite o nome do objectivo"
          value={objectiveName}
          onChange={(e) => setObjectiveName(e.target.value)}
          required
          type={""}
        />
        <Input
          label="Valor necessário"
          type="text"
          placeholder="Digite o valor"
          value={targetValue}
          onChange={(e) => setTargetValue(e.target.value)}
          required
        />

        <div className="relative flex w-full flex-col gap-2">
          <label className="text-gray-600">Data limite</label>
          <input
            type={isDateInput ? 'date' : 'text'}
            placeholder="Selecione a data"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            onFocus={() => setIsDateInput(true)}
            onBlur={() => !dueDate && setIsDateInput(false)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <Select
          label="Prioridade"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          options={priorityOptions}
          required
        />
        <Select
          label="Categoria"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={categoryOptions}
          required
        />
      </div>

      <Button onClick={handleSaveObjective}>
        Salvar Objectivo
      </Button>
    </div>
  );
};

export default ObjectiveForm;