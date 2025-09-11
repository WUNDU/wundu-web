'use client'
import { useRegisterContext } from "@/src/contexts/RegisterContext";
import PersonalData from "../organisms/PersonalData";
import SecurityData from "../organisms/SecurityData";
import Success from "../organisms/Success";

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
    <div className="h-screen w-screen bg-white flex justify-center items-center">
      <div className="w-full h-full md:w-2/3 md:h-auto md:max-w-2xl md:shadow-lg md:rounded-lg md:bg-white">
        {renderStep()}
      </div>
    </div>
  );
};

export default RegisterScreen;