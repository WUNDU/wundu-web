"use client";

import React from "react";
import { cn } from "@/shared/lib/utils";

interface ModernButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "gradient";
  size?: "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  glow?: boolean;
  shimmer?: boolean;
}

const ModernButton: React.FC<ModernButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  loading = false,
  icon,
  iconPosition = "right",
  glow = false,
  shimmer = false,
  className,
  disabled,
  ...props
}) => {
  const baseClasses = [
    "relative inline-flex items-center justify-center",
    "font-semibold rounded-xl transition-all duration-300 ease-out",
    "transform-gpu will-change-transform",
    "focus:outline-none focus:ring-2 focus:ring-offset-2",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
    "overflow-hidden group",
  ];

  const variants = {
    primary: [
      "bg-gradient-to-r from-primary to-primary-dark",
      "text-white shadow-soft hover:shadow-soft-lg",
      "hover:scale-105 hover:shadow-glow-primary",
      "focus:ring-primary/50",
      "active:scale-95",
    ],
    secondary: [
      "bg-gradient-to-r from-secondary to-secondary-dark",
      "text-white shadow-soft hover:shadow-soft-lg",
      "hover:scale-105 hover:shadow-glow-secondary",
      "focus:ring-secondary/50",
      "active:scale-95",
    ],
    outline: [
      "border-2 border-primary bg-transparent",
      "text-primary hover:bg-primary hover:text-white",
      "shadow-soft hover:shadow-soft-lg",
      "hover:scale-105",
      "focus:ring-primary/50",
      "active:scale-95",
    ],
    ghost: [
      "bg-transparent text-gray-700",
      "hover:bg-gray-100 hover:text-gray-900",
      "hover:scale-105",
      "focus:ring-gray-300",
      "active:scale-95",
    ],
    gradient: [
      "bg-gradient-to-r from-primary via-primary-dark to-secondary",
      "text-white shadow-soft-lg",
      "hover:scale-105 hover:shadow-glow-primary",
      "focus:ring-primary/50",
      "active:scale-95",
      "bg-size-200 hover:bg-pos-0",
    ],
  };

  const sizes = {
    sm: "px-4 py-2 text-sm gap-2",
    md: "px-6 py-3 text-base gap-2",
    lg: "px-8 py-4 text-lg gap-3",
    xl: "px-10 py-5 text-xl gap-3",
  };

  const glowClasses = glow
    ? [
        variant === "primary"
          ? "hover:shadow-glow-primary"
          : "hover:shadow-glow-secondary",
      ]
    : [];

  return (
    <button
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        glowClasses,
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {/* Shimmer Effect */}
      {shimmer && (
        <div className="absolute inset-0 -top-px overflow-hidden rounded-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer transform -skew-x-12" />
        </div>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Content */}
      <div
        className={cn(
          "flex items-center gap-2 transition-opacity duration-200",
          loading && "opacity-0",
        )}
      >
        {icon && iconPosition === "left" && (
          <span className="transition-transform duration-200 group-hover:scale-110">
            {icon}
          </span>
        )}

        <span className="relative z-10">{children}</span>

        {icon && iconPosition === "right" && (
          <span className="transition-transform duration-200 group-hover:translate-x-1 group-hover:scale-110">
            {icon}
          </span>
        )}
      </div>

      {/* Ripple Effect */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-active:opacity-100 transition-opacity duration-200">
        <div className="absolute inset-0 bg-white/20 rounded-xl animate-ping" />
      </div>
    </button>
  );
};

export default ModernButton;
