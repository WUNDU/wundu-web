"use client";

import CtaSectionLogin from "../molecules/CtaSectionLogin";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import { useState } from "react";
import { usePasswordResetContext } from "@/src/contexts/PasswordResetContext";
import Header from "./Header";
import NavigationBack from "../atoms/NavigationBack";

const NewPassword = () => {
  const { nextStep, prevStep, setResetData } = usePasswordResetContext();
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password === form.confirmPassword && form.password.length > 0) {
      setResetData({ newPassword: form.password });
      nextStep();
      setPasswordsMatch(true);
    } else {
      setPasswordsMatch(false);
    }
  };

  return (
    <div className="flex h-full md:max-w-xl  flex-col gap-2.5 justify-between md:gap-6 md:justify-start md:p-0">
      <NavigationBack prev={prevStep} />
      {/* Header - apenas mobile */}
      <div className="block md:hidden">
        <Header title="Criar uma nova senha" onBack={prevStep} />
      </div>

      <div className="w-full text-left md:text-center">
        <CtaSectionLogin
          title="Criar uma nova senha"
          subtitle="Crie uma senha e mantenha seus dados seguros."
        />
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-8 px-4 md:px-0 md:gap-6"
      >
        <Input
          id="password"
          label="Crie uma senha"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="************"
          required
          isError={!passwordsMatch}
        />
        <Input
          id="confirmPassword"
          label="Repita a senha"
          type="password"
          value={form.confirmPassword}
          onChange={(e) =>
            setForm({ ...form, confirmPassword: e.target.value })
          }
          placeholder="************"
          required
          isError={!passwordsMatch}
        />
        {!passwordsMatch && (
          <p className="text-sm text-red-500 text-center">
            As senhas não correspondem.
          </p>
        )}
        <Button onClick={() => {}} type="submit">
          Continuar
        </Button>
      </form>

      {/* Spacer apenas para mobile */}
      <div className="mt-auto h-1/4 md:hidden"></div>
    </div>
  );
};

export default NewPassword;
