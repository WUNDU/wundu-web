export interface Option {
  value: string;
  label: string;
}

// Província e município usam a API pública angolaprovinciasapi (ver
// src/components/ui/angola-location-select.tsx) em vez de uma lista estática.

export const GENDER_OPTIONS: Option[] = [
  { value: "MASCULINO", label: "Masculino" },
  { value: "FEMININO", label: "Feminino" },
  { value: "NAO_ESPECIFICADO", label: "Prefiro não especificar" },
];

export const MARITAL_STATUS_OPTIONS: Option[] = [
  { value: "SOLTEIRO", label: "Solteiro(a)" },
  { value: "CASADO", label: "Casado(a)" },
  { value: "DIVORCIADO", label: "Divorciado(a)" },
  { value: "VIUVO", label: "Viúvo(a)" },
  { value: "UNIAO_DE_FACTO", label: "União de facto" },
];

export const EMPLOYMENT_STATUS_OPTIONS: Option[] = [
  { value: "EMPREGADO", label: "Empregado(a)" },
  { value: "DESEMPREGADO", label: "Desempregado(a)" },
  { value: "CONTA_PROPRIA", label: "Conta própria" },
  { value: "ESTUDANTE", label: "Estudante" },
  { value: "REFORMADO", label: "Reformado(a)" },
];

export function labelFor(options: Option[], value?: string | null): string {
  return options.find((o) => o.value === value)?.label ?? "";
}
