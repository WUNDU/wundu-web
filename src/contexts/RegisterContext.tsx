'use client'
import { createContext, useContext, useState } from "react";
import { RegisterContextType, RegisterData } from "../types/register";

const RegisterContext = createContext<RegisterContextType | undefined>(undefined);

export const useRegisterContext = () => {
  const context = useContext(RegisterContext);
  if (!context) {
    throw new Error("useRegisterContext must be used within a RegisterProvider");
  }
  return context;
};

// Provedor do Contexto
export const RegisterProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<RegisterData>({});

  const setRegisterData = (newData: RegisterData) => {
    setData((prevData) => ({ ...prevData, ...newData }));
  };

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  return (
    <RegisterContext.Provider value={{ data, setRegisterData, nextStep, prevStep, currentStep }
    }>
      {children}
    </RegisterContext.Provider>
  );
};