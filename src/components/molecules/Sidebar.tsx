import React from 'react';
import { Bot } from 'lucide-react';
import HomeDesk from '../icons/HomeDesk';
import ImageIcon from '../icons/Image';
import Image from 'next/image';
import SettingsDesk from '../icons/SettingsDesk';
import LibraryDesk from '../icons/LibraryDesk';
import { logo } from '@/src/constants/images';
import IA from '../icons/IA';

const Sidebar = () => {
  return (
    <nav className="hidden md:flex flex-col w-64 bg-white py-5 shadow-sm border-r border-gray-200">
      <div className="flex items-center justify-center mb-10 border-b-2 pb-5 shadow-sm border-gray-300">
        <Image src={logo} alt="Wundu Logo" className="w-12 h-12 rounded-full  bg-gray-100" />
        <span className="text-xl font-bold ml-2">WUNDU</span>
      </div>

      <ul className="flex-1 space-y-2 px-4">
        <li className='text-gray-400 p-2'>Menu</li>
        <li>
          <a href="#" className="flex items-center space-x-3 p-3 rounded-xl bg-yellow-300 text-white font-semibold">
            <HomeDesk className="w-5 h-5" />
            <span>Home</span>
          </a>
        </li>
        <li>
          <a href="#" className="flex items-center space-x-3 p-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors">
            <LibraryDesk className="w-5 h-5" />
            <span>Biblioteca</span>
          </a>
        </li>
        <li>
          <a href="#" className="flex items-center space-x-3 p-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors">
            <ImageIcon className="w-5 h-5" />
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
      <div className="mt-auto px-4">
        <div className="text-sm text-gray-500 mb-2 flex items-center">
          <span className="mr-2">AI</span>
          <div className="flex-1 border-b border-gray-300"></div>
        </div>
        <button className="flex items-center w-full space-x-3 p-3 rounded-xl bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors">
          <div className='border-2 p-2 rounded-full border-purple-200 bg-white'>
            <IA />
          </div>
          <span>Wundu AI</span>
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;
