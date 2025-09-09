export interface PasswordResetData {
  phoneOrEmail?: string;
  code?: string;
  newPassword?: string;
}
export interface PasswordResetContextType {
  data: PasswordResetData;
  setResetData: (newData: PasswordResetData) => void;
  currentStep: number;
  nextStep: () => void;
  prevStep: () => void;
  timer: number;
  setTimer: (value: number) => void;
  resetTimer: () => void;
  isCodeIncorrect: boolean;
  setIsCodeIncorrect: (isIncorrect: boolean) => void;
}