'use client'
import { useState } from "react";
import GoogleLoginButton from "../atoms/GoogleLoginButton";
import CtaSectionLogin from "../molecules/CtaSectionLogin";
import FormSection from "../molecules/FormSection";
import { errorIllustration, loginIllustration, logo } from "@/src/constants/images";
import Image from "next/image";

const LoginScreen: React.FC = () => {

  const [loginError, setLoginError] = useState(false)

  const handleLogin = () => {
    setLoginError(true);
  }
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-8">
      <div className="mb-8 w-20 self-start">
        <Image src={logo} alt="Logo" className="w-full" />
      </div>
      <div className="my-auto w-31">
        <Image src={loginError ? errorIllustration : loginIllustration} alt="Login Illustration" className="w-31" />
      </div>
      <div className="mt-8 w-full">
        <CtaSectionLogin
          title={loginError ? "A senha inserida está incorreta!" : "FAÇA SEU LOGIN"}
          subtitle={loginError ? "" : "Faça login e melhore a tua vida financeira"}
          isError={loginError}
        />
        <div className="mt-8 flex w-full flex-col gap-4">
          <FormSection onLogin={handleLogin} />
          <div className="relative my-4 flex items-center px-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 shrink text-gray-500">Ou</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          <div className="mb-8">
            <GoogleLoginButton />
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col items-center">
        <a href="#" className="text-center text-sm text-gray-600">
          Não é registrado? Crie uma conta
        </a>
        <p className="mt-4 text-center text-xs text-gray-500">
          Ao entrar, você concorda com nossos{" "}
          <a href="https://wundu.netlify.app/privacy-policy#terms-policy" className="underline">
            termos de uso
          </a>{" "}
          e nossa{" "}
          <a href="https://wundu.netlify.app/privacy-policy" className="underline">
            política de privacidade
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;