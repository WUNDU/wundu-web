"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/ui/atoms";
import { ROUTES } from "@/constants/routes";
import { CheckmarkIcon } from "@/constants/icons";

const SuccessPasswordReset = () => {
  const router = useRouter();

  const handleContinue = () => {
    router.push(ROUTES.LOGIN);
  };

  return (
    <div className="flex flex-col h-full justify-center items-center text-center p-8 md:p-0 md:gap-6">
      <div className="w-24 h-24 mb-8 md:mb-4 flex items-center justify-center rounded-full bg-green-100">
        <CheckmarkIcon className="w-16 h-16 text-green-500" />
      </div>
      <h1 className="text-3xl md:text-2xl font-bold text-gray-800">
        SENHA REDEFINIDA COM SUCESSO!
      </h1>
      <p className="mt-2 text-gray-600 max-w-sm mx-auto">
        Tudo certo! agora podes aceder a sua conta com a tua nova senha.
      </p>

      {/* Button positioning - fixed bottom for mobile, inline for desktop */}
      <div className="fixed bottom-0 left-0 right-0 p-4 md:static md:p-0 md:w-full md:max-w-sm">
        <Button onClick={handleContinue} type="button">
          Continuar
        </Button>
      </div>
    </div>
  );
};

export default SuccessPasswordReset;
