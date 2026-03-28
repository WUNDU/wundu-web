"use client";

import React from "react";
import { ViewMode } from "@/shared/types/panel";

interface HeaderSectionProps {
  isCredit: boolean;
  headerText: string;
  headerAmount: number;
  viewMode: ViewMode;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({
  isCredit,
  headerText,
  headerAmount,
  viewMode,
}) => {
  return (
    <div
      className={`mx-4 p-6 bg-blue-950 text-white rounded-3xl shadow-lg ${
        viewMode === "pie" ? "hidden md:block" : ""
      }`}
    >
      <div className="flex justify-center items-center mb-4">
        <div className="flex bg-gray-500/45 px-4 py-2 rounded-2xl">
          <span className="font-semibold text-lg">
            {isCredit ? "IMG" : "Todos"}
          </span>
        </div>
      </div>
      <p className="text-sm text-center">{headerText}</p>
      <h1 className="text-3xl font-bold text-center">
        {headerAmount.toLocaleString("pt-AO")},00KZ
      </h1>
    </div>
  );
};

export default HeaderSection;
