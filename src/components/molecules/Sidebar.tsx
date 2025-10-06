'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ChartDesktopIcon, HomeDeskIcon, IAIcon, ImageIcon, LibraryDeskIcon, SettingsDeskIcon } from '@/src/constants/icons';
import Link from 'next/link';
import { logo } from '@/src/constants/images';
import { TrashIcon } from 'lucide-react';
import { ROUTES } from '@/src/constants/routes';

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
}

const Sidebar = () => {
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState('');
  const [isInChatPage, setIsInChatPage] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      title: 'Dicas de Economia',
      lastMessage: 'Muito obrigado Wundo AI',
      timestamp: '10:30'
    },
    {
      id: '2',
      title: 'Investimentos para Iniciantes',
      lastMessage: 'Como posso começar a investir?',
      timestamp: 'Ontem'
    },
    {
      id: '3',
      title: 'Planejamento Financeiro',
      lastMessage: 'Preciso de ajuda com orçamento',
      timestamp: '2 dias'
    },
    {
      id: '4',
      title: 'Poupança e Metas',
      lastMessage: 'Qual a melhor estratégia?',
      timestamp: '1 semana'
    },
    {
      id: '5',
      title: 'Gestão de Gastos',
      lastMessage: 'Como controlar melhor os gastos?',
      timestamp: '2 semanas'
    }
  ]);

  // Mapeia os caminhos para os itens do menu
  const menuItems = [
    { name: 'Home', path: ROUTES.HOME, icon: HomeDeskIcon },
    { name: 'Análises', path: ROUTES.CONTROL_PANEL, icon: ChartDesktopIcon },
    { name: 'Biblioteca', path: ROUTES.LIBRARY, icon: LibraryDeskIcon },
    { name: 'Objetivos Financeiros', path: ROUTES.FINANCIAL, icon: ImageIcon },
    { name: 'Configurações', path: '/configuracoes', icon: SettingsDeskIcon },

  ];

  // Verifica se está na página do chat e atualiza o item ativo
  useEffect(() => {
    const isChatRoute = pathname.includes('/chat') || pathname.includes('/ai');
    setIsInChatPage(isChatRoute);

    if (isChatRoute) {
      setActiveItem('Wundu AI');
    } else {
      const currentItem = menuItems.find((item) => item.path === pathname);
      setActiveItem(currentItem ? currentItem.name : 'Home');
    }
  }, [pathname]);

  const handleDeleteConversation = (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConversations(conversations.filter(conv => conv.id !== conversationId));
  };

  const handleNewChat = () => {
    console.log('Nova conversa');
  };

  return (
    <nav className="hidden md:flex h-full flex-col w-64 bg-white py-5 shadow-sm border-r border-gray-200 overflow-hidden">
      {/* Logo Header */}
      <div className="flex items-center justify-center mb-6 border-b-2 pb-5 shadow-sm border-gray-300">
        <Image src={logo} alt="Wundu Logo" className="w-12 h-12 rounded-full bg-gray-100" />
        <span className="text-xl font-bold ml-2">WUNDU</span>
      </div>

      {/* Menu Navigation */}
      <div className="px-4 mb-6">
        <p className="text-gray-400 text-sm mb-3">Menu</p>
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.path}
                className={`flex items-center space-x-3 p-3 rounded-xl font-semibold transition-colors text-sm ${activeItem === item.name ? 'bg-yellow-300 text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                onClick={() => setActiveItem(item.name)}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Container flexível */}
      <div className="flex-1 flex flex-col px-4 relative overflow-hidden">
        {/* Conversas Anteriores - Agora sempre renderizado, mas escondido quando não no chat */}
        <div
          className={`transition-all duration-500 ease-in-out flex flex-col ${isInChatPage ? 'opacity-100 transform translate-y-0 flex-1' : 'opacity-0 transform translate-y-4 h-0'
            } overflow-hidden`}
        >
          {/* Removido o {isInChatPage &&} para evitar remontagem */}
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-500 flex items-center flex-1">
                <span className="mr-2">Conversas anteriores</span>
                <div className="flex-1 border-b border-gray-300"></div>
              </div>
              <button
                onClick={handleNewChat}
                className="ml-2 text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-md hover:bg-blue-100 transition-colors"
              >
                + Nova
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="space-y-2">
                {conversations.map((conversation, index) => (
                  <div
                    key={conversation.id}
                    className={`group flex items-start p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-300 ${isInChatPage ? 'animate-slide-in' : ''
                      }`}
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animationFillMode: 'both',
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">{conversation.title}</h4>
                      <p className="text-xs text-gray-500 truncate mt-1">{conversation.lastMessage}</p>
                      <span className="text-xs text-gray-400 mt-1 block">{conversation.timestamp}</span>
                    </div>
                    <button
                      onClick={(e) => handleDeleteConversation(conversation.id, e)}
                      className="opacity-0 group-hover:opacity-100 ml-2 p-1 rounded hover:bg-gray-200 transition-all duration-200"
                      title="Deletar conversa"
                    >
                      <TrashIcon className="w-4 h-4 text-gray-400 hover:text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
              {conversations.length === 0 && (
                <div className="text-center text-gray-400 text-sm py-8">Nenhuma conversa anterior</div>
              )}
            </div>
          </>
        </div>

        {/* AI Section */}
        <div className={`transition-all duration-500 ease-in-out ${isInChatPage ? 'mt-4' : 'mt-auto'}`}>
          <div className="text-sm text-gray-500 mb-3 flex items-center">
            <span className="mr-2">AI</span>
            <div className="flex-1 border-b border-gray-300"></div>
          </div>
          <Link
            href="/home/chat"
            className={`flex items-center w-full space-x-3 p-3 rounded-xl transition-all duration-300 ${activeItem === 'Wundu AI' ? 'bg-purple-600 text-white shadow-lg transform scale-105' : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
              }`}
            onClick={() => setActiveItem('Wundu AI')}
          >
            <div
              className={`border-2 p-2 rounded-full transition-all duration-300 ${activeItem === 'Wundu AI' ? 'border-purple-300 bg-purple-100' : 'border-purple-200 bg-white'
                }`}
            >
              <IAIcon className={activeItem === 'Wundu AI' ? 'text-white' : ''} />
            </div>
            <span className="font-semibold">Wundu AI</span>
            {isInChatPage && (
              <div className="ml-auto">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            )}
          </Link>
        </div>
      </div>

      {/* Estilos CSS */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.6s ease-out forwards;
        }
      `}</style>
    </nav>
  );
};

export default Sidebar;