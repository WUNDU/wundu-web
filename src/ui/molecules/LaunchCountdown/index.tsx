"use client";

import React from "react";
import { useCountdown } from "@/hooks/useCountdown";

interface LaunchCountdownProps {
  targetDate: Date;
}

const LaunchCountdown: React.FC<LaunchCountdownProps> = ({ targetDate }) => {
  const { timeLeft, isLaunched, isLoading } = useCountdown(targetDate);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-pulse flex space-x-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-16 w-16"></div>
          ))}
        </div>
      </div>
    );
  }

  if (isLaunched) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-400 to-blue-500 text-white rounded-full font-semibold shadow-lg">
          <span className="mr-2">🎉</span>
          Wundu está disponível agora!
        </div>
      </div>
    );
  }

  const timeUnits = [
    { label: "Dias", value: timeLeft.days },
    { label: "Horas", value: timeLeft.hours },
    { label: "Min", value: timeLeft.minutes },
    { label: "Seg", value: timeLeft.seconds },
  ];

  return (
    <div className="text-center py-8">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">
        Lançamento em
      </h3>
      
      <div className="flex justify-center items-center space-x-4 mb-6">
        {timeUnits.map((unit, index) => (
          <div key={unit.label} className="text-center">
            <div className="bg-gradient-to-br from-yellow-400 to-blue-500 text-white rounded-lg p-4 min-w-[70px] shadow-lg">
              <div className="text-2xl font-bold">
                {unit.value.toString().padStart(2, '0')}
              </div>
            </div>
            <div className="text-sm font-medium text-gray-600 mt-2">
              {unit.label}
            </div>
          </div>
        ))}
      </div>

      <div className="text-gray-600">
        <div className="text-sm mb-1">Lançamento oficial</div>
        <div className="font-semibold">19 de Novembro de 2025</div>
      </div>
    </div>
  );
};

export default LaunchCountdown;
