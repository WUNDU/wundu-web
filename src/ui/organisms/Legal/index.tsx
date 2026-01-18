"use client";
import React, { useEffect } from "react";
import LandingHeader from "@/ui/organisms/landing-header";
import LandingFooter from "@/ui/organisms/landing-footer";

interface LegalTemplateProps {
  title: string;
  subtitle: string;
  description: string;
  children: React.ReactNode;
}

const LegalTemplate: React.FC<LegalTemplateProps> = ({
  title,
  subtitle,
  description,
  children,
}) => {
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
    <div className="min-h-screen bg-white">
      <LandingHeader />

      {/* Hero Section */}
      <section className="hero-bg pt-28 pb-20 md:pt-36 md:pb-28 border-2 mx-2 my-5 shadow-2xs border-gray-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-blue-600/10"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-20"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white mb-6 text-sm font-medium fade-in-section">
            {subtitle}
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight fade-in-section animate-in">
            {title}
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto fade-in-section animate-in delay-2 leading-relaxed">
            {description}
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="bg-white">{children}</div>

      <LandingFooter />
    </div>
  );
};

export default LegalTemplate;
