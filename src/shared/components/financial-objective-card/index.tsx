import { FinancialObjectiveCardProps } from "@/types/card";
import { IconContainer } from "@/shared/components";

const FinancialObjectiveCard: React.FC<FinancialObjectiveCardProps> = ({
  icon,
  title,
  description,
  borderColor,
  bgColor,
  iconBgColor,
  iconColor,
}) => (
  <div
    className={`${bgColor} p-4 rounded-xl shadow-sm md:shadow-none ${borderColor} transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1`}
  >
    <div className="flex items-center space-x-4 transition-all duration-300 ease-out">
      <IconContainer icon={icon} bgColor={iconBgColor} iconColor={iconColor} />
      <div>
        <h3
          className={`text-base font-semibold ${iconColor} md:text-gray-900 transition-all duration-300 ease-out`}
        >
          {title}
        </h3>
        <p className="text-xs text-gray-500 mt-1 transition-all duration-300 ease-out">
          {description}
        </p>
      </div>
    </div>
  </div>
);

export default FinancialObjectiveCard;
