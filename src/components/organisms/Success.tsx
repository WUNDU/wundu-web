import { useRegisterContext } from "@/src/contexts/RegisterContext";
import Button from "../atoms/Button";
import Image from "next/image";
import { logo } from "@/src/constants/images";

const Success = () => {
  const { data } = useRegisterContext();
  return (
    <div className="flex flex-col h-full justify-center items-center text-center p-8 md:p-12">
      <Image src={logo} alt="Success Illustration" className="w-48 h-48 mb-8 md:w-64 md:h-64" />
      <h1 className="text-3xl font-bold text-gray-800 md:text-4xl">Cadastro finalizado com sucesso</h1>
      <p className="mt-2 text-gray-600 md:text-lg">
        Bem-vindo, {data.name}! O caminho para a liberdade financeira começa agora.
      </p>
      <a href="#" className="mt-8">
        <Button onClick={() => { }}>Continuar</Button>
      </a>
    </div>
  );
};

export default Success;