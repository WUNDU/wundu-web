"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/shared/components";
import { ROUTES } from "@/constants/routes";

interface LaunchButtonsProps {
  isLaunched: boolean;
  isLoading?: boolean;
}

const LaunchButtons: React.FC<LaunchButtonsProps> = ({
  isLaunched,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <div className="animate-pulse bg-gray-200 rounded-lg h-12 w-32"></div>
        <div className="animate-pulse bg-gray-200 rounded-lg h-12 w-32"></div>
      </div>
    );
  }

  if (!isLaunched) {
    return (
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        {/* Botão desabilitado para Login */}
        <div className="relative group">
          <Button
            disabled
            className="bg-gray-300 text-gray-500 cursor-not-allowed opacity-60 px-8 py-3 rounded-lg font-medium transition-all duration-200"
          >
            Fazer Login
          </Button>
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            Disponível em breve
          </div>
        </div>

        {/* Botão desabilitado para Registro */}
        <div className="relative group">
          <Button
            disabled
            className="bg-gray-300 text-gray-500 cursor-not-allowed opacity-60 px-8 py-3 rounded-lg font-medium transition-all duration-200"
          >
            Criar Conta
          </Button>
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            Disponível em breve
          </div>
        </div>

        {/* Botão de Notificação */}
        <Button
          variant="secondary"
          className="border-2 border-orange-500 text-orange-600 hover:bg-orange-50 px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
        >
          <span>🔔</span>
          Me avise quando lançar
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
      {/* Botão ativo para Login */}
      <Link href={ROUTES.LOGIN}>
        <Button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg">
          Fazer Login
        </Button>
      </Link>

      {/* Botão ativo para Registro */}
      <Link href={ROUTES.REGISTER}>
        <Button
          variant="secondary"
          className="border-2 border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
        >
          Criar Conta Grátis
        </Button>
      </Link>

      {/* Badge de "Novo" */}
      <div className="relative">
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-bounce">
          NOVO!
        </div>
      </div>
    </div>
  );
};

export default LaunchButtons;
