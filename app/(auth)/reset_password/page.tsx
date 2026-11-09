"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components/ui";
import { AuthShell } from "@/components/auth/auth-shell";
import { loginIllustration } from "@/constants/images";
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
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, length);
    if (!pasted) return;
    onChange(pasted.padEnd(length, "").slice(0, length));
    const nextIndex = Math.min(pasted.length, length - 1);
    inputRefs.current[nextIndex]?.focus();
  };
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !e.currentTarget.value && index > 0)
      inputRefs.current[index - 1]?.focus();
  };
  const borderColorClass = isError
    ? "border-danger-300 bg-danger-300/5"
    : isSuccess
      ? "border-success bg-success/10"
      : "border-(--card-barras) bg-(--background)";
  return (
    <div className="flex flex-row gap-2.5 justify-center">
      {[...Array(length)].map((_, index) => (
        <input
          key={index}
          id={`code-input-${index}`}
          type="tel"
          inputMode="numeric"
          maxLength={1}
          aria-label={`Dígito ${index + 1} do código`}
          className={`h-12 w-12 rounded-lg border text-center font-manrope text-xl font-bold text-(--text-title) transition-all focus:border-primary-300 focus:outline-none focus:ring-4 focus:ring-primary-300/10 ${borderColorClass}`}
          value={value[index] || ""}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
        />
      ))}
    </div>
  );
};
import { ROUTES } from "@/constants/routes";
import {
  ArrowLeftIcon,
  CheckmarkIcon,
  ClockIcon,
  EmailFilledIcon,
} from "@/constants/icons";
import { usePasswordRecovery } from "@/hooks/use-password-recovery";

function StepHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header>
      <h1 className="font-manrope text-2xl font-bold tracking-tighter text-(--text-title) md:text-3xl">
        {title}
      </h1>
      <p className="mt-2 font-manrope text-sm font-medium text-(--text-description)">
        {subtitle}
      </p>
    </header>
  );
}

