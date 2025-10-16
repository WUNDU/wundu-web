// src/components/molecules/TechnologySection/index.tsx
const TechnologySection: React.FC = () => {
  const technologies = [
    'IA e Machine Learning',
    'OCR Avançado',
    'Encriptação de dados',
    'Open Banking',
    'Análise Preditiva',
    'APIs Seguras'
  ];

  return (
    <section className="py-12 fade-in-section">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Tecnologia de ponta</h2>
      <p className="text-lg text-gray-700 mb-6">
        Utilizamos as mais recentes tecnologias para garantir a melhor experiência e segurança.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {technologies.map((tech, index) => (
          <div key={index} className="bg-blue-50 rounded-lg p-4 text-center">
            <span className="text-blue-700 font-medium">{tech}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TechnologySection;