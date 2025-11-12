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
      {/* Header Space Reservation */}
      <div className="h-24 bg-white"></div>
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
      
      {/* Countdown Section - Modernized */}
      {!isLaunched && (
        <section className="relative py-20 bg-gradient-to-br from-gray-50 via-white to-primary/5 overflow-hidden">
          {/* Parallax Background Elements */}
          <div className="absolute top-10 left-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-float"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-secondary/10 rounded-full blur-xl animate-float-delayed"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-primary-dark/5 rounded-full blur-lg animate-bounce-soft"></div>
          
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="mb-4 animate-fade-in">
              <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary/10 to-secondary/10 text-secondary font-semibold rounded-full text-sm border border-secondary/20">
                <span className="mr-2 animate-bounce-soft">🚀</span>
                Lançamento Oficial
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 animate-slide-up">
              Em Breve Disponível
            </h2>
            <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '200ms' }}>
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
      <div className="py-8"></div>
      <LandingFooter />
    </div>
  );
};

export default WunduLanding;
