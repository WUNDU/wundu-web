export interface RegisterData {
  name?: string;
  email?: string;
  phone?: string; // Usado internamente; mapeado para phoneNumber na API
  password?: string;
}

export interface RegisterContextType {
  data: RegisterData;
  setRegisterData: (newData: Partial<RegisterData>) => void; // Use Partial para updates parciais
  nextStep: () => void;
  prevStep: () => void;
  currentStep: number;
  error: string | null; // Novo: para erros globais (ex.: API falha)
  registerUser: () => Promise<any>; // Novo: função async para chamada API; retorne any ou tipo específico da resposta
}