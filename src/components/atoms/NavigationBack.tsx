import { useRouter } from "next/navigation";
import ArrowLeft from "../icons/ArrowLeft";
import { NavigationBackProps } from "@/src/types/button";

const NavigationBack: React.FC<NavigationBackProps> = ({ prev }) => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="flex items-center space-x-2" onClick={prev ? prev : handleBack}>
      <ArrowLeft className="h-5 w-5 text-gray-500" />
      <span className="text-gray-700 font-medium">Voltar</span>
    </div>
  )
};

export default NavigationBack