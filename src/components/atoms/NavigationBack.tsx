import { ChevronLeftIcon, MoreVertical } from "lucide-react";

const NavigationBack: React.FC = () => (
  <div className="flex items-center space-x-2">
    <ChevronLeftIcon className="h-5 w-5 text-gray-500" />
    <span className="text-gray-700 font-medium">Voltar</span>
  </div>
);

export default NavigationBack