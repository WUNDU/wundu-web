// Atualização no FeaturesSection existente
interface FeaturesSectionProps {
  title: string;
  subtitle: string;
  features: Array<{
    icon: string | React.ReactNode;
    title: string;
    description: string;
    subDescription?: string;
  }>;
  backgroundColor?: string;
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  title,
  subtitle,
  features,
  backgroundColor = "bg-white"
}) => {
  return (
    <section className={`py-20 ${backgroundColor} border-2 m-2 border-gray-100 shadow-2xs`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20 fade-in-section">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">{title}</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-3xl p-8 text-center card-hover fade-in-section shadow-xl hover:shadow-2xl transition-all duration-500">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg text-2xl">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-700 leading-relaxed font-medium mb-2">
                {feature.description}
              </p>
              {feature.subDescription && (
                <p className="text-gray-500 text-sm">{feature.subDescription}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;