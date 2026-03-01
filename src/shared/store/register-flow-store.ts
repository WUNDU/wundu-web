import { create } from "zustand";

type RegisterStep = 1 | 2 | 3;

interface PersonalForm {
  name: string;
  email: string;
  phone: string;
}

interface PersonalErrors {
  email: string;
  phone: string;
}

interface SecurityForm {
  password: string;
  confirmPassword: string;
}

interface RegisterFlowState {
  step: RegisterStep;
  personalForm: PersonalForm;
  personalErrors: PersonalErrors;
  securityForm: SecurityForm;
  passwordError: string;
  isPasswordFocused: boolean;
  isSubmitting: boolean;
  isLoggingIn: boolean;
  autoLoginError: string | null;
  successVisible: boolean;
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: RegisterStep) => void;
  setPersonalField: (field: keyof PersonalForm, value: string) => void;
  setPersonalErrors: (errors: PersonalErrors) => void;
  setSecurityField: (field: keyof SecurityForm, value: string) => void;
  setPasswordError: (message: string) => void;
  setIsPasswordFocused: (focused: boolean) => void;
  setIsSubmitting: (submitting: boolean) => void;
  setIsLoggingIn: (loggingIn: boolean) => void;
  setAutoLoginError: (message: string | null) => void;
  setSuccessVisible: (visible: boolean) => void;
  resetFlow: () => void;
}

const initialState = {
  step: 1 as RegisterStep,
  personalForm: {
    name: "",
    email: "",
    phone: "",
  },
  personalErrors: {
    email: "",
    phone: "",
  },
  securityForm: {
    password: "",
    confirmPassword: "",
  },
  passwordError: "",
  isPasswordFocused: false,
  isSubmitting: false,
  isLoggingIn: false,
  autoLoginError: null,
  successVisible: false,
};

export const useRegisterFlowStore = create<RegisterFlowState>((set) => ({
  ...initialState,
  nextStep: () =>
    set((state) => ({ step: Math.min(3, state.step + 1) as RegisterStep })),
  prevStep: () =>
    set((state) => ({ step: Math.max(1, state.step - 1) as RegisterStep })),
  setStep: (step) => set({ step }),
  setPersonalField: (field, value) =>
    set((state) => ({
      personalForm: {
        ...state.personalForm,
        [field]: value,
      },
    })),
  setPersonalErrors: (errors) => set({ personalErrors: errors }),
  setSecurityField: (field, value) =>
    set((state) => ({
      securityForm: {
        ...state.securityForm,
        [field]: value,
      },
    })),
  setPasswordError: (message) => set({ passwordError: message }),
  setIsPasswordFocused: (focused) => set({ isPasswordFocused: focused }),
  setIsSubmitting: (submitting) => set({ isSubmitting: submitting }),
  setIsLoggingIn: (loggingIn) => set({ isLoggingIn: loggingIn }),
  setAutoLoginError: (message) => set({ autoLoginError: message }),
  setSuccessVisible: (visible) => set({ successVisible: visible }),
  resetFlow: () => set(initialState),
}));
