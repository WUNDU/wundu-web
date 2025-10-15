'use client';

import type { NextPage } from 'next';
import { useEffect, useRef } from 'react';
import LandingHeader from '../organisms/LandingHeader';
import HeroSection from '../organisms/HeroSection';
import FeaturesSection from '../organisms/FeaturesSection';
import AISection from '../organisms/AISection';
import CtaSectionLanding from '../molecules/CtaSectionLanding';
import LandingFooter from '../organisms/LandingFooter';

const HomeLandingPage: NextPage = () => {
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeIn');
            entry.target.classList.add('opacity-100');
            entry.target.classList.remove('opacity-0');
          }
        });
      },
      { threshold: 0.1 }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-white min-h-screen text-gray-800 font-sans">
      <LandingHeader />
      <main>
        <HeroSection ref={(el) => { sectionRefs.current[0] = el; }} />
        <FeaturesSection ref={(el) => { sectionRefs.current[1] = el; }} />
        <AISection ref={(el) => { sectionRefs.current[2] = el; }} />
        <CtaSectionLanding ref={(el) => { sectionRefs.current[3] = el; }} />
      </main>
      <LandingFooter ref={(el) => { sectionRefs.current[4] = el; }} />
    </div>
  );
};

export default HomeLandingPage;