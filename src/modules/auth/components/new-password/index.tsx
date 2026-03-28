"use client";

import { CTA } from "@/shared/components";
import { Input as PasswordInput } from "@/shared/components";
import { Button } from "@/shared/components";
import { usePasswordResetContext } from "@/contexts/password-reset-context";
import { Header } from "@/shared/components";
import { NavigationBack } from "@/shared/components";
import { useNewPassword } from "@/hooks/auth/use-new-password";

const NewPassword = () => {
  const { prevStep } = usePasswordResetContext();
  const { form, passwordsMatch, setField, submit } = useNewPassword();

  return (
    <div className="flex h-full md:max-w-xl  flex-col gap-2.5 justify-between md:gap-6 md:justify-start md:p-0">
      <NavigationBack prev={prevStep} />
      {/* Header - apenas mobile */}
      <div className="block md:hidden">
        <Header title="Criar uma nova senha" onBack={prevStep} />
      </div>

      <div className="w-full text-left md:text-center">
        <CTA
          title="Criar uma nova senha"
          subtitle="Crie uma senha e mantenha seus dados seguros."
          variant="default"
        />
      </div>

      <form
        onSubmit={submit}
        className="flex w-full flex-col gap-8 px-4 md:px-0 md:gap-6"
      >
        <PasswordInput
          id="password"
          label="Crie uma senha"
          type="password"
          value={form.password}
          onChange={(e) => setField("password", e.target.value)}
          placeholder="************"
          required
          isError={!passwordsMatch}
        />
        <PasswordInput
          id="confirmPassword"
          label="Repita a senha"
          type="password"
          value={form.confirmPassword}
          onChange={(e) => setField("confirmPassword", e.target.value)}
          placeholder="************"
          required
          isError={!passwordsMatch}
        />
        {!passwordsMatch && (
          <p className="text-sm text-red-500 text-center">
            As senhas não correspondem.
          </p>
        )}
        <Button onClick={() => {}} type="submit">
          Continuar
        </Button>
      </form>

      {/* Spacer apenas para mobile */}
      <div className="mt-auto h-1/4 md:hidden"></div>
    </div>
  );
};

export default NewPassword;
