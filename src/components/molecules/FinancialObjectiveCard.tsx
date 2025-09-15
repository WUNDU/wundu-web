import { FinancialObjectiveCardProps } from "@/src/types/card";
import IconContainer from "../atoms/IconContainer";



const FinancialObjectiveCard: React.FC<FinancialObjectiveCardProps> = ({ icon, title, description, borderColor, bgColor, iconBgColor, iconColor }) => (
  <div className={`${bgColor} p-4 rounded-xl shadow-sm md:shadow-none ${borderColor}`}>
    <div className="flex items-start space-x-4">
      <IconContainer icon={icon} bgColor={iconBgColor} iconColor={iconColor} />
      <div>
        <h3 className={`text-base font-semibold ${iconColor} md:text-gray-900`}>{title}</h3>
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      </div>
    </div>
  </div>
);

export default FinancialObjectiveCard