import React from 'react';
import Image from 'next/image';
import { appScreen } from '@/src/constants/images';

const AISection: React.FC = () => {
  const ShieldIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
  );

  const BookIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
    </svg>
  );

  const HeadphonesIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
    </svg>
  );

  const aiFeatures = [
    {
      icon: <ShieldIcon />,
      text: 'Segurança bancária com criptografia de ponta'
    },
    {
      icon: <BookIcon />,
      text: 'Conteúdo educativo personalizado'
    },
    {
      icon: <HeadphonesIcon />,
      text: 'Suporte dedicado sempre disponível'
    }
  ];

  return (
    <section className="py-20 bg-white overflow-hidden border-2 m-2 border-gray-100 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="fade-in-section">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
              Inteligência artificial<br />ao seu serviço
            </h2>
            <p className="text-lg text-gray-600 mb-10 leading-relaxed">
              A nossa tecnologia avançada categoriza automaticamente as suas transações, identifica padrões de gastos e fornece insights personalizados para melhorar a sua saúde financeira.
            </p>
            <div className="space-y-6">
              {aiFeatures.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 rounded-2xl hover:bg-yellow-50 transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
                    {feature.icon}
                  </div>
                  <span className="text-gray-700 text-lg pt-2">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="fade-in-section">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-yellow-500 to-blue-500 rounded-3xl opacity-20 blur-xl"></div>
              <Image
                src={appScreen}
                alt="App Wundu"
                className="rounded-3xl mx-auto max-w-md shadow-2xl relative z-10 float-animation"
                width={400}
                height={800}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AISection;