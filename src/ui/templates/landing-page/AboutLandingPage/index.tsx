"use client";
import React, { useEffect } from "react";
import LandingHeader from "@/ui/organisms/LandingHeader";
import LandingFooter from "@/ui/organisms/LandingFooter";
import { PageHero } from "@/ui/organisms";
import TextSection from "@/ui/molecules/TextSection";
import TechnologySection from "@/ui/molecules/TechnologySection";
import FeaturesSection from "@/ui/organisms/FeaturesSection";

import { Shield, Zap, Lightbulb, Eye } from "lucide-react";

const AboutLandingPage: React.FC = () => {
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

  const values = [
    {
      icon: <Shield className="w-10 h-10 text-orange-600" />,
      title: "Segurança",
      description:
        "Os teus dados financeiros são protegidos com os mais altos padrões de segurança.",
    },
    {
      icon: <Zap className="w-10 h-10 text-orange-600" />,
      title: "Simplicidade",
      description:
        "Interface intuitivo que torna a gestão financeira acessível a todos.",
    },
    {
      icon: <Lightbulb className="w-10 h-10 text-orange-600" />,
      title: "Inovação",
      description:
        "Utilizamos tecnologia de ponta para criar soluções financeiras inteligentes.",
    },
    {
      icon: <Eye className="w-10 h-10 text-orange-600" />,
      title: "Transparência",
      description:
        "Comunicação clara sobre como utilizamos os teus dados e como funciona a nossa plataforma.",
    },
  ];

  return (
    <div className="min-h-screen bg-white font-inter">
      {/* Header Space Reservation */}
      <div className="h-24 bg-white"></div>
      <LandingHeader />
      <PageHero
        title="Sobre a WUNDU"
        description="Transformamos a forma como geris as tuas finanças pessoais, criando uma experiência simples, segura e intuitiva."
      />
      <div className="text-center px-4 sm:px-6 lg:px-8 py-12 border-2 mx-2 p-10 my-5 shadow-2xs border-gray-100">
        <TextSection
          title="A nossa missão"
          content="Democratizar o acesso a ferramentas financeiras inteligentes, ajudando cada pessoa a tomar decisões mais informadas sobre o seu dinheiro."
        />

        {/* Seção de Valores - agora reutilizando FeaturesSection com customizações para matching o estilo original */}
        <FeaturesSection
          title="Os Nossos Valores"
          subtitle=""
          features={values}
          gradientFrom="from-blue-100"
          gradientTo="to-yellow-200"
          containerSize="w-20 h-20"
          containerRounded="rounded-3xl"
          cardRounded="rounded-3xl"
          gridCols={4}
          descriptionClass="text-gray-600 leading-relaxed text-lg"
          titleClass="text-2xl font-bold text-gray-900 mb-6"
        />
      </div>
      <div className="border-2 mx-2 p-10 my-5 shadow-2xs border-gray-100">
        <TextSection
          title="A Nossa História"
          content="Somos uma startup em fase inicial que nasceu durante o desafio Codepoint, promovido pela Mirantes.io. Percebemos que muitas pessoas têm dificuldade em acompanhar os seus gastos e atingir metas financeiras, por isso começámos a construir o WUNDU: uma solução que combina inteligência artificial com design intuitivo para simplificar o controlo do dinheiro. Ainda estamos a dar os primeiros passos, aprendendo com cada teste e feedback para entregar uma plataforma segura, transparente e realmente útil para quem quer organizar as finanças."
        />

        <TechnologySection />
      </div>

      <div className="py-8"></div>
      <LandingFooter />
    </div>
  );
};

export default AboutLandingPage;
