import React from 'react';
import { CoinIcon, MoneyBagIcon, MoneyManagerIcon, MoneyPotIcon, MoneySignIcon } from '@/src/constants/icons';

const ChatOptions: React.FC<{ onOptionSelect: () => void }> = ({ onOptionSelect }) => {
  const options = [
    { label: 'Investimentos', color: 'bg-red-50 text-red-600', icon: <MoneyBagIcon /> },
    { label: 'Finanças', color: 'bg-orange-50 text-orange-600', icon: <CoinIcon /> },
    { label: 'Poupanças', color: 'bg-blue-50 text-blue-600', icon: <MoneyManagerIcon /> },
    { label: 'Gestão', color: 'bg-green-50 text-green-600', icon: <MoneyPotIcon /> },
    { label: 'Dinheiro', color: 'bg-teal-50 text-teal-600', icon: <MoneySignIcon /> }
  ];

  return (
    <div className="flex flex-col items-center justify-center flex-1 p-6">
      <div className="w-full max-w-sm mt-16">
        <h3 className="text-center text-gray-700 font-medium mb-6">Como posso ajudar?</h3>
        <p className="text-center text-gray-600 text-sm mb-6">Deseja falar sobre:</p>

        <div className="flex flex-wrap gap-5">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={onOptionSelect}
              // Removendo 'w-full' para que os botões se ajustem ao conteúdo
              className={`flex items-center justify-center p-3 rounded-xl ${option.color} transition-all hover:scale-105`}
            >
              <span className="mr-2">{option.icon}</span>
              <span className="text-sm font-medium break-words whitespace-normal text-left flex-grow">{option.label}</span>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};

export default ChatOptions