'use client'
import { createContext, ReactNode, useState } from 'react';
import { RegisterContextType, RegisterData } from '@/src/types/register';
import { UserService } from '../services/UserServices';
import { AxiosError } from 'axios';
import { ApiErrorResponse } from '../types/api';

const RegisterContext = createContext<RegisterContextType | undefined>(undefined);

export const RegisterProvider = ({ children }: { children: ReactNode }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<RegisterData>({});
  const [error, setError] = useState<string | null>(null);

  const setRegisterData = (newData: Partial<RegisterData>) => {
    setData((prevData) => ({ ...prevData, ...newData }));
  };

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  const registerUser = async (overrideData?: RegisterData) => {
    setError(null);
    try {
      const result = await UserService.register(overrideData || data);
      console.log('Registro bem-sucedido:', result);
      return result;
    } catch (err: any) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      const message =
        axiosError.message ||
        axiosError.message ||
        'Falha no registro';
      setError(message);
      throw new Error(message);
    }
  };

  // Opcional: Função de login, se necessário
  const loginUser = async (email: string, password: string) => {
    setError(null);
    try {
      const token = await UserService.login(email, password);
      console.log('Login bem-sucedido:', token);
      return token;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return (
    <RegisterContext.Provider
      value={{ data, setRegisterData, nextStep, prevStep, currentStep, error, registerUser, loginUser }}
    >
      {children}
    </RegisterContext.Provider>
  );
};

export { RegisterContext };