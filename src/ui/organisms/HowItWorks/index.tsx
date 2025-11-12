import {
  ChartDesktopIcon,
  DocumentLibraryIcon,
  RobotIcon,
} from "@/constants/icons";

const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: "1",
      title: "Carrega os extratos",
      description:
        "Faça upload dos seus extratos bancários ou faturas. Suportamos PDF, JPG e PNG.",
      icon: <DocumentLibraryIcon className="w-10 h-10 text-[#CA6F06]/40" />,
    },
    {
      number: "2",
      title: "Processamento automático",
      description:
        "A nossa IA analisa e categoriza automaticamente todas as transações.",
      icon: <RobotIcon className="w-10 h-10 text-[#CA6F06]/40" />,
    },
    {
      number: "3",
      title: "Acompanha e otimiza",
      description:
        "Visualiza relatórios, define metas e obtém insights para melhorar suas finanças.",
      icon: <ChartDesktopIcon className="w-10 h-10 text-[#CA6F06]/40" />,
    },
  ];

  return (
    <section className="py-16 bg-white border-2 m-2 border-gray-100 shadow-2xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 fade-in-section">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Como funciona
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-yellow-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center fade-in-section group">
              <div className="relative mb-6">
                {/* Gradiente Radial de Fundo */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-200  to-orange-200 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>

                {/* Círculo Principal com Gradiente */}
                <div className="relative w-24 h-24 bg-gradient-to-br from-blue-600 to-yellow-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-2 shadow-xl group-hover:scale-110 transition-transform duration-300">
                  {step.number}
                </div>

                {/* Ícone Flutuante */}
                <div className="absolute -top-2 -right-2 w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-lg shadow-lg border border-gray-100">
                  {step.icon}
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-gray-800">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed group-hover:text-gray-700">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
