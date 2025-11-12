"use client";
import React from "react";
import Image from "next/image";
import { logo, user as avatar } from "@/src/constants/images";
import {
  DownArrowIcon,
  IAIcon,
  NotificationDeskIcon,
  NotificationIcon,
} from "@/src/constants/icons";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/src/constants/routes";
import useRegisterContext from "@/src/hooks/useRegisterContext";
import LoadingSpinner from "../atoms/LoadingSpinner";
import type { GreetingHeaderProps } from "@/src/types/header";

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
    <header className="bg-white px-4 py-3 flex items-center justify-between md:justify-end shadow-sm">
      <div className="flex justify-start items-center md:justify-end">
        <div className="flex items-center space-x-2">
          <div className="hidden md:flex pr-10">
            <NotificationDeskIcon />
          </div>

          <div
            className="md:p-[2px] md:rounded-full
            md:bg-gradient-to-r md:from-yellow-400 md:to-yellow-600"
          >
            <div className="bg-white md:p-4 rounded-full ">
              <Image
                src={avatar}
                alt={user?.name || "Usuário"}
                className="md:hidden w-6 h-6 rounded-full"
                onClick={handleProfile}
              />
              <Image
                src={avatar}
                alt={user?.name || "Usuário"}
                className="hidden md:block w-6 h-6 rounded-full"
              />
            </div>
          </div>
          <button
            className="hidden md:flex w-4 h-4 text-gray-600"
            onClick={onToggleSidebar}
            aria-label="Toggle right sidebar"
          >
            <DownArrowIcon />
          </button>
        </div>
        <div className="md:hidden ml-3">
          <h1 className="text-lg font-semibold text-gray-900">
            Olá, {user?.name || "Usuário"}
          </h1>
          <p className="text-sm text-gray-500">Bem-vindo ao wundu</p>
        </div>
      </div>
      <div className="md:hidden flex items-center space-x-3">
        {/* <button onClick={handleChatIa} className='border-2 rounded-full border-purple-200 bg-white'> */}
        {/* Ícone IA */}
        {/* <IAIcon />
        </button> */}
        <div className="border-2 rounded-full border-gray-300 bg-gray-300">
          {/* Ícone de notificação */}
          <NotificationIcon />
        </div>
      </div>
    </header>
  );
};

export default GreetingHeader;
