import { NotificationDeskIcon, ObjectiveIcon, StatsIcon, UploadIcon } from "@/src/constants/icons"

// src/components/organisms/MainFeatures/index.tsx
const MainFeatures: React.FC = () => {
  const features = [
    {
      icon: <UploadIcon className="w-10 h-10 text-white" />,
      title: 'Carregamento inteligente',
      description: 'Carregue extratos bancários e faturas em PDF ou Imagem. Nosso OCR processa automaticamente e categoriza as transações.',
      items: [
        'Reconhecimento automático',
        'Suporte para PDF e imagens',
        'Categorização por IA'
      ],
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: <StatsIcon className="w-10 h-10 text-white" />,
      title: 'Relatórios Avançados',
      description: 'Visualize seus gastos com gráficos interativos e relatórios detalhados. Exporte em PDF para compartilhar ou salvar.',
      items: [
        'Gráficos interativos',
        'Análise por categorias',
        'Exportação em PDF'
      ],
      color: 'from-green-500 to-green-600'
    },
    {
      icon: <ObjectiveIcon className="w-10 h-10 text-white" />,
      title: 'Metas Financeiras',
      description: 'Definir objetivos de poupança e gastos. Acompanha o progresso em tempo real e recebe dicas personalizadas.',
      items: [
        'Objetivos personalizados',
        'Progresso em tempo real',
        'Dicas inteligentes'
      ],
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: <NotificationDeskIcon className="w-10 h-10 text-white" />,
      title: 'Notificações Inteligentes',
      description: 'Recebe alertas quando ultrapassas limites de gastos ou quando é altura de poupar para as tuas metas.',
      items: [
        'Alertas personalizadas',
        'Limites configurados',
        'Lembretes de metas'
      ],
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {features.map((feature, index) => (
            <div key={index} className="group fade-in-section hover:scale-105 transition-transform duration-300">
              <div className="flex items-start space-x-6 p-6 rounded-2xl hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="flex-shrink-0">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-2xl text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed group-hover:text-gray-700">
                    {feature.description}
                  </p>
                  <ul className="space-y-2">
                    {feature.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center text-gray-700 group-hover:text-gray-800">
                        <span className={`w-2 h-2 bg-gradient-to-r ${feature.color} rounded-full mr-3`}></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MainFeatures;