"use client";
import React, { useEffect } from "react";
import LandingHeader from "@/ui/organisms/landing-header";
import FeaturesSection from "@/ui/organisms/features-section";
import AISection from "@/ui/organisms/ai-section";
import CTASection from "@/ui/organisms/cta-section";
import LandingFooter from "@/ui/organisms/landing-footer";
import { CardIcon, StatsIcon, GoalsIcon } from "@/constants/icons";
import { PageHero } from "@/ui/organisms";

const WunduLanding: React.FC = () => {
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
      <LandingHeader />
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
      />

      <FeaturesSection
        title="Gestão financeira simplificada"
        subtitle="Três pilares fundamentais para o controle total das suas finanças pessoais."
        features={homeFeatures}
        gridCols={3}
      />
      <AISection />
      <CTASection />
      <div className="py-8"></div>
      <LandingFooter />
    </div>
  );
};

export default WunduLanding;
