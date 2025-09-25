'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ViewMode } from '@/src/types/panel';

interface HeaderSectionProps {
  isCredit: boolean;
  headerText: string;
  headerAmount: number;
  viewMode: ViewMode;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({
  isCredit,
  headerText,
  headerAmount,
  viewMode,
}) => {
  return (
    <div className={`mx-4 p-6 bg-blue-950 text-white rounded-3xl shadow-lg ${viewMode === 'pie' ? 'hidden md:block' : ''}`}>
      <div className="flex justify-center items-center mb-4">
        <div className="flex bg-gray-500/45 p-2 space-x-4 rounded-2xl">
          <button className="flex items-center">
            <ChevronLeft />
          </button>
          <span className="font-semibold text-lg">{isCredit ? 'IMG' : 'Todos'}</span>
          <button className="flex items-center">
            <ChevronRight />
          </button>
        </div>
      </div>
      <p className="text-sm text-center">{headerText}</p>
      <h1 className="text-3xl font-bold text-center">{headerAmount.toLocaleString('pt-AO')},00KZ</h1>
    </div>
  );
};

export default HeaderSection;