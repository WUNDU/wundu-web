'use client'
import { useRegisterContext } from "@/src/contexts/RegisterContext";
import PersonalData from "../organisms/PersonalData";
import SecurityData from "../organisms/SecurityData";
import Success from "../organisms/Success";
import Image from "next/image";
import { logo } from "@/src/constants/images";

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
    <div className="h-screen w-screen bg-white flex justify-center items-center lg:my-10">
      <div className="w-full h-full md:w-2/3 md:h-auto md:max-w-2xl md:shadow-2xl md:rounded-lg md:bg-white">
        <div className="md:absolute md:top-8 md:left-8 md:flex md:items-center md:gap-2 hidden">
          <Image src={logo} alt="Login Illustration" className="w-full" />
          <span className="text-2xl font-bold text-gray-800">WUNDU</span>
        </div>
        {renderStep()}
      </div>
    </div>
  );
};

export default RegisterScreen;