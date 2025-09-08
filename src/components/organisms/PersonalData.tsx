'use client'
import { logo } from "@/src/constants/images";
import { useRegisterContext } from "@/src/hooks/context";
import Image from "next/image";
import { useState } from "react";
import backArrow from "../icons/BackArrow";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import GoogleLoginButton from "../atoms/GoogleLoginButton";

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

  return (
    <div className="flex flex-col h-full justify-between items-center p-8">
      <div className="w-full flex justify-between items-center mb-8">
        <div className="w-6 h-6" />
        <Image src={logo} alt="Logo" className="w-16 h-16" />
      </div>
      <div className="w-full text-left">
        <h1 className="text-3xl font-bold text-gray-800">Dados pessoais</h1>
        <p className="mt-2 text-gray-600">
          Forneça seus dados e seja cadastrado no nosso aplicativo.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="w-full my-8">
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
      <div className="w-full">
        <div className="relative my-4 flex items-center px-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 shrink text-gray-500">Ou</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        <GoogleLoginButton />
      </div>
      <div className="flex flex-col items-center mt-auto w-full">
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

export default PersonalData