import { CtaSectionProps } from "@/src/types/ctaSection";

const CtaSectionLogin: React.FC<CtaSectionProps> = ({ title, subtitle, isError
}) => {
  const titleColorClass = isError ? 'text-red-500' : 'text-gray-800';
  return (
    <div className="flex w-full flex-col items-center gap-2 px-6 text-center">
      <h1 className={`text-2xl font-bold ${titleColorClass}`}>{title}</h1>
      <p className="text-gray-600">{subtitle}</p>
    </div>
  );
};

export default CtaSectionLogin