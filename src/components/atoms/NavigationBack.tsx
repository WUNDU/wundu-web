import { ChevronLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const NavigationBack: React.FC = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="flex items-center space-x-2" onClick={handleBack}>
      <ChevronLeftIcon className="h-5 w-5 text-gray-500" />
      <span className="text-gray-700 font-medium">Voltar</span>
    </div>
  )
};

export default NavigationBack