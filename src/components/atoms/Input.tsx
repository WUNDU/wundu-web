'use client'
import { ViewOffIcon, ViewOnIcon } from "@/src/constants/icons";
import { InputProps } from "@/src/types/input";
import { useState } from "react";

const Input: React.FC<InputProps> = ({ label, type, placeholder, value, onChange, isError = false, required = false, maxLenght }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === 'password';
  const inputType = isPasswordField && showPassword ? 'text' : type;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const borderClass = isError ? 'border-red-500' : 'border-gray-300'
  const ringClass = isError ? 'focus:ring-red-500' : 'focus:ring-blue-500'

  return (
    <div className="flex w-full flex-col gap-2">
      <style>{`
        /* Remove o ícone de 'revelar senha' nativo em navegadores Microsoft Edge */
        input[type="password"]::-ms-reveal {
          display: none;
        }
      `}</style>
      <label className="text-gray-600">{label}</label>
      <div className="relative">
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full rounded-xl border ${borderClass} px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 ${ringClass}`}
          required={required}
          maxLength={maxLenght}
        />
        {isPasswordField && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 text-gray-500"
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <ViewOnIcon />
            ) : (
              <ViewOffIcon />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default Input
