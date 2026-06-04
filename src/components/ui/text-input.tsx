"use client";

import React, { forwardRef, useId } from "react";

export interface TextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  isError?: boolean;
  errorMessage?: string;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, isError = false, errorMessage, className, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;

    const borderClass = isError ? "border-red-500" : "border-gray-300";
    const ringClass = isError ? "focus:ring-red-500" : "focus:ring-blue-500";

    return (
      <div className="flex w-full flex-col gap-2">
        {label && (
          <label htmlFor={inputId} className="text-gray-600 text-sm font-medium">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={isError || undefined}
          aria-describedby={isError && errorMessage ? errorId : undefined}
          className={`w-full rounded-xl border ${borderClass} px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 ${ringClass} ${className || ""}`}
          {...props}
        />
        {isError && errorMessage && (
          <p id={errorId} className="text-red-500 text-xs mt-0.5">
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

TextInput.displayName = "TextInput";
export default TextInput;
