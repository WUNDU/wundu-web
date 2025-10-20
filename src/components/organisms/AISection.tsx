import React from 'react';
import Image from 'next/image';
import { appScreen } from '@/src/constants/images';
import { BookIcon, GroupIcon, SecurityIcon } from '@/src/constants/icons';

const AISection: React.FC = () => {

  const aiFeatures = [
    {
      icon: <SecurityIcon />,
      text: 'Segurança bancária com criptografia de ponta'
    },
    {
      icon: <BookIcon />,
      text: 'Conteúdo educativo personalizado'
    },
    {
      icon: <GroupIcon />,
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
                  <div className="w-12 h-12 bg-gradient-to-br text-yellow-700 from-yellow-100 to-yellow-200 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
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