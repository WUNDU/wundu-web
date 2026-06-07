"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button, Input, LogoType, TextInput } from "@/components/ui";
import { PasswordResetData } from "@/types/ui";
import { validatePasswordDetailed } from "@/utils/validation";
import { motion, AnimatePresence } from "framer-motion";

interface CodeInputProps {
  length: number;
  value: string;
  onChange: (value: string) => void;
  isError?: boolean;
  isSuccess?: boolean;
}

const CodeInput: React.FC<CodeInputProps> = ({
  length,
  value,
  onChange,
  isError = false,
  isSuccess = false,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const val = e.target.value;
    if (/[^0-9]/.test(val)) return;
    const newValue = value.slice(0, index) + val + value.slice(index + 1);
    onChange(newValue);
    if (val && index < length - 1) inputRefs.current[index + 1]?.focus();
  };
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !e.currentTarget.value && index > 0)
      inputRefs.current[index - 1]?.focus();
  };
  const borderColorClass = isError
    ? "border-red-500"
    : isSuccess
      ? "border-green-500"
      : "border-gray-300";
  return (
    <div className="flex flex-row gap-2.5 justify-center">
      {[...Array(length)].map((_, index) => (
        <TextInput
          label=""
          key={index}
          id={`code-input-${index}`}
          type="tel"
          className={`text-center rounded-lg w-12 h-12 text-3xl shadow-sm border ${borderColorClass}`}
          value={value[index] || ""}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          maxLength={1}
          inputMode="numeric"
        />
      ))}
    </div>
  );
};
import { ROUTES } from "@/constants/routes";
import { logo } from "@/constants/images";
import { ClockIcon, CheckmarkIcon } from "@/constants/icons";
import { usePasswordRecovery } from "@/hooks/use-password-recovery";

type CTAVariant = "landing" | "login" | "default";

interface CTAProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  buttonText?: string;
  onButtonClick?: () => void;
  showButton?: boolean;
  variant?: CTAVariant;
  className?: string;
}

const CTA: React.FC<CTAProps> = ({
  title,
  subtitle,
  buttonText = "Continuar",
  onButtonClick,
  showButton = false,
  variant = "default",
  className,
}) => {
  const containerClasses = [
    "flex flex-col items-center text-center",
    variant === "landing" ? "gap-6" : "gap-4",
    className || "",
  ]
    .filter(Boolean)
    .join(" ");
  const titleClasses = [
    "font-bold text-gray-900",
    variant === "landing" ? "text-3xl md:text-4xl" : "text-xl md:text-2xl",
  ].join(" ");
  const subtitleClasses = [
    "text-gray-600",
    variant === "landing" ? "text-base md:text-lg" : "text-sm md:text-base",
  ].join(" ");
  const buttonVariant = variant === "landing" ? "landing" : "primary";
  return (
    <div className={containerClasses}>
      <h2 className={titleClasses}>{title}</h2>
      {subtitle && <p className={subtitleClasses}>{subtitle}</p>}
      {showButton && (
        <div className="mt-2">
          <Button variant={buttonVariant as any} onClick={onButtonClick}>
            {buttonText}
          </Button>
        </div>
      )}
    </div>
  );
};

const NavigationBack: React.FC<{ prev?: () => void; color?: string }> = ({
  prev,
  color,
}) => {
  const router = useRouter();
  return (
    <button
      onClick={prev ?? (() => router.back())}
      className={`p-2 -ml-2 ${color ?? "text-gray-700"} hover:bg-gray-100 rounded-full transition-colors`}
      aria-label="Voltar"
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </button>
  );
};

