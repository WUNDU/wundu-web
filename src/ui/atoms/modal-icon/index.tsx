import { DoneAllIcon, ErrorIcon, InfoIcon } from "@/constants/icons";
import type { NotificationType } from "@/store/ui-store";
import React from "react";

interface ModalIconProps {
  type: NotificationType;
  variant?: "toast" | "default";
}

const iconSvgs: Record<NotificationType, React.ReactNode> = {
  success: <DoneAllIcon className="text-green-500 w-12 h-12" />,
  error: <ErrorIcon className="text-red-500 w-12 h-12" />,
  info: <InfoIcon className="text-yellow-500 w-12 h-12" />,
};

const bgColors: Record<NotificationType, string> = {
  success: "bg-green-100",
  error: "bg-red-100",
  info: "bg-yellow-100",
};

const ringColors: Record<NotificationType, string> = {
  success: "text-green-200",
  error: "text-red-200",
  info: "text-yellow-200",
};

export function ModalIcon({ type, variant = "default" }: ModalIconProps) {
  if (variant === "toast") {
    return (
      <div className="flex flex-col items-center justify-center mb-4">
        {/* Animated Icon */}
        <div className="relative">
          {/* Pulse ring effect */}
          <div
            className={`absolute inset-0 rounded-full ${ringColors[type]} animate-pulse-ring opacity-75`}
          />
          {/* Main icon container */}
          <div
            className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full ${bgColors[type]} flex items-center justify-center animate-icon-pop shadow-lg`}
          >
            {iconSvgs[type]}
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className="inline-flex items-center justify-center rounded-full border-4 shadow-lg">
      <div className={`p-5 rounded-full text-white ${bgColors[type]}`}>
        {iconSvgs[type]}
      </div>
    </div>
  );
}
