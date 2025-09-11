import React from 'react';
import { FileText, Image as ImageIcon, Folders } from 'lucide-react';
import StatsCard from '../atoms/StatsCard';

interface StatsSectionProps {
  totalFiles: number;
  totalProofs: number;
  totalImages: number;
}

const StatsSection: React.FC<StatsSectionProps> = ({ totalFiles, totalProofs, totalImages }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-10 rounded-2xl">
      <StatsCard icon={Folders} count={totalFiles} label="Total Arquivos" color="bg-blue-500" />
      <StatsCard icon={FileText} count={totalProofs} label="Total Comprovativos" color="bg-red-500" />
      <StatsCard icon={ImageIcon} count={totalImages} label="Total Imagens" color="bg-green-500" />
    </div>
  );
};

export default StatsSection;
