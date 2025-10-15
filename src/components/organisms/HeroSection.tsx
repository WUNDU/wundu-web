'use client';

import LandingButton from '../atoms/LandingButton';

const HeroSection = ({ ref }: { ref: React.Ref<HTMLDivElement> }) => (
  <section className="bg-gradient-to-b from-blue-900 to-blue-800 text-white py-20 md:py-32" ref={ref}>
    <div className="container mx-auto px-4 text-center">
      <h1 className="text-4xl md:text-6xl font-extrabold leading-tight animate-float">
        O futuro das tuas<br />
        <span className="text-yellow-400">Finanças começa aqui</span>
      </h1>
      <p className="mt-6 max-w-2xl mx-auto text-lg text-blue-200">
        Com o WUNDU, controlar gastos, definir metas e organizar cartões nunca foi tão simples. Um app feito para o teu bolso e o teu ritmo.
      </p>
      <div className="mt-10">
        <LandingButton className="bg-yellow-400 text-blue-900 hover:bg-yellow-500 animate-pulse">
          Experimente agora - É grátis →
        </LandingButton>
      </div>
    </div>
  </section>
);

export default HeroSection;