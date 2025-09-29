// src/context/RegisterContext.tsx
'use client';
import { createContext, ReactNode, useState, useMemo, useEffect } from 'react';
import { RegisterContextType, RegisterData } from '@/src/types/register';
import { AxiosError } from 'axios';
import { ApiErrorResponse } from '@/src/types/api';
import { UserService } from '../services/UserServices';
import type { User } from '../types/user';

const RegisterContext = createContext<RegisterContextType | undefined>(undefined);

export const RegisterProvider = ({ children }: { children: ReactNode }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<RegisterData>({});
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  });

  const [user, setUser] = useState<User | null>(() => {
    // Inicializar do sessionStorage ao carregar
    if (typeof window !== 'undefined') {
      const storedUser = sessionStorage.getItem('user');
      if (storedUser) {
        try {
          return JSON.parse(storedUser);
        } catch {
          return null;
        }
      }
    }
    return null;
  });

  // Sincronizar user com sessionStorage quando mudar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (user) {
        sessionStorage.setItem('user', JSON.stringify(user));
      } else {
        sessionStorage.removeItem('user');
      }
    }
  }, [user]);

  // Verificar se há token sem user (caso sessionStorage foi limpo)
  useEffect(() => {
    if (token && !user) {
      // Token existe mas user não - sessão inválida, fazer logout
      console.log('Token existe mas user não encontrado - fazendo logout');
      logoutUser();
    }
    setIsLoading(false);
  }, [token, user]);

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
    setIsLoading(true);
    try {
      const result = await UserService.login(email, password);
      console.log('Login bem-sucedido:', result);

      if (typeof window !== 'undefined') {
        localStorage.setItem('token', result.token);
        sessionStorage.setItem('user', JSON.stringify(result.user));
      }

      // Definir token e user ao mesmo tempo
      setToken(result.token);
      setUser(result.user);
    } catch (err: unknown) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Falha no login';
      console.log('Erro no loginUser:', message);
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const logoutUser = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      sessionStorage.removeItem('user');
    }
    setToken(null);
    setUser(null);
    setData({});
    setError(null);
    setCurrentStep(1);
  };

  const isAuthenticated = useMemo(() => !!token && !!user, [token, user]);

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
        user,
        isAuthenticated,
        isLoading,
      }}
    >
      {children}
    </RegisterContext.Provider>
  );
};

export { RegisterContext };