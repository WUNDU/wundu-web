'use client'
import { useState } from "react";
import GoogleLoginButton from "../atoms/GoogleLoginButton";
import CtaSectionLogin from "../molecules/CtaSectionLogin";
import FormSection from "../molecules/FormSection";
import { errorIllustration, loginIllustration, logo } from "@/src/constants/images";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/src/constants/routes";
import { useUiStore } from "@/src/store/uiStore";

const LoginScreen: React.FC = () => {

  const { openModal } = useUiStore();

  const handleLogin = () => {
    openModal('error', 'Erro de Login', 'A senha inserida está incorreta!');
  }
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center md:bg-gray-100 font-sans">
      {/* Logo Wundu - visível para todas as telas, mas posicionado de forma diferente */}
      <div className="md:absolute md:top-8 md:left-8 md:flex md:items-center md:gap-2 hidden">
        <Image src={logo} alt="Login Illustration" className="w-full" />
        <span className="text-2xl font-bold text-gray-800">WUNDU</span>
      </div>
      <div className="md:py-14">
        <div className="flex w-full md:max-w-3xl flex-col items-center md:rounded-3xl md:bg-white md:shadow-2xl md:flex-row md:overflow-hidden md:p-0">

          {/* Seção da ilustração - oculta em telas pequenas */}
          <div className="hidden flex-1 items-center justify-center p-8 md:flex md:w-1/2 lg:p-14">
            <Image src={loginIllustration} alt="Login Illustration" className="w-full" />
          </div>

          {/* Seção do formulário - ajusta a largura em telas grandes */}
          <div className="flex flex-1 flex-col justify-center  md:w-1/2 md:p-12 lg:p-4">
            {/* Logo para telas pequenas, dentro do contêiner */}
            <div className="w-12 self-start mb-auto md:hidden">
              <Image src={logo} alt="Login Illustration" className="w-full" />
            </div>

            <CtaSectionLogin
              title="FAÇA SEU LOGIN"
              subtitle="Faça login e melhore a tua vida financeira"
            />
            <div className="mt-8 flex w-full flex-col">
              <FormSection onLogin={handleLogin} />

              <div className="relative my-4 flex items-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="mx-4 shrink text-sm text-gray-500">Ou</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              <GoogleLoginButton />

              <div className="mt-8 text-center">
                <Link href={ROUTES.REGISTER} className="text-sm text-gray-600 hover:underline">
                  Não é registrado? <strong>Crie uma conta</strong>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Links de política de privacidade e termos de uso - visíveis para todas as telas, mas com posicionamento diferente */}
      <div className="mt-4  md:mt-8 w-full max-w-xl text-center md:absolute md:bottom-8 md:left-1/2 md:-translate-x-1/2">
        <p className="mt-1 px-10 text-center text-xs text-gray-500">
          Ao entrar, você concorda com nossos{" "}
          <Link href="https://wundu.netlify.app/privacy-policy#terms-policy" className="underline">
            termos de uso
          </Link>{" "}
          e nossa{" "}
          <Link href="https://wundu.netlify.app/privacy-policy" className="underline">
            política de privacidade
          </Link>  .
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;