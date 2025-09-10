'use client'
import { useState } from "react";
import Input from "../atoms/Input";
import LoginButton from "../atoms/LoginButton";
import { FormSectionProps } from "@/src/types/form";
import Link from "next/link";
import { ROUTES } from "@/src/constants/routes";

const FormSection: React.FC<FormSectionProps> = ({ onLogin }) => {
  const [passwordError, setPasswordError] = useState(false)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(true);
    onLogin()
    console.log('Formulário de login enviado!');
  };

  return (
    <form onSubmit={handleLogin} className="flex w-full flex-col gap-4 px-4">
      <Input label="Email" type="email" placeholder="Digite seu email" isError={passwordError} />
      <Input label="Senha" type="password" placeholder="Digite sua senha" isError={passwordError} required={true} />
      <Link href={ROUTES.RESET_PASSWORD} className="self-end text-sm text-gray-600">
        Esqueci minha senha
      </Link>
      <LoginButton onClick={() => { }} type="submit">Entrar</LoginButton>
    </form>
  );
};

export default FormSection