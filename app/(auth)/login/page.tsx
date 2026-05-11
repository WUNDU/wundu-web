"use client";

import { Input, Button, LoadingSpinner, LogoType } from "@/components/ui";
import { loginIllustration, errorIllustration } from "@/constants/images";
import { SecurityIcon } from "@/constants/icons";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { validateEmail } from "@/utils/validation";
import { useUserStore } from "@/store/user-store";
import posthog from "posthog-js";

const SAVED_USER_KEY = "wundu-saved-user";

interface SavedUser {
  name: string;
  email: string;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

const LoginPage: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, login, error, retryAfterSeconds } = useAuth();

  const errorRef = useRef<string | null>(null);
  errorRef.current = error ?? null;

  const [savedUser, setSavedUser] = useState<SavedUser | null>(null);
  const [mode, setMode] = useState<"quick" | "full">("full");
  const [form, setFormState] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const hasError = !!(errors.email || errors.password || loginError);
  const isBlocked = countdown !== null && countdown > 0;

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  useEffect(() => {
    if (retryAfterSeconds && retryAfterSeconds > 0) {
      setCountdown(retryAfterSeconds);
    }
  }, [retryAfterSeconds]);

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

  useEffect(() => {
    if (isAuthenticated) router.push(ROUTES.HOME);
  }, [isAuthenticated, router]);

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

  const setField = (field: "email" | "password", value: string) => {
    const normalized = field === "email" ? value.toLowerCase() : value;
    setFormState((prev) => ({ ...prev, [field]: normalized }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setLoginError(null);
  };

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
        // Persist user for next login
        const user = useUserStore.getState().user;
        if (user) {
          localStorage.setItem(
            SAVED_USER_KEY,
            JSON.stringify({ name: user.name, email: user.email }),
          );
        }
        posthog.identify(form.email, { email: form.email });
        posthog.capture("user_signed_in", { method: "email" });
      } else {
        const errMsg = errorRef.current || "Credenciais incorretas. Tente novamente.";
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

  return (
    <div className="flex min-h-screen flex-col bg-white md:bg-[#fafafa]">
      <header className="flex h-16 shrink-0 items-center justify-start px-8 md:justify-start md:px-12">
        <Link href={ROUTES.LANDINGPAGE} className="transition-opacity hover:opacity-80">
          <div className="w-30">
            <LogoType />
          </div>
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-255">
          <div className="flex w-full flex-col bg-white md:h-130 md:flex-row md:rounded-3xl md:border md:border-slate-200/50 md:shadow-[0_1px_2px_rgba(0,0,0,0.01),0_8px_16px_rgba(0,0,0,0.02)] overflow-hidden">
            {/* Visual Column */}
            <div className="hidden flex-1 items-center justify-center border-r border-slate-100/80 bg-[#f9f9f9]/50 p-12 lg:flex">
              <Image
                src={hasError ? errorIllustration : loginIllustration}
                alt="Status"
                className="h-64 w-64 transition-opacity duration-300"
                priority
              />
            </div>

            {/* Form Side */}
            <div className="flex flex-1 flex-col justify-center px-6 py-10 sm:px-12 md:px-14 lg:px-16">
              {mode === "quick" && savedUser ? (
                /* ── Quick Login ── */
                <form onSubmit={handleLogin} className="flex w-full flex-col">
                  <div className="mb-8 flex flex-col items-center gap-3">
                    {/* Avatar */}
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-400 shadow-sm">
                      <span className="text-xl font-black tracking-tight text-slate-900">
                        {getInitials(savedUser.name)}
                      </span>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold tracking-tight text-slate-900">
                        {savedUser.name.split(" ")[0]}
                      </p>
                      <p className="text-sm font-medium text-slate-400">
                        {savedUser.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <Input
                      id="password"
                      label="Palavra-passe"
                      type="password"
                      leftIcon={<SecurityIcon className="w-5 h-5" />}
                      value={form.password}
                      onChange={(e) => setField("password", e.target.value)}
                      placeholder="A tua senha"
                      isError={!!errors.password || !!loginError}
                      disabled={isSubmitting}
                      autoFocus
                      className="h-11 border-slate-200 bg-slate-50/40 text-[14px] transition-all focus:border-slate-900 focus:bg-white"
                    />
                  </div>

                  <div className="min-h-17 py-3 flex items-center">
                    {isBlocked ? (
                      <div className="flex w-full items-center gap-3 rounded-lg border border-orange-100 bg-orange-50/40 p-3 animate-in fade-in slide-in-from-top-1">
                        <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                        <p className="text-xs font-bold text-orange-600">
                          Demasiadas tentativas. Tente novamente em {formatCountdown(countdown!)}
                        </p>
                      </div>
                    ) : (errors.password || loginError) ? (
                      <div className="flex w-full items-center gap-3 rounded-lg border border-red-100 bg-red-50/30 p-3 animate-in fade-in slide-in-from-top-1">
                        <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                        <p className="text-xs font-bold text-red-600">
                          {errors.password || loginError}
                        </p>
                      </div>
                    ) : null}
                  </div>

                  <Button
                    variant="warning"
                    type="submit"
                    fullWidth
                    disabled={isSubmitting || isBlocked}
                    className="h-11 rounded-xl text-sm font-extrabold shadow-sm transition-all active:scale-[0.98]"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <LoadingSpinner size="sm" />A verificar...
                      </span>
                    ) : isBlocked ? (
                      `Aguarde ${formatCountdown(countdown!)}`
                    ) : (
                      "Entrar no Wundu"
                    )}
                  </Button>

                  <div className="mt-6 border-t border-slate-100 pt-6 text-center">
                    <button
                      type="button"
                      onClick={handleSwitchAccount}
                      className="text-sm font-bold text-slate-500 transition-colors hover:text-slate-900"
                    >
                      Usar outra conta
                    </button>
                  </div>
                </form>
              ) : (
                /* ── Full Login ── */
                <>
                  <header className="mb-6">
                    <h1 className="text-2xl font-bold tracking-tighter text-slate-900 md:text-3xl">
                      Acesse sua conta
                    </h1>
                    <p className="mt-2 text-sm font-medium text-slate-500">
                      Gestão financeira de alta precisão.
                    </p>
                  </header>

                  <form onSubmit={handleLogin} className="flex w-full flex-col">
                    <div className="flex flex-col gap-4">
                      <Input
                        id="email"
                        label="E-mail"
                        type="email"
                        leftIcon={<SecurityIcon className="w-5 h-5" />}
                        value={form.email}
                        onChange={(e) => setField("email", e.target.value)}
                        placeholder="exemplo@email.com"
                        disabled={isSubmitting}
                        isError={!!errors.email || !!loginError}
                        className="h-11 border-slate-200 bg-slate-50/40 text-[14px] transition-all focus:border-slate-900 focus:bg-white"
                      />
                      <Input
                        id="password"
                        label="Palavra-passe"
                        type="password"
                        leftIcon={<SecurityIcon className="w-5 h-5" />}
                        value={form.password}
                        onChange={(e) => setField("password", e.target.value)}
                        placeholder="A tua senha"
                        isError={!!errors.password || !!loginError}
                        disabled={isSubmitting}
                        className="h-11 border-slate-200 bg-slate-50/40 text-[14px] transition-all focus:border-slate-900 focus:bg-white"
                      />
                    </div>

                    <div className="min-h-17 py-3 flex items-center">
                      {isBlocked ? (
                        <div className="flex w-full items-center gap-3 rounded-lg border border-orange-100 bg-orange-50/40 p-3 animate-in fade-in slide-in-from-top-1">
                          <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                          <p className="text-xs font-bold text-orange-600">
                            Demasiadas tentativas. Tente novamente em {formatCountdown(countdown!)}
                          </p>
                        </div>
                      ) : (errors.email || errors.password || loginError) ? (
                        <div className="flex w-full items-center gap-3 rounded-lg border border-red-100 bg-red-50/30 p-3 animate-in fade-in slide-in-from-top-1">
                          <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                          <p className="text-xs font-bold text-red-600">
                            {errors.email || errors.password || loginError}
                          </p>
                        </div>
                      ) : null}
                    </div>

                    <Button
                      variant="warning"
                      type="submit"
                      fullWidth
                      disabled={isSubmitting || isBlocked}
                      className="h-11 rounded-xl text-sm font-extrabold shadow-sm transition-all active:scale-[0.98]"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <LoadingSpinner size="sm" />A verificar...
                        </span>
                      ) : isBlocked ? (
                        `Aguarde ${formatCountdown(countdown!)}`
                      ) : (
                        "Entrar no Wundu"
                      )}
                    </Button>

                    <footer className="mt-6 border-t border-slate-100 pt-6 text-center">
                      <p className="text-sm font-medium text-slate-500">
                        Novo por aqui?{" "}
                        <Link
                          href={ROUTES.REGISTER}
                          className="font-bold text-slate-900 decoration-yellow-400 decoration-2 underline-offset-4 hover:underline"
                        >
                          Crie uma conta
                        </Link>
                      </p>
                    </footer>
                  </form>
                </>
              )}
            </div>
          </div>

          <footer className="mt-8 px-8 text-center">
            <p className="text-[10px] leading-relaxed text-slate-400 font-medium max-w-sm mx-auto">
              Ao acessar, você aceita nossos{" "}
              <Link href={ROUTES.LEGAL} className="text-slate-500 hover:text-slate-900 transition-colors underline underline-offset-2">
                Termos
              </Link>{" "}
              e{" "}
              <Link href={ROUTES.LEGAL} className="text-slate-500 hover:text-slate-900 transition-colors underline underline-offset-2">
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

