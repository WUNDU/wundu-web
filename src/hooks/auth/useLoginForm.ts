"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { validateEmail, validatePassword } from "@/utils/validation";
import useRegisterContext from "@/contexts/useRegisterContext";

export interface LoginFormState {
  email: string;
  password: string;
}

export interface LoginFormErrors {
  email: string;
  password: string;
}

export const useLoginForm = (onErrorChange?: (hasError: boolean) => void) => {
  const { loginUser, error: contextError } = useRegisterContext();
  const router = useRouter();

  const [form, setForm] = useState<LoginFormState>({ email: "", password: "" });
  const [errors, setErrors] = useState<LoginFormErrors>({ email: "", password: "" });

  const setField = (field: keyof LoginFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    let valid = true;
    const nextErrors: LoginFormErrors = { email: "", password: "" };

    if (!validateEmail(form.email)) {
      nextErrors.email = "Por favor, insira um email válido";
      valid = false;
    }

    if (!validatePassword(form.password)) {
      nextErrors.password = "Senha deve ter no mínimo 8 caracteres e no máximo 12";
      valid = false;
    }

    setErrors(nextErrors);
    onErrorChange?.(!!nextErrors.email || !!nextErrors.password || !!contextError);

    if (!valid) return;

    try {
      await loginUser(form.email, form.password);
      router.push(ROUTES.HOME);
    } catch (err) {}
  };

  return {
    form,
    errors,
    setField,
    submit,
    contextError,
  };
};
