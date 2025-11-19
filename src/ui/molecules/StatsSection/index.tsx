import React from "react";
import { StatsCard } from "@/ui/atoms";
import { FileIcon, ImageHomeIcon } from "@/constants/icons";
import { StatsSectionProps } from "@/types/ctaSection";

const StatsSection: React.FC<StatsSectionProps> = ({
  totalFiles,
  totalProofs,
  totalImages,
}) => {
  const stats = [
    {
      icon: FileIcon,
      count: totalFiles,
      label: "Total Arquivos",
      color: "bg-blue-50",
      iconColor: "text-blue-500",
    },
    {
      icon: ImageHomeIcon,
      count: totalProofs,
      label: "Total Comprovativos",
      color: "bg-rose-50",
      iconColor: "text-rose-500",
    },
    {
      icon: ImageHomeIcon,
      count: totalImages,
      label: "Total Imagens",
      color: "bg-emerald-50",
      iconColor: "text-emerald-500",
    },
  ];

  return (
    <section className="flex-1 w-full mt-4 sm:mt-6 md:mt-0">
      <div className="rounded-3xl bg-white border border-gray-100 shadow-lg ring-1 ring-black/5 p-3 sm:p-5 lg:p-7">
        <div className="flex flex-nowrap gap-3 sm:gap-5 lg:gap-8 overflow-x-auto pb-2 sm:pb-0 snap-x snap-mandatory sm:snap-none sm:grid sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <StatsCard key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
