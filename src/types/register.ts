export interface RegisterData {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
}

export interface RegisterContextType {
  data: RegisterData;
  setRegisterData: (newData: RegisterData) => void;
  nextStep: () => void;
  prevStep: () => void;
  currentStep: number;
}