import React from 'react';
import ImageIcon from '../icons/Image';
import Image from 'next/image';
import { user } from '@/src/constants/images';
import NotificationDesk from '../icons/NotificationDesk';
import Close from '../icons/Close';
import DownArrow from '../icons/DownArrow';

interface SidebarRightProps {
  isOpen: boolean;
  onClose: () => void;
}

const SidebarRight: React.FC<SidebarRightProps> = ({ isOpen, onClose }) => {
  return (
    <div
      className={`fixed top-0 right-0 h-full w-full max-w-sm bg-black/10 backdrop-blur-sm z-50 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      onClick={onClose}
    >
      <div className='pb-20'>
        <div className='flex flex-row justify-between mx-2 px-10 mt-2'>
          <NotificationDesk />
          <button onClick={onClose} className="">
            <DownArrow className='w-6 h-6' />
          </button>
        </div>
        <div
          className="relative h-full   rounded-l-2xl shadow-lg p-6 flex flex-col items-center space-y-4 overflow-y-auto transform transition-transform duration-300 ease-in-out"
          onClick={(e) => e.stopPropagation()}
        >


          <div className='md:p-[2px] md:rounded-full
                    md:bg-gradient-to-r md:from-yellow-400 md:to-yellow-600'>
            <div className='bg-white md:p-4 rounded-full '>
              <Image
                src={user}
                alt="Israel Manuel"
                className="w-5 h-5 rounded-full"
              />
            </div>
          </div>
          <span className="text-xl font-semibold text-gray-800">Israel Manuel</span>

          <div className="w-full flex flex-col space-y-4 pt-4">
            <div className="bg-blue-900 rounded-xl p-4 shadow-md text-white font-medium flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10v11h18V10M3 10l9-7 9 7M3 10a2 2 0 01-2-2v-1a2 2 0 012-2h18a2 2 0 012 2v1a2 2 0 01-2 2H3z"></path>
                </svg>
                <span>Painel de controle</span>
              </span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>

            <div className='border rounded-2xl shadow-2xl bg-white/60 border-gray-50'>
              <ul className="w-full space-y-2">
                {[
                  { icon: <ImageIcon className="w-5 h-5 text-gray-600" />, text: 'Meus dados' },
                  { icon: <ImageIcon className="w-5 h-5 text-gray-600" />, text: 'Suporte e Feedback' },
                  { icon: <ImageIcon className="w-5 h-5 text-gray-600" />, text: 'Notificações' },
                  { icon: <ImageIcon className="w-5 h-5 text-gray-600" />, text: 'Meus plano' },
                  { icon: <ImageIcon className="w-5 h-5 text-gray-600" />, text: 'Configurações' },
                ].map((item, index) => (
                  <li key={index} className="flex justify-between items-center w-full p-4 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                    <div className="flex items-center space-x-4">
                      {item.icon}
                      <span className="font-medium text-gray-700">{item.text}</span>
                    </div>
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </li>
                ))}
                <li className="flex justify-start items-center w-full p-4 rounded-xl text-red-500 hover:bg-red-50 transition-colors duration-200 space-x-4">
                  <ImageIcon className="w-5 h-5" />
                  <span className="font-medium">Terminar Sessão</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarRight;
