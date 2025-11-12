import React from "react";
import { StatsCard } from "@/ui/atoms";
import { FileIcon, ImageHomeIcon } from "@/constants/icons";
import { StatsSectionProps } from "@/types/ctaSection";

const StatsSection: React.FC<StatsSectionProps> = ({
  totalFiles,
  totalProofs,
  totalImages,
}) => {
  return (
    <div className="flex flex-1 justify-center flex-row flex-nowrap gap-1 bg-white py-6 sm:p-4 lg:p-10 rounded-2xl shadow-xl overflow-x-auto mt-4 sm:mt-6 md:mt-0 max-w-full">
      <StatsCard
        icon={FileIcon}
        count={totalFiles}
        label="Total Arquivos"
        color="bg-blue-100"
        iconColor="text-blue-400"
      />
      <StatsCard
        icon={ImageHomeIcon}
        count={totalProofs}
        label="Total Comprovativos"
        color="bg-red-100"
        iconColor="text-red-400"
        border="border-gray-100 border-r-2 border-l-2 sm:border-r-2 sm:border-l-2"
      />
      <StatsCard
        icon={ImageHomeIcon}
        count={totalImages}
        label="Total Imagens"
        color="bg-green-100"
        iconColor="text-green-400"
      />
    </div>
  );
};

export default StatsSection;
