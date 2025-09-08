'use client'
import { useRegisterContext } from "@/src/hooks/context";
import { useState } from "react";
import backArrow from "../icons/BackArrow";
import Image from "next/image";
import { logo } from "@/src/constants/images";
import Input from "../atoms/Input";
import Button from "../atoms/Button";

const SecurityData = () => {
  const { data, setRegisterData, nextStep, prevStep } = useRegisterContext();
  const [form, setForm] = useState({
    password: data.password || "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setPasswordError("As senhas não coincidem!");
      return;
    }
    setPasswordError("");
    setRegisterData({ password: form.password });
    nextStep();
  };

  return (
    <div className="flex flex-col h-full justify-between items-center p-8">
      <div className="w-full flex justify-between items-center mb-8">
        <div onClick={prevStep} className="w-6 h-6 cursor-pointer" />
        <Image src={logo} alt="Logo" className="w-16 h-16" />
      </div>
      <div className="w-full text-left">
        <h1 className="text-3xl font-bold text-gray-800">Segurança</h1>
        <p className="mt-2 text-gray-600">
          Crie uma senha e mantenha seus dados seguros.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="w-full my-8">
        <Input
          id="password"
          label="Crie uma senha"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="Digite sua senha"
          required
          isError={!!passwordError}
        />
        <Input
          id="confirmPassword"
          label="Repita a senha"
          type="password"
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          placeholder="Digite sua senha novamente"
          required
          isError={!!passwordError}
        />
        {passwordError && (
          <p className="text-red-500 text-sm mt-2">{passwordError}</p>
        )}
        <Button type="submit" onClick={() => { }}>
          Finalizar cadastro
        </Button>
      </form>
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

export default SecurityData