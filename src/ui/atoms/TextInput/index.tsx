"use client";

import React, { forwardRef } from "react";

export interface TextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  isError?: boolean;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, isError = false, className, ...props }, ref) => {
    const borderClass = isError ? "border-red-500" : "border-gray-300";
    const ringClass = isError ? "focus:ring-red-500" : "focus:ring-blue-500";

    return (
      <div className="flex w-full flex-col gap-2">
        {label && (
          <label className="text-gray-600 text-sm font-medium">{label}</label>
        )}
        <input
          ref={ref}
          className={`w-full rounded-xl border ${borderClass} px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 ${ringClass} ${className || ""}`}
          {...props}
        />
      </div>
    );
  }
);

TextInput.displayName = "TextInput";
export default TextInput;
