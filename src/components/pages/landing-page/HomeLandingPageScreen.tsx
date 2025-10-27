// src/components/templates/LandingTemplate/index.tsx (WunduLanding - Home Landing Page atualizada com FeaturesSection populada)
"use client";
import React, { useEffect } from "react";
import LandingHeader from "@/src/components/organisms/LandingHeader";
import HeroSection from "@/src/components/organisms/HeroSection";
import FeaturesSection from "@/src/components/organisms/FeaturesSection";
import AISection from "@/src/components/organisms/AISection";
import CTASection from "@/src/components/organisms/CTASection";
import LandingFooter from "@/src/components/organisms/LandingFooter";
import { CardIcon, StatsIcon, GoalsIcon } from "@/src/constants/icons";

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
    <div className="min-h-screen bg-white">
      <LandingHeader />
      <HeroSection />
      <FeaturesSection
        title="Gestão financeira simplificada"
        subtitle="Três pilares fundamentais para o controle total das suas finanças pessoais."
        features={homeFeatures}
        gridCols={3}
      />
      <AISection />
      <CTASection />
      <LandingFooter />
    </div>
  );
};

export default WunduLanding;
