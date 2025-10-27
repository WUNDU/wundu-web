"use client";

import type { LandingButtonProps } from "@/src/types/button";
import React from "react";

const LandingButton: React.FC<LandingButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  className = "",
  type = "button",
}) => {
  const baseStyles = "px-6 py-2 font-semibold rounded-full transition";
  const variants = {
    primary: "btn-primary text-blue-900",
    secondary: "text-gray-700 border border-gray-300 hover:bg-gray-50",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default LandingButton;
