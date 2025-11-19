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
    <div className="bg-gray-100/80 backdrop-blur-sm p-4 rounded-xl shadow-sm transition-all duration-300 ease-out hover:shadow-md hover:-translate-y-1 border border-gray-200/50">
      <div className="flex items-center justify-between transition-all duration-300 ease-out">
        <div className="flex items-start space-x-4 transition-all duration-300 ease-out">
          <IconContainer
            icon={ObjectiveIcon}
            bgColor="bg-white"
            iconColor={iconColor}
            className="self-start"
          />
          <div>
            <h3 className="text-base font-semibold text-indigo-600 transition-all duration-300 ease-out">{title}</h3>
            <p className="text-xs text-green-600 mt-1 transition-all duration-300 ease-out">
              Valor-alvo:{" "}
              <span className="text-gray-800 font-medium">{valorAlvo}</span>
            </p>
            <p className="text-xs text-amber-600 transition-all duration-300 ease-out">
              Valor poupado:{" "}
              <span className="text-gray-800 font-medium">{valorPoupado}</span>
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="relative w-12 h-12">
            <svg className="w-full h-full transform -rotate-90 transition-all duration-500 ease-out">
              <circle
                className={progressBgColor}
                strokeWidth="4"
                fill="transparent"
                r={radius}
                cx="50%"
                cy="50%"
                style={{transition: 'all 0.5s ease-out'}}
              />
              <circle
                className={progressRingColor}
                strokeWidth="4"
                fill="transparent"
                r={radius}
                cx="50%"
                cy="50%"
                style={{ 
                  strokeDasharray: circumference, 
                  strokeDashoffset,
                  transition: 'stroke-dashoffset 1s ease-out'
                }}
              />
            </svg>
            <span
              className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${progressColor} transition-all duration-300 ease-out`}
            >
              {percentage}%
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.();
            }}
            className="hover:bg-gray-200/80 flex flex-col items-center justify-center rounded-full transition-all duration-300 ease-out hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2"
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
