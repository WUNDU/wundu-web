// src/components/organisms/PageHero/index.tsx
interface PageHeroProps {
  title: string;
  description: string;
}

const PageHero: React.FC<PageHeroProps> = ({ title, description }) => {
  return (
    <section className="hero-bg pt-28 pb-20 md:pt-36 md:pb-28 border-2 mx-2 my-5 shadow-2xs border-gray-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-blue-600/10"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gradient bg-gradient-to-r from-yellow-400 to-orange-500 leading-tight fade-in-section animate-in mb-6">
          {title}
        </h1>
        <p className="mt-6 text-lg md:text-xl text-blue-100 max-w-3xl mx-auto fade-in-section animate-in delay-2 leading-relaxed">
          {description}
        </p>
      </div>
    </section>
  );
};

export default PageHero;
