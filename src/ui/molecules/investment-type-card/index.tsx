import { InvestmentType } from "@/types/article";
import React from "react";

interface InvestmentTypeCardProps {
  investmentType: InvestmentType;
}

const InvestmentTypeCard: React.FC<InvestmentTypeCardProps> = ({
  investmentType,
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center mb-2">
        <span className="font-semibold text-gray-900 mr-2">
          {investmentType.name}
        </span>
        <span
          className={`text-xs px-2 py-1 rounded-full ${investmentType.riskLevel}`}
        ></span>
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
