"use client";

import React from "react";
import type { PasswordValidation } from "@/utils/validation";

interface PasswordStrengthProps {
  validation: PasswordValidation;
  showStrength?: boolean;
}

const PasswordStrength: React.FC<PasswordStrengthProps> = ({
  validation,
  showStrength = true,
}) => {
  if (!showStrength) return null;

  const getStrengthLevel = () => {
    const validCriteria = Object.values(validation.criteria).filter(Boolean).length;
    const totalCriteria = Object.values(validation.criteria).length;
    const percentage = (validCriteria / totalCriteria) * 100;

    if (percentage === 100) return { level: "Forte", color: "bg-green-500", textColor: "text-green-600" };
    if (percentage >= 66) return { level: "Média", color: "bg-yellow-500", textColor: "text-yellow-600" };
    if (percentage >= 33) return { level: "Fraca", color: "bg-orange-500", textColor: "text-orange-600" };
    return { level: "Muito fraca", color: "bg-red-500", textColor: "text-red-600" };
  };

  const strength = getStrengthLevel();
  const validCriteria = Object.values(validation.criteria).filter(Boolean).length;
  const totalCriteria = Object.values(validation.criteria).length;
  const percentage = (validCriteria / totalCriteria) * 100;

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Força da senha:</span>
        <span className={`text-sm font-medium ${strength.textColor}`}>
          {strength.level}
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${strength.color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {validation.messages.length > 0 && (
        <p className="text-sm text-gray-600">
          {validation.messages.length === 1 
            ? `Falta: ${validation.messages[0].toLowerCase()}`
            : `Faltam ${validation.messages.length} critérios`
          }
        </p>
      )}
    </div>
  );
};

export default PasswordStrength;
