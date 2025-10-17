const ContactHero: React.FC = () => {
  return (
    <section className="hero-bg pt-28 pb-20 md:pt-36 md:pb-28 border-2 mx-2 my-5 shadow-2xs border-gray-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-blue-600/10"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-20"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight fade-in-section animate-in mb-6">
          Fale Connosco
        </h1>
        <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto fade-in-section animate-in delay-2 leading-relaxed">
          Tem alguma dúvida ou sugestão? A nossa equipe está pronta para te ajudar.
        </p>
      </div>
    </section>
  );
};

export default ContactHero;