import { InvestmentType } from '@/src/types/article';
import React from 'react';


interface InvestmentTypeCardProps {
  investmentType: InvestmentType;
}

const InvestmentTypeCard: React.FC<InvestmentTypeCardProps> = ({ investmentType }) => {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'baixo': return 'text-green-600';
      case 'médio': return 'text-yellow-600';
      case 'alto': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'baixo': return 'bg-green-100 text-green-800';
      case 'médio': return 'bg-yellow-100 text-yellow-800';
      case 'alto': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center mb-2">
        <span className="font-semibold text-gray-900 mr-2">{investmentType.name}</span>
        <span className={`text-xs px-2 py-1 rounded-full ${getRiskBadge(investmentType.riskLevel)}`}>
          {investmentType.riskLevel} risco
        </span>
      </div>
      <p className="text-gray-600 text-sm mb-3">{investmentType.description}</p>
      <ul className="space-y-1">
        {investmentType.examples.map((example, index) => (
          <li key={index} className="text-sm text-gray-700 flex items-start">
            <span className="text-gray-400 mr-2">•</span>
            {example}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InvestmentTypeCard;