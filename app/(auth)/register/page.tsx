"use client";

import React, { useState, useEffect, forwardRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { wunduToast } from "@/utils/toast";
import { ROUTES } from "@/constants/routes";
import { Button, Input, LogoType } from "@/components/ui";
import { useUserStore } from "@/store/user-store";
import { useAuth } from "@/hooks/use-auth";
import { GoogleButton } from "@/components/auth/google-button";
import { getApiErrorMessage, getRegisterErrorField } from "@/utils/api-error";
import {
  buildVerifyPendingUrl,
  setPendingVerificationEmail,
} from "@/utils/pending-verification";
import {
  validateEmail,
  validatePhoneNumber,
  validatePasswordDetailed,
  validateName,
} from "@/utils/validation";
import { identifyUser, captureEvent, captureException } from "@/lib/analytics";
import {
  ProfileIcon,
  EmailFilledIcon,
  KeyIcon,
  ArrowLeftIcon,
} from "@/constants/icons";

// ─── PhoneInput ───────────────────────────────────────────────────────────────

interface PhoneInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> {
  label?: string;
  isError?: boolean;
  onChange?: (value: string) => void;
}

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      label,
      placeholder = "Digite seu número de telefone",
      value = "",
      onChange,
      isError = false,
      required = false,
      ...props
    },
    ref,
  ) => {
    const [selectedCountry, setSelectedCountry] = useState("+244");
    const [isFocused, setIsFocused] = useState(false);
    const countries = [{ code: "+244", name: "Angola", flag: "🇦🇴" }];

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let phoneNumber = e.target.value.replace(/\D/g, "");
      if (phoneNumber.length > 9) phoneNumber = phoneNumber.slice(0, 9);
      onChange?.(`${selectedCountry} ${phoneNumber}`);
    };

    const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newCountryCode = e.target.value;
      setSelectedCountry(newCountryCode);
      const phoneOnly =
        typeof value === "string" ? value.replace(/^\+\d+\s*/, "") : "";
      onChange?.(`${newCountryCode} ${phoneOnly}`);
    };

    const phoneOnly =
      typeof value === "string" ? value.replace(/^\+\d+\s*/, "") : "";

    const stateClasses = isError
      ? "border-red-500 bg-red-50/30"
      : isFocused
        ? "border-[#003cc3] bg-white ring-4 ring-[#003cc3]/[0.06]"
        : "border-slate-200 bg-slate-50/50";

    return (
      <div className="flex w-full flex-col gap-2">
        {label && (
          <label
            className={`text-sm font-semibold transition-colors duration-150 ${
              isError
                ? "text-red-600"
                : isFocused
                  ? "text-[#003cc3]"
                  : "text-slate-500"
            }`}
          >
            {label}
          </label>
        )}
        <div
          className={`flex h-12 rounded-lg border transition-all duration-150 overflow-hidden ${stateClasses}`}
        >
          <div className="relative border-r border-slate-100 bg-slate-50/30">
            <select
              value={selectedCountry}
              onChange={handleCountryChange}
              className="h-full appearance-none bg-transparent px-3 text-sm font-bold text-slate-800 focus:outline-none cursor-pointer pr-8"
            >
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.flag} {country.code}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-slate-400">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
          <input
            ref={ref}
            type="tel"
            placeholder={placeholder}
            value={phoneOnly}
            onChange={handlePhoneChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            required={required}
            className="w-full bg-transparent px-4 text-[15px] text-slate-900 placeholder:text-slate-400 focus:outline-none"
            {...props}
          />
        </div>
      </div>
    );
  },
);
PhoneInput.displayName = "PhoneInput";

// ─── Shared animation config ──────────────────────────────────────────────────

const stepTransition = { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const };
const stepInitial = { opacity: 0, x: 20 };
const stepAnimate = { opacity: 1, x: 0 };

// ─── RegisterPage ─────────────────────────────────────────────────────────────

