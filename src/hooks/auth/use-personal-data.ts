"use client";

import { useState } from "react";
import { useRegisterContext } from "@/contexts/use-register-context";
import { validateEmail, validatePhoneNumber } from "@/utils/validation";

export interface PersonalFormState {
  name: string;
  email: string;
  phone: string;
}

export interface PersonalFormErrors {
  email: string;
  phone: string;
}

export const usePersonalData = () => {
  const { data, setRegisterData, nextStep } = useRegisterContext();

  const [form, setForm] = useState<PersonalFormState>({
    name: data.name || "",
    email: data.email || "",
    phone: data.phone || "",
  });
  const [errors, setErrors] = useState<PersonalFormErrors>({
    email: "",
    phone: "",
  });

  const setField = (field: keyof PersonalFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    let valid = true;
    const nextErrors: PersonalFormErrors = { email: "", phone: "" };

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
