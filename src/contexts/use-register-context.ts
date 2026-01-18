"use client";
import { useContext } from "react";
import { RegisterContext } from "@/contexts/register-context";
import { RegisterContextType } from "@/types/register";

export const useRegisterContext = (): RegisterContextType => {
  const context = useContext(RegisterContext);
  if (!context) {
    throw new Error(
      "useRegisterContext must be used within a RegisterProvider",
    );
  }
  return context;
};

export default useRegisterContext;
