const CtaSection: React.FC = () => {
  return (
    <div className="flex flex-col items-start px-4 text-justify">
      <h1 className="text-5xl font-bold leading-tight tracking-tighter text-gray-800 md:text-5xl">
        Acompanhe seus gastos sem esforço
        <span className="inline-block w-5 h-5 bg-yellow-400 align-middle ml-2"></span>
      </h1>
      <p className="mt-6 text-lg text-gray-600 md:text-xl">
        Gerencie suas finanças facilmente usando nossa interface intuitiva e amigável, defina
        metas financeiras e monitore seu progresso.
      </p>
    </div>
  );
};

export default CtaSection