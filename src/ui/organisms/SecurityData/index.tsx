"use client";
import { useRegisterContext } from "@/contexts/useRegisterContext";
import Image from "next/image";
import { logo } from "@/constants/images";
import { Input as PasswordInput } from "@/ui/molecules";
import { Button } from "@/ui/atoms";
import { CTA } from "@/ui/molecules";
import { NavigationBack } from "@/ui/atoms";
import { useSecurityData } from "@/hooks/auth/useSecurityData";
import PasswordValidationFeedback from "@/ui/molecules/PasswordValidation";

const SecurityData = () => {
  const { prevStep, error } = useRegisterContext();
  const { form, setField, submit, passwordError, passwordValidation, contextError } =
    useSecurityData();

  const handleSubmit = submit;

  return (
    <div className="flex flex-col h-full justify-between items-center p-4 md:p-8">
      <div className="w-full flex-col flex md:flex-row md:items-center md:justify-between">
        <NavigationBack prev={prevStep} />
        <div className="w-6 h-6 md:hidden" />
        <Image src={logo} alt="Logo" className="w-12 h-12 md:hidden" />
      </div>
      <div className="w-full text-left md:w-2/3">
        <CTA
          title={"Segurança"}
          subtitle={"Crie uma senha e mantenha seus dados seguros."}
          variant="default"
        />
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-8 py-10 px-6 md:px-0 md:w-2/3"
      >
        <div>
          <PasswordInput
            id="password"
            label="Crie uma senha"
            type="password"
            value={form.password}
            onChange={(e) => setField("password", e.target.value)}
            placeholder="Digite sua senha"
            required
            isError={!!passwordError || !!contextError}
          />
          <PasswordValidationFeedback 
            validation={passwordValidation}
            showCriteria={form.password.length > 0}
          />
        </div>
        <PasswordInput
          id="confirmPassword"
          label="Repita a senha"
          type="password"
          value={form.confirmPassword}
          onChange={(e) => setField("confirmPassword", e.target.value)}
          placeholder="Digite sua senha novamente"
          required
          isError={!!passwordError || !!contextError}
        />
        {(passwordError || contextError) && (
          <p className="text-red-500 text-sm mt-2">{passwordError || contextError}</p>
        )}
        <Button type="submit" onClick={() => {}}>
          Finalizar cadastro
        </Button>
      </form>
    </div>
  );
};

export default SecurityData;
