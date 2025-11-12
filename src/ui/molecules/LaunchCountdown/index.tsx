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
      <div className="text-center py-8 animate-fade-in">
        <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl font-bold shadow-soft-lg hover:shadow-glow-primary transition-all duration-500 animate-bounce-soft">
          <span className="mr-3 text-2xl animate-bounce-soft">🎉</span>
          <span className="text-lg">Wundu está disponível agora!</span>
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
    <div className="text-center py-8 animate-fade-in">
      <h3 className="text-3xl font-bold text-gray-800 mb-8 animate-slide-up">
        Lançamento em
      </h3>
      
      <div className="flex justify-center items-center space-x-3 sm:space-x-6 mb-8 px-4">
        {timeUnits.map((unit, index) => (
          <div 
            key={unit.label} 
            className="text-center group animate-scale-in"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <div 
              className="relative text-white rounded-2xl p-3 sm:p-6 min-w-[60px] sm:min-w-[80px] shadow-soft-lg hover:shadow-glow-primary transition-all duration-500 hover:scale-110 group-hover:-translate-y-2 overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #00216b 0%, #003cc3 50%, #ffd400 100%)'
              }}
            >
              <div className="text-2xl sm:text-3xl font-bold relative z-10">
                {unit.value.toString().padStart(2, '0')}
              </div>
              {/* Floating elements inside cards */}
              <div className="absolute top-1 right-1 w-3 h-3 rounded-full blur-sm opacity-30" style={{ backgroundColor: 'rgba(255, 212, 0, 0.6)' }}></div>
              <div className="absolute bottom-1 left-1 w-2 h-2 rounded-full blur-sm opacity-20" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}></div>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </div>
            <div className="text-sm font-semibold text-gray-700 mt-3 transition-colors duration-300 group-hover:text-blue-600">
              {unit.label}
            </div>
          </div>
        ))}
      </div>

      <div className="text-gray-600 animate-fade-in" style={{ animationDelay: '600ms' }}>
        <div className="text-base mb-2 font-medium">Lançamento oficial</div>
        <div className="text-lg font-bold text-blue-600">19 de Novembro de 2025</div>
      </div>
    </div>
  );
};

export default LaunchCountdown;
