import { useRouter } from "next/navigation";

import { NavigationBackProps } from "@/src/types/button";
import { ArrowLeftIcon } from "@/src/constants/icons";

const NavigationBack: React.FC<NavigationBackProps> = ({ prev, color }) => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="flex items-center space-x-2" onClick={prev ? prev : handleBack}>
      <ArrowLeftIcon className={`h-5 w-5 ${color ? color : "text-gray-500"} `} />
      <span className={`${color ? color : "text-gray-700"}`}>Voltar</span>
    </div>
  )
};

export default NavigationBack