// ── Step 1: Email ──
function StepEmailPhone({
  setResetData,
  nextStep,
  sendRequestEmail,
}: {
  setResetData: (d: PasswordResetData) => void;
  nextStep: () => void;
  sendRequestEmail: (email: string) => Promise<boolean>;
}) {
  const [email, setEmail] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setIsError(true);
      return;
    }
    setIsError(false);
    setIsLoading(true);
    const ok = await sendRequestEmail(email);
    setIsLoading(false);
    if (ok) {
      setResetData({ phoneOrEmail: email });
      nextStep();
    } else {
      setIsError(true);
    }
  };

  return (
    <div className="flex h-full flex-col gap-y-8 justify-between p-4 md:gap-y-6 md:justify-start md:p-0">
      <NavigationBack />
      <div className="w-full text-left md:text-center">
        <CTA
          title="Perdeu a sua senha?"
          subtitle="Digite seu endereço de email e enviaremos um código de verificação."
          variant="default"
        />
      </div>
      <form
        onSubmit={submit}
        className="flex w-full flex-col gap-y-8 px-4 md:px-0 md:gap-y-6"
      >
        <TextInput
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Digite seu email"
          isError={isError}
          required
        />
        {isError && (
          <p className="text-sm text-red-500 -mt-4 md:text-center">
            Por favor, insira um endereço de email válido.
          </p>
        )}
        <Button onClick={() => {}} type="submit" loading={isLoading}>
          Continuar
        </Button>
      </form>
      <div className="mt-auto h-1/4 md:hidden"></div>
    </div>
  );
}

// ── Step 2: Verification ──
function StepVerification({
  prevStep,
  nextStep,
  timer,
  resetTimer,
  isCodeIncorrect,
  setIsCodeIncorrect,
  data,
  setResetData,
  verifyOtp,
  sendRequestEmail,
}: {
  prevStep: () => void;
  nextStep: () => void;
  timer: number;
  resetTimer: () => void;
  isCodeIncorrect: boolean;
  setIsCodeIncorrect: (v: boolean) => void;
  data: PasswordResetData;
  setResetData: (d: PasswordResetData) => void;
  verifyOtp: (d: {
    email: string;
    otp: string;
  }) => Promise<{ success: boolean; errorMessage?: string }>;
  sendRequestEmail: (email: string) => Promise<boolean>;
}) {
  const [code, setCode] = useState("");
  const [isCodeCorrect, setIsCodeCorrect] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  const isRed = timer <= 30;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await verifyOtp({ email: data.phoneOrEmail!, otp: code });
    setIsLoading(false);
    if (result.success) {
      setIsCodeIncorrect(false);
      setIsCodeCorrect(true);
      setResetData({ code });
      setTimeout(() => {
        nextStep();
      }, 500);
    } else {
      setIsCodeIncorrect(true);
      setIsCodeCorrect(false);
    }
  };

  return (
    <div className="flex h-full flex-col gap-y-8 justify-between p-6 md:gap-y-6 md:justify-start md:p-0">
      <NavigationBack prev={prevStep} />
      <div className="w-full mt-10 md:mt-0 md:text-center">
        <CTA
          title="Verificação do Código"
          subtitle="Insira o código que foi enviado para o seu email nos campos abaixo."
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
          <button
            type="button"
            disabled={isResending || timer > 0}
            onClick={async () => {
              if (!data.phoneOrEmail) return;
              setIsResending(true);
              const ok = await sendRequestEmail(data.phoneOrEmail);
              setIsResending(false);
              if (ok) resetTimer();
            }}
            className="text-sm text-gray-600 disabled:opacity-50"
          >
            {isResending ? "A reenviar..." : "Não recebi o código"}
          </button>
          <div
            className={`flex items-center text-sm ${isRed ? "text-red-500" : "text-gray-600"}`}
          >
            <ClockIcon className="mr-1" />
            {minutes.toString().padStart(2, "0")}:
            {seconds.toString().padStart(2, "0")}
          </div>
        </div>
        <Button onClick={() => {}} type="submit" loading={isLoading}>
          Confirmar
        </Button>
      </form>
      <div className="mt-auto h-1/4 md:hidden"></div>
    </div>
  );
}

