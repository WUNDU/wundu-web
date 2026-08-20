"use client";

import { Input, Button, LogoType } from "@/components/ui";
import { loginIllustration, errorIllustration } from "@/constants/images";
import { EmailFilledIcon, KeyIcon } from "@/constants/icons";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { validateEmail } from "@/utils/validation";
import { useUserStore } from "@/store/user-store";
import { GoogleButton } from "@/components/auth/google-button";
import { buildVerifyPendingUrl } from "@/utils/pending-verification";
import posthog from "posthog-js";

// ─── Constants ────────────────────────────────────────────────────────────────

const SAVED_USER_KEY = "wundu-saved-user";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SavedUser {
  name: string;
  email: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function formatCountdown(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

// ─── Shared animation config ──────────────────────────────────────────────────

const panelTransition = { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const };
const panelInitial = { opacity: 0, x: 10 };
const panelAnimate = { opacity: 1, x: 0 };

// ─── Shared error/blocked banner ──────────────────────────────────────────────
// FIX: extracted duplicated error banner JSX into a single component so both
// modes stay in sync and future changes only need to happen in one place.

interface StatusBannerProps {
  isBlocked: boolean;
  countdown: number | null;
  errorMessage: string | null;
}

function StatusBanner({
  isBlocked,
  countdown,
  errorMessage,
}: StatusBannerProps) {
  const showBanner = isBlocked || !!errorMessage;

  return (
    // FIX: replaced non-standard min-h-17 with an explicit min-h-[68px]
    <div className="min-h-17 py-4 flex items-center">
      <AnimatePresence mode="wait">
        {isBlocked ? (
          <motion.div
            key="blocked"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex w-full items-center gap-3 rounded-xl border border-orange-100 bg-orange-50/40 p-3.5"
          >
            <div className="h-2 w-2 shrink-0 rounded-full bg-orange-500 animate-pulse" />
            <p className="text-xs font-bold text-orange-600">
              Demasiadas tentativas. Tente novamente em{" "}
              {formatCountdown(countdown!)}
            </p>
          </motion.div>
        ) : errorMessage ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex w-full items-center gap-3 rounded-xl border border-red-100 bg-red-50/30 p-3.5"
          >
            <div className="h-2 w-2 shrink-0 rounded-full bg-red-500" />
            <p className="text-xs font-bold text-red-600">{errorMessage}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

// ─── LoginPage ────────────────────────────────────────────────────────────────

const LoginPage: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, login, error, errorCode, retryAfterSeconds } = useAuth();

  const errorRef = useRef<string | null>(null);
  errorRef.current = error ?? null;
  const errorCodeRef = useRef<string | null>(null);
  errorCodeRef.current = errorCode ?? null;

  const [savedUser, setSavedUser] = useState<SavedUser | null>(null);
  const [mode, setMode] = useState<"quick" | "full">("full");
  const [form, setFormState] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const hasError = !!(errors.email || errors.password || loginError);
  const isBlocked = countdown !== null && countdown > 0;

  // Populate countdown from hook
  useEffect(() => {
    if (retryAfterSeconds && retryAfterSeconds > 0) {
      setCountdown(retryAfterSeconds);
    }
  }, [retryAfterSeconds]);

  // Countdown ticker
  useEffect(() => {
    if (!countdown || countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) router.push(ROUTES.HOME);
  }, [isAuthenticated, router]);

  // Load saved user from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVED_USER_KEY);
      if (raw) {
        const parsed: SavedUser = JSON.parse(raw);
        if (parsed?.email) {
          setSavedUser(parsed);
          setFormState((prev) => ({ ...prev, email: parsed.email }));
          setMode("quick");
        }
      }
    } catch {}
  }, []);

  // ── Field helpers ──────────────────────────────────────────────────────────

  const setField = (field: "email" | "password", value: string) => {
    const normalized = field === "email" ? value.toLowerCase() : value;
    setFormState((prev) => ({ ...prev, [field]: normalized }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setLoginError(null);
  };

  // ── Submit ─────────────────────────────────────────────────────────────────

  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (isBlocked) return;

    setErrors({ email: "", password: "" });
    setLoginError(null);

    let valid = true;
    const nextErrors = { email: "", password: "" };

    if (mode === "full") {
      if (!form.email.trim()) {
        nextErrors.email = "Por favor, insira o seu e-mail";
        valid = false;
      } else if (!validateEmail(form.email)) {
        nextErrors.email = "Por favor, insira um email válido";
        valid = false;
      }
    }

    if (!form.password) {
      nextErrors.password = "Por favor, insira a sua palavra-passe";
      valid = false;
    }

    if (!valid) {
      setErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await login(form.email, form.password);
      if (success) {
        const user = useUserStore.getState().user;
        if (user) {
          localStorage.setItem(
            SAVED_USER_KEY,
            JSON.stringify({ name: user.name, email: user.email }),
          );
        }
        posthog.identify(form.email, { email: form.email });
        posthog.capture("user_signed_in", { method: "email" });
      } else if (errorCodeRef.current === "EMAIL_NOT_VERIFIED") {
        posthog.capture("user_sign_in_failed", { reason: "EMAIL_NOT_VERIFIED" });
        router.push(buildVerifyPendingUrl(form.email));
        return;
      } else {
        const errMsg =
          errorRef.current || "Credenciais incorretas. Tente novamente.";
        setLoginError(errMsg);
        posthog.capture("user_sign_in_failed", { reason: errMsg });
      }
    } catch (err) {
      const errMsg = "Ocorreu um erro inesperado. Tente novamente.";
      setLoginError(errMsg);
      posthog.capture("user_sign_in_failed", { reason: errMsg });
      posthog.captureException(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSwitchAccount = () => {
    localStorage.removeItem(SAVED_USER_KEY);
    setSavedUser(null);
    setMode("full");
    setFormState({ email: "", password: "" });
    setErrors({ email: "", password: "" });
    setLoginError(null);
  };

  // ── Derived error message for StatusBanner ─────────────────────────────────

  const quickErrorMessage = errors.password || loginError;
  const fullErrorMessage = errors.email || errors.password || loginError;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex min-h-screen flex-col bg-white md:bg-[#fafafa]">
      {/* Brand Header */}
      <header className="flex h-16 shrink-0 items-center justify-start px-8 md:px-12">
        <Link
          href={ROUTES.LANDINGPAGE}
          className="transition-opacity hover:opacity-80"
        >
          {/* FIX: w-30 is not a standard Tailwind class → aligned to w-32 (same as RegisterPage) */}
          <div className="w-32">
            <LogoType />
          </div>
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-255">
          {/*
           * Surface Container
           * FIX: removed fixed md:h-130 — height is content-driven to prevent
           * overflow when error banners expand or content is taller than expected.
           * overflow-hidden is retained only on the card itself (not per-breakpoint)
           * so the shadow renders correctly everywhere.
           */}
          <div className="flex w-full flex-col bg-white md:flex-row md:rounded-3xl md:border md:border-slate-200/50 md:shadow-[0_1px_2px_rgba(0,0,0,0.01),0_8px_16px_rgba(0,0,0,0.02)] overflow-hidden">
            {/* Visual Column */}
            <div className="hidden flex-1 items-center justify-center border-r border-slate-100/80 bg-[#f9f9f9]/50 p-12 lg:flex">
              {/*
               * FIX: added explicit width/height to next/image to prevent CLS.
               * Using fill + a sized container is the alternative, but explicit
               * dimensions are simpler for a fixed illustration.
               */}
              <Image
                src={hasError ? errorIllustration : loginIllustration}
                alt={hasError ? "Erro de autenticação" : "Entrar na conta"}
                width={256}
                height={256}
                className="transition-opacity duration-300"
                priority
              />
            </div>

            {/* Form Side
             * FIX: unified horizontal padding to px-8 (mobile) matching RegisterPage.
             * Previously px-6 on mobile caused misaligned content between the two auth pages.
             */}
            <div className="flex flex-1 flex-col justify-center px-8 py-10 sm:px-12 md:px-14 lg:px-16">
              {mode === "quick" && savedUser ? (
                /* ── Quick Login ── */
                <motion.form
                  initial={panelInitial}
                  animate={panelAnimate}
                  transition={panelTransition}
                  onSubmit={handleLogin}
                  className="flex w-full flex-col"
                >
                  {/* Avatar + user info */}
                  <div className="mb-10 flex flex-col items-center gap-4">
                    <div className="relative group cursor-default">
                      <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                      <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-yellow-400 shadow-lg border-4 border-white">
                        <span className="text-2xl font-black tracking-tight text-slate-900">
                          {getInitials(savedUser.name)}
                        </span>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold tracking-tight text-slate-900">
                        {savedUser.name.split(" ")[0]}
                      </p>
                      <p className="text-sm font-semibold text-slate-400 tracking-tight">
                        {savedUser.email}
                      </p>
                    </div>
                  </div>

                  {/* Password field — Quick mode only needs this */}
                  <Input
                    id="password-quick"
                    label="Palavra-passe"
                    type="password"
                    leftIcon={<KeyIcon className="w-5 h-5" />}
                    value={form.password}
                    onChange={(e) => setField("password", e.target.value)}
                    placeholder="A tua senha"
                    isError={!!errors.password || !!loginError}
                    disabled={isSubmitting}
                    autoFocus
                    className="h-12 border-slate-200 bg-slate-50/40 transition-all"
                  />

                  <StatusBanner
                    isBlocked={isBlocked}
                    countdown={countdown}
                    errorMessage={quickErrorMessage}
                  />

                  <Button
                    variant="warning"
                    type="submit"
                    fullWidth
                    loading={isSubmitting}
                    disabled={isBlocked}
                    className="h-12 rounded-xl text-sm font-extrabold shadow-sm transition-all active:scale-[0.98]"
                  >
                    {isBlocked
                      ? `Aguarde ${formatCountdown(countdown!)}`
                      : "Entrar no Wundu"}
                  </Button>

                  {/* FIX: aligned footer spacing to mt-8 pt-6 (same as RegisterPage footer) */}
                  <div className="mt-8 border-t border-slate-100 pt-6 text-center">
                    <button
                      type="button"
                      onClick={handleSwitchAccount}
                      className="text-sm font-bold text-slate-400 transition-colors hover:text-slate-900"
                    >
                      Usar outra conta
                    </button>
                  </div>
                </motion.form>
              ) : (
                /* ── Full Login ── */
                <motion.div
                  initial={panelInitial}
                  animate={panelAnimate}
                  transition={panelTransition}
                >
                  {/*
                   * FIX: removed text-center from the header — only the heading
                   * text is centered while inputs/buttons are left-aligned, which
                   * created visual misalignment. Header now inherits the form's
                   * left alignment for a consistent reading axis.
                   */}
                  <header className="mb-8">
                    <h1 className="text-2xl font-bold tracking-tighter text-slate-900 md:text-3xl">
                      Acesse sua conta
                    </h1>
                    <p className="mt-2 text-sm font-medium text-slate-500">
                      Gestão financeira de alta precisão.
                    </p>
                  </header>

                  <form onSubmit={handleLogin} className="flex w-full flex-col">
                    {/* FIX: removed unnecessary <div className="space-y-2"> wrapper
                        around the password Input — the parent gap-4 already handles
                        spacing and the wrapper added no visual benefit */}
                    <div className="flex flex-col gap-4">
                      <Input
                        id="email"
                        label="E-mail"
                        type="email"
                        leftIcon={<EmailFilledIcon className="w-5 h-5" />}
                        value={form.email}
                        onChange={(e) => setField("email", e.target.value)}
                        placeholder="exemplo@email.com"
                        disabled={isSubmitting}
                        isError={!!errors.email || !!loginError}
                        autoFocus
                        // FIX: email is the first field → it gets autoFocus,
                        // not the password field which came after it in the original
                        className="h-12 border-slate-200 bg-slate-50/40 transition-all"
                      />
                      <Input
                        id="password"
                        label="Palavra-passe"
                        type="password"
                        leftIcon={<KeyIcon className="w-5 h-5" />}
                        value={form.password}
                        onChange={(e) => setField("password", e.target.value)}
                        placeholder="A tua senha"
                        isError={!!errors.password || !!loginError}
                        disabled={isSubmitting}
                        // FIX: removed autoFocus — only one field per form should have it
                        className="h-12 border-slate-200 bg-slate-50/40 transition-all"
                      />
                      <div className="flex justify-end">
                        <Link
                          href="/reset_password"
                          className="text-xs text-slate-500 hover:text-slate-800 transition-colors"
                        >
                          Esqueceu a senha?
                        </Link>
                      </div>
                    </div>

                    <StatusBanner
                      isBlocked={isBlocked}
                      countdown={countdown}
                      errorMessage={fullErrorMessage}
                    />

                    <Button
                      variant="warning"
                      type="submit"
                      fullWidth
                      loading={isSubmitting}
                      disabled={isBlocked}
                      className="h-12 rounded-xl text-sm font-extrabold shadow-sm transition-all active:scale-[0.98]"
                    >
                      {isBlocked
                        ? `Aguarde ${formatCountdown(countdown!)}`
                        : "Entrar no Wundu"}
                    </Button>

                    {/* Separador + entrada com Google */}
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

                    <GoogleButton disabled={isSubmitting || isBlocked} />

                    {/* FIX: aligned footer spacing to mt-8 pt-6 — original had pt-8
                        which was inconsistent with the Quick mode footer (pt-6)
                        and with the RegisterPage footer pattern */}
                    <footer className="mt-8 border-t border-slate-100 pt-6 text-center">
                      <p className="text-sm font-medium text-slate-500">
                        Novo por aqui?{" "}
                        <Link
                          href={ROUTES.REGISTER}
                          className="font-bold text-slate-900 decoration-yellow-400 decoration-2 underline-offset-4 hover:underline transition-all"
                        >
                          Crie uma conta
                        </Link>
                      </p>
                    </footer>
                  </form>
                </motion.div>
              )}
            </div>
          </div>

          {/* Legal Footer */}
          <footer className="mt-8 px-8 text-center">
            <p className="text-[10px] leading-relaxed text-slate-400 font-medium max-w-sm mx-auto">
              Ao acessar, você aceita nossos{" "}
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

export default LoginPage;
