"use client";

import React from "react";
import { CheckmarkIcon } from "@/constants/icons";
import type { PasswordValidation } from "@/shared/components/utils/validation";

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
      label: "Min. 8 caracteres",
      isValid: validation.criteria.minLength,
    },
    {
      key: "maxLength",
      label: "Max. 12 caracteres",
      isValid: validation.criteria.maxLength,
    },
    {
      key: "hasLowercase",
      label: "Letra minúscula (a-z)",
      isValid: validation.criteria.hasLowercase,
    },
    {
      key: "hasUppercase",
      label: "Letra maiúscula (A-Z)",
      isValid: validation.criteria.hasUppercase,
    },
    {
      key: "hasNumber",
      label: "Número (0-9)",
      isValid: validation.criteria.hasNumber,
    },
    {
      key: "hasSpecialChar",
      label: "Caractere especial (@$!%*?&)",
      isValid: validation.criteria.hasSpecialChar,
    },
  ];

  return (
    <div className="mt-2 space-y-1">
      <p className="text-xs font-medium text-gray-700">Requisitos da senha:</p>
      <ul className="space-y-0.5">
        {criteriaList.map((criterion) => (
          <li key={criterion.key} className="flex items-center space-x-1.5">
            <div
              className={`flex-shrink-0 w-3 h-3 rounded-full flex items-center justify-center ${
                criterion.isValid
                  ? "bg-green-100 text-green-600"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {criterion.isValid ? (
                <CheckmarkIcon className="w-2 h-2" />
              ) : (
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
              )}
            </div>
            <span
              className={`text-xs ${
                criterion.isValid ? "text-green-600" : "text-gray-600"
              }`}
            >
              {criterion.label}
            </span>
          </li>
        ))}
      </ul>

      {validation.messages.length > 0 && (
        <div className="mt-1.5 p-1.5 bg-red-50 border border-red-200 rounded-md">
          <p className="text-xs text-red-600 font-medium">Ainda faltam:</p>
          <ul className="mt-0.5 text-xs text-red-600">
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
