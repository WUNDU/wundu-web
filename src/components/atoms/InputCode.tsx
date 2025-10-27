import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  isError?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, isError = false, ...props }, ref) => {
    return (
      <div className="relative">
        <label
          htmlFor={id}
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          {label}
        </label>
        <div className="mt-2">
          <input
            ref={ref}
            id={id}
            className={`block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ${
              isError
                ? "ring-red-500 focus:ring-red-500"
                : "ring-gray-300 focus:ring-gray-600"
            } placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
            {...props}
          />
        </div>
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
