"use client";

import { useState } from "react";
import { usePasswordResetContext } from "@/contexts/PasswordResetContext";

export interface NewPasswordState {
  password: string;
  confirmPassword: string;
}

export const useNewPassword = () => {
  const { nextStep, setResetData } = usePasswordResetContext();

  const [form, setForm] = useState<NewPasswordState>({
    password: "",
    confirmPassword: "",
  });
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const setField = (field: keyof NewPasswordState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password === form.confirmPassword && form.password.length > 0) {
      setResetData({ newPassword: form.password });
      nextStep();
      setPasswordsMatch(true);
    } else {
      setPasswordsMatch(false);
    }
  };

  return {
    form,
    passwordsMatch,
    setField,
    submit,
  };
};
