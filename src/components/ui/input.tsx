"use client";

import React, { useState, forwardRef } from "react";
import { SendIcon, ViewOffIcon, ViewOnIcon } from "@/constants/icons";

interface BaseInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  isError?: boolean;
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
      required = false,
      maxLength,
      showSendButton = false,
      leftIcon,
      className,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    
    const isPasswordField = type === "password";
    const inputType = isPasswordField && showPassword ? "text" : type;

    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

    // Border and Ring logic — brand blue #003cc3 on focus, matching mobile Input
    const stateClasses = isError 
      ? "border-red-500 bg-red-50/30" 
      : isFocused 
        ? "border-[#003cc3] bg-white ring-4 ring-[#003cc3]/[0.06]" 
        : "border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50";

    const iconColorClass = isError 
      ? "text-red-400" 
      : isFocused 
        ? "text-[#003cc3]" 
        : "text-slate-400";

    return (
      <div className="flex w-full flex-col gap-2 group">
        {label && (
          <label className={`text-sm font-semibold transition-colors duration-150 ${
            isError ? "text-red-600" : isFocused ? "text-[#003cc3]" : "text-slate-500"
          }`}>
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
            className={`
              w-full rounded-xl border py-3 text-[15px] text-slate-900 
              placeholder:text-slate-400 placeholder:font-medium
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
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? <ViewOnIcon className="w-5 h-5" /> : <ViewOffIcon className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
