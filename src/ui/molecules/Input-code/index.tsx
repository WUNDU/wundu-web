"use client";

import { useRef, useEffect } from "react";
import { CodeInputProps } from "@/types/input";
import TextInput from "@/ui/atoms/text-input";

const CodeInput: React.FC<CodeInputProps> = ({
  length,
  value,
  onChange,
  isError = false,
  isSuccess = false,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const val = e.target.value;
    if (/[^0-9]/.test(val)) return;

    const newValue = value.slice(0, index) + val + value.slice(index + 1);
    onChange(newValue);

    if (val && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const borderColorClass = isError
    ? "border-red-500"
    : isSuccess
      ? "border-green-500"
      : "border-gray-300";
  const shadowClass = "shadow-sm";

  return (
    <div className="flex flex-row gap-2.5 justify-center">
      {[...Array(length)].map((_, index) => (
        <TextInput
          label=""
          key={index}
          id={`code-input-${index}`}
          type="tel"
          className={`text-center rounded-lg w-12 h-12 text-3xl ${shadowClass} border ${borderColorClass}`}
          value={value[index] || ""}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          maxLength={1}
          inputMode="numeric"
        />
      ))}
    </div>
  );
};

export default CodeInput;
