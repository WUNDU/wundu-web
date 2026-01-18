import { FinancialProgressCardProps } from "@/types/card";
import { IconContainer } from "@/shared/components";
import { EditIcon, ObjectiveIcon } from "@/constants/icons";

const FinancialProgressCard: React.FC<FinancialProgressCardProps> = ({
  title,
  valorAlvo,
  valorPoupado,
  percentage,
  onEdit,
  iconColor = "text-indigo-600",
  isCompleted = false,
}) => {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const isGoalComplete = percentage >= 100 || isCompleted;
  const ringColor = isGoalComplete ? "stroke-emerald-500" : "stroke-rose-400";
  const progressTextColor = isGoalComplete
    ? "text-emerald-600"
    : "text-rose-500";

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-[#f5f6fb] p-4 shadow-sm border border-white/80 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center gap-4">
        <IconContainer
          icon={ObjectiveIcon}
          bgColor="bg-white"
          iconColor={iconColor}
          className="shadow-sm ring-1 ring-slate-100"
        />

        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-[#675af5] leading-tight">
            {title}
          </h3>
          <p className="text-sm font-medium text-[#4caf50]">
            Valor-alvo:
            <span className="ml-2 font-semibold text-slate-700">
              {valorAlvo}
            </span>
          </p>
          <p className="text-sm font-medium text-[#ff8a65]">
            Valor poupado:
            <span className="ml-2 font-semibold text-slate-700">
              {valorPoupado}
            </span>
          </p>
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          if (!isGoalComplete) {
            onEdit?.();
          }
        }}
        aria-label={isGoalComplete ? "Objetivo concluído" : "Editar objetivo"}
        className={`relative flex flex-col items-center gap-1 rounded-full p-1 transition-opacity duration-200 ${
          isGoalComplete ? "cursor-default opacity-80" : "hover:opacity-80"
        }`}
        disabled={isGoalComplete}
      >
        <div className="relative w-12 h-12">
          <svg
            className="w-full h-full -rotate-90"
            viewBox="0 0 48 48"
            fill="none"
          >
            <circle
              strokeWidth="4"
              stroke="rgba(148, 163, 184, 0.4)"
              fill="transparent"
              r={radius}
              cx="24"
              cy="24"
            />
            <circle
              className={ringColor}
              strokeWidth="4"
              strokeLinecap="round"
              fill="transparent"
              r={radius}
              cx="24"
              cy="24"
              style={{
                strokeDasharray: circumference,
                strokeDashoffset,
                transition: "stroke-dashoffset 0.8s ease-out",
              }}
            />
          </svg>
          <span
            className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${progressTextColor}`}
          >
            {percentage}%
          </span>
        </div>
        {!isGoalComplete && (
          <IconContainer
            icon={EditIcon}
            bgColor="bg-white"
            iconColor="text-slate-500"
            className="scale-90"
          />
        )}
      </button>
    </div>
  );
};

export default FinancialProgressCard;
