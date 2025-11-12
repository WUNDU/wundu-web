"use client";
import React, { useEffect } from "react";
import LandingHeader from "@/ui/organisms/LandingHeader";
import FeaturesSection from "@/ui/organisms/FeaturesSection";
import AISection from "@/ui/organisms/AISection";
import CTASection from "@/ui/organisms/CTASection";
import LandingFooter from "@/ui/organisms/LandingFooter";
import { CardIcon, StatsIcon, GoalsIcon } from "@/constants/icons";
import { PageHero } from "@/ui/organisms";
import { LaunchCountdown } from "@/ui/molecules";
import { useLaunchStatus } from "@/hooks/useLaunchStatus";

const WunduLanding: React.FC = () => {
  const { isLaunched, launchDate } = useLaunchStatus();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".fade-in-section").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const homeFeatures = [
    {
      icon: <StatsIcon className="w-10 h-10 text-orange-600" />,
      title: "Gestão de gastos",
      description:
        "Upload de extratos automático com categorização inteligente por IA. Mantenha sempre o controle dos seus gastos.",
    },
    {
      icon: <CardIcon className="w-10 h-10 text-orange-600" />,
      title: "Gestão de orçamento",
      description:
        "Crie orçamentos realistas e controle seus gastos por categoria para nunca mais estourar suas finanças.",
    },
    {
      icon: <GoalsIcon className="w-10 h-10 text-orange-600" />,
      title: "Metas financeiras",
      description:
        "Defina objetivos claros e acompanhe o progresso em tempo real. Transforma sonhos em planos concretos.",
    },
  ];

  return (
    <div className="min-h-screen bg-white font-inter">
      <LandingHeader isLaunched={isLaunched} />
      <PageHero
        title={
          <>
            O futuro das tuas
            <br />
            <span className="text-gradient bg-gradient-to-r from-yellow-400 to-orange-500">
              Finanças começa aqui
            </span>
          </>
        }
        description="Com o WUNDU, controlar gastos, definir metas e organizar cartões nunca foi tão simples. Um app feito para o teu bolso e o teu ritmo."
        showButton={true}
        isLaunched={isLaunched}
      />
      
      {/* Countdown Section - Adicionado sem alterar o resto */}
      {!isLaunched && (
        <section className="py-12 bg-gradient-to-br from-blue-50 to-yellow-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              🚀 Lançamento Oficial
            </h2>
            <p className="text-gray-600 mb-8">
              Estamos nos preparativos finais para revolucionar sua gestão financeira
            </p>
            <LaunchCountdown targetDate={launchDate} />
          </div>
        </section>
      )}
      
      <FeaturesSection
        title="Gestão financeira simplificada"
        subtitle="Três pilares fundamentais para o controle total das suas finanças pessoais."
        features={homeFeatures}
        gridCols={3}
      />
      <AISection />
      <CTASection isLaunched={isLaunched} />
      <LandingFooter />
    </div>
  );
};

export default WunduLanding;
