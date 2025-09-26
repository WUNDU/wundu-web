export interface RegisterData {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
}

export interface RegisterContextType {
  data: RegisterData;
  setRegisterData: (newData: Partial<RegisterData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  currentStep: number;
  error: string | null;
  registerUser: (overrideData?: RegisterData) => Promise<any>;
  loginUser: (email: string, password: string) => Promise<string>;
  logoutUser: () => void;
  token: string | null;
  isAuthenticated: boolean;
}