// ── Step 3: New Password ──
function StepNewPassword({
  prevStep,
  nextStep,
  setResetData,
  data,
  resetPassword,
}: {
  prevStep: () => void;
  nextStep: () => void;
  setResetData: (d: PasswordResetData) => void;
  data: PasswordResetData;
  resetPassword: (d: {
    email: string;
    newPassword: string;
    confirmPassword: string;
  }) => Promise<boolean>;
}) {
  const [form, setFormState] = useState({ password: "", confirmPassword: "" });
  const [passwordValidation, setPasswordValidation] = useState(() =>
    validatePasswordDetailed(""),
  );
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const setField = (field: "password" | "confirmPassword", value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    if (field === "password") {
      setPasswordValidation(validatePasswordDetailed(value));
    }
  };

  const showPasswordHint = isPasswordFocused || form.password.length > 0;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordValidation.isValid || form.password !== form.confirmPassword) {
      return;
    }
    setIsLoading(true);
    const ok = await resetPassword({
      email: data.phoneOrEmail!,
      newPassword: form.password,
      confirmPassword: form.confirmPassword,
    });
    setIsLoading(false);
    if (ok) {
      setResetData({ newPassword: form.password });
      nextStep();
    } else {
      setIsError(true);
    }
  };

  return (
    <div className="flex h-full md:max-w-xl flex-col gap-2.5 justify-between md:gap-6 md:justify-start md:p-0">
      <NavigationBack prev={prevStep} />
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
        <div className="flex flex-col gap-2">
          <Input
            id="password"
            label="Crie uma senha"
            type="password"
            value={form.password}
            onChange={(e) => setField("password", e.target.value)}
            onFocus={() => setIsPasswordFocused(true)}
            onBlur={() => setIsPasswordFocused(false)}
            placeholder="************"
            required
            isError={!passwordValidation.isValid && form.password.length > 0}
          />
          <AnimatePresence initial={false} mode="wait">
            {showPasswordHint && (
              <motion.div
                key="hint"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="flex flex-col gap-2 mt-2"
              >
                <div className="flex items-center gap-2">
                  <div className="h-1 w-20 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full transition-colors duration-500 ${
                        passwordValidation.isValid
                          ? "bg-green-500"
                          : "bg-yellow-400"
                      }`}
                      initial={{ width: 0 }}
                      animate={{
                        width: passwordValidation.isValid ? "100%" : "40%",
                      }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider ${
                      passwordValidation.isValid ? "text-green-600" : "text-slate-400"
                    }`}
                  >
                    {passwordValidation.isValid ? "Senha Forte" : "Segurança"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 text-[10px]">
                  <span className={`flex items-center gap-1 ${form.password.length >= 6 ? "text-green-600" : "text-slate-400"}`}>
                    {form.password.length >= 6 ? "✓" : "○"} +6
                  </span>
                  <span className={`flex items-center gap-1 ${/[A-Z]/.test(form.password) ? "text-green-600" : "text-slate-400"}`}>
                    {/[A-Z]/.test(form.password) ? "✓" : "○"} A-Z
                  </span>
                  <span className={`flex items-center gap-1 ${/[a-z]/.test(form.password) ? "text-green-600" : "text-slate-400"}`}>
                    {/[a-z]/.test(form.password) ? "✓" : "○"} a-z
                  </span>
                  <span className={`flex items-center gap-1 ${/[0-9]/.test(form.password) ? "text-green-600" : "text-slate-400"}`}>
                    {/[0-9]/.test(form.password) ? "✓" : "○"} 0-9
                  </span>
                  <span className={`flex items-center gap-1 ${/[@$!%*?&]/.test(form.password) ? "text-green-600" : "text-slate-400"}`}>
                    {/[@$!%*?&]/.test(form.password) ? "✓" : "○"} #!
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <Input
          id="confirmPassword"
          label="Repita a senha"
          type="password"
          value={form.confirmPassword}
          onChange={(e) => setField("confirmPassword", e.target.value)}
          placeholder="************"
          required
          isError={form.confirmPassword.length > 0 && form.password !== form.confirmPassword}
        />
        {form.confirmPassword.length > 0 && form.password !== form.confirmPassword && (
          <p className="text-sm text-red-500 text-center -mt-6">
            As senhas não correspondem.
          </p>
        )}
        {isError && (
          <p className="text-sm text-red-500 text-center">
            Não foi possível redefinir a senha. Tente novamente.
          </p>
        )}
        <Button onClick={() => {}} type="submit" loading={isLoading} disabled={!passwordValidation.isValid || form.password !== form.confirmPassword}>
          Continuar
        </Button>
      </form>
      <div className="mt-auto h-1/4 md:hidden"></div>
    </div>
  );
}

