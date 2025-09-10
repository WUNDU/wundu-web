'use client';

import { useRouter } from "next/navigation";
import Button from "../atoms/Button";
import CheckmarkIcon from "../icons/CheckmarkIcon";
import { ROUTES } from "@/src/constants/routes";

const SuccessPasswordReset = () => {
  const router = useRouter()

  const handleContinue = () => {
    router.push(ROUTES.LOGIN)
  };

  return (
    <div className="flex flex-col h-full justify-center items-center text-center p-8">
      <div className="w-24 h-24 mb-8 flex items-center justify-center rounded-full bg-green-100">
        <CheckmarkIcon className="w-16 h-16 text-green-500" />
      </div>
      <h1 className="text-3xl font-bold text-gray-800">SENHA REDEFINIDA COM SUCESSO!</h1>
      <p className="mt-2 text-gray-600 max-w-sm mx-auto">
        Tudo certo! agora podes aceder a sua conta com a tua nova senha.
      </p>
      <div className="fixed bottom-0 left-0 right-0 p-4">
        <Button onClick={handleContinue} type="button">Continuar</Button>
      </div>
    </div>
  );
};

export default SuccessPasswordReset;
