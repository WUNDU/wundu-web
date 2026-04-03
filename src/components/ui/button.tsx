"use client";
import { forwardRef, ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { CloseIcon, PlusIcon } from "@/constants/icons";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "rounded-xl bg-slate-900 text-white border border-slate-900 hover:bg-white hover:text-slate-900 hover:shadow-lg",
        secondary:
          "rounded-xl bg-white border border-slate-200 text-slate-900 hover:bg-slate-50",
        google:
          "rounded-xl bg-white border border-gray-200 text-gray-800 hover:bg-gradient-to-r hover:from-red-50 hover:to-blue-50 hover:border-blue-300 hover:shadow-lg",
        destructive: "rounded-xl bg-red-500 text-white hover:bg-red-600",
        success: "rounded-xl bg-emerald-500 text-white hover:bg-emerald-600",
        warning:
          "rounded-xl bg-yellow-400 text-white hover:bg-white hover:text-yellow-500 hover:border hover:border-yellow-400 hover:shadow-lg",
        fab:
          "rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 shadow-xl hover:scale-105 active:scale-95 focus-visible:ring-yellow-300 p-0",
        fabCircle:
          "rounded-full w-16 h-16 p-0 flex items-center justify-center bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 shadow-xl border border-white/60 hover:scale-105 active:scale-95 focus-visible:ring-yellow-300",
        chip: "px-3 py-1.5 text-sm",
        tab: "px-4 py-2 text-sm border",
        option:
          "w-full flex flex-1 justify-start px-15 p-4 bg-gray-100 hover:bg-gray-200 hover:shadow-md hover:scale-105 shadow-sm",
        landing:
          "py-2 md:px-12 md:py-5 font-bold rounded-full inline-flex items-center space-x-3 md:text-lg transition-all duration-500 hover:scale-105 hover:shadow-2xl bg-gradient-to-r from-yellow-400 to-orange-300 text-blue-900 border-0",
        close: "size-8 p-0 bg-gray-100 text-gray-800 hover:bg-gray-200",
        icon: "size-10 p-2",
        more: "px-4 py-2 text-sm shadow-sm",
      },
      size: {
        none: "p-0 h-auto",
        sm: "px-3 py-1.5 text-sm h-9",
        md: "px-6 py-2 text-base h-11",
        lg: "px-8 py-3 text-lg h-14",
        xl: "px-12 py-4 text-xl h-16",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  label?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
  colorScheme?: "gray" | "red" | "orange" | "purple" | "green" | "teal";
  active?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      label,
      leftIcon,
      rightIcon,
      loading,
      colorScheme,
      active,
      variant = "primary",
      size,
      fullWidth,
      className,
      children = label,
      disabled,
      ...props
    },
    ref
  ) => {
    const chipColor =
      colorScheme && variant === "chip"
        ? {
            red: "bg-red-100 text-red-600",
            orange: "bg-orange-100 text-orange-600",
            gray: "bg-gray-100 text-gray-600",
            purple: "bg-purple-100 text-purple-600",
            green: "bg-green-100 text-green-600",
            teal: "bg-teal-100 text-teal-600",
          }[colorScheme]
        : "";

    const tabActive =
      active && variant === "tab" ? "bg-black text-white border-black" : "";

    const shouldForceNoneSize = variant === "fab" || variant === "fabCircle";
    const resolvedSize = size ?? (shouldForceNoneSize ? "none" : undefined);
    const shouldRenderFabIcon =
      (variant === "fab" || variant === "fabCircle") && !children;

    return (
      <button
        ref={ref}
        className={buttonVariants({
          variant,
          size: resolvedSize,
          fullWidth,
          className: [className, chipColor, tabActive].join(" "),
        })}
        disabled={disabled || loading}
        {...props}
      >
        {leftIcon && <span className="mr-2">{leftIcon}</span>}
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
        {rightIcon && !loading && <span className="ml-2">{rightIcon}</span>}
        {variant === "close" && !children && <CloseIcon className="h-4 w-4" />}
        {shouldRenderFabIcon && (
          <PlusIcon
            className={`text-white ${variant === "fabCircle" ? "w-8 h-8" : "w-10 h-10"}`}
          />
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
