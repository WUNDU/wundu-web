'use client';

import { BriefcaseIcon, ChartBarIcon, TargetIcon } from 'lucide-react';
import FeatureCard from '../molecules/FeatureCard';

const FeaturesSection = ({ ref }: { ref: React.Ref<HTMLDivElement> }) => (
  <section className="bg-gray-50 py-20" ref={ref}>
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-blue-900">Gestão financeira simplificada</h2>
        <p className="mt-4 max-w-2xl mx-auto text-gray-600">
          Três pilares fundamentais para o controle total das suas finanças pessoais.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        <FeatureCard
          icon={<ChartBarIcon className="w-8 h-8 text-yellow-500" />}
          title="Gestão de gastos"
          description="Upload de extratos com categorização inteligente por IA, para ter sempre o controle dos teus gastos."
        />
        <FeatureCard
          icon={<BriefcaseIcon className="w-8 h-8 text-yellow-500" />}
          title="Gestão de orçamento"
          description="Crie orçamentos realistas e controle seus gastos por categoria para nunca mais estourar suas finanças."
        />
        <FeatureCard
          icon={<TargetIcon className="w-8 h-8 text-yellow-500" />}
          title="Metas financeiras"
          description="Defina objetivos claros e acompanhe o progresso em tempo real. Transforme sonhos em planos concretos."
        />
      </div>
    </div>
  </section>
);

export default FeaturesSection;