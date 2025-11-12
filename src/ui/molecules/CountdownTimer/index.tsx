"use client";

import React from "react";
import { useCountdown } from "@/hooks/useCountdown";

interface CountdownTimerProps {
  targetDate: Date;
  title?: string;
  subtitle?: string;
  onLaunch?: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  title = "Lançamento em breve",
  subtitle = "Estamos preparando algo incrível para você",
  onLaunch,
}) => {
  const { timeLeft, isLaunched, isLoading } = useCountdown(targetDate);

  React.useEffect(() => {
    if (isLaunched && onLaunch) {
      onLaunch();
    }
  }, [isLaunched, onLaunch]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center space-y-6 p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-48 mx-auto mb-8"></div>
          <div className="flex space-x-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg p-4 w-20 h-24"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isLaunched) {
    return (
      <div className="flex flex-col items-center space-y-6 p-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
            🎉 Estamos no ar!
          </h2>
          <p className="text-lg text-gray-600">
            Bem-vindo ao futuro da gestão financeira
          </p>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl shadow-lg">
          <div className="text-center">
            <div className="text-2xl font-bold mb-2">✨ Wundu está disponível!</div>
            <div className="text-sm opacity-90">Comece sua jornada financeira agora</div>
          </div>
        </div>
      </div>
    );
  }

  const timeUnits = [
    { label: "Dias", value: timeLeft.days, color: "from-yellow-400 to-orange-500" },
    { label: "Horas", value: timeLeft.hours, color: "from-orange-400 to-red-500" },
    { label: "Min", value: timeLeft.minutes, color: "from-yellow-500 to-orange-400" },
    { label: "Seg", value: timeLeft.seconds, color: "from-orange-500 to-yellow-500" },
  ];

  return (
    <div className="flex flex-col items-center space-y-8 p-8">
      {/* Título e Subtítulo */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
          {title}
        </h2>
        <p className="text-lg text-gray-600 max-w-md">
          {subtitle}
        </p>
      </div>

      {/* Contagem Regressiva */}
      <div className="flex flex-wrap justify-center gap-4 md:gap-6">
        {timeUnits.map((unit, index) => (
          <div
            key={unit.label}
            className="flex flex-col items-center"
            style={{
              animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
            }}
          >
            <div className={`bg-gradient-to-br ${unit.color} text-white rounded-2xl shadow-lg p-4 md:p-6 min-w-[80px] md:min-w-[100px] transform hover:scale-105 transition-transform duration-200`}>
              <div className="text-center">
                <div className="text-2xl md:text-4xl font-bold leading-none">
                  {unit.value.toString().padStart(2, '0')}
                </div>
              </div>
            </div>
            <div className="text-sm md:text-base font-medium text-gray-600 mt-2">
              {unit.label}
            </div>
          </div>
        ))}
      </div>

      {/* Data de Lançamento */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <div className="text-center">
          <div className="text-sm text-gray-500 mb-1">Lançamento oficial</div>
          <div className="text-lg font-semibold text-gray-800">
            19 de Novembro de 2025
          </div>
        </div>
      </div>

      {/* Animação de pulso para criar expectativa */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-20 animate-ping"></div>
        <div className="relative bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-medium">
          Em breve disponível
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default CountdownTimer;
