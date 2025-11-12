import { FinancialProgressCardProps } from "@/types/card";
import { IconContainer } from "@/ui/atoms";
import { EditIcon, ObjectiveIcon } from "@/constants/icons";

const FinancialProgressCard: React.FC<FinancialProgressCardProps> = ({
  title,
  valorAlvo,
  valorPoupado,
  percentage,
  onEdit,
  iconColor = "text-indigo-600",
}) => {
  const progressColor = percentage < 100 ? "text-red-500" : "text-green-500";
  const progressRingColor =
    percentage < 100 ? "stroke-red-500" : "stroke-green-500";
  const progressBgColor = "stroke-gray-300";
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-gray-100 p-4 rounded-xl shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-start space-x-4">
          <IconContainer
            icon={ObjectiveIcon}
            bgColor="bg-white"
            iconColor={iconColor}
            className="self-start"
          />
          <div>
            <h3 className="text-base font-semibold text-violet-400">{title}</h3>
            <p className="text-xs text-green-400 mt-1">
              Valor-alvo:{" "}
              <span className="text-gray-800 font-medium">{valorAlvo}</span>
            </p>
            <p className="text-xs text-orange-400">
              Valor poupado:{" "}
              <span className="text-gray-800 font-medium">{valorPoupado}</span>
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="relative w-12 h-12">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                className={progressBgColor}
                strokeWidth="4"
                fill="transparent"
                r={radius}
                cx="50%"
                cy="50%"
              />
              <circle
                className={progressRingColor}
                strokeWidth="4"
                fill="transparent"
                r={radius}
                cx="50%"
                cy="50%"
                style={{ strokeDasharray: circumference, strokeDashoffset }}
              />
            </svg>
            <span
              className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${progressColor}`}
            >
              {percentage}%
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              console.log("Botão edit clicado!");
              onEdit?.();
            }}
            className="hover:bg-gray-200 flex flex-col items-center justify-center rounded-full transition-colors focus:outline-none focus:ring-1 focus:ring-indigo-200"
            aria-label="Editar objetivo"
          >
            <IconContainer
              icon={EditIcon}
              bgColor="bg-white"
              iconColor="text-indigo-600"
              className="m-1"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinancialProgressCard;
