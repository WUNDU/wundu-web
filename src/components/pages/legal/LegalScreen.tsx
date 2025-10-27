// src/components/templates/LegalPageTemplate/index.tsx
'use client';
import React, { useEffect, useState } from 'react';
import LandingHeader from '@/src/components/organisms/LandingHeader';
import LandingFooter from '@/src/components/organisms/LandingFooter';
import LegalTabs from '@/src/components/molecules/LegalTabs';
import PrivacyPolicy from '@/src/components/organisms/PrivacyPolicy';
import CookiesPolicy from '@/src/components/organisms/CookiesPolicy';
import TermsOfUse from '@/src/components/organisms/TermsOfUse';

const LegalPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'cookies' | 'terms'>('privacy');

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
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-white">
      <LandingHeader />
      
      {/* Hero Section */}
      <section className="min-h-[80vh] relative">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-900 via-blue-800 to-yellow-400"></div>
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-blue-900/80 via-blue-800/70 to-yellow-400/80"></div>
        
        <div className="container mx-auto px-6 relative z-20 flex items-center min-h-[80vh]">
          <div className="max-w-4xl mx-auto text-center fade-in-section">
            <span className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white mb-6 text-sm font-medium">
              WUNDU • Privacidade e Segurança em Primeiro Lugar
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Políticas de Privacidade e Cookies
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Entenda como coletamos, usamos e protegemos suas informações pessoais e financeiras enquanto você utiliza os
              serviços da WUNDU.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="#policy-content" 
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-full font-medium text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Ler a Política <span className="ml-2">↓</span>
              </a>
              <a 
                href="/contactos" 
                className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full font-medium text-center hover:bg-white/30 transition-all duration-300 hover:scale-105"
              >
                Fale Conosco <span className="ml-2">💬</span>
              </a>
            </div>
          </div>
        </div>

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 text-center">
          <div className="animate-bounce">
            <a 
              href="#policy-content" 
              className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm hover:bg-white/30 transition-all duration-300"
            >
              <span className="text-white">↓</span>
            </a>
          </div>
        </div>
      </section>

      {/* Tabbed Content */}
      <section id="policy-content" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 fade-in-section">
            <span className="text-blue-600 font-medium text-sm uppercase tracking-wider">NOSSAS POLÍTICAS</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">Entenda Nossas Regras</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Saiba como tratamos seus dados e os termos que regem o uso do nosso serviço.
            </p>
          </div>

          <LegalTabs activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="max-w-4xl mx-auto">
            {activeTab === 'privacy' && <PrivacyPolicy />}
            {activeTab === 'cookies' && <CookiesPolicy />}
            {activeTab === 'terms' && <TermsOfUse />}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-gray-50 border-2 m-2 border-gray-100 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-3xl overflow-hidden relative">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
            
            <div className="p-12 md:p-16 text-center relative z-10 fade-in-section">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Dúvidas sobre nossa política?</h2>
              <p className="text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
                Estamos comprometidos com a transparência e queremos garantir que você compreenda completamente como
                tratamos suas informações. Entre em contato conosco caso tenha dúvidas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/contactos" 
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-full font-medium text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Fale Conosco <span className="ml-2">→</span>
                </a>
                <a 
                  href="/funcionalidades" 
                  className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full font-medium text-center hover:bg-white/30 transition-all duration-300 hover:scale-105"
                >
                  Baixe o MVP <span className="ml-2">📥</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
};

export default LegalPage;