"use client";
import React from "react";
import Image from "next/image";
import { user as avatar } from "@/constants/images";
import {
  DownArrowIcon,
  HelpIcon,
  LogoutIcon,
  NotificationDeskIcon,
  NotificationRightBarIcon,
} from "@/constants/icons";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { SidebarRightProps } from "@/types/sidebar";
import useRegisterContext from "@/contexts/useRegisterContext";

const SidebarRight: React.FC<SidebarRightProps> = ({ isOpen, onClose }) => {
  const route = useRouter();
  const { logoutUser, user } = useRegisterContext();

  const handleControlPanel = () => {
    route.push(ROUTES.CONTROL_PANEL);
  };

  const handleLogout = async () => {
    await logoutUser();
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-full sm:max-w-md bg-black/20 backdrop-blur-xl z-50 transition-all duration-500 ease-out ${
        isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
      onClick={onClose}
    >
      {/* Conteúdo com rolagem */}
      <div
        className="flex flex-col h-full max-h-screen overflow-y-auto bg-white/95 backdrop-blur-xl shadow-2xl border-l border-gray-200/50 transition-all duration-500 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header com notificação e botão de fechar */}
        <div className="flex flex-row justify-between items-center px-4 sm:px-6 py-4 animate-slide-up">
          <NotificationDeskIcon className="w-8 h-8 text-black transition-all duration-300 ease-out hover:scale-110" />
          <button onClick={onClose} className="p-2 transition-all duration-300 ease-out hover:scale-110 hover:bg-gray-100 rounded-full">
            <DownArrowIcon className="w-6 h-6 text-black rotate-90" />
          </button>
        </div>
        {/* Conteúdo principal */}
        <div className="flex flex-col items-center space-y-6 px-4 sm:px-6 py-4 flex-1 animate-fade-in" style={{animationDelay: '0.2s'}}>
          {/* Avatar do usuário */}
          <div className="p-1 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 transition-all duration-500 ease-out hover:scale-110 hover:rotate-3 shadow-lg animate-scale-in">
            <div className="bg-white p-3 rounded-full">
              <Image
                src={avatar}
                alt={user?.name || "Usuário"}
                className="w-12 h-12 rounded-full object-cover transition-all duration-300 ease-out hover:scale-105"
              />
            </div>
          </div>
          {/* Nome do usuário */}
          <span className="text-xl sm:text-2xl font-semibold text-black transition-all duration-300 ease-out animate-slide-up" style={{animationDelay: '0.3s'}}>
            {user?.name || "Usuário"}
          </span>
          {/* Painel de controle */}
          <div className="w-full max-w-md animate-slide-up" style={{animationDelay: '0.4s'}}>
            <div className="bg-white/30 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden transition-all duration-300 ease-out hover:shadow-2xl hover:-translate-y-1">
              <ul className="divide-y divide-gray-100">
                {[
                  {
                    icon: <HelpIcon className="w-6 h-6 text-gray-600" />,
                    text: "Suporte e Feedback",
                  },
                  {
                    icon: (
                      <NotificationRightBarIcon className="w-6 h-6 text-gray-600" />
                    ),
                    text: "Notificações",
                  },
                ].map((item, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center p-4 hover:bg-white/50 transition-all duration-300 ease-out hover:scale-[1.02] cursor-pointer"
                  >
                    <div className="flex items-center space-x-4">
                      {item.icon}
                      <span className="font-medium text-gray-800 text-sm sm:text-base">
                        {item.text}
                      </span>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </li>
                ))}
              </ul>
              {/* Botão de logout */}
              <button onClick={handleLogout} className="w-full">
                <div className="p-4 border-t border-gray-100">
                  <div className="flex items-center space-x-4 text-red-500 hover:bg-red-50 p-3 rounded-xl transition-all duration-300 ease-out cursor-pointer hover:scale-[1.02] hover:shadow-md">
                    <LogoutIcon className="w-6 h-6 transition-all duration-300 ease-out hover:scale-110" />
                    <span className="font-medium text-sm sm:text-base">
                      Terminar Sessão
                    </span>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarRight;
