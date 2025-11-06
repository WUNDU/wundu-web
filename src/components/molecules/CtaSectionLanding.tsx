"use client";

import { useRouter } from "next/navigation";
import { ROUTES } from "@/src/constants/routes";
import Button from "../atoms/Button";

const CtaSectionLanding = ({ ref }: { ref: React.Ref<HTMLDivElement> }) => {
  const router = useRouter();
  const handleLogin = () => {
    router.push(ROUTES.LOGIN);
  };
  return (
    <section
      className="bg-gradient-to-b from-blue-900 to-blue-800 text-white py-20"
      ref={ref}
    >
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">
          Pronto para assumir o controle?
        </h2>
        <p className="mt-4 max-w-xl mx-auto text-blue-200">
          Junta-te a milhares de pessoas que já começaram a transformar a sua
          relação com o dinheiro.
        </p>
        <div className="mt-8">
          <Button onClick={handleLogin} variant="landing">
            Experimente agora - É grátis →
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CtaSectionLanding;
