"use client";

import React from "react";
import { CheckmarkIcon } from "@/constants/icons";
import type { PasswordValidation } from "@/utils/validation";

interface PasswordValidationProps {
  validation: PasswordValidation;
  showCriteria?: boolean;
}

const PasswordValidationFeedback: React.FC<PasswordValidationProps> = ({
  validation,
  showCriteria = true,
}) => {
  if (!showCriteria) return null;

  const criteriaList = [
    {
      key: "minLength",
      label: "Mínimo de 8 caracteres",
      isValid: validation.criteria.minLength,
    },
    {
      key: "maxLength", 
      label: "Máximo de 12 caracteres",
      isValid: validation.criteria.maxLength,
    },
    {
      key: "hasLowercase",
      label: "Pelo menos uma letra minúscula (a-z)",
      isValid: validation.criteria.hasLowercase,
    },
    {
      key: "hasUppercase",
      label: "Pelo menos uma letra maiúscula (A-Z)",
      isValid: validation.criteria.hasUppercase,
    },
    {
      key: "hasNumber",
      label: "Pelo menos um número (0-9)",
      isValid: validation.criteria.hasNumber,
    },
    {
      key: "hasSpecialChar",
      label: "Pelo menos um caractere especial (@$!%*?&)",
      isValid: validation.criteria.hasSpecialChar,
    },
  ];

  return (
    <div className="mt-3 space-y-2">
      <p className="text-sm font-medium text-gray-700">Requisitos da senha:</p>
      <ul className="space-y-1">
        {criteriaList.map((criterion) => (
          <li key={criterion.key} className="flex items-center space-x-2">
            <div
              className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
                criterion.isValid
                  ? "bg-green-100 text-green-600"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {criterion.isValid ? (
                <CheckmarkIcon className="w-3 h-3" />
              ) : (
                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
              )}
            </div>
            <span
              className={`text-sm ${
                criterion.isValid ? "text-green-600" : "text-gray-600"
              }`}
            >
              {criterion.label}
            </span>
          </li>
        ))}
      </ul>
      
      {validation.messages.length > 0 && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600 font-medium">Ainda faltam:</p>
          <ul className="mt-1 text-sm text-red-600">
            {validation.messages.map((message, index) => (
              <li key={index}>• {message}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PasswordValidationFeedback;
