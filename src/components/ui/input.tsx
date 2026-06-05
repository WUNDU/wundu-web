"use client";

import React, { useState, forwardRef } from "react";
import { SendIcon, ViewOffIcon, ViewOnIcon } from "@/constants/icons";

interface BaseInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  isError?: boolean;
  errorMessage?: string;
  maxLength?: number;
  showSendButton?: boolean;
  leftIcon?: React.ReactNode;
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
      errorMessage,
      required = false,
      maxLength,
      showSendButton = false,
      leftIcon,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    
    const isPasswordField = type === "password";
    const inputType = isPasswordField && showPassword ? "text" : type;

    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

    // Border logic — consistent with PhoneInput style
    const stateClasses = isError 
      ? "border-red-500 bg-red-50/30" 
      : isFocused 
        ? "border-[#003cc3] bg-white ring-4 ring-[#003cc3]/[0.06]" 
        : "border-slate-200 bg-slate-50/50 hover:border-slate-300";

    const iconColorClass = isError 
      ? "text-red-500" 
      : isFocused 
        ? "text-[#003cc3]" 
        : "text-slate-400";

    return (
      <div className="flex w-full flex-col gap-2 group">
        {label && (
          <label
            htmlFor={id}
            className={`text-sm font-semibold transition-colors duration-150 ${
              isError ? "text-red-500" : "text-slate-500"
            }`}
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className={`absolute left-4 flex items-center pointer-events-none transition-colors duration-150 ${iconColorClass}`}>
              {React.cloneElement(leftIcon as React.ReactElement<any>, {
                className: `${(leftIcon as React.ReactElement<any>).props.className || "w-5 h-5"} transition-all duration-150`
              })}
            </div>
          )}

          <input
            ref={ref}
            id={id}
            type={inputType}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            required={required}
            maxLength={maxLength}
            aria-invalid={isError || undefined}
            aria-describedby={isError && errorMessage && id ? `${id}-error` : undefined}
            className={`
              w-full rounded-lg border py-3 text-[15px] text-slate-900 
              placeholder:text-slate-400 placeholder:font-normal
              transition-all duration-150 ease-in-out
              focus:outline-none
              ${stateClasses}
              ${leftIcon ? "pl-11" : "px-4"}
              ${isPasswordField ? "pr-12" : "pr-4"}
              ${className || ""}
            `}
            {...props}
          />

          {isPasswordField && (
            <button
              type="button"
              tabIndex={-1}
              className={`absolute inset-y-0 right-3 flex items-center justify-center p-2 transition-colors duration-150 ${iconColorClass} hover:text-slate-900`}
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Ocultar palavra-passe" : "Mostrar palavra-passe"}
            >
              {showPassword ? <ViewOnIcon className="w-5 h-5" /> : <ViewOffIcon className="w-5 h-5" />}
            </button>
          )}
        </div>

        {isError && errorMessage && (
          <p
            id={id ? `${id}-error` : undefined}
            role="alert"
            className="text-xs font-semibold text-red-600"
          >
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
