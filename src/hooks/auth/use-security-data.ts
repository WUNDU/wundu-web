"use client";

import { useState } from "react";
import { useRegisterContext } from "@/contexts/use-register-context";
import {
  validatePassword,
  validatePasswordDetailed,
  type PasswordValidation,
} from "@/shared/components/utils/validation";

export interface SecurityFormState {
  password: string;
  confirmPassword: string;
}

export interface SecurityFormErrors {
  password: string;
}

export const useSecurityData = () => {
  const { data, setRegisterData, nextStep, registerUser, error } =
    useRegisterContext();

  const [form, setForm] = useState<SecurityFormState>({
    password: data.password || "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState<string>("");
  const [passwordValidation, setPasswordValidation] =
    useState<PasswordValidation>(validatePasswordDetailed(""));

  const setField = (field: keyof SecurityFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    // Update password validation in real-time
    if (field === "password") {
      setPasswordValidation(validatePasswordDetailed(value));
      setPasswordError(""); // Clear error when user types
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validatePasswordDetailed(form.password);
    if (!validation.isValid) {
      setPasswordError("Por favor, atenda todos os requisitos da senha.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setPasswordError("As senhas não coincidem!");
      return;
    }

    setPasswordError("");

    try {
      await registerUser({ ...data, password: form.password });
      setRegisterData({ password: form.password });
      nextStep();
    } catch (err) {}
  };

  return {
    form,
    setField,
    submit,
    passwordError,
    passwordValidation,
    contextError: error,
  };
};
