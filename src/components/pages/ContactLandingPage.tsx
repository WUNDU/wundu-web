// src/components/templates/ContactTemplate/index.tsx
'use client';
import React, { useEffect } from 'react';
import LandingHeader from '@/src/components/organisms/LandingHeader';
import LandingFooter from '@/src/components/organisms/LandingFooter';
import ContactHero from '@/src/components/organisms/ContactHero';
import ContactMethods from '@/src/components/organisms/ContactMethods';
import ContactFormSection from '@/src/components/organisms/ContactFormSection';

const ContactLandingPage: React.FC = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.fade-in-section').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <LandingHeader />
      <ContactHero />
      <ContactMethods />
      <ContactFormSection />
      <LandingFooter />
    </div>
  );
};

export default ContactLandingPage;