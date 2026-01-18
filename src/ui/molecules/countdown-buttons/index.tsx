"use client";

import React from "react";
import { Button } from "@/ui/atoms";

interface CountdownButtonsProps {
  isLaunched: boolean;
}

const CountdownButtons: React.FC<CountdownButtonsProps> = ({ isLaunched }) => {
  if (isLaunched) {
    return (
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-6">
        <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-full font-semibold shadow-lg">
          <span className="mr-2">✅</span>
          Sistema disponível!
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-6">
      {/* Botão desabilitado para Login */}
      <div className="relative group">
        <Button
          disabled
          className="bg-gray-300 text-gray-500 cursor-not-allowed opacity-60 px-6 py-3 rounded-lg font-medium"
        >
          🔒 Fazer Login
        </Button>
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          Disponível em 19/11/2025
        </div>
      </div>

      {/* Botão desabilitado para Registro */}
      <div className="relative group">
        <Button
          disabled
          className="bg-gray-300 text-gray-500 cursor-not-allowed opacity-60 px-6 py-3 rounded-lg font-medium"
        >
          🔒 Criar Conta
        </Button>
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          Disponível em 19/11/2025
        </div>
      </div>

      {/* Botão de Notificação */}
      <Button
        variant="secondary"
        className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
      >
        <span>🔔</span>
        Me avise quando lançar
      </Button>
    </div>
  );
};

export default CountdownButtons;
