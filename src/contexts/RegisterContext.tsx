// src/context/RegisterContext.tsx
"use client";
import {
  createContext,
  ReactNode,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import { RegisterContextType, RegisterData } from "@/src/types/register";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "@/src/types/api";
import { UserService } from "../services/UserServices";
import type { User } from "../types/user";

const RegisterContext = createContext<RegisterContextType | undefined>(
  undefined
);

export const RegisterProvider = ({ children }: { children: ReactNode }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<RegisterData>({});
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      if (typeof window === "undefined") {
        setIsLoading(false);
        setInitialized(true);
        return;
      }

      const storedToken = localStorage.getItem("token");

      if (!storedToken) {
        setIsLoading(false);
        setInitialized(true);
        return;
      }

      try {
        setTokenState(storedToken);
        const userData = await UserService.getUser();
        setUser(userData);
      } catch (error) {
        console.log("Erro ao carregar usuário", error);
        localStorage.removeItem("token");
        setTokenState(null);
      } finally {
        setIsLoading(false);
        setInitialized(true);
      }
    };
    initializeAuth();
  }, []);

  const setToken = useCallback((newToken: string | null) => {
    setTokenState(newToken);
    if (typeof window !== "undefined") {
      if (newToken) {
        localStorage.setItem("token", newToken);
      } else {
        localStorage.removeItem("token");
      }
    }
  }, []);

  const setRegisterData = (newData: Partial<RegisterData>) => {
    setData((prevData) => ({ ...prevData, ...newData }));
  };

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  const registerUser = async (overrideData?: RegisterData) => {
    setError(null);
    try {
      const result = await UserService.register(overrideData || data);
      console.log("Registro bem-sucedido:", result);
      return result;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Falha no registro";
      console.log("Erro no registerUser:", message);
      setError(message);
      throw new Error(message);
    }
  };

  const loginUser = async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);
    try {
      const result = await UserService.login(email, password);
      console.log("Login bem-sucedido:", result);

      // Atualiza o token primeiro
      setToken(result.token);

      // Busca os dados do usuário
      const userData = await UserService.getUser();
      console.log("Dados do usuário:", userData);

      // Atualiza o usuário
      setUser(userData);

      return result;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Falha no login";
      console.log("Erro no loginUser:", message);
      setError(message);
      throw new Error(message);
    } finally {
      // IMPORTANTE: Só marca como não carregando após tudo estar pronto
      setIsLoading(false);
    }
  };

  const logoutUser = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      sessionStorage.removeItem("user");
    }
    setToken(null);
    setUser(null);
    setData({});
    setError(null);
    setCurrentStep(1);
  };

  const isAuthenticated = useMemo(() => {
    // Só considera autenticado quando já inicializou e tem token + user
    return initialized && !!token && !!user;
  }, [token, user, initialized]);

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
