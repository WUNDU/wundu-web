// src/components/templates/FeaturesTemplate/index.tsx
"use client";
import React, { useEffect } from "react";
import LandingHeader from "@/src/components/organisms/LandingHeader";
import LandingFooter from "@/src/components/organisms/LandingFooter";
import FeaturesHero from "@/src/components/organisms/FeaturesHero";
import MainFeatures from "@/src/components/organisms/MainFeatures";
import MoreFeatures from "@/src/components/organisms/MoreFeatures";
import HowItWorks from "@/src/components/organisms/HowItWorks";
import CTASection from "@/src/components/organisms/CTASection";

const FeaturesLandingPage: React.FC = () => {
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

  return (
    <div className="min-h-screen bg-white">
      <LandingHeader />
      <FeaturesHero />
      <MainFeatures />
      <MoreFeatures />
      <HowItWorks />
      <CTASection
        title="Pronto para simplificar as suas finanças?"
        subtitle="Junte-se a milhares de usuários que já controlam melhor seu dinheiro com o WUNDU."
        buttonText="Experimente agora - É grátis"
      />
      <LandingFooter />
    </div>
  );
};

export default FeaturesLandingPage;
