import React from 'react';
import Image from 'next/image';
import { user } from '@/src/constants/images';
import { DownArrowIcon, HelpIcon, LogoutIcon, NotificationDeskIcon, NotificationRightBarIcon, PaymentIcon, ProfileIcon, SettingsRightBarIcon } from '@/src/constants/icons';

interface SidebarRightProps {
  isOpen: boolean;
  onClose: () => void;
}

const SidebarRight: React.FC<SidebarRightProps> = ({ isOpen, onClose }) => {
  return (
    <div
      className={`fixed top-0 right-0 h-full w-full max-w-lg bg-black/5 backdrop-blur-sm z-50 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      onClick={onClose}
    >
      {/* Header com notificação e botão de fechar */}
      <div className="flex flex-row justify-between items-center px-6 py-4">
        <NotificationDeskIcon className="w-8 h-8 text-black" />
        <button onClick={onClose} className="p-2">
          <DownArrowIcon className="w-6 h-6 text-black rotate-90" />
        </button>
      </div>

      {/* Conteúdo principal */}
      <div
        className="px-6 py-4 flex flex-col items-center space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Avatar do usuário */}
        <div className="p-1 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600">
          <div className="bg-white p-3 rounded-full">
            <Image
              src={user}
              alt="Israel Manuel"
              className="w-12 h-12 rounded-full object-cover"
            />
          </div>
        </div>

        {/* Nome do usuário */}
        <span className="text-2xl font-semibold text-black">Israel Manuel</span>

        {/* Painel de controle */}
        <div className="w-full">
          <div className="bg-blue-900 rounded-xl p-4 shadow-md text-white font-medium flex items-center justify-between mb-4">
            <span>Painel de controle</span>
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
                    <span className="font-medium text-gray-800">{item.text}</span>
                  </div>
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </li>
              ))}
            </ul>

            {/* Botão de logout */}
            <div className="p-4 border-t border-gray-100">
              <div className="flex items-center space-x-4 text-red-500 hover:bg-red-50 p-2 rounded-xl transition-colors duration-200 cursor-pointer">
                <LogoutIcon className="w-6 h-6" />
                <span className="font-medium">Terminar Sessão</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarRight;