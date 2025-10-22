interface FeaturesSectionProps {
  title: string;
  subtitle: string;
  features: Array<{
    icon: React.ReactNode;
    title: string;
    description: string;
    subDescription?: string;
  }>;
  backgroundColor?: string;
  gradientFrom?: string;
  gradientTo?: string;
  containerSize?: string;
  containerRounded?: string;
  cardRounded?: string;
  gridCols?: number;
  textColor?: string;
  descriptionClass?: string;
  titleClass?: string;
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  title,
  subtitle,
  features,
  backgroundColor = "bg-white",
  gradientFrom = "from-yellow-100",
  gradientTo = "to-blue-200",
  containerSize = "w-20 h-20",
  containerRounded = "rounded-2xl",
  cardRounded = "rounded-3xl",
  gridCols = 4,
  descriptionClass = "text-gray-700 leading-relaxed font-medium mb-2",
  titleClass = "text-xl font-bold text-gray-900 mb-3",
}) => {
  return (
    <section className={`py-20 ${backgroundColor} border-2 m-2 border-gray-100 shadow-2xs rounded-2xl`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20 fade-in-section">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">{title}</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${gridCols} gap-8`}>
          {features.map((feature, index) => (
            <div key={index} className={`bg-white ${cardRounded} p-8 text-center card-hover fade-in-section shadow-xl hover:shadow-2xl transition-all duration-500`}>
              <div className={`${containerSize}  bg-gradient-to-br ${gradientFrom} ${gradientTo} ${containerRounded} flex items-center justify-center mx-auto mb-6 shadow-lg text-2xl`}>
                {feature.icon}
              </div>
              <h3 className={titleClass}>{feature.title}</h3>
              <p className={descriptionClass}>
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