'use client'; // Adicione isso se estiver usando Next.js App Router

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation'; // Importa usePathname para verificar a URL
import { logo } from '@/src/constants/images';
import { HomeDeskIcon, IAIcon, ImageIcon, LibraryDeskIcon, SettingsDeskIcon } from '@/src/constants/icons';
import Link from 'next/link';

const Sidebar = () => {
  const pathname = usePathname(); // Obtém o caminho atual da URL
  const [activeItem, setActiveItem] = useState('');

  // Mapeia os caminhos para os itens do menu
  const menuItems = [
    { name: 'Home', path: '/home', icon: HomeDeskIcon },
    { name: 'Biblioteca', path: '/biblioteca', icon: LibraryDeskIcon },
    { name: 'Objetivos Financeiros', path: '/home/financial', icon: ImageIcon },
    { name: 'Configurações', path: '/configuracoes', icon: SettingsDeskIcon },
  ];

  // Atualiza o item ativo com base na URL
  useEffect(() => {
    const currentItem = menuItems.find((item) => item.path === pathname);
    setActiveItem(currentItem ? currentItem.name : 'Home');
  }, [pathname]);

  return (
    <nav className="hidden md:flex h-full flex-col w-64 bg-white py-5 shadow-sm border-r border-gray-200">
      <div className="flex items-center justify-center mb-10 border-b-2 pb-5 shadow-sm border-gray-300">
        <Image src={logo} alt="Wundu Logo" className="w-12 h-12 rounded-full bg-gray-100" />
        <span className="text-xl font-bold ml-2">WUNDU</span>
      </div>

      <ul className="flex-1 space-y-2 px-4">
        <li className="text-gray-400 p-2">Menu</li>
        {menuItems.map((item) => (
          <li key={item.name}>
            <Link
              href={item.path}
              className={`flex items-center space-x-3 p-3 rounded-xl font-semibold transition-colors ${activeItem === item.name
                ? 'bg-yellow-300 text-white'
                : 'text-gray-600 hover:bg-gray-100'
                }`}
              onClick={() => setActiveItem(item.name)} // Atualiza o item ativo ao clicar
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-auto px-4">
        <div className="text-sm text-gray-500 mb-2 flex items-center">
          <span className="mr-2">AI</span>
          <div className="flex-1 border-b border-gray-300"></div>
        </div>
        <button
          className="flex items-center w-full space-x-3 p-3 rounded-xl bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
          onClick={() => setActiveItem('Wundu AI')}
        >
          <div className="border-2 p-2 rounded-full border-purple-200 bg-white">
            <IAIcon />
          </div>
          <span>Wundu AI</span>
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;