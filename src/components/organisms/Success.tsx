import { useRegisterContext } from "@/src/contexts/RegisterContext";
import Button from "../atoms/Button";
import Image from "next/image";
import { logo } from "@/src/constants/images";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/src/constants/routes";
import CheckmarkIcon from "../icons/CheckmarkIcon";

const Success = () => {
  const { data } = useRegisterContext();
  const router = useRouter()

  const handleContinue = () => {
    router.push(ROUTES.LOGIN)
  };
  return (
    <div className="flex m-4 flex-col h-full justify-center items-center text-center p-8 md:p-0 md:gap-6">
      <div className="w-24 h-24 mb-8 md:mb-4 flex items-center justify-center rounded-full bg-green-100">
        <CheckmarkIcon className="w-16 h-16 text-green-500" />
      </div>
      <h1 className="text-3xl md:text-2xl font-bold text-gray-800">Cadastro finalizado com sucesso</h1>
      <p className="mt-2 text-gray-600 max-w-sm mx-auto">
        Bem-vindo, {data.name}! O caminho para a liberdade financeira começa agora.
      </p>

      {/* Button positioning - fixed bottom for mobile, inline for desktop */}
      <div className="fixed bottom-0 left-0 right-0 p-4 md:static md:p-0 md:w-full md:max-w-sm">
        <Button onClick={handleContinue} type="button">Continuar</Button>
      </div>
    </div>
  );
};

export default Success;