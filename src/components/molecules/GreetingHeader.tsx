import React from 'react';
import IA from '../icons/IA';
import Notification from '../icons/Notification';
import { user } from '@/src/constants/images';
import Image from 'next/image';
import DownArrow from '../icons/DownArrow';
import NotificationDesk from '../icons/NotificationDesk';

const GreetingHeader = () => {
  return (
    <header className="bg-white px-4 py-3 flex items-center justify-between md:justify-end shadow-sm">
      <div className="flex justify-start items-center md:justify-end">
        <div className='flex items-center space-x-2'>
          <div className='hidden md:flex pr-10'>
            <NotificationDesk />
          </div>

          <div className='md:p-[2px] md:rounded-full
            md:bg-gradient-to-r md:from-yellow-400 md:to-yellow-600'>
            <div className='bg-white md:p-4 rounded-full '>
              <Image
                src={user}
                alt="Israel Manuel"
                className="w-10 h-10 rounded-full"
              />
            </div>
          </div>
          <DownArrow className='hidden md:flex w-4 h-4 text-gray-600' />
        </div>
        <div className="md:hidden ml-3">
          <h1 className="text-lg font-semibold text-gray-900">Olá, Israel Manuel</h1>
          <p className="text-sm text-gray-500">Bem-vindo ao wundu</p>
        </div>
      </div>
      <div className="md:hidden flex items-center space-x-3">
        <div className='border-2 rounded-full border-purple-200 bg-white'>
          <IA />
        </div>
        <div className='border-2 rounded-full border-gray-300 bg-gray-300'>
          <Notification />
        </div>
      </div>
    </header>
  );
};

export default GreetingHeader;