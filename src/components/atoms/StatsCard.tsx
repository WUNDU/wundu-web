import { StatsCardProps } from '@/src/types/card';
import React from 'react';

const StatsCard: React.FC<StatsCardProps> = ({ icon: Icon, count, label, color, iconColor, border }) => {
  const iconContainerClass = `p-1 sm:p-2 lg:p-3 rounded-full ${color}`;
  const iconClass = `w-3 h-3 sm:w-4 lg:w-6 sm:h-4 lg:h-6 ${iconColor}`;

  return (
    <div className={`flex flex-col md:flex-row items-center justify-center space-x-1 sm:space-x-2 lg:space-x-4 bg-white p-1 sm:p-2 lg:p-4 ${border} min-w-fit`}>
      <div className={iconContainerClass}>
        <Icon className={iconClass} />
      </div>
      <div className='text-center md:text-left'>
        <h3 className="text-sm sm:text-base lg:text-xl font-bold text-gray-900">{count}</h3>
        <p className="text-xs sm:text-xs lg:text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
};

export default StatsCard;