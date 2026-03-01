"use client";

import { useState } from "react";
import { useRegisterContext } from "@/contexts/use-register-context";
import { wunduToast } from "@/shared/lib/toast";
import {
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
  const { data, setRegisterData, nextStep, registerUser, error, clearError } =
    useRegisterContext();

  const [form, setForm] = useState<SecurityFormState>({
    password: data.password || "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordValidation, setPasswordValidation] =
    useState<PasswordValidation>(validatePasswordDetailed(data.password || ""));

  const setField = (field: keyof SecurityFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    // Update password validation in real-time
    if (field === "password") {
      setPasswordValidation(validatePasswordDetailed(value));
      if (passwordError) setPasswordError("");
      if (error) clearError();
    }

    if (field === "confirmPassword" && passwordError) {
      setPasswordError("");
      if (error) clearError();
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    clearError();
    const validation = validatePasswordDetailed(form.password);

    if (!validation.isValid) {
      setPasswordError("A senha não cumpre todos os requisitos de segurança.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setPasswordError("As senhas digitadas não são iguais.");
      return;
    }

    setPasswordError("");
    setIsSubmitting(true);

    try {
      // We pass the full data including the password from the current form
      await registerUser({ ...data, password: form.password });

      // If registration is successful, update context and move to next step
      setRegisterData({ password: form.password });
      nextStep();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Falha ao concluir o cadastro.";
      wunduToast.error("Erro no cadastro", { description: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    setField,
    submit,
    passwordError,
    passwordValidation,
    isSubmitting,
    contextError: error,
  };
};
