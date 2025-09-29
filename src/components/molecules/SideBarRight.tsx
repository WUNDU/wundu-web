'use client';

import React from 'react';
import Image from 'next/image';
import { backgroundPanel, user as avatar } from '@/src/constants/images';
import { DownArrowIcon, HelpIcon, LogoutIcon, NotificationDeskIcon, NotificationRightBarIcon, PaymentIcon, ProfileIcon, SettingsRightBarIcon } from '@/src/constants/icons';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/src/constants/routes';
import { SidebarRightProps } from '@/src/types/sidebar';
import useRegisterContext from '@/src/hooks/useRegisterContext';


const SidebarRight: React.FC<SidebarRightProps> = ({ isOpen, onClose }) => {
  const route = useRouter();
  const { logoutUser, user } = useRegisterContext()

  const handleControlPanel = () => {
    route.push(ROUTES.CONTROL_PANEL)
  }

  const handleLogout = async () => {
    await logoutUser()
  }
  return (
    <div
      className={`fixed top-0 right-0 h-full w-full sm:max-w-md bg-black/5 backdrop-blur-sm z-50 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      onClick={onClose}
    >
      {/* Conteúdo com rolagem */}
      <div
        className="flex flex-col h-full max-h-screen overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header com notificação e botão de fechar */}
        <div className="flex flex-row justify-between items-center px-4 sm:px-6 py-4">
          <NotificationDeskIcon className="w-8 h-8 text-black" />
          <button onClick={onClose} className="p-2">
            <DownArrowIcon className="w-6 h-6 text-black rotate-90" />
          </button>
        </div>

        {/* Conteúdo principal */}
        <div className="flex flex-col items-center space-y-6 px-4 sm:px-6 py-4 flex-1">
          {/* Avatar do usuário */}
          <div className="p-1 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600">
            <div className="bg-white p-3 rounded-full">
              <Image
                src={avatar}
                alt={user?.name || 'Usuário'}
                className="w-12 h-12 rounded-full object-cover"
              />
            </div>
          </div>

          {/* Nome do usuário */}
          <span className="text-xl sm:text-2xl font-semibold text-black">{user?.name || 'Usuário'}</span>

          {/* Painel de controle */}
          <div className="w-full max-w-md">
            <div
              className="rounded-xl p-4 shadow-md text-white font-medium flex items-center justify-between mb-4"
              style={{
                backgroundImage: `url(${backgroundPanel.src})`,
                backgroundSize: 'cover',  // Ajusta para cobrir toda a div (pode mudar para 'contain' se preferir)
                backgroundPosition: 'center',  // Centraliza a imagem
                backgroundRepeat: 'no-repeat'  // Evita repetição
              }}
            >
              {/* Removi a <Image> pequena, pois agora a imagem é o fundo. Se quiser mantê-la como ícone, adicione de volta. */}
              <button onClick={handleControlPanel}>
                <span>Painel de controle</span>
              </button>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>

            {/* Menu de opções */}
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
              <ul className="divide-y divide-gray-100">
                {[
                  { icon: <ProfileIcon className="w-6 h-6 text-gray-600" />, text: 'Meus dados' },
                  { icon: <HelpIcon className="w-6 h-6 text-gray-600" />, text: 'Suporte e Feedback' },
                  { icon: <NotificationRightBarIcon className="w-6 h-6 text-gray-600" />, text: 'Notificações' },
                  { icon: <PaymentIcon className="w-6 h-6 text-gray-600" />, text: 'Meus plano' },
                  { icon: <SettingsRightBarIcon className="w-6 h-6 text-gray-600" />, text: 'Configurações' },
                ].map((item, index) => (
                  <li key={index} className="flex justify-between items-center p-4 hover:bg-white/50 transition-colors duration-200">
                    <div className="flex items-center space-x-4">
                      {item.icon}
                      <span className="font-medium text-gray-800 text-sm sm:text-base">{item.text}</span>
                    </div>
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </li>
                ))}
              </ul>

              {/* Botão de logout */}
              <button onClick={handleLogout}>
                <div className="p-4 border-t border-gray-100">
                  <div className="flex items-center space-x-4 text-red-500 hover:bg-red-50 p-2 rounded-xl transition-colors duration-200 cursor-pointer">
                    <LogoutIcon className="w-6 h-6" />
                    <span className="font-medium text-sm sm:text-base">Terminar Sessão</span>
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