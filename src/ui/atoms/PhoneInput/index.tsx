"use client";

import React, { useState, forwardRef } from "react";

interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  isError?: boolean;
  onChange?: (value: string) => void;
}

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      label,
      placeholder = "Digite seu número de telefone",
      value = "",
      onChange,
      isError = false,
      required = false,
      ...props
    },
    ref
  ) => {
    const [selectedCountry, setSelectedCountry] = useState("+244"); // Angola default

    const countries = [
      { code: "+244", name: "Angola", flag: "🇦🇴" },
    ];

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let phoneNumber = e.target.value.replace(/\D/g, ''); // Remove non-digits
      
      // Limit to 9 digits
      if (phoneNumber.length > 9) {
        phoneNumber = phoneNumber.slice(0, 9);
      }
      
      const fullNumber = `${selectedCountry} ${phoneNumber}`;
      onChange?.(fullNumber);
    };

    const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newCountryCode = e.target.value;
      setSelectedCountry(newCountryCode);
      
      // Update the full number with new country code
      const phoneOnly = typeof value === 'string' ? value.replace(/^\+\d+\s*/, '') : '';
      const fullNumber = `${newCountryCode} ${phoneOnly}`;
      onChange?.(fullNumber);
    };

    // Extract phone number without country code for display
    const phoneOnly = typeof value === 'string' ? value.replace(/^\+\d+\s*/, '') : '';

    const borderClass = isError ? "border-red-500" : "border-gray-300";
    const ringClass = isError ? "focus:ring-red-500" : "focus:ring-blue-500";

    return (
      <div className="flex w-full flex-col gap-2">
        {label && (
          <label className="text-gray-600 text-sm font-medium">{label}</label>
        )}

        <div className="flex">
          {/* Country Code Selector */}
          <select
            value={selectedCountry}
            onChange={handleCountryChange}
            className={`rounded-l-xl border ${borderClass} px-3 py-3 text-gray-800 focus:outline-none focus:ring-2 ${ringClass} bg-gray-50 min-w-[100px]`}
          >
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.flag} {country.code}
              </option>
            ))}
          </select>

          {/* Phone Number Input */}
          <input
            ref={ref}
            type="tel"
            placeholder={placeholder}
            value={phoneOnly}
            onChange={handlePhoneChange}
            required={required}
            className={`w-full rounded-r-xl border-l-0 border ${borderClass} px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 ${ringClass}`}
            {...props}
          />
        </div>
      </div>
    );
  }
);

PhoneInput.displayName = "PhoneInput";
export default PhoneInput;