const RegisterPage = () => {
  const { currentStep, prevStep, nextStep, data, setRegisterData } =
    useUserStore();
  const { registerUser, error, clearError } = useAuth();
  const router = useRouter();

  useEffect(() => {
    clearError();
  }, [clearError]);

  // ── Step 1: Personal Data ──────────────────────────────────────────────────

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
    const normalized = field === "email" ? value.toLowerCase() : value;
    setPersonalFormState((prev) => ({ ...prev, [field]: normalized }));
    if (personalErrors[field]) {
      setPersonalErrors((prev) => ({ ...prev, [field]: "" }));
    }
    if (submitError) setSubmitError("");
    clearError();
  };

  const submitPersonal = (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;
    const nextErrors = { name: "", email: "", phone: "" };

    if (!personalForm.name.trim()) {
      nextErrors.name = "Por favor, insira o seu nome completo";
      valid = false;
    } else if (!validateName(personalForm.name)) {
      nextErrors.name =
        "Nome deve ter pelo menos 4 letras e não pode conter números";
      valid = false;
    }

    if (!personalForm.email.trim()) {
      nextErrors.email = "Por favor, insira o seu e-mail";
      valid = false;
    } else if (!validateEmail(personalForm.email)) {
      nextErrors.email = "Por favor, insira um email válido";
      valid = false;
    }

    const phoneDigits = personalForm.phone.replace(/\D/g, "");
    if (!personalForm.phone.trim() || phoneDigits.length <= 3) {
      nextErrors.phone = "Por favor, insira o seu número de telefone";
      valid = false;
    } else if (!validatePhoneNumber(personalForm.phone)) {
      nextErrors.phone =
        "Número inválido. Use formato angolano: +244 9XX XXX XXX";
      valid = false;
    }

    setPersonalErrors(nextErrors);
    if (!valid) return;

    setRegisterData(personalForm);
    captureEvent("user_registration_step_completed", { step: 1 });
    nextStep();
  };

  // ── Step 2: Security ───────────────────────────────────────────────────────

  const [securityForm, setSecurityFormState] = useState({
    password: data.password || "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState(() =>
    validatePasswordDetailed(data.password || ""),
  );
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const contextError = submitError || error;

  const setSecurityField = (
    field: "password" | "confirmPassword",
    value: string,
  ) => {
    setSecurityFormState((prev) => ({ ...prev, [field]: value }));
    if (field === "password") {
      setPasswordValidation(validatePasswordDetailed(value));
      if (passwordError) setPasswordError("");
      if (submitError) setSubmitError("");
      if (error) clearError();
    }
    if (field === "confirmPassword" && passwordError) {
      setPasswordError("");
      if (submitError) setSubmitError("");
      if (error) clearError();
    }
  };

  const submitSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    clearError();
    setSubmitError("");
    setPersonalErrors({ name: "", email: "", phone: "" });

    const validation = validatePasswordDetailed(securityForm.password);
    if (!validation.isValid) {
      setPasswordError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (securityForm.password !== securityForm.confirmPassword) {
      setPasswordError(
        !securityForm.confirmPassword
          ? "Por favor, confirme a sua senha."
          : "As senhas digitadas não são iguais.",
      );
      return;
    }

    setPasswordError("");
    setIsSubmitting(true);

    try {
      const ok = await registerUser({
        ...data,
        password: securityForm.password,
      });

      if (ok) {
        setRegisterData({ password: securityForm.password });
        const user = useUserStore.getState().user;
        if (user) {
          identifyUser(user.id, { email: user.email, name: user.name });
        }
        captureEvent("user_registered", {
          name: data.name,
          email: data.email,
        });
        setPendingVerificationEmail(data.email!);
        wunduToast.success("Cadastro concluído!", {
          description: "Enviámos um link de verificação para o teu email.",
        });
        router.push(buildVerifyPendingUrl(data.email));
      } else {
        const message =
          useUserStore.getState().error || "Falha ao concluir o cadastro.";
        const field = getRegisterErrorField(message);

        if (field) {
          setPersonalErrors({
            name: "",
            email: "",
            phone: "",
            [field]: message,
          });
          setSubmitError("");
          clearError();
          prevStep();
        } else {
          setSubmitError(message);
        }

        wunduToast.error("Erro no cadastro", { description: message });
      }
    } catch (err) {
      const message = getApiErrorMessage(err, "Falha ao concluir o cadastro.");
      const field = getRegisterErrorField(message);

      if (field) {
        setPersonalErrors({ name: "", email: "", phone: "", [field]: message });
        setSubmitError("");
        clearError();
        prevStep();
      } else {
        setSubmitError(message);
      }

      wunduToast.error("Erro no cadastro", { description: message });
      captureException(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Password strength hint visibility ─────────────────────────────────────

  const showPasswordHint =
    isPasswordFocused || securityForm.password.length > 0;

  // ── Render ─────────────────────────────────────────────────────────────────

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
          {/*
           * Surface Container
           * FIX: Removed fixed md:h-165 — height is now driven by content.
           * The card grows naturally, preventing overflow on the success step
           * while keeping a consistent appearance on steps 1 & 2.
           * FIX: overflow-hidden on all breakpoints to prevent shadow clipping.
           */}
          <div className="flex w-full flex-col bg-white md:rounded-3xl md:border md:border-slate-200/50 md:shadow-[0_1px_2px_rgba(0,0,0,0.01),0_8px_16px_rgba(0,0,0,0.02)]">
            <div className="flex flex-1 flex-col justify-center px-8 py-10 sm:px-12 md:px-14">
              {/* Progress System — steps 1 & 2 only */}
              {currentStep < 3 && (
                <div className="flex justify-center gap-2 mb-10">
                  {[1, 2].map((s) => (
                    <div
                      key={s}
                      className={`h-1 rounded-full transition-all duration-300 ${
                        s === currentStep
                          ? "w-12 bg-yellow-400" // active
                          : s < currentStep
                            ? "w-6 bg-slate-900" // completed
                            : "w-6 bg-slate-100" // upcoming
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* ── Step 1: Personal Data ────────────────────────────────── */}
              {currentStep === 1 && (
                <motion.div
                  initial={stepInitial}
                  animate={stepAnimate}
                  transition={stepTransition}
                >
                  <header className="mb-8">
                    <h2 className="text-2xl font-bold tracking-tighter text-slate-900 md:text-3xl">
                      Criar conta
                    </h2>
                    <p className="mt-2 text-sm font-medium text-slate-500 leading-relaxed">
                      Inicie sua jornada para a liberdade financeira com gestão
                      de alta precisão.
                    </p>
                  </header>

                  <form
                    onSubmit={submitPersonal}
                    className="flex flex-col gap-5"
                    noValidate
                  >
                    {/* Name */}
                    <div className="space-y-1.5">
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
                        autoFocus // FIX: only the first field in the step receives autoFocus
                        className="h-12 border-slate-200 bg-slate-50/40 transition-all"
                      />
                      <AnimatePresence>
                        {personalErrors.name && (
                          <motion.p
                            key="name-error"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="text-[11px] font-bold text-red-600 px-1"
                          >
                            {personalErrors.name}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <Input
                        id="email"
                        label="Email"
                        type="email"
                        leftIcon={<EmailFilledIcon className="w-5 h-5" />}
                        value={personalForm.email}
                        onChange={(e) =>
                          setPersonalField("email", e.target.value)
                        }
                        placeholder="exemplo@email.com"
                        required
                        isError={!!personalErrors.email}
                        // FIX: removed duplicate autoFocus
                        className="h-12 border-slate-200 bg-slate-50/40 transition-all"
                      />
                      <AnimatePresence>
                        {personalErrors.email && (
                          <motion.p
                            key="email-error"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="text-[11px] font-bold text-red-600 px-1"
                          >
                            {personalErrors.email}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5">
                      <PhoneInput
                        id="phone"
                        label="Nº de telefone"
                        value={personalForm.phone}
                        onChange={(value) => setPersonalField("phone", value)}
                        placeholder="9XX XXX XXX"
                        required
                        isError={!!personalErrors.phone}
                        // FIX: removed duplicate autoFocus
                      />
                      <AnimatePresence>
                        {personalErrors.phone && (
                          <motion.p
                            key="phone-error"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="text-[11px] font-bold text-red-600 px-1"
                          >
                            {personalErrors.phone}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    <Button
                      type="submit"
                      variant="warning"
                      className="h-12 mt-6 rounded-xl font-extrabold shadow-sm active:scale-[0.98] transition-all"
                    >
                      Próximo passo
                    </Button>
                  </form>

                  {/* Separador + registo com Google */}
                  <div className="relative my-5">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-100" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-white px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        ou
                      </span>
                    </div>
                  </div>

                  <GoogleButton label="Registar com Google" />

                  {/* FIX: consistent footer spacing with Step 2 — mt-8 pt-6 */}
                  <footer className="mt-8 border-t border-slate-100 pt-6 text-center">
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
                </motion.div>
              )}

              {/* ── Step 2: Security ─────────────────────────────────────── */}
              {currentStep === 2 && (
                <motion.div
                  initial={stepInitial}
                  animate={stepAnimate}
                  transition={stepTransition}
                >
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={isSubmitting}
                    className="group mb-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-colors disabled:opacity-50"
                  >
                    <ArrowLeftIcon className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                    Voltar
                  </button>

                  <header className="mb-8">
                    <h2 className="text-2xl font-bold tracking-tighter text-slate-900 md:text-3xl">
                      Segurança
                    </h2>
                    <p className="mt-2 text-sm font-medium text-slate-500 leading-relaxed">
                      Proteja sua conta com uma senha forte para garantir a
                      segurança dos seus dados financeiros.
                    </p>
                  </header>

                  {/*
                   * FIX: unified gap-5 across both steps' form fields.
                   * FIX: removed empty className="" from password Input.
                   */}
                  <form
                    onSubmit={submitSecurity}
                    className="flex flex-col gap-5"
                    noValidate
                  >
                    {/* Password */}
                    <div className="space-y-2.5">
                      <Input
                        id="password"
                        label="Crie uma senha"
                        type="password"
                        leftIcon={<KeyIcon className="w-5 h-5" />}
                        value={securityForm.password}
                        onChange={(e) =>
                          setSecurityField("password", e.target.value)
                        }
                        onFocus={() => setIsPasswordFocused(true)}
                        onBlur={() => setIsPasswordFocused(false)}
                        placeholder="Sua senha"
                        required
                        isError={!!passwordError || !!contextError}
                        autoFocus // FIX: first field of step gets autoFocus
                        className="h-12 border-slate-200 bg-slate-50/40 transition-all"
                      />

                      {/* Strength bar */}
                      <div className="px-1">
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
                                  {passwordValidation.isValid ? "Senha válida" : "Mínimo 6 caracteres"}
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-2 text-[10px]">
                                <span className={`flex items-center gap-1 ${securityForm.password.length >= 6 ? "text-green-600" : "text-slate-400"}`}>
                                  {securityForm.password.length >= 6 ? "✓" : "○"} Pelo menos 6 caracteres
                                </span>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Confirm password */}
                    <div className="space-y-1.5">
                      <Input
                        id="confirmPassword"
                        label="Confirme a senha"
                        type="password"
                        leftIcon={<KeyIcon className="w-5 h-5" />}
                        value={securityForm.confirmPassword}
                        onChange={(e) =>
                          setSecurityField("confirmPassword", e.target.value)
                        }
                        placeholder="Repita sua senha"
                        required
                        isError={!!passwordError || !!contextError}
                        className="h-12 border-slate-200 bg-slate-50/40 transition-all"
                      />
                      <AnimatePresence>
                        {(passwordError || contextError) && (
                          <motion.p
                            key="password-error"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="text-[11px] font-bold text-red-600 px-1"
                          >
                            {passwordError || contextError}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    <Button
                      type="submit"
                      variant="warning"
                      loading={isSubmitting}
                      disabled={isSubmitting}
                      className="h-12 mt-4 rounded-xl font-extrabold shadow-sm active:scale-[0.98] transition-all"
                    >
                      {/* FIX: removed redundant manual <LoadingSpinner> — Button's
                          loading prop already handles the spinner internally */}
                      {isSubmitting ? "A processar..." : "Finalizar cadastro"}
                    </Button>
                  </form>
                </motion.div>
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
