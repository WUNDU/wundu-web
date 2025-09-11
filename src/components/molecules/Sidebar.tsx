import React from 'react';
import { Bot } from 'lucide-react';
import HomeDesk from '../icons/HomeDesk';
import Library from '../icons/Library';
import Image from '../icons/Image';
import SettingsDesk from '../icons/SettingsDesk';

const Sidebar = () => {
  return (
    <nav className="hidden md:flex flex-col w-64 bg-white p-6 shadow-md border-r border-gray-200">
      <div className="flex items-center mb-10">
        <img src="https://placehold.co/32x32/E5E7EB/4B5563?text=W" alt="Wundu Logo" className="w-8 h-8 rounded-full" />
        <span className="text-xl font-bold ml-2">WUNDU</span>
      </div>

      <ul className="flex-1 space-y-2">
        <li>
          <a href="#" className="flex items-center space-x-3 p-3 rounded-xl bg-yellow-100 text-yellow-600 font-semibold">
            <HomeDesk className="w-5 h-5" />
            <span>Home</span>
          </a>
        </li>
        <li>
          <a href="#" className="flex items-center space-x-3 p-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors">
            <Library className="w-5 h-5" />
            <span>Biblioteca</span>
          </a>
        </li>
        <li>
          <a href="#" className="flex items-center space-x-3 p-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors">
            <Image className="w-5 h-5" />
            <span>Objetivos Financeiros</span>
          </a>
        </li>
        <li>
          <a href="#" className="flex items-center space-x-3 p-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors">
            <SettingsDesk className="w-5 h-5" />
            <span>Configurações</span>
          </a>
        </li>
      </ul>

      <div className="mt-auto">
        <div className="text-sm text-gray-500 mb-2">AI</div>
        <button className="flex items-center w-full space-x-3 p-3 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-colors">
          <Bot className="w-5 h-5" />
          <span>Wundu AI</span>
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;