// ── Step 4: Success ──
function StepSuccess() {
  const router = useRouter();

  return (
    <div className="flex flex-col h-full justify-center items-center text-center p-8 md:p-0 md:gap-6">
      <div className="w-24 h-24 mb-8 md:mb-4 flex items-center justify-center rounded-full bg-green-100">
        <CheckmarkIcon className="w-16 h-16 text-green-500" />
      </div>
      <h1 className="text-3xl md:text-2xl font-bold text-gray-800">
        SENHA REDEFINIDA COM SUCESSO!
      </h1>
      <p className="mt-2 text-gray-600 max-w-sm mx-auto">
        Tudo certo! agora podes aceder a sua conta com a tua nova senha.
      </p>
      <div className="fixed bottom-0 left-0 right-0 p-4 md:static md:p-0 md:w-full md:max-w-sm">
        <Button onClick={() => router.push(ROUTES.LOGIN)} type="button">
          Continuar
        </Button>
      </div>
    </div>
  );
}

export default function PasswordReset() {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<PasswordResetData>({});
  const [timer, setTimer] = useState(300);
  const [isCodeIncorrect, setIsCodeIncorrect] = useState(false);

  const { sendRequestEmail, verifyOtp, resetPassword } = usePasswordRecovery();

  const setResetData = (newData: PasswordResetData) =>
    setData((prev) => ({ ...prev, ...newData }));
  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);
  const resetTimer = () => setTimer(300);

  useEffect(() => {
    let countdown: NodeJS.Timeout | null = null;
    if (currentStep === 2 && timer > 0) {
      countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => {
      if (countdown) clearInterval(countdown);
    };
  }, [currentStep, timer]);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepEmailPhone
            setResetData={setResetData}
            nextStep={nextStep}
            sendRequestEmail={sendRequestEmail}
          />
        );
      case 2:
        return (
          <StepVerification
            prevStep={prevStep}
            nextStep={nextStep}
            timer={timer}
            resetTimer={resetTimer}
            isCodeIncorrect={isCodeIncorrect}
            setIsCodeIncorrect={setIsCodeIncorrect}
            data={data}
            setResetData={setResetData}
            verifyOtp={verifyOtp}
            sendRequestEmail={sendRequestEmail}
          />
        );
      case 3:
        return (
          <StepNewPassword
            prevStep={prevStep}
            nextStep={nextStep}
            setResetData={setResetData}
            data={data}
            resetPassword={resetPassword}
          />
        );
      case 4:
        return <StepSuccess />;
      default:
        return (
          <StepEmailPhone
            setResetData={setResetData}
            nextStep={nextStep}
            sendRequestEmail={sendRequestEmail}
          />
        );
    }
  };

  return (
    <div className="min-h-screen w-screen bg-white md:bg-gray-100">
      <div className="block md:hidden h-screen">{renderStep()}</div>
      <div className="hidden md:flex min-h-screen items-center justify-center p-8 relative">
        <div className="absolute top-8 left-8 flex items-center gap-2">
          <div className="w-30">
            <LogoType />
          </div>
        </div>
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl px-16 py-30 relative">
          {renderStep()}
        </div>
      </div>
    </div>
  );
}
