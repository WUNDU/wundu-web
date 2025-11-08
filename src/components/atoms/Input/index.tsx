"use client";

import React, { useState, forwardRef } from "react";
import { SendIcon, ViewOffIcon, ViewOnIcon } from "@/src/constants/icons";

interface BaseInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  isError?: boolean;
  maxLength?: number;
  showSendButton?: boolean;
}

const Input = forwardRef<HTMLInputElement, BaseInputProps>(
  (
    {
      label,
      type = "text",
      placeholder,
      value,
      onChange,
      isError = false,
      required = false,
      maxLength,
      showSendButton = false,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordField = type === "password";
    const inputType = isPasswordField && showPassword ? "text" : type;

    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

    const borderClass = isError ? "border-red-500" : "border-gray-300";
    const ringClass = isError ? "focus:ring-red-500" : "focus:ring-blue-500";

    return (
      <div className="flex w-full flex-col gap-2">
        {label && (
          <label className="text-gray-600 text-sm font-medium">{label}</label>
        )}

        <div
          className={`relative flex items-center ${
            showSendButton ? "bg-gray-50 rounded-full p-1" : ""
          }`}
        >
          <input
            ref={ref}
            type={inputType}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required={required}
            maxLength={maxLength}
            className={`w-full rounded-xl border ${borderClass} px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 ${ringClass} ${
              showSendButton ? "bg-transparent text-sm border-none" : ""
            }`}
            {...props}
          />

          {/* Botão para mostrar/ocultar senha */}
          {isPasswordField && (
            <button
              type="button"
              className="absolute inset-y-0 right-3 text-gray-500"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? <ViewOnIcon /> : <ViewOffIcon />}
            </button>
          )}

          {/* Botão de enviar mensagem (caso showSendButton = true) */}
          {showSendButton && (
            <button
              type="button"
              className="bg-gradient-to-b from-blue-600 to-blue-300 p-2 m-1 rounded-full"
            >
              <SendIcon className="w-5 h-5 text-white" />
            </button>
          )}
        </div>
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
