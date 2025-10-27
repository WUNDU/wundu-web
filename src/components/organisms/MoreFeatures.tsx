import {
  BookIcon,
  ComputerPhoneSyncIcon,
  MobileIcon,
} from "@/src/constants/icons";
import { ShieldIcon, Phone } from "lucide-react";

// src/components/organisms/MoreFeatures/index.tsx
const MoreFeatures: React.FC = () => {
  const moreFeatures = [
    {
      icon: <BookIcon className="w-10 h-10 text-white" />,
      title: "Educação Financeira",
      description:
        "Acede a conteúdos educativos e simuladores para melhorar a sua literacia financeira.",
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: <ShieldIcon className="w-10 h-10 text-white" />,
      title: "Segurança Bancária",
      description:
        "Criptografia de nível bancário para proteger todos os seus dados financeiros.",
      color: "from-red-500 to-pink-500",
    },
    {
      icon: <MobileIcon className="w-10 h-10 text-white" />,
      title: "Multiplataforma",
      description:
        "Acede as suas finanças em qualquer dispositivo – web, mobile ou tablet.",
      color: "from-green-500 to-teal-500",
    },
    {
      icon: <ComputerPhoneSyncIcon className="w-10 h-10 text-white" />,
      title: "Sincronização Automática",
      description:
        "Acede as suas finanças em qualquer dispositivo – web, mobile ou tablet.",
      color: "from-yellow-500 to-orange-500",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50 border-2 m-2 border-gray-100 shadow-2xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 fade-in-section">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            E muito mais...
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {moreFeatures.map((feature, index) => (
            <div key={index} className="group fade-in-section">
              <div className="bg-white rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 border border-gray-100 group-hover:border-transparent group-hover:scale-105">
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-2xl text-white mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MoreFeatures;
