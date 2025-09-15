import { IconContainerProps } from "@/src/types/card";

const IconContainer: React.FC<IconContainerProps> = ({ icon: Icon, bgColor, iconColor }) => (
  <div className={`p-3 rounded-full flex-shrink-0 ${bgColor}`}>
    <Icon className={`h-6 w-6 ${iconColor}`} />
  </div>
);


export default IconContainer