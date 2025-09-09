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
    <div className="h-screen w-screen bg-white">
      {renderStep()}
    </div>
  );
};

export default RegisterScreen