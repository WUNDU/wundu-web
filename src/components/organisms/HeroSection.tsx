import React from 'react';
import { ArrowRight } from 'lucide-react';
import LandingButton from '@/src/components/atoms/LandingButton';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/src/constants/routes';

const HeroSection: React.FC = () => {
  const router = useRouter()
  const handleLogin = () => {
    router.push(ROUTES.LOGIN)
  }
  return (
    <section className="hero-bg pt-28 pb-20 md:pt-36 md:pb-28 border-2 mx-2 my-5 shadow-2xs border-gray-100 relative overflow-hidden rounded-2xl">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-blue-600/10"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight fade-in-section animate-in mb-6">
          O futuro das tuas<br />
          <span className="text-gradient bg-gradient-to-r from-yellow-400 to-orange-500">Finanças começa aqui</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-blue-100 max-w-3xl mx-auto fade-in-section animate-in delay-2 leading-relaxed">
          Com o WUNDU, controlar gastos, definir metas e organizar cartões nunca foi tão simples. Um app feito para o teu bolso e o teu ritmo.
        </p>
        <div className="mt-12 fade-in-section animate-in delay-4">
          <LandingButton onClick={handleLogin} className="py-2 md:px-12 md:py-5 font-bold rounded-full inline-flex items-center space-x-3 md:text-lg transition-all duration-500 hover:scale-105 hover:shadow-2xl">
            <span>Experimente agora - É grátis</span>
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </LandingButton>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;