"use client";

import { useState } from "react";
import { useRegisterContext } from "@/contexts/use-register-context";
import {
  validateEmail,
  validatePhoneNumber,
} from "@/shared/components/utils/validation";

export interface PersonalFormState {
  name: string;
  email: string;
  phone: string;
}

export interface PersonalFormErrors {
  name: string;
  email: string;
  phone: string;
}

export const usePersonalData = () => {
  const { data, setRegisterData, nextStep, clearError } = useRegisterContext();

  const [form, setForm] = useState<PersonalFormState>({
    name: data.name || "",
    email: data.email || "",
    phone: data.phone || "",
  });
  const [errors, setErrors] = useState<PersonalFormErrors>({
    name: "",
    email: "",
    phone: "",
  });

  const setField = (field: keyof PersonalFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear specific error when typing
    if (errors[field as keyof PersonalFormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
    clearError();
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    let valid = true;
    const nextErrors: PersonalFormErrors = { name: "", email: "", phone: "" };

    if (!form.name || form.name.trim().length < 3) {
      nextErrors.name = "Por favor, insira seu nome completo";
      valid = false;
    }

    if (!validateEmail(form.email)) {
      nextErrors.email = "Por favor, insira um email válido";
      valid = false;
    }

    if (!validatePhoneNumber(form.phone)) {
      nextErrors.phone = "Por favor, insira um número de telefone válido";
      valid = false;
    }

    setErrors(nextErrors);

    if (!valid) return;

    setRegisterData(form);
    nextStep();
  };

  return {
    form,
    errors,
    setField,
    submit,
  };
};
