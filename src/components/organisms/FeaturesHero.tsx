// src/components/organisms/FeaturesHero/index.tsx
const FeaturesHero: React.FC = () => {
  return (
    <section className="pt-28 pb-16 md:pt-36 md:pb-24 bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6 fade-in-section">
          Todas as
          <span className="text-gradient bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800"> funcionalidades</span><br />
          que você precisa
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto fade-in-section delay-2 leading-relaxed">
          Descobre como o WUNDU pode revolucionar a forma como gere o seu dinheiro,
          com tecnologia de ponta e design intuitivo.
        </p>
      </div>
    </section>
  );
};

export default FeaturesHero;