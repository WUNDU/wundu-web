"use client";
import GoogleLoginButton from "../../atoms/GoogleLoginButton";
import CtaSectionLogin from "../../molecules/CtaSectionLogin";
import FormSection from "../../molecules/FormSection";
import {
  loginIllustration,
  errorIllustration,
  logo,
} from "@/src/constants/images";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/src/constants/routes";
import { useState } from "react";

const LoginScreen: React.FC = () => {
  const [hasError, setHasError] = useState(false);
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center md:bg-gray-100 font-sans">
      {/* Logo Wundu - visível para todas as telas, mas posicionado de forma diferente */}
      <div className="hidden md:absolute top-8 left-8 md:flex items-center gap-2">
        <Image src={logo} alt="Logo Wundu" className="w-full" />
        <span className="text-2xl font-bold text-gray-800">WUNDU</span>
      </div>

      <div className="md:py-4">
        <div className="flex w-full md:w-full lg:w-full flex-col items-center md:rounded-3xl md:bg-white md:shadow-2xl md:overflow-hidden md:p-0">
          {/* Seção dos textos centralizados no topo - apenas visível em desktop */}
          <div className="hidden md:flex md:w-full md:flex-col md:items-center md:justify-center md:text-center md:pt-8 md:px-4">
            <CtaSectionLogin
              title="FAÇA SEU LOGIN"
              subtitle="Faça login e melhore a tua vida financeira"
            />
          </div>

          {/* Container para ilustração e formulário lado a lado */}
          <div className="flex w-full flex-col md:flex-row">
            {/* Seção da ilustração - oculta em telas pequenas */}
            <div className="hidden flex-1 items-center justify-center p-8 md:flex md:w-1/2 md:p-14 lg:p-14">
              <Image
                src={hasError ? errorIllustration : loginIllustration}
                alt="Login Illustration"
                width={300}
              />
            </div>

            {/* Seção do formulário */}
            <div className="flex flex-1 flex-col justify-center md:w-1/2 md:p-8 lg:p-6">
              {/* Logo para telas pequenas, dentro do contêiner */}
              <div className="w-12 self-start mb-auto md:hidden">
                <Image src={logo} alt="Logo Wundu" className="w-full" />
              </div>

              {/* Textos para mobile - ocultos em desktop */}
              <div className="md:hidden">
                <CtaSectionLogin
                  title="FAÇA SEU LOGIN"
                  subtitle="Faça login e melhore a tua vida financeira"
                />
              </div>

              <div className="mt-8 flex w-full flex-col">
                <FormSection
                  onErrorChange={(error) => setHasError(error)}
                  onLogin={function (): void {
                    throw new Error("Function not implemented.");
                  }}
                />

                <div className="relative my-4 flex items-center">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="mx-4 shrink text-sm text-gray-500">Ou</span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <GoogleLoginButton />

                {/* Link de registro para mobile - oculto em desktop */}
                <div className="mt-8 text-center md:hidden">
                  <Link
                    href={ROUTES.REGISTER}
                    className="text-sm text-gray-600 hover:underline"
                  >
                    Não é registrado? <strong>Crie uma conta</strong>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Link de registro centralizado embaixo - apenas visível em desktop */}
          <div className="hidden md:flex md:w-full md:justify-center md:pb-8 md:px-4">
            <Link
              href={ROUTES.REGISTER}
              className="text-sm text-gray-600 hover:underline"
            >
              Não é registrado? <strong>Crie uma conta</strong>
            </Link>
          </div>
        </div>
      </div>

      {/* Links de política de privacidade e termos de uso */}
      <div className="mt-4 md:mt-8 w-full max-w-xl text-center md:absolute md:bottom-8 md:left-1/2 md:-translate-x-1/2">
        <p className="mt-1 px-10 text-center text-xs text-gray-500">
          Ao entrar, você concorda com nossos{" "}
          <Link
            href="https://wundu.netlify.app/privacy-policy#terms-policy"
            className="underline"
          >
            termos de uso
          </Link>{" "}
          e nossa{" "}
          <Link
            href="https://wundu.netlify.app/privacy-policy"
            className="underline"
          >
            política de privacidade
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
