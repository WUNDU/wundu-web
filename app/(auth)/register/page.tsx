"use client";

import React, { useState, useEffect, forwardRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { wunduToast } from "@/utils/toast";
import { ROUTES } from "@/constants/routes";
import { Button, Input, LoadingSpinner, LogoType } from "@/components/ui";
import { useUserStore } from "@/store/user-store";
import {
  validateEmail,
  validatePhoneNumber,
  validatePasswordDetailed,
  type PasswordValidation,
} from "@/utils/validation";
import {
  CheckmarkIcon,
  MoneyBagIcon,
  ChartIcon,
  GoalsIcon,
  ProfileIcon,
  EmailIcon,
  SecurityIcon,
  ArrowLeftIcon,
} from "@/constants/icons";

interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  isError?: boolean;
  onChange?: (value: string) => void;
}

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ label, placeholder = "Digite seu número de telefone", value = "", onChange, isError = false, required = false, ...props }, ref) => {
    const [selectedCountry, setSelectedCountry] = useState("+244");
    const countries = [{ code: "+244", name: "Angola", flag: "🇦🇴" }];

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let phoneNumber = e.target.value.replace(/\D/g, '');
      if (phoneNumber.length > 9) phoneNumber = phoneNumber.slice(0, 9);
      onChange?.(`${selectedCountry} ${phoneNumber}`);
    };

    const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newCountryCode = e.target.value;
      setSelectedCountry(newCountryCode);
      const phoneOnly = typeof value === 'string' ? value.replace(/^\+\d+\s*/, '') : '';
      onChange?.(`${newCountryCode} ${phoneOnly}`);
    };

    const phoneOnly = typeof value === 'string' ? value.replace(/^\+\d+\s*/, '') : '';
    const borderClass = isError ? "border-red-500" : "border-gray-300";
    const ringClass = isError ? "focus:ring-red-500" : "focus:ring-blue-500";

    return (
      <div className="flex w-full flex-col gap-2">
        {label && <label className="text-gray-600 text-sm font-medium">{label}</label>}
        <div className="flex">
          <select
            value={selectedCountry}
            onChange={handleCountryChange}
            className={`rounded-l-xl border ${borderClass} px-3 py-3 text-gray-800 focus:outline-none focus:ring-2 ${ringClass} bg-gray-50 min-w-[100px]`}
          >
            {countries.map((country) => (
              <option key={country.code} value={country.code}>{country.flag} {country.code}</option>
            ))}
          </select>
          <input
            ref={ref}
            type="tel"
            placeholder={placeholder}
            value={phoneOnly}
            onChange={handlePhoneChange}
            required={required}
            className={`w-full rounded-r-xl border-l-0 border ${borderClass} px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 ${ringClass}`}
            {...props}
          />
        </div>
      </div>
    );
  }
);
PhoneInput.displayName = "PhoneInput";

/**
 * RegisterPage - Interface Design Standard
 *
 * Signature: Multi-step stability + Unified Input Icons.
 * Intent: Secure and professional onboarding.
 * Depth: Fixed 660px height to prevent layout shifts.
 */
