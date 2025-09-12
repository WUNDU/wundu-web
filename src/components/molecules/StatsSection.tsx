import React from 'react';
import StatsCard from '../atoms/StatsCard';
import File from '../icons/File';
import ImageHome from '../icons/ImageHome';
import { StatsSectionProps } from '@/src/types/ctaSection';

const StatsSection: React.FC<StatsSectionProps> = ({ totalFiles, totalProofs, totalImages }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-10 rounded-2xl">
      <StatsCard icon={File} count={totalFiles} label="Total Arquivos" color="bg-blue-100" iconColor='text-blue-400' />
      <StatsCard icon={ImageHome} count={totalProofs} label="Total Comprovativos" color="bg-red-100" iconColor='text-red-400' border='border-gray-100 border-r-2 border-l-2' />
      <StatsCard icon={ImageHome} count={totalImages} label="Total Imagens" color="bg-green-100" iconColor='text-green-400' />
    </div>
  );
};

export default StatsSection;
