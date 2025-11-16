"use client";
import React from "react";
import Image from "next/image";
import { logo, user as avatar } from "@/constants/images";
import {
  DownArrowIcon,
  IAIcon,
  NotificationDeskIcon,
  NotificationIcon,
} from "@/constants/icons";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import useRegisterContext from "@/contexts/useRegisterContext";
import { LoadingSpinner } from "@/ui/atoms";
import type { GreetingHeaderProps } from "@/types/header";

const GreetingHeader: React.FC<GreetingHeaderProps> = ({ onToggleSidebar }) => {
  const route = useRouter();
  const { user, isAuthenticated } = useRegisterContext();

  const handleChatIa = () => {
    route.push(ROUTES.CHAT_IA);
  };

  const handleProfile = () => {
    route.push(ROUTES.PROFILE);
  };

  if (!user && isAuthenticated) {
    return <LoadingSpinner />;
  }
  return (
    <header className="bg-white/80 px-4 py-3 flex items-center justify-between md:justify-end border-b border-slate-200/60 transition-all duration-300 ease-out animate-fade-in">
      <div className="flex justify-start items-center md:justify-end transition-all duration-300 ease-out">
        <div className="flex items-center space-x-2">
          <div className="hidden md:flex pr-10 transition-all duration-300 ease-out hover:scale-110">
            <NotificationDeskIcon />
          </div>

          <div
            className="md:p-[2px] md:rounded-full transition-all duration-500 ease-out hover:scale-110 hover:rotate-3
            md:bg-gradient-to-r md:from-yellow-400 md:to-yellow-600"
          >
            <div className="bg-white md:p-3 rounded-full transition-all duration-300 ease-out">
              <Image
                src={avatar}
                alt={user?.name || "Usuário"}
                className="md:hidden w-6 h-6 rounded-full transition-all duration-300 ease-out hover:scale-110 cursor-pointer"
                onClick={handleProfile}
              />
              <Image
                src={avatar}
                alt={user?.name || "Usuário"}
                className="hidden md:block w-6 h-6 rounded-full transition-all duration-300 ease-out hover:scale-110 cursor-pointer"
                onClick={handleProfile}
              />
            </div>
          </div>
          <button
            className="hidden md:flex w-4 h-4 text-gray-600 transition-all duration-300 ease-out hover:scale-125 hover:text-blue-600"
            onClick={onToggleSidebar}
            aria-label="Toggle right sidebar"
          >
            <DownArrowIcon />
          </button>
        </div>
        <div className="md:hidden ml-3 animate-slide-up">
          <h1 className="text-lg font-semibold text-gray-900 transition-all duration-300 ease-out">
            Olá, {user?.name || "Usuário"}
          </h1>
          <p className="text-sm text-gray-500 transition-all duration-300 ease-out">Bem-vindo ao wundu</p>
        </div>
      </div>
      <div className="md:hidden flex items-center space-x-3 animate-slide-up" style={{animationDelay: '0.2s'}}>
        {/* <button onClick={handleChatIa} className='border-2 rounded-full border-purple-200 bg-white'> */}
        {/* Ícone IA */}
        {/* <IAIcon />
        </button> */}
        <div className="border border-slate-300 bg-white/80 rounded-full px-2 py-2 transition-all duration-300 ease-out hover:scale-110 hover:border-blue-400 hover:bg-blue-50 cursor-pointer">
          {/* Ícone de notificação */}
          <NotificationIcon />
        </div>
      </div>
    </header>
  );
};

export default GreetingHeader;
