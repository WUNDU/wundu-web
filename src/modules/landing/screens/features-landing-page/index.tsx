"use client";
import React, { useEffect } from "react";
import LandingHeader from "@/shared/components/landing-header";
import LandingFooter from "@/shared/components/landing-footer";
import MainFeatures from "@/modules/dashboard/components/main-features";
import MoreFeatures from "@/modules/dashboard/components/more-features";
import HowItWorks from "@/shared/components/how-it-works";
import CTASection from "@/shared/components/cta-section";
import { PageHero } from "@/shared/components";

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
      { threshold: 0.1 },
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
            <span className="text-gradient bg-linear-to-r from-blue-400 to-blue-600">
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
