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
    <div className="min-h-screen w-screen bg-white md:bg-gray-100">
      {/* Layout Mobile (mantém o original) */}
      <div className="block md:hidden h-screen">
        {renderStep()}
      </div>

      {/* Layout Desktop (novo design centralizado) */}
      <div className="hidden md:flex min-h-screen items-center justify-center p-8">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default PasswordResetScreen;
