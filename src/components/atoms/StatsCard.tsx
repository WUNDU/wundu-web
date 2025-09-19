import { StatsCardProps } from '@/src/types/card';
import React from 'react';

const StatsCard: React.FC<StatsCardProps> = ({ icon: Icon, count, label, color, iconColor, border }) => {
  const iconContainerClass = `p-3 rounded-full ${color}`;
  const iconClass = `w-6 h-6 ${iconColor}`;

  return (
    <div className={`hidden md:flex items-center justify-center space-x-4 bg-white p-4 ${border}`}>
      <div className={iconContainerClass}>
        <Icon className={iconClass} />
      </div>
      <div>
        <h3 className="text-xl font-bold text-gray-900">{count}</h3>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
};

export default StatsCard;
