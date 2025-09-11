'use client'
import { logo } from "@/src/constants/images";
import { useRegisterContext } from "@/src/contexts/RegisterContext";
import Image from "next/image";
import { useState } from "react";
import BackArrow from "../icons/BackArrow";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import GoogleLoginButton from "../atoms/GoogleLoginButton";
import CtaSectionLogin from "../molecules/CtaSectionLogin";
import Link from "next/link";
import { ROUTES } from "@/src/constants/routes";

const PersonalData = () => {
  const { data, setRegisterData, nextStep } = useRegisterContext();
  const [form, setForm] = useState({
    name: data.name || "",
    email: data.email || "",
    phone: data.phone || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterData(form);
    nextStep();
  };

  const handBackClick = () => {
    history.back()
  }

  return (
    <div className="flex flex-col h-full justify-between items-center p-4 md:p-8">
      <div className="w-full flex-col flex md:flex-row md:items-center md:justify-between">
        <div onClick={handBackClick}>
          <BackArrow />
        </div>
        <div className="w-6 h-6 md:hidden" />
        <Image src={logo} alt="Logo" className="w-12 h-12 md:hidden" />
      </div>
      <div className="w-full md:w-2/3">
        <CtaSectionLogin
          title={"Dados pessoais"}
          subtitle={"Forneça seus dados e seja cadastrado no nosso aplicativo."}
        />
      </div>
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4 px-4 md:px-0 md:w-2/3">
        <Input
          id="name"
          label="Nome"
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Digite seu nome"
          required
        />
        <Input
          id="email"
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="Digite seu email"
          required
        />
        <Input
          id="phone"
          label="Nº Telefone"
          type="tel"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="Digite seu nº de telefone"
          required
        />
        <Button type="submit" onClick={() => { }}>
          Próximo
        </Button>
      </form>
      <div className="w-full md:w-2/3">
        <div className="relative my-4 flex items-center px-6 md:px-0">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 shrink text-gray-500">Ou</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        <div className="m-3.5">
          <GoogleLoginButton />
        </div>
      </div>
      <div className="flex flex-col items-center mt-auto w-full md:w-2/3">
        <Link href={ROUTES.LOGIN} className="text-center text-sm text-gray-600">
          Já tem conta? <strong>Entrar</strong>
        </Link>
        <p className="mt-4 text-center text-xs text-gray-500">
          Ao entrar, você concorda com nossos{" "}
          <a href="#" className="underline">
            termos de uso
          </a>{" "}
          e nossa{" "}
          <a href="#" className="underline">
            política de privacidade
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default PersonalData;