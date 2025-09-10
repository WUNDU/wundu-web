import React from 'react';
import IA from '../icons/IA';
import Notification from '../icons/Notification';
import { user } from '@/src/constants/images';
import Image from 'next/image';

const GreetingHeader = () => {
  return (
    <header className="bg-white px-4 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center">
        <Image
          src={user}
          alt="Israel Manuel"
          className="w-10 h-10 rounded-full"
        />
        <div className="ml-3">
          <h1 className="text-lg font-semibold text-gray-900">Olá, Israel Manuel</h1>
          <p className="text-sm text-gray-500">Bem-vindo ao wundu</p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <IA />
        <Notification />
      </div>
    </header>
  );
};

export default GreetingHeader;