import { IconContainerProps } from "@/types/card";

const IconContainer: React.FC<IconContainerProps> = ({
  icon: Icon,
  bgColor,
  iconColor,
  className,
}) => (
  <div className={`p-3 rounded-full flex-shrink-0 ${bgColor} ${className}`}>
    <Icon className={`h-6 w-6 ${iconColor}`} />
  </div>
);

export default IconContainer;
