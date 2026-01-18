"use client";
import React, { useEffect } from "react";
import LandingHeader from "@/ui/organisms/landing-header";
import LandingFooter from "@/ui/organisms/landing-footer";
import ContactMethods from "@/ui/organisms/contact-methods";
import ContactFormSection from "@/ui/organisms/contact-form-section";
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
