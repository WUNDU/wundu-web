"use client";
import React, { useEffect } from "react";
import LandingHeader from "@/ui/organisms/LandingHeader";
import LandingFooter from "@/ui/organisms/LandingFooter";
import MainFeatures from "@/ui/organisms/MainFeatures";
import MoreFeatures from "@/ui/organisms/MoreFeatures";
import HowItWorks from "@/ui/organisms/HowItWorks";
import CTASection from "@/ui/organisms/CTASection";
import { PageHero } from "@/ui/organisms";

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
    <div className="min-h-screen bg-white font-inter">
      {/* Header Space Reservation */}
      <div className="h-24 bg-white"></div>
      <LandingHeader />
      <PageHero
        title={
          <>
            Todas as{" "}
            <span className="text-gradient bg-gradient-to-r from-blue-400 to-blue-600">
              funcionalidades
            </span>{" "}
            que você precisa
          </>
        }
        description="Descobre como o WUNDU pode revolucionar a forma como gere o seu dinheiro, com tecnologia de ponta e design intuitivo."
      />
      <MainFeatures />
      <MoreFeatures />
      <HowItWorks />
      <CTASection
        title="Pronto para simplificar as suas finanças?"
        subtitle="Junte-se a milhares de usuários que já controlam melhor seu dinheiro com o WUNDU."
        buttonText="Experimente agora - É grátis"
      />
      <div className="py-8"></div>
      <LandingFooter />
    </div>
  );
};

export default FeaturesLandingPage;
