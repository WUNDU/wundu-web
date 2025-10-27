"use client";
import { useContext } from "react";
import { RegisterContext } from "@/src/contexts/RegisterContext";
import { RegisterContextType } from "@/src/types/register";

export const useRegisterContext = (): RegisterContextType => {
  const context = useContext(RegisterContext);
  if (!context) {
    throw new Error(
      "useRegisterContext must be used within a RegisterProvider"
    );
  }
  return context;
};

export default useRegisterContext;