const RegisterPage = () => {
  const {
    currentStep,
    prevStep,
    nextStep,
    data,
    loginUser,
    clearError,
    setRegisterData,
    registerUser,
    error,
  } = useUserStore();
  const router = useRouter();

  // Clear global auth errors on mount
  useEffect(() => {
    clearError();
  }, [clearError]);

  // ── Personal Data (Step 1) state ──
  const [personalForm, setPersonalFormState] = useState({
    name: data.name || "",
    email: data.email || "",
    phone: data.phone || "",
  });
  const [personalErrors, setPersonalErrors] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const setPersonalField = (
    field: "name" | "email" | "phone",
    value: string,
  ) => {
    setPersonalFormState((prev) => ({ ...prev, [field]: value }));
    if (personalErrors[field]) {
      setPersonalErrors((prev) => ({ ...prev, [field]: "" }));
    }
    clearError();
  };

  const submitPersonal = (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;
    const nextErrors = { name: "", email: "", phone: "" };

    if (!personalForm.name || personalForm.name.trim().length < 3) {
      nextErrors.name = "Por favor, insira seu nome completo";
      valid = false;
    }
    if (!validateEmail(personalForm.email)) {
      nextErrors.email = "Por favor, insira um email válido";
      valid = false;
    }
    if (!validatePhoneNumber(personalForm.phone)) {
      nextErrors.phone = "Por favor, insira um número de telefone válido";
      valid = false;
    }

    setPersonalErrors(nextErrors);
    if (!valid) return;

    setRegisterData(personalForm);
    nextStep();
  };

  // ── Security Data (Step 2) state ──
  const [securityForm, setSecurityFormState] = useState({
    password: data.password || "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordValidation, setPasswordValidation] =
    useState<PasswordValidation>(
      validatePasswordDetailed(data.password || ""),
    );
  const contextError = error;

  const setSecurityField = (
    field: "password" | "confirmPassword",
    value: string,
  ) => {
    setSecurityFormState((prev) => ({ ...prev, [field]: value }));
    if (field === "password") {
      setPasswordValidation(validatePasswordDetailed(value));
      if (passwordError) setPasswordError("");
      if (error) clearError();
    }
    if (field === "confirmPassword" && passwordError) {
      setPasswordError("");
      if (error) clearError();
    }
  };

  const submitSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    clearError();
    const validation = validatePasswordDetailed(securityForm.password);
    if (!validation.isValid) {
      setPasswordError("A senha não cumpre todos os requisitos de segurança.");
      return;
    }
    if (securityForm.password !== securityForm.confirmPassword) {
      setPasswordError("As senhas digitadas não são iguais.");
      return;
    }
    setPasswordError("");
    setIsSubmitting(true);
    try {
      await registerUser({ ...data, password: securityForm.password });
      setRegisterData({ password: securityForm.password });
      nextStep();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Falha ao concluir o cadastro.";
      wunduToast.error("Erro no cadastro", { description: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── UI state ──
  const [isVisible, setIsVisible] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [autoLoginError, setAutoLoginError] = useState<string | null>(null);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  // Announce success screen
  useEffect(() => {
    if (currentStep === 3) {
      wunduToast.success("Cadastro concluído!", {
        description: `Bem-vindo${data.name ? `, ${data.name}` : ""}. A sua conta está pronta.`,
      });
    }
  }, [currentStep, data.name]);

  // Success screen animations
  useEffect(() => {
    if (currentStep === 3) {
      const t = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(t);
    } else {
      setIsVisible(false);
    }
  }, [currentStep]);

  const handleContinue = async () => {
    if (isLoggingIn) return;
    if (!data.email || !data.password) {
      const msg = "Credenciais não encontradas. Faça login manualmente.";
      setAutoLoginError(msg);
      wunduToast.error("Credenciais em falta", { description: msg });
      return;
    }
    setAutoLoginError(null);
    setIsLoggingIn(true);
    try {
      await loginUser(data.email, data.password);
      wunduToast.success("Sessão iniciada!", {
        description: "A redirecionar...",
      });
      router.replace(ROUTES.HOME);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Não foi possível entrar. Tente manualmente.";
      setAutoLoginError(msg);
      wunduToast.error("Falha na entrada", { description: msg });
    } finally {
      setIsLoggingIn(false);
    }
  };

  // ── Inline PasswordValidationFeedback ──
  const passwordCriteriaList = [
    {
      key: "minLength",
      label: "8+ chars",
      isValid: passwordValidation.criteria.minLength,
    },
    {
      key: "hasLowercase",
      label: "a-z",
      isValid: passwordValidation.criteria.hasLowercase,
    },
    {
      key: "hasUppercase",
      label: "A-Z",
      isValid: passwordValidation.criteria.hasUppercase,
    },
    {
      key: "hasNumber",
      label: "0-9",
      isValid: passwordValidation.criteria.hasNumber,
    },
    {
      key: "hasSpecialChar",
      label: "!@#",
      isValid: passwordValidation.criteria.hasSpecialChar,
    },
  ];
  const showPasswordCriteria =
    isPasswordFocused || securityForm.password.length > 0;

  return (
    <div className="flex min-h-screen flex-col bg-white md:bg-[#fafafa]">
      {/* Brand Header */}
      <header className="flex h-16 shrink-0 items-center justify-center px-8 md:justify-start md:px-12">
        <Link
          href={ROUTES.LANDINGPAGE}
          className="transition-opacity hover:opacity-80"
        >
          <div className="w-32">
            <LogoType />
          </div>
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center p-0 md:p-8">
        <div className="w-full max-w-120">
          {/* Surface Container - Stable height (660px) */}
          <div className="flex w-full flex-col bg-white md:h-165 md:rounded-3xl md:border md:border-slate-200/50 md:shadow-[0_1px_2px_rgba(0,0,0,0.01),0_8px_16px_rgba(0,0,0,0.02)] overflow-hidden md:overflow-visible">
            <div className="flex flex-1 flex-col justify-center px-8 py-10 sm:px-12 md:px-14">
              {/* Progress System */}
              {currentStep < 3 && (
                <div className="flex justify-center gap-2 mb-10">
                  {[1, 2].map((s) => (
                    <div
                      key={s}
                      className={`h-1 rounded-full transition-all duration-300 ${
                        s === currentStep
                          ? "w-12 bg-yellow-400"
                          : s < currentStep
                            ? "w-6 bg-slate-900"
                            : "w-6 bg-slate-100"
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* ── Step 1: Personal Data ── */}
              {currentStep === 1 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <header className="mb-8">
                    <h2 className="text-2xl font-bold tracking-tighter text-slate-900 md:text-3xl">
                      Criar conta
                    </h2>
                    <p className="mt-2 text-sm font-medium text-slate-500">
                      Inicie sua jornada para a liberdade financeira.
                    </p>
                  </header>

                  <form
                    onSubmit={submitPersonal}
                    className="flex flex-col gap-5"
                    noValidate
                  >
                    <div className="space-y-1">
                      <Input
                        id="name"
                        label="Nome completo"
                        type="text"
                        leftIcon={<ProfileIcon className="w-5 h-5" />}
                        value={personalForm.name}
                        onChange={(e) =>
                          setPersonalField("name", e.target.value)
                        }
                        placeholder="Seu nome"
                        required
                        isError={!!personalErrors.name}
                        className="h-11 border-slate-200 bg-slate-50/50 text-[14px] transition-all focus:border-slate-900 focus:bg-white"
                      />
                      {personalErrors.name && (
                        <p className="text-[11px] font-bold text-red-600">
                          {personalErrors.name}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <Input
                        id="email"
                        label="Email"
                        type="email"
                        leftIcon={<EmailIcon className="w-5 h-5" />}
                        value={personalForm.email}
                        onChange={(e) =>
                          setPersonalField("email", e.target.value)
                        }
                        placeholder="exemplo@email.com"
                        required
                        isError={!!personalErrors.email}
                        className="h-11 border-slate-200 bg-slate-50/50 text-[14px] transition-all focus:border-slate-900 focus:bg-white"
                      />
                      {personalErrors.email && (
                        <p className="text-[11px] font-bold text-red-600">
                          {personalErrors.email}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <PhoneInput
                        id="phone"
                        label="Nº de telefone"
                        value={personalForm.phone}
                        onChange={(value) => setPersonalField("phone", value)}
                        placeholder="Seu número"
                        required
                        isError={!!personalErrors.phone}
                      />
                      {personalErrors.phone && (
                        <p className="text-[11px] font-bold text-red-600">
                          {personalErrors.phone}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      variant="warning"
                      className="h-11 mt-4 font-extrabold shadow-sm active:scale-[0.98]"
                    >
                      Próximo passo
                    </Button>
                  </form>

                  <footer className="mt-10 border-t border-slate-100 pt-8 text-center">
                    <p className="text-sm font-medium text-slate-500">
                      Já possui uma conta?{" "}
                      <Link
                        href={ROUTES.LOGIN}
                        className="font-bold text-slate-900 hover:underline decoration-yellow-400 decoration-2 underline-offset-4"
                      >
                        Fazer login
                      </Link>
                    </p>
                  </footer>
                </div>
              )}

              {/* ── Step 2: Security ── */}
              {currentStep === 2 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={isSubmitting}
                    className="group mb-8 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-900 transition-colors disabled:opacity-50"
                  >
                    <ArrowLeftIcon className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                    Voltar
                  </button>

                  <header className="mb-8">
                    <h2 className="text-2xl font-bold tracking-tighter text-slate-900 md:text-3xl">
                      Segurança
                    </h2>
                    <p className="mt-2 text-sm font-medium text-slate-500">
                      Proteja sua conta com uma senha forte.
                    </p>
                  </header>

                  <form
                    onSubmit={submitSecurity}
                    className="flex flex-col gap-5"
                    noValidate
                  >
                    <div className="relative space-y-2">
                      <Input
                        id="password"
                        label="Crie uma senha"
                        type="password"
                        leftIcon={<SecurityIcon className="w-5 h-5" />}
                        value={securityForm.password}
                        onChange={(e) =>
                          setSecurityField("password", e.target.value)
                        }
                        onFocus={() => setIsPasswordFocused(true)}
                        onBlur={() => setIsPasswordFocused(false)}
                        placeholder="Sua senha"
                        required
                        isError={!!passwordError || !!contextError}
                        className="h-11 border-slate-200 bg-slate-50/50 text-[14px] transition-all focus:border-slate-900 focus:bg-white"
                      />
                      {/* Inline PasswordValidationFeedback */}
                      <div className="mt-2 px-1">
                        <AnimatePresence initial={false}>
                          {showPasswordCriteria && (
                            <motion.div
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              className="flex flex-wrap gap-x-3 gap-y-1.5"
                            >
                              {passwordCriteriaList.map((criterion) => (
                                <div
                                  key={criterion.key}
                                  className="flex items-center gap-1.5"
                                >
                                  <div
                                    className={`flex h-3.5 w-3.5 items-center justify-center rounded-full transition-colors duration-300 ${
                                      criterion.isValid
                                        ? "bg-green-500 text-white"
                                        : "bg-slate-200 text-slate-400"
                                    }`}
                                  >
                                    {criterion.isValid ? (
                                      <CheckmarkIcon className="h-2 w-2" />
                                    ) : (
                                      <div className="h-1 w-1 rounded-full bg-current" />
                                    )}
                                  </div>
                                  <span
                                    className={`text-[10px] font-bold uppercase tracking-tight transition-colors duration-300 ${
                                      criterion.isValid
                                        ? "text-green-600"
                                        : "text-slate-400"
                                    }`}
                                  >
                                    {criterion.label}
                                  </span>
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    <Input
                      id="confirmPassword"
                      label="Confirme a senha"
                      type="password"
                      leftIcon={<SecurityIcon className="w-5 h-5" />}
                      value={securityForm.confirmPassword}
                      onChange={(e) =>
                        setSecurityField("confirmPassword", e.target.value)
                      }
                      placeholder="Repita sua senha"
                      required
                      isError={!!passwordError || !!contextError}
                      className="h-11 border-slate-200 bg-slate-50/50 text-[14px] transition-all focus:border-slate-900 focus:bg-white"
                    />

                    {/* Reserved Space for Feedback */}
                    <div className="min-h-8 flex items-center">
                      {(passwordError || contextError) && (
                        <p className="text-[11px] font-bold text-red-600">
                          {passwordError || contextError}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      variant="warning"
                      loading={isSubmitting}
                      disabled={isSubmitting}
                      className="h-11 font-extrabold shadow-sm active:scale-[0.98]"
                    >
                      {isSubmitting ? "A processar..." : "Finalizar cadastro"}
                    </Button>
                  </form>
                </div>
              )}

              {/* ── Step 3: Success ── */}
              {currentStep === 3 && (
                <div className="flex flex-col items-center text-center gap-6 py-4 animate-in fade-in zoom-in-95 duration-700">
                  <div
                    className={`transition-all duration-1000 ${
                      isVisible ? "scale-100 opacity-100" : "scale-75 opacity-0"
                    }`}
                  >
                    <div className="w-24 h-24 flex items-center justify-center rounded-full bg-slate-50 border border-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
                      <CheckmarkIcon className="w-10 h-10 text-slate-900" />
                    </div>
                  </div>

                  <div
                    className={`transition-all duration-1000 delay-300 ${
                      isVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4"
                    }`}
                  >
                    <h2 className="text-2xl font-bold tracking-tighter text-slate-900 md:text-3xl">
                      Cadastro concluído!
                    </h2>
                    <p className="mt-3 text-sm font-medium text-slate-500 max-w-xs mx-auto">
                      Bem-vindo,{" "}
                      <span className="font-bold text-slate-900">
                        {data.name}
                      </span>
                      . Sua jornada financeira começa agora.
                    </p>
                  </div>

                  <div
                    className={`flex gap-4 transition-all duration-1000 delay-500 ${
                      isVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4"
                    }`}
                  >
                    {(
                      [
                        { Icon: MoneyBagIcon, color: "text-slate-600" },
                        { Icon: ChartIcon, color: "text-slate-600" },
                        { Icon: GoalsIcon, color: "text-slate-600" },
                      ] as const
                    ).map(({ Icon, color }, i) => (
                      <div
                        key={i}
                        className="w-12 h-12 flex items-center justify-center rounded-full bg-white border border-slate-100 shadow-sm transition-transform hover:scale-110"
                      >
                        <Icon className={`w-6 h-6 ${color}`} />
                      </div>
                    ))}
                  </div>

                  {autoLoginError && (
                    <div className="rounded-lg bg-red-50 p-3">
                      <p className="text-xs font-bold text-red-600">
                        {autoLoginError}
                      </p>
                    </div>
                  )}

                  <div
                    className={`w-full mt-4 transition-all duration-1000 delay-700 ${
                      isVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4"
                    }`}
                  >
                    <Button
                      onClick={handleContinue}
                      type="button"
                      variant="warning"
                      loading={isLoggingIn}
                      disabled={isLoggingIn}
                      className="w-full h-12 font-extrabold shadow-sm active:scale-[0.98]"
                    >
                      {isLoggingIn ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        "Aceder à plataforma"
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Legal Footer */}
          <footer className="mt-8 px-8 text-center">
            <p className="text-[10px] leading-relaxed text-slate-400 font-medium max-w-sm mx-auto">
              Ao cadastrar, você aceita nossos{" "}
              <Link
                href={ROUTES.LEGAL}
                className="text-slate-500 hover:text-slate-900 transition-colors underline underline-offset-2"
              >
                Termos
              </Link>{" "}
              e{" "}
              <Link
                href={ROUTES.LEGAL}
                className="text-slate-500 hover:text-slate-900 transition-colors underline underline-offset-2"
              >
                Privacidade
              </Link>
              .
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;
