import { TabProps } from "@/src/types/panel";
import React from "react";

export const Tab: React.FC<TabProps> = ({
  label,
  isActive,
  onClick,
  value,
}) => {
  return (
    <button
      onClick={() => onClick(value)}
      className={`
        px-4 py-2 text-sm font-medium rounded-full transition-colors
        ${isActive ? "bg-zinc-800 text-white shadow-md" : "text-zinc-600"}
      `}
    >
      {label}
    </button>
  );
};
