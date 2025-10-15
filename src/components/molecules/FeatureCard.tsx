import type { FeatureCardProps } from '@/src/types/card';
import React from 'react';

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay }) => {
  return (
    <div className={`bg-white rounded-2xl p-8 text-center card-hover fade-in-section ${delay ? `delay-${delay}` : ''} shadow-lg`}>
      <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default FeatureCard;