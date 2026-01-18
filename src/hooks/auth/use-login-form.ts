"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { validateEmail, validatePasswordDetailed } from "@/utils/validation";
import useRegisterContext from "@/contexts/use-register-context";

export interface LoginFormState {
  email: string;
  password: string;
}

export interface LoginFormErrors {
  email: string;
  password: string;
}

export const useLoginForm = (onErrorChange?: (hasError: boolean) => void) => {
  const {
    loginUser,
    error: contextError,
    isLoading,
    clearError,
  } = useRegisterContext();
  const router = useRouter();

  const [form, setForm] = useState<LoginFormState>({ email: "", password: "" });
  const [errors, setErrors] = useState<LoginFormErrors>({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Monitor contextError changes to update illustration
  useEffect(() => {
    if (contextError) {
      onErrorChange?.(true);
    }
  }, [contextError, onErrorChange]);

  const setField = (field: keyof LoginFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }

    // Clear error state and reset illustration when user starts typing
    if (errors[field] || contextError) {
      clearError(); // Clear context error
      onErrorChange?.(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({ email: "", password: "" });
    clearError(); // Clear context error
    onErrorChange?.(false);

    let valid = true;
    const nextErrors: LoginFormErrors = { email: "", password: "" };

    if (!validateEmail(form.email)) {
      nextErrors.email = "Por favor, insira um email válido";
      valid = false;
    }

    const passwordValidation = validatePasswordDetailed(form.password);

    if (!passwordValidation.isValid) {
      nextErrors.password =
        "Senha deve ter entre 8 e 12 caracteres, com letras maiúsculas, minúsculas, números e caractere especial";
      valid = false;
    }

    if (!valid) {
      setErrors(nextErrors);
      onErrorChange?.(true);
      return;
    }

    setIsSubmitting(true);

    try {
      await loginUser(form.email, form.password);
      // Only redirect on successful login
      router.push(ROUTES.HOME);
    } catch (err) {
      // Set error state to show error illustration
      onErrorChange?.(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    errors,
    setField,
    submit,
    contextError,
    isSubmitting,
    isLoading,
  };
};
