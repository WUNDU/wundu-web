"use client";

import { useState } from "react";
import { useRegisterContext } from "@/contexts/useRegisterContext";
import { validatePassword } from "@/utils/validation";

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

  const setField = (field: keyof SecurityFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword(form.password)) {
      setPasswordError(
        `Senha deve ter no mínimo 8 caracteres e no máximo 12 (valor rejeitado: '${form.password}')`
      );
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
    contextError: error,
  };
};
