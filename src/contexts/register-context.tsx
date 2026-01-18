"use client";
import {
  createContext,
  ReactNode,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import { RegisterContextType, RegisterData } from "@/types/register";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "@/types/api";
import { UserService } from "../services/user-services";
import type { User } from "../types/user";

const RegisterContext = createContext<RegisterContextType | undefined>(
  undefined,
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
      return result;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Falha no registro";
      setError(message);
      throw new Error(message);
    }
  };

  const loginUser = async (email: string, password: string) => {
    // Don't clear error immediately - let the UI handle it
    setIsLoading(true);
    try {
      const result = await UserService.login(email, password);

      setToken(result.token);

      const userData = await UserService.getUser();
      setUser(userData);

      // Clear error only on successful login
      setError(null);

      return result;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Falha no login";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
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
        clearError,
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
