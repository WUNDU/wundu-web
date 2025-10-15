'use client';
import React, { useEffect } from 'react';
import LandingHeader from '../organisms/LandingHeader';
import HeroSection from '../organisms/HeroSection';
import FeaturesSection from '../organisms/FeaturesSection';
import AISection from '../organisms/AISection';
import CTASection from '../organisms/CTASection';
import LandingFooter from '../organisms/LandingFooter';

const WunduLanding: React.FC = () => {
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
      <HeroSection />
      <FeaturesSection />
      <AISection />
      <CTASection />
      <LandingFooter />
    </div>
  );
};

export default WunduLanding;