"use client";
import React, { useEffect } from "react";
import LandingHeader from "@/shared/components/landing-header";
import LandingFooter from "@/shared/components/landing-footer";
import ContactMethods from "@/shared/components/contact-methods";
import ContactFormSection from "@/shared/components/contact-form-section";
import { PageHero } from "@/shared/components";

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
        title="Fale Connosco"
        description="Tem alguma dúvida ou sugestão? A nossa equipe está pronta para te ajudar."
      />

      <ContactMethods />
      <ContactFormSection />
      <div className="py-8"></div>
      <LandingFooter />
    </div>
  );
};

export default ContactLandingPage;