const NavigationBack: React.FC<{ prev?: () => void }> = ({ prev }) => {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={prev ?? (() => router.back())}
      className="group flex items-center gap-2 self-start font-manrope text-[10px] font-black uppercase tracking-[0.2em] text-(--text-description-60) transition-colors hover:text-(--text-title)"
      aria-label="Voltar"
    >
      <ArrowLeftIcon className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
      Voltar
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
  sendRequestEmail: (email: string) => Promise<{ success: boolean; retryAfter?: number }>;
}) {
  const [email, setEmail] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rateLimitSeconds, setRateLimitSeconds] = useState(0);

  useEffect(() => {
    if (rateLimitSeconds <= 0) return;
    const id = setTimeout(() => setRateLimitSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [rateLimitSeconds]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setIsError(true);
      return;
    }
    setIsError(false);
    setIsLoading(true);
    const result = await sendRequestEmail(email);
    setIsLoading(false);
    if (result.success) {
      setResetData({ phoneOrEmail: email });
      nextStep();
    } else {
      if (result.retryAfter) setRateLimitSeconds(result.retryAfter);
      setIsError(true);
    }
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <NavigationBack />
      <StepHeader
        title="Perdeu a sua senha?"
        subtitle="Se existir uma conta associada a este email, vais receber um código para redefinir a senha."
      />
      <form onSubmit={submit} className="flex w-full flex-col gap-4">
        <Input
          id="email"
          label="Email"
          type="email"
          leftIcon={<EmailFilledIcon className="h-5 w-5" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="exemplo@email.com"
          isError={isError}
          required
          autoFocus
          className="h-12 transition-all"
        />
        {isError && (
          <p className="-mt-2 px-1 font-manrope text-[11px] font-bold text-danger-300">
            Por favor, insira um endereço de email válido.
          </p>
        )}
        <Button
          variant="warning"
          type="submit"
          fullWidth
          loading={isLoading}
          disabled={rateLimitSeconds > 0}
          className="h-12 rounded-xl font-manrope text-sm font-extrabold shadow-sm transition-all active:scale-[0.98]"
        >
          {rateLimitSeconds > 0 ? `Aguarde ${rateLimitSeconds}s` : "Continuar"}
        </Button>
      </form>
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
  }) => Promise<{ success: boolean; errorMessage?: string; retryAfter?: number }>;
  sendRequestEmail: (email: string) => Promise<{ success: boolean; retryAfter?: number }>;
}) {
  const [code, setCode] = useState("");
  const [isCodeCorrect, setIsCodeCorrect] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [rateLimitSeconds, setRateLimitSeconds] = useState(0);

  useEffect(() => {
    if (rateLimitSeconds <= 0) return;
    const id = setTimeout(() => setRateLimitSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [rateLimitSeconds]);

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
      if (result.retryAfter) setRateLimitSeconds(result.retryAfter);
      setIsCodeIncorrect(true);
      setIsCodeCorrect(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <NavigationBack prev={prevStep} />
      <StepHeader
        title="Verificação do código"
        subtitle="Insira o código que foi enviado para o seu email nos campos abaixo."
      />
      <form onSubmit={submit} className="flex w-full flex-col gap-4">
        <CodeInput
          length={6}
          value={code}
          onChange={setCode}
          isError={isCodeIncorrect}
          isSuccess={isCodeCorrect}
        />
        {isCodeIncorrect && (
          <p className="px-1 text-center font-manrope text-[11px] font-bold text-danger-300">
            Código incorreto. Tente novamente.
          </p>
        )}
        <div className="flex items-center justify-between">
          <button
            type="button"
            disabled={isResending || timer > 0 || rateLimitSeconds > 0}
            onClick={async () => {
              if (!data.phoneOrEmail) return;
              setIsResending(true);
              const result = await sendRequestEmail(data.phoneOrEmail);
              setIsResending(false);
              if (result.success) resetTimer();
              else if (result.retryAfter) setRateLimitSeconds(result.retryAfter);
            }}
            className="font-manrope text-sm font-bold text-(--text-description) transition-colors hover:text-(--text-title) disabled:opacity-50"
          >
            {isResending ? "A reenviar..." : "Não recebi o código"}
          </button>
          <div
            className={`flex items-center font-manrope text-sm font-bold ${isRed ? "text-danger-300" : "text-(--text-description)"}`}
          >
            <ClockIcon className="mr-1 size-4" />
            {minutes.toString().padStart(2, "0")}:
            {seconds.toString().padStart(2, "0")}
          </div>
        </div>
        <Button
          variant="warning"
          type="submit"
          fullWidth
          loading={isLoading}
          disabled={rateLimitSeconds > 0}
          className="h-12 rounded-xl font-manrope text-sm font-extrabold shadow-sm transition-all active:scale-[0.98]"
        >
          {rateLimitSeconds > 0 ? `Aguarde ${rateLimitSeconds}s` : "Confirmar"}
        </Button>
      </form>
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
    otp: string;
    newPassword: string;
    confirmPassword: string;
  }) => Promise<{ success: boolean; retryAfter?: number }>;
}) {
  const [form, setFormState] = useState({ password: "", confirmPassword: "" });
  const [passwordValidation, setPasswordValidation] = useState(() =>
    validatePasswordDetailed(""),
  );
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rateLimitSeconds, setRateLimitSeconds] = useState(0);

  useEffect(() => {
    if (rateLimitSeconds <= 0) return;
    const id = setTimeout(() => setRateLimitSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [rateLimitSeconds]);

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
    setIsError(false);
    setErrorMessage("");
    const result = await resetPassword({
      email: data.phoneOrEmail!,
      otp: data.code!,
      newPassword: form.password,
      confirmPassword: form.confirmPassword,
    });
    setIsLoading(false);
    if (result.success) {
      setResetData({ newPassword: form.password });
      nextStep();
    } else {
      setIsError(true);
      if (result.retryAfter) {
        setRateLimitSeconds(result.retryAfter);
        setErrorMessage(`Demasiados pedidos. Aguarde ${result.retryAfter} segundos.`);
      } else {
        setErrorMessage("Não foi possível redefinir a senha. Tente novamente.");
      }
    }
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <NavigationBack prev={prevStep} />
      <StepHeader
        title="Criar uma nova senha"
        subtitle="Crie uma senha e mantenha seus dados seguros."
      />
      <form onSubmit={submit} className="flex w-full flex-col gap-4">

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
                  <div className="h-1 w-20 bg-(--card-barras) rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full transition-colors duration-500 ${
                        passwordValidation.isValid
                          ? "bg-success"
                          : "bg-secondary-300"
                      }`}
                      initial={{ width: 0 }}
                      animate={{
                        width: passwordValidation.isValid ? "100%" : "40%",
                      }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                  <span
                    className={`font-manrope text-[10px] font-bold uppercase tracking-wider ${
                      passwordValidation.isValid ? "text-success-text" : "text-(--text-description-60)"
                    }`}
                  >
                    {passwordValidation.isValid ? "Senha válida" : "Mínimo 6 caracteres"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 font-manrope text-[10px]">
                  <span className={`flex items-center gap-1 ${form.password.length >= 6 ? "text-success-text" : "text-(--text-description-60)"}`}>
                    {form.password.length >= 6 ? "✓" : "○"} Pelo menos 6 caracteres
                  </span>
                  <span className={`flex items-center gap-1 ${/[a-z]/.test(form.password) ? "text-success-text" : "text-(--text-description-60)"}`}>
                    {/[a-z]/.test(form.password) ? "✓" : "○"} Minúscula
                  </span>
                  <span className={`flex items-center gap-1 ${/[A-Z]/.test(form.password) ? "text-success-text" : "text-(--text-description-60)"}`}>
                    {/[A-Z]/.test(form.password) ? "✓" : "○"} Maiúscula
                  </span>
                  <span className={`flex items-center gap-1 ${/\d/.test(form.password) ? "text-success-text" : "text-(--text-description-60)"}`}>
                    {/\d/.test(form.password) ? "✓" : "○"} Número
                  </span>
                  <span className={`flex items-center gap-1 ${/[^da-zA-Z]/.test(form.password) ? "text-success-text" : "text-(--text-description-60)"}`}>
                    {/[^da-zA-Z]/.test(form.password) ? "✓" : "○"} Símbolo
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
          <p className="-mt-2 px-1 font-manrope text-[11px] font-bold text-danger-300">
            As senhas não correspondem.
          </p>
        )}
        {(isError || rateLimitSeconds > 0) && (
          <p className="px-1 text-center font-manrope text-[11px] font-bold text-danger-300">
            {errorMessage || "Não foi possível redefinir a senha. Tente novamente."}
          </p>
        )}
        <Button
          variant="warning"
          type="submit"
          fullWidth
          loading={isLoading}
          disabled={!passwordValidation.isValid || form.password !== form.confirmPassword || rateLimitSeconds > 0}
          className="h-12 rounded-xl font-manrope text-sm font-extrabold shadow-sm transition-all active:scale-[0.98]"
        >
          {rateLimitSeconds > 0 ? `Aguarde ${rateLimitSeconds}s` : "Continuar"}
        </Button>
      </form>
    </div>
  );
}

// ── Step 4: Success ──
function StepSuccess() {
  const router = useRouter();

  return (
    <div className="flex w-full flex-col items-center gap-6 py-4 text-center">
      <div className="flex size-24 items-center justify-center rounded-full bg-success/10">
        <CheckmarkIcon className="size-12 text-success" />
      </div>
      <div>
        <h1 className="font-manrope text-2xl font-bold tracking-tighter text-(--text-title)">
          Senha redefinida com sucesso!
        </h1>
        <p className="mx-auto mt-2 max-w-sm font-manrope text-sm font-medium text-(--text-description)">
          Tudo certo! Agora podes aceder à tua conta com a tua nova senha.
        </p>
      </div>
      <Button
        variant="warning"
        type="button"
        fullWidth
        onClick={() => router.push(ROUTES.LOGIN)}
        className="h-12 rounded-xl font-manrope text-sm font-extrabold shadow-sm transition-all active:scale-[0.98]"
      >
        Continuar
      </Button>
    </div>
  );
}

export default function PasswordReset() {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<PasswordResetData>({});
  const [timer, setTimer] = useState(600);
  const [isCodeIncorrect, setIsCodeIncorrect] = useState(false);

  const { sendRequestEmail, verifyOtp, resetPassword } = usePasswordRecovery();

  const setResetData = (newData: PasswordResetData) =>
    setData((prev) => ({ ...prev, ...newData }));
  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);
  const resetTimer = () => setTimer(600);

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
    <AuthShell
      visual={{
        title: "Acesso seguro, sempre.",
        description: "Recupera o acesso à tua conta em poucos passos.",
        illustration: loginIllustration,
        illustrationAlt: "Recuperar senha",
      }}
    >
      {renderStep()}
    </AuthShell>
  );
}
