import { OptionChatButtonProps } from "@/src/types/button";
import React from "react";

const OptionChatButton: React.FC<OptionChatButtonProps> = ({ label }) => {
  const getColorClass = () => {
    const colors = {
      Investimentos: "bg-red-100 text-red-600",
      Finanças: "bg-orange-100 text-orange-600",
      Poupanças: "bg-purple-100 text-purple-600",
      Gestão: "bg-green-100 text-green-600",
      Dinheiro: "bg-teal-100 text-teal-600",
    };
    return colors[label as keyof typeof colors] || "bg-gray-100 text-gray-600";
  };

  return (
    <button className={`flex items-center p-2 rounded-lg ${getColorClass()}`}>
      <span className="mr-2">💰</span>
      <span>{label}</span>
    </button>
  );
};

export default OptionChatButton;
