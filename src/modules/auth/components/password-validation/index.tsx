"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckmarkIcon } from "@/constants/icons";
import type { PasswordValidation } from "@/shared/components/utils/validation";

interface PasswordValidationProps {
  validation: PasswordValidation;
  showCriteria?: boolean;
  isVisible?: boolean;
}

const PasswordValidationFeedback: React.FC<PasswordValidationProps> = ({
  validation,
  showCriteria = true,
  isVisible = true,
}) => {
  const active = showCriteria && isVisible;

  const criteriaList = [
    { key: "minLength", label: "8+ chars", isValid: validation.criteria.minLength },
    { key: "hasLowercase", label: "a-z", isValid: validation.criteria.hasLowercase },
    { key: "hasUppercase", label: "A-Z", isValid: validation.criteria.hasUppercase },
    { key: "hasNumber", label: "0-9", isValid: validation.criteria.hasNumber },
    { key: "hasSpecialChar", label: "!@#", isValid: validation.criteria.hasSpecialChar },
  ];

  return (
    <div className="mt-2 px-1">
      <AnimatePresence initial={false}>
        {active && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex flex-wrap gap-x-3 gap-y-1.5"
          >
            {criteriaList.map((criterion) => (
              <div key={criterion.key} className="flex items-center gap-1.5">
                <div
                  className={`flex h-3.5 w-3.5 items-center justify-center rounded-full transition-colors duration-300 ${
                    criterion.isValid
                      ? "bg-green-500 text-white"
                      : "bg-slate-200 text-slate-400"
                  }`}
                >
                  {criterion.isValid ? (
                    <CheckmarkIcon className="h-2 w-2" />
                  ) : (
                    <div className="h-1 w-1 rounded-full bg-current" />
                  )}
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-tight transition-colors duration-300 ${
                    criterion.isValid ? "text-green-600" : "text-slate-400"
                  }`}
                >
                  {criterion.label}
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PasswordValidationFeedback;
