"use client";
import { PersonalData } from "@/ui/organisms";
import { SecurityData } from "@/ui/organisms";
import Success from "@/ui/organisms/success";
import Image from "next/image";
import { logo, logoLogin } from "@/constants/images";
import { useRegisterContext } from "@/contexts/use-register-context";
import { useEffect } from "react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

const RegisterScreen = () => {
  const { currentStep } = useRegisterContext();

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

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalData />;
      case 2:
        return <SecurityData />;
      case 3:
        return <Success />;
      default:
        return <PersonalData />;
    }
  };

  return (
    <div
      className="min-h-screen w-screen overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)",
      }}
    >
      {/* Floating Elements */}
      <div
        className="absolute top-20 left-10 w-24 h-24 rounded-full blur-xl animate-float opacity-30"
        style={{ backgroundColor: "rgba(255, 212, 0, 0.3)" }}
      ></div>
      <div
        className="absolute bottom-20 right-10 w-32 h-32 rounded-full blur-2xl animate-float-delayed opacity-20"
        style={{ backgroundColor: "rgba(0, 60, 195, 0.2)" }}
      ></div>
      <div
        className="absolute top-1/2 right-20 w-16 h-16 rounded-full blur-lg animate-bounce-soft opacity-25"
        style={{ backgroundColor: "rgba(202, 111, 5, 0.4)" }}
      ></div>

      {/* Layout Mobile (modernizado) */}
      <div className="block md:hidden h-screen relative">
        <div className="h-full bg-white/95 backdrop-blur-sm">
          {renderStep()}
        </div>
      </div>

      {/* Layout Desktop (novo design centralizado) */}
      <div className="hidden md:flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative">
        {/* Logo WUNDU - fora do container, canto superior esquerdo */}
        <Link
          href={ROUTES.LANDINGPAGE}
          className="absolute top-8 left-8 flex items-center gap-2 fade-in-section animate-in z-10 cursor-pointer"
        >
          <Image
            src={logoLogin}
            alt="Logo Wundu"
            className="h-12 w-auto transition-transform duration-300 hover:scale-110"
            priority
          />
        </Link>

        <div className="w-full max-w-3xl bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 px-6 sm:px-8 lg:px-12 py-8 lg:py-12 relative fade-in-section animate-in delay-2 transform-gpu">
          <div className="fade-in-section animate-in delay-3">
            {renderStep()}
          </div>
        </div>

        {/* Links de política de privacidade e termos de uso */}
        <div className="mt-6 w-full max-w-2xl text-center fade-in-section animate-in delay-4">
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

export default RegisterScreen;
