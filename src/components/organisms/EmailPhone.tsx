'use client';
import CtaSectionLogin from "../molecules/CtaSectionLogin";
import Input from "../atoms/Input";
import Button from "../atoms/Button";

import { useState } from "react";
import { usePasswordResetContext } from "@/src/contexts/PasswordResetContext";
import Header from "./Header";

const Step1_EmailPhone = () => {
  const { setResetData, nextStep } = usePasswordResetContext();
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResetData({ phoneOrEmail: input });
    nextStep();
  };

  return (
    <div className="flex h-full flex-col justify-between p-4">
      <Header title="Perdeu a sua senha?" />
      <div className="w-full text-left">
        <CtaSectionLogin
          title="Perdeu a sua senha?"
          subtitle="Digite seu número telefônico e enviaremos um código de verificação."
        />
      </div>
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-18 py-10 px-4">
        <Input
          id="phone-or-email"
          label="Nº Telefone"
          type="tel" // Pode ser 'email' se preferir, mas 'tel' é para a imagem
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite seu nº de telefone"
          required
        />
        <Button onClick={() => { }} type="submit">Continuar</Button>
      </form>
      <div className="mt-auto h-1/4"></div>
    </div>
  );
};

export default Step1_EmailPhone;
