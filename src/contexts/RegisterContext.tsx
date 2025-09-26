'use client'
import { createContext, ReactNode, useState, useMemo } from 'react';
import { RegisterContextType, RegisterData } from '@/src/types/register';
import { AxiosError } from 'axios';
import { ApiErrorResponse } from '@/src/types/api';
import { UserService } from '../services/UserServices';

const RegisterContext = createContext<RegisterContextType | undefined>(undefined);

export const RegisterProvider = ({ children }: { children: ReactNode }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<RegisterData>({});
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }); // Inicialização lazy para evitar erro no SSR

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
    } catch (err: unknown) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Falha no registro';
      console.log('Erro no registerUser:', message);
      setError(message);
      throw new Error(message);
    }
  };

  const loginUser = async (email: string, password: string) => {
    setError(null);
    try {
      const token = await UserService.login(email, password);
      console.log('Login bem-sucedido:', token);
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
      }
      setToken(token);
      return token;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Falha no login';
      console.log('Erro no loginUser:', message);
      setError(message);
      throw new Error(message);
    }
  };

  const logoutUser = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    setToken(null);
    setData({});
    setError(null);
    setCurrentStep(1);
  };

  const isAuthenticated = useMemo(() => !!token, [token]);

  return (
    <RegisterContext.Provider
      value={{
        data,
        setRegisterData,
        nextStep,
        prevStep,
        currentStep,
        error,
        registerUser,
        loginUser,
        logoutUser,
        token,
        isAuthenticated,
      }}
    >
      {children}
    </RegisterContext.Provider>
  );
};

export { RegisterContext };