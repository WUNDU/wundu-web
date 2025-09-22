'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { user } from '@/src/constants/images';
import {
  HomeIcon,
  ScanIcon,
  LibraryIcon,
  ProfileIcon,
  HelpIcon,
  NotificationRightBarIcon,
  PaymentIcon,
  SettingsRightBarIcon,
  LogoutIcon
} from '@/src/constants/icons';
import BottomNavigation from '../organisms/BottomNavigation';

const ProfileScreen: React.FC = () => {
  const [userName, setUserName] = useState('Israel Manuel');

  const menuItems = [
    { icon: <ProfileIcon />, text: 'Meus dados' },
    { icon: <HelpIcon />, text: 'Suporte e Feedback' },
    { icon: <NotificationRightBarIcon />, text: 'Notificações' },
    { icon: <PaymentIcon />, text: 'Meus plano' },
    { icon: <SettingsRightBarIcon />, text: 'Configurações' },
    { icon: <LogoutIcon className="text-red-500" />, text: 'Sair' },
  ];

  return (
    <div className="flex flex-col justify-center h-full my-5 bg-gray-50">

      {/* Conteúdo principal */}
      <div className="flex-1 justify-center flex flex-col overflow-auto pb-20">
        {/* Header do perfil */}
        <div className="bg-white rounded-2xl mx-5 p-4 border border-gray-200">
          <div className="flex flex-col items-center justify-between">
            <div className="flex flex-col justify-center mt-4 space-y-6 items-center space-x-3">
              <div className="relative">
                {/* Container externo com borda amarela */}
                <div className="p-1 rounded-full border-2 border-yellow-400 bg-white">
                  {/* Container interno com gradiente */}

                  {/* Container da imagem */}
                  <div className="bg-white p-2 rounded-full relative">
                    <Image
                      src={user}
                      alt="Israel Manuel"
                      className="w-12 h-12 rounded-full object-cover"
                    />

                  </div>

                  {/* Ícone de lápis posicionado no canto superior direito */}
                  <div className="absolute -bottom-1 right-1 p-1 bg-white rounded-full shadow-md  border border-yellow-400">
                    <svg
                      className="w-4 h-4 text-yellow-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{userName}</h1>
              </div>
            </div>
          </div>
        </div>

        {/* Painel de controle */}
        <div className="p-4">
          <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-2xl p-4 text-white mb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Painel de controle</h2>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* Lista de menu */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {menuItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border-b border-gray-50 last:border-b-0 hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2  rounded-xl">
                    {item.icon}
                  </div>
                  <span className={`text-sm font-medium ${item.text == "Sair" ? "text-red-500" : "text-gray-700"} `}>{item.text}</span>
                </div>
                {item.text == "Sair" ? "" : (
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                )}

              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default ProfileScreen;