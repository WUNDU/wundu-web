'use client'
import { createContext, ReactNode, useState } from "react";
import { RegisterContextType, RegisterData } from "@/src/types/register";

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

  const registerUser = async () => {
    setError(null);
    const payload = {
      name: data.name,
      email: data.email,
      phoneNumber: data.phone,
      password: data.password,
      planType: "FREE",
    };

    try {
      const response = await fetch('/api/v1/users', { // Mude para caminho relativo
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Falha no registro: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Registro bem-sucedido:', result);
      return result;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    }
  };

  return (
    <RegisterContext.Provider
      value={{ data, setRegisterData, nextStep, prevStep, currentStep, error, registerUser }}
    >
      {children}
    </RegisterContext.Provider>
  );
};

// Não exporte o contexto diretamente; use o hook em hooks/useRegisterContext.ts
export { RegisterContext }; // Opcional, se precisar em testes