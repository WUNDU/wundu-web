'use client'
import { useRegisterContext } from "@/src/contexts/RegisterContext";
import { useState } from "react";
import Image from "next/image";
import { logo } from "@/src/constants/images";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import CtaSectionLogin from "../molecules/CtaSectionLogin";
import BackArrow from "../icons/ArrowLeft";
import { BackArrowIcon } from "@/src/constants/icons";
import NavigationBack from "../atoms/NavigationBack";

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
    <div className="flex flex-col h-full justify-between items-center p-4 md:p-8">
      <div className="w-full flex-col flex md:flex-row md:items-center md:justify-between">
        <NavigationBack prev={prevStep} />
        <div className="w-6 h-6 md:hidden" />
        <Image src={logo} alt="Logo" className="w-12 h-12 md:hidden" />
      </div>
      <div className="w-full text-left md:w-2/3">
        <CtaSectionLogin
          title={"Segurança"}
          subtitle={"Crie uma senha e mantenha seus dados seguros."}
        />
      </div>
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-8 py-10 px-6 md:px-0 md:w-2/3">
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
      <div className="flex flex-col items-center mt-auto w-full md:w-2/3">
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

export default SecurityData;