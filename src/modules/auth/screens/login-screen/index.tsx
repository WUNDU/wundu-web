"use client";
import FormSection from "@/shared/components/form-section";
import {
  loginIllustration,
  errorIllustration,
  logo,
  logoLogin,
} from "@/constants/images";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { useState, useEffect } from "react";
import { useRegisterContext } from "@/contexts/use-register-context";
import { CTA } from "@/shared/components";

const LoginScreen: React.FC = () => {
  const [hasError, setHasError] = useState(false);
  const { isAuthenticated, isLoading } = useRegisterContext();

  // Reset error state when user starts typing again
  const handleErrorChange = (error: boolean) => {
    setHasError(error);
  };

  // Reset illustration when authentication is successful
  useEffect(() => {
    if (isAuthenticated) {
      setHasError(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      { threshold: 0.1 },
    );

    document.querySelectorAll(".fade-in-section").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white md:bg-linear-to-br md:from-slate-50 md:via-slate-200 md:to-slate-300">
      {/* Floating Elements - apenas desktop */}
      <div
        className="hidden md:block absolute top-20 left-10 w-24 h-24 rounded-full blur-xl animate-float opacity-30"
        style={{ backgroundColor: "rgba(255, 212, 0, 0.3)" }}
      ></div>
      <div
        className="hidden md:block absolute bottom-20 right-10 w-32 h-32 rounded-full blur-2xl animate-float-delayed opacity-20"
        style={{ backgroundColor: "rgba(0, 60, 195, 0.2)" }}
      ></div>
      <div
        className="hidden md:block absolute top-1/2 right-20 w-16 h-16 rounded-full blur-lg animate-bounce-soft opacity-25"
        style={{ backgroundColor: "rgba(202, 111, 5, 0.4)" }}
      ></div>

      {/* Logo Wundu */}
      <Link
        href={ROUTES.LANDINGPAGE}
        className="absolute top-4 left-4 flex items-center gap-2 md:hidden z-10 cursor-pointer"
      >
        <Image
          src={logoLogin}
          alt="Logo Wundu"
          className="h-10 w-auto transition-transform duration-300 hover:scale-110"
          priority
        />
      </Link>
      <Link
        href={ROUTES.LANDINGPAGE}
        className="hidden md:absolute top-8 left-8 md:flex items-center gap-2 fade-in-section animate-in z-10 cursor-pointer"
      >
        <Image
          src={logoLogin}
          alt="Logo Wundu"
          className="h-12 w-auto transition-transform duration-300 hover:scale-110"
          priority
        />
      </Link>

      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex w-full flex-col items-center md:bg-white/95 md:backdrop-blur-xl md:rounded-3xl md:shadow-2xl md:border md:border-white/20 overflow-hidden fade-in-section animate-in delay-2 transform-gpu">
          {/* Seção dos textos centralizados no topo - apenas visível em desktop */}
          <div className="hidden md:flex md:w-full md:flex-col md:items-center md:justify-center md:text-center md:pt-8 md:px-4">
            <CTA
              title="FAÇA SEU LOGIN"
              subtitle="Faça login e melhore a tua vida financeira"
              variant="default"
            />
          </div>

          {/* Container para ilustração e formulário lado a lado */}
          <div className="flex w-full flex-col lg:flex-row">
            {/* Seção da ilustração - oculta em telas pequenas */}
            <div className="hidden lg:flex flex-1 items-center justify-center p-8 lg:w-1/2 lg:p-14 fade-in-section animate-in delay-3">
              <div className="relative">
                <Image
                  src={hasError ? errorIllustration : loginIllustration}
                  alt="Login Illustration"
                  className="w-80 h-80 transition-all duration-700 hover:scale-105 drop-shadow-2xl"
                  priority
                />
                {/* Glow effect behind illustration */}
                <div className="absolute inset-0 bg-linear-to-r from-blue-400/20 to-yellow-400/20 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>
              </div>
            </div>

            {/* Seção do formulário */}
            <div className="flex flex-1 flex-col justify-start gap-6 p-5 sm:p-8 lg:w-1/2 lg:p-12 fade-in-section animate-in delay-4">
              {/* Textos para mobile - ocultos em desktop */}
              <div className="md:hidden -mt-2">
                <CTA
                  title="FAÇA SEU LOGIN"
                  subtitle="Faça login e melhore a tua vida financeira"
                  variant="default"
                />
              </div>

              <div className="mt-2 md:mt-8 flex w-full flex-col space-y-6">
                <div className="fade-in-section animate-in delay-5">
                  <FormSection
                    onErrorChange={handleErrorChange}
                    onLogin={function (): void {
                      throw new Error("Function not implemented.");
                    }}
                  />
                </div>

                {/*
                <div className="relative my-6 flex items-center fade-in-section animate-in delay-6">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="mx-4 shrink text-sm text-gray-500 bg-white px-2">Ou</span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <div className="fade-in-section animate-in delay-7 flex justify-center">
                  <Button
                    variant="google"
                    leftIcon={<GoogleIcon className="w-5" />}
                    label="Entrar com Google"
                  />
                </div>
                */}

                {/* Link de registro para mobile - oculto em desktop */}
                <div className="mt-4 text-center md:hidden fade-in-section animate-in delay-8">
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
          <div className="hidden md:flex md:w-full md:justify-center md:pb-8 md:px-4 fade-in-section animate-in delay-8">
            <Link
              href={ROUTES.REGISTER}
              className="text-sm text-gray-600 hover:underline"
            >
              Não é registrado? <strong>Crie uma conta</strong>
            </Link>
          </div>
        </div>

        {/* Links de política de privacidade e termos de uso */}
        <div className="mt-6 w-full max-w-2xl mx-auto text-center fade-in-section animate-in delay-9">
          <p className="px-6 sm:px-10 text-center text-xs text-gray-500 leading-relaxed">
            Ao entrar, você concorda com nossos{" "}
            <Link
              href={ROUTES.LEGAL}
              className="underline hover:text-blue-600 transition-colors duration-300"
            >
              termos de uso
            </Link>{" "}
            e nossa{" "}
            <Link
              href={ROUTES.LEGAL}
              className="underline hover:text-blue-600 transition-colors duration-300"
            >
              política de privacidade
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
