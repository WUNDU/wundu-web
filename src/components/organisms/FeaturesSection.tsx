import React from 'react';
import { Target } from 'lucide-react';
import FeatureItem from '@/src/components/molecules/FeatureItem';

const FeaturesSection: React.FC = () => {
  const ChartIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="20" x2="12" y2="10"></line>
      <line x1="18" y1="20" x2="18" y2="4"></line>
      <line x1="6" y1="20" x2="6" y2="16"></line>
    </svg>
  );

  const BriefcaseIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
    </svg>
  );

  const features = [
    {
      icon: <ChartIcon />,
      title: 'Gestão de gastos',
      description: 'Upload de extratos automático com categorização inteligente por IA. Mantenha sempre o controle dos seus gastos.'
    },
    {
      icon: <BriefcaseIcon />,
      title: 'Gestão de orçamento',
      description: 'Crie orçamentos realistas e controle seus gastos por categoria para nunca mais estourar suas finanças.'
    },
    {
      icon: <Target className="w-10 h-10 text-orange-600" />,
      title: 'Metas financeiras',
      description: 'Definir objetivos claros e acompanhar o progresso em tempo real. Transforme sonhos em planos concretos.'
    }
  ];

  return (
    <section className="py-20 bg-gray-50 border-2 m-2 border-gray-100 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20 fade-in-section">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">Gestão financeira simplificada</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Três pilares fundamentais para o controle total das suas finanças pessoais.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureItem
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;