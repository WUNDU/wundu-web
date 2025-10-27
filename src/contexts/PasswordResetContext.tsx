"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { PasswordResetContextType, PasswordResetData } from "../types/password";

const PasswordResetContext = createContext<
  PasswordResetContextType | undefined
>(undefined);

export const usePasswordResetContext = () => {
  const context = useContext(PasswordResetContext);
  if (!context) {
    throw new Error(
      "usePasswordResetContext must be used within a PasswordResetProvider"
    );
  }
  return context;
};

// Provedor do Contexto
export const PasswordResetProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<PasswordResetData>({});
  const [timer, setTimer] = useState(120);
  const [isCodeIncorrect, setIsCodeIncorrect] = useState(false);

  const setResetData = (newData: PasswordResetData) => {
    setData((prevData) => ({ ...prevData, ...newData }));
  };

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);
  const resetTimer = () => setTimer(120);

  useEffect(() => {
    let countdown: NodeJS.Timeout | null = null;
    if (currentStep === 2 && timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (countdown) {
        clearInterval(countdown);
      }
    };
  }, [currentStep, timer]);

  return (
    <PasswordResetContext.Provider
      value={{
        data,
        setResetData,
        currentStep,
        nextStep,
        prevStep,
        timer,
        setTimer,
        resetTimer,
        isCodeIncorrect,
        setIsCodeIncorrect,
      }}
    >
      {children}
    </PasswordResetContext.Provider>
  );
};
