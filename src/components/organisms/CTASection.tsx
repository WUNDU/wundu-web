import React from 'react';
import { ArrowRight } from 'lucide-react';
import LandingButton from '@/src/components/atoms/LandingButton';

const CTASection: React.FC = () => {
  return (
    <section className="hero-bg py-20 border-2 m-2 border-gray-100 shadow-2xs relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-blue-600/20"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 fade-in-section">
          Pronto para assumir o controle?
        </h2>
        <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-12 fade-in-section delay-2 leading-relaxed">
          Junta-te a milhares de pessoas que já começaram a transformar a sua relação com o dinheiro.
        </p>
        <div className="fade-in-section delay-4">
          <LandingButton className="px-12 py-5 font-bold rounded-full inline-flex items-center space-x-3 text-lg transition-all duration-500 hover:scale-105 hover:shadow-2xl">
            <span>Experimente agora - É grátis</span>
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </LandingButton>
        </div>
      </div>
    </section>
  );
};

export default CTASection;