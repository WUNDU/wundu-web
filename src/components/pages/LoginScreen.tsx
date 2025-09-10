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
    <div className="flex min-h-screen flex-col items-center justify-between p-8">
      <div className="mb-1 w-13 self-start">
        <Image src={logo} alt="Logo" className="w-full" />
      </div>
      {/* <div className="my-auto w-31">
        <Image src={loginError ? errorIllustration : loginIllustration} alt="Login Illustration" className="w-31" />
      </div> */}
      <div className="mt-4 w-screen px-2">
        <CtaSectionLogin
          title="FAÇA SEU LOGIN"
          subtitle="Faça login e melhore a tua vida financeira"
        />
        <div className="mt-5 flex w-full flex-col gap-2">
          <FormSection onLogin={handleLogin} />
          <div className="relative my-2 flex items-center px-2">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-1 shrink text-gray-500">Ou</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          <div className="m-3.5">
            <GoogleLoginButton />
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col items-center">
        <Link href={ROUTES.REGISTER} className="text-center text-sm text-gray-600">
          Não é registrado? Crie uma conta
        </Link>
        <p className="mt-4 text-center text-xs text-gray-500">
          Ao entrar, você concorda com nossos{" "}
          <Link href="https://wundu.netlify.app/privacy-policy#terms-policy" className="underline">
            termos de uso
          </Link>{" "}
          e nossa{" "}
          <Link href="https://wundu.netlify.app/privacy-policy" className="underline">
            política de privacidade
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;