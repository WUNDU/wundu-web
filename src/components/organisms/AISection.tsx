'use client';

import Image from 'next/image';
import InfoPoint from '../molecules/InfoPoint';
import { appScreen } from '@/src/constants/images';

const AISection = ({ ref }: { ref: React.Ref<HTMLDivElement> }) => (
  <section className="py-20" ref={ref}>
    <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
      <div className="md:pr-12">
        <h2 className="text-3xl md:text-4xl font-bold text-blue-900">Inteligência artificial ao seu serviço</h2>
        <p className="mt-6 text-gray-600 leading-relaxed">
          A nossa tecnologia avançada categoriza automaticamente as suas transações, identifica padrões de gastos e fornece insights personalizados para melhorar a sua saúde financeira.
        </p>
        <ul className="mt-8 space-y-4">
          <InfoPoint>Segurança bancária com criptografia de ponta</InfoPoint>
          <InfoPoint>Conteúdo educativo personalizado</InfoPoint>
          <InfoPoint>Suporte dedicado sempre disponível</InfoPoint>
        </ul>
      </div>
      <div className="relative">
        <Image
          src={appScreen}
          alt="App Wundu no celular"
          className="rounded-2xl mx-auto animate-float-slow"
        />
      </div>
    </div>
  </section>
);

export default AISection;