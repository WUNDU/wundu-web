import { DetailsSectionProps } from "@/shared/types/ctaSection";

const DetailsSection = ({ icon, label, children }: DetailsSectionProps) => (
  <div className="flex flex-col gap-2 mb-4">
    <div className="flex items-center gap-2 text-[#0F2045]">
      {icon}
      <span className="font-semibold text-sm">{label}</span>
    </div>
    <div className="flex flex-col gap-2">{children}</div>
  </div>
);

export default DetailsSection;
