'use client'
import { useRouter } from "next/navigation";
import Button from "../atoms/Button";
import { ROUTES } from "@/src/constants/routes";

const Footer: React.FC = () => {
  const router = useRouter();
  const handleCadastreSe = () => {
    router.push(ROUTES.REGISTER)
  };

  const handleFacaLogin = () => {
    router.push(ROUTES.LOGIN)
  };

  return (
    <div className="mt-10 flex w-full items-center gap-3 px-2">
      <Button onClick={handleCadastreSe} variant="primary">
        Cadastre-se
      </Button>
      <Button onClick={handleFacaLogin} variant="secondary">
        Faça login
      </Button>
    </div>
  );
};

export default Footer