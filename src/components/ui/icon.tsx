import { IconProps } from "@/types/ui";
import React from "react";

export const Icon: React.FC<IconProps> = ({ initials, bgColor }) => {
  return (
    <div
      className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${bgColor}`}
    >
      {initials}
    </div>
  );
};
