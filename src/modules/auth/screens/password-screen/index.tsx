"use client";

import { usePasswordResetContext } from "@/contexts/password-reset-context";
import EmailPhone from "@/modules/auth/components/email-phone";
import SuccessPasswordReset from "@/modules/auth/components/sucess-password-reset";
import { logo } from "@/constants/images";
import Image from "next/image";
import { Verification, NewPassword } from "@/shared/components";

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
      <div className="block md:hidden h-screen">{renderStep()}</div>

      {/* Layout Desktop (novo design centralizado) */}
      <div className="hidden md:flex min-h-screen items-center justify-center p-8 relative">
        {/* Logo WUNDU - fora do container, canto superior esquerdo */}
        <div className="absolute top-8 left-8 flex items-center gap-2">
          <Image src={logo} alt="Login Illustration" className="w-full" />
          <span className="text-2xl font-bold text-gray-800">WUNDU</span>
        </div>

        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl px-16 py-30 relative">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default PasswordResetScreen;
