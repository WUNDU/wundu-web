"use client";
import React, { useEffect } from "react";
import LandingHeader from "@/ui/organisms/LandingHeader";
import LandingFooter from "@/ui/organisms/LandingFooter";
import ContactMethods from "@/ui/organisms/ContactMethods";
import ContactFormSection from "@/ui/organisms/ContactFormSection";
import { PageHero } from "@/ui/organisms";

const ContactLandingPage: React.FC = () => {
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
      <PageHero
        title="Fale Connosco"
        description="Tem alguma dúvida ou sugestão? A nossa equipe está pronta para te ajudar."
      />

      <ContactMethods />
      <ContactFormSection />
      <LandingFooter />
    </div>
  );
};

export default ContactLandingPage;
