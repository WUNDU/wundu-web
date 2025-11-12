import { DoneAllIcon, ErrorIcon, InfoIcon } from "@/constants/icons";
import type { NotificationType } from "@/store/uiStore";
import React from "react";

interface ModalIconProps {
  type: NotificationType;
  variant?: "toast" | "default";
}

const iconSvgs: Record<NotificationType, React.ReactNode> = {
  success: <DoneAllIcon className="text-green-500 w-8 h-8" />,
  error: <ErrorIcon className="text-red-500 w-8 h-8" />,
  info: <InfoIcon className="text-yellow-500 w-8 h-8" />,
};

const bgColors: Record<NotificationType, string> = {
  success: "bg-green-50",
  error: "bg-red-50",
  info: "bg-yellow-50",
};

export function ModalIcon({ type, variant = "default" }: ModalIconProps) {
  const containerClass =
    variant === "toast"
      ? "flex-shrink-0 rounded-xl bg-white/20 flex items-center justify-center"
      : "inline-flex items-center justify-center rounded-full border-4 shadow-lg";

  return (
    <div className={containerClass}>
      <div className={`p-5 rounded-full text-white ${bgColors[type]}`}>
        {iconSvgs[type]}
      </div>
    </div>
  );
}
