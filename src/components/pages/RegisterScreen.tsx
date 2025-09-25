'use client'
import PersonalData from "../organisms/PersonalData";
import SecurityData from "../organisms/SecurityData";
import Success from "../organisms/Success";
import Image from "next/image";
import { logo } from "@/src/constants/images";
import { useRegisterContext } from "@/src/hooks/useRegisterContext";

const RegisterScreen = () => {
  const { currentStep } = useRegisterContext();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalData />;
      case 2:
        return <SecurityData />;
      case 3:
        return <Success />;
      default:
        return <PersonalData />;
    }
  };

  return (
    <div className="min-h-screen w-screen bg-white md:bg-gray-100">
      {/* Layout Mobile (mantém o original) */}
      <div className="block md:hidden h-screen">
        {renderStep()}
      </div>

      {/* Layout Desktop (novo design centralizado) */}
      <div className="hidden md:flex min-h-screen items-center justify-center p-8 relative">
        {/* Logo WUNDU - fora do container, canto superior esquerdo */}
        <div className="absolute top-8 left-8 flex items-center gap-2">
          <Image src={logo} alt="Login Illustration" className="w-full" />
          <span className="text-2xl font-bold text-gray-800">WUNDU</span>
        </div>

        <div className="w-full max-w-3xl bg-white rounded-2xl  shadow-xl px-5 py-10 relative">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;