"use client";
import { useRegisterContext } from "@/contexts/useRegisterContext";
import Image from "next/image";
import { logo } from "@/constants/images";
import { TextInput } from "@/ui/atoms";
import { Button } from "@/ui/atoms";
import { CTA } from "@/ui/molecules";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { NavigationBack } from "@/ui/atoms";
import { GoogleIcon } from "@/constants/icons";
import { usePersonalData } from "@/hooks/auth/usePersonalData";

const PersonalData = () => {
  const { form, errors, setField, submit } = usePersonalData();

  return (
    <div className="flex flex-col h-full justify-between items-center p-4 md:p-8">
      <div className="w-full flex-col flex md:flex-row md:items-center md:justify-between">
        <NavigationBack />
        <div className="w-6 h-6 md:hidden" />
        <Image src={logo} alt="Logo" className="w-12 h-12 md:hidden" />
      </div>
      <div className="w-full md:w-2/3">
        <CTA
          title={"Dados pessoais"}
          subtitle={"Forneça seus dados e seja cadastrado no nosso aplicativo."}
          variant="default"
        />
      </div>
      <form
        onSubmit={submit}
        className="flex w-full flex-col gap-4 px-4 md:px-0 md:w-2/3"
      >
        <TextInput
          id="name"
          label="Nome"
          type="text"
          value={form.name}
          onChange={(e) => setField("name", e.target.value)}
          placeholder="Digite seu nome"
          required
        />
        <TextInput
          id="email"
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => setField("email", e.target.value)}
          placeholder="Digite seu email"
          required
          isError={!!errors.email}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-2">{errors.email}</p>
        )}
        <TextInput
          id="phone"
          label="Nº Telefone"
          type="tel"
          value={form.phone}
          onChange={(e) => setField("phone", e.target.value)}
          placeholder="Digite seu nº de telefone"
          required
          isError={!!errors.phone}
        />
        {errors.phone && (
          <p className="text-red-500 text-sm mt-2">{errors.phone}</p>
        )}
        <Button type="submit">Próximo</Button>
      </form>
      <div className="w-full md:w-2/3">
        <div className="relative my-4 flex items-center px-6 md:px-0">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 shrink text-gray-500">Ou</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        <div className="m-3.5 flex items-center justify-center">
          <Button
            variant="google"
            leftIcon={<GoogleIcon className="w-5" />}
            label="Entrar com Google"
          />
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
