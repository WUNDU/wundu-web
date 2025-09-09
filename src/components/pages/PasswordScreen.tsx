'use client';

import { usePasswordResetContext } from "@/src/contexts/PasswordResetContext";
import EmailPhone from "../organisms/EmailPhone";
import Verification from "../organisms/Verification";
import NewPassword from "../organisms/NewPassword";
import SuccessPasswordReset from "../organisms/SucessPasswordReset";

const PasswordResetScreen = () => {
  const { currentStep } = usePasswordResetContext();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <EmailPhone />;
      case 2:
        return <Verification />;
      case 3:
        return <NewPassword />;
      case 4:
        return <SuccessPasswordReset />;
      default:
        return <EmailPhone />;
    }
  };

  return (
    <div className="h-screen w-screen bg-white">
      {renderStep()}
    </div>
  );
};

export default PasswordResetScreen;
