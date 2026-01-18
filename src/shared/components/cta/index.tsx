"use client";

import React from "react";
import { Button } from "@/shared/components";

export type CTAVariant = "landing" | "login" | "default";

interface CTAProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  buttonText?: string;
  onButtonClick?: () => void;
  showButton?: boolean;
  variant?: CTAVariant;
  className?: string;
}

const CTA: React.FC<CTAProps> = ({
  title,
  subtitle,
  buttonText = "Continuar",
  onButtonClick,
  showButton = false,
  variant = "default",
  className,
}) => {
  const containerClasses = [
    "flex flex-col items-center text-center",
    variant === "landing" ? "gap-6" : "gap-4",
    className || "",
  ]
    .filter(Boolean)
    .join(" ");

  const titleClasses = [
    "font-bold text-gray-900",
    variant === "landing" ? "text-3xl md:text-4xl" : "text-xl md:text-2xl",
  ].join(" ");

  const subtitleClasses = [
    "text-gray-600",
    variant === "landing" ? "text-base md:text-lg" : "text-sm md:text-base",
  ].join(" ");

  const buttonVariant = variant === "landing" ? "landing" : "primary";

  return (
    <div className={containerClasses}>
      <h2 className={titleClasses}>{title}</h2>
      {subtitle && <p className={subtitleClasses}>{subtitle}</p>}
      {showButton && (
        <div className="mt-2">
          <Button variant={buttonVariant as any} onClick={onButtonClick}>
            {buttonText}
          </Button>
        </div>
      )}
    </div>
  );
};

export default CTA;
