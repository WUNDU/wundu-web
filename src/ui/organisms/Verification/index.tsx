"use client";

import { CTA } from "@/ui/molecules";
import { Button } from "@/ui/atoms";
import { usePasswordResetContext } from "@/contexts/PasswordResetContext";
import { Header } from "@/ui/organisms";
import CodeInput from "@/ui/molecules/InputCode";
import { ROUTES } from "@/constants/routes";
import Link from "next/link";
import { ClockIcon } from "@/constants/icons";
import { NavigationBack } from "@/ui/atoms";
import { useVerification } from "@/hooks/auth/useVerification";

const Verification = () => {
  const { prevStep } = usePasswordResetContext();
  const {
    code,
    setCode,
    isCodeCorrect,
    isCodeIncorrect,
    minutes,
    seconds,
    isRed,
    resetTimer,
    submit,
  } = useVerification();

  return (
    <div className="flex h-full flex-col gap-y-8 justify-between p-6 md:gap-y-6 md:justify-start md:p-0">
      <NavigationBack prev={prevStep} />
      {/* Header - apenas mobile */}
      <div className="block md:hidden">
        <Header title="Verificação do Código" onBack={prevStep} />
      </div>

      <div className="w-full mt-10 md:mt-0 md:text-center">
        <CTA
          title="Verificação do Código"
          subtitle="Insira o código que foi enviado para o seu nº telefônico nos campos abaixo."
          variant="default"
        />
      </div>

      <form
        onSubmit={submit}
        className="flex w-full flex-col gap-4 px-4 md:px-0 md:gap-6"
      >
        <CodeInput
          length={6}
          value={code}
          onChange={setCode}
          isError={isCodeIncorrect}
          isSuccess={isCodeCorrect}
        />
        {isCodeIncorrect && (
          <p className="text-sm text-red-500 text-center">
            Código incorreto. Tente novamente.
          </p>
        )}
        <div className="flex items-center justify-between">
          <Link
            href={ROUTES.RESEND_CODE}
            className="text-sm text-gray-600"
            onClick={resetTimer}
          >
            Não recebi o código
          </Link>
          <div className={`flex items-center text-sm ${isRed ? "text-red-500" : "text-gray-600"}`}>
            <ClockIcon className="mr-1" />
            {minutes.toString().padStart(2, "0")}:
            {seconds.toString().padStart(2, "0")}
          </div>
        </div>
        <Button onClick={() => {}} type="submit">
          Confirmar
        </Button>

        {/* Botão Voltar apenas para desktop */}
      </form>

      {/* Spacer apenas para mobile */}
      <div className="mt-auto h-1/4 md:hidden"></div>
    </div>
  );
};

export default Verification;
