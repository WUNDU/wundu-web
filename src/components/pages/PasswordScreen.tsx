'use client';

import { PasswordResetProvider, usePasswordResetContext } from "@/src/contexts/PasswordResetContext";
import Success from "../organisms/Success";
import EmailPhone from "../organisms/EmailPhone";
import Verification from "../organisms/Verification";
import NewPassword from "../organisms/NewPassword";

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
        return <Success />;
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
