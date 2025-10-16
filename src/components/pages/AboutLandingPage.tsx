// src/components/templates/AboutTemplate/index.tsx
'use client';
import React, { useEffect } from 'react';
import LandingHeader from '@/src/components/organisms/LandingHeader';
import LandingFooter from '@/src/components/organisms/LandingFooter';
import PageHero from '@/src/components/organisms/PageHero';
import TextSection from '@/src/components/molecules/TextSection';
import TechnologySection from '@/src/components/molecules/TechnologySection';

// Import ícones para os valores
import { Shield, Zap, Lightbulb, Eye } from 'lucide-react';

const AboutTemplate: React.FC = () => {
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

  // Dados para a seção de valores
  const values = [
    {
      icon: <Shield className="w-10 h-10 text-orange-600" />,
      title: 'Segurança',
      description: 'Os teus dados financeiros são protegidos com os mais altos padrões de segurança.'
    },
    {
      icon: <Zap className="w-10 h-10 text-orange-600" />,
      title: 'Simplicidade',
      description: 'Interface intuitivo que torna a gestão financeira acessível a todos.'
    },
    {
      icon: <Lightbulb className="w-10 h-10 text-orange-600" />,
      title: 'Inovação',
      description: 'Utilizamos tecnologia de ponta para criar soluções financeiras inteligentes.'
    },
    {
      icon: <Eye className="w-10 h-10 text-orange-600" />,
      title: 'Transparência',
      description: 'Comunicação clara sobre como utilizamos os teus dados e como funciona a nossa plataforma.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
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

        {/* Seção de Valores - reutilizando FeaturesSection */}
        <section className="py-12">
          <div className="text-center mb-20 fade-in-section">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">Os Nossos Valores</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-3xl p-10 text-center card-hover fade-in-section shadow-xl hover:shadow-2xl transition-all duration-500">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                  {value.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed text-lg">{value.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
      <div className='border-2 mx-2 p-10 my-5 shadow-2xs border-gray-100'>
        <TextSection
          title="A Nossa História"
          content="A WUNDU nasceu da necessidade de simplificar a gestão financeira pessoal. Percebemos que muitas pessoas têm dificuldade em acompanhar os seus gastos e atingir as suas metas financeiras. Criamos uma solução que combina inteligência artificial com design intuitivo, permitindo que qualquer pessoa possa ter controlo total sobre as suas finanças de forma simples e eficaz. Hoje, ajudamos milhares de utilizadores a alcançar a liberdade financeira através de ferramentas inteligentes e educação financeira de qualidade."
        />

        <TechnologySection />
      </div>

      <LandingFooter />
    </div>
  );
};

export default AboutTemplate;