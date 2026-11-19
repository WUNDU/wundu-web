"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthBrandPanel } from "@/components/auth/auth-brand-panel";
import {
  AuthFormShell,
  AuthRoot,
} from "@/components/auth/auth-form-shell";
import {
  DsButton,
  DsCheckbox,
  DsDivider,
  DsFieldLabel,
  DsInput,
  DsLink,
  GoogleLogo,
} from "@/components/auth/ds";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/use-auth";
import { useUserStore } from "@/store/user-store";
import { userService } from "@/services/user.service";
import { buildVerifyPendingUrl } from "@/utils/pending-verification";
import { validateEmail } from "@/utils/validation";
import { identifyUser, captureEvent, captureException } from "@/lib/analytics";

const PREFILL_EMAIL_KEY = "wundu-prefill-email";
const PENDING_BIRTHDATE_KEY = "wundu-pending-birthdate";
const REMEMBER_KEY = "wundu-remember-session";

function formatCountdown(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

const LoginPage: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, login, error, errorCode, retryAfterSeconds } = useAuth();

  const [form, setFormState] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);

  const isBlocked = countdown !== null && countdown > 0;

  useEffect(() => {
    try {
      const prefill = localStorage.getItem(PREFILL_EMAIL_KEY);
      if (prefill) {
        setFormState((prev) => ({ ...prev, email: prefill }));
        localStorage.removeItem(PREFILL_EMAIL_KEY);
      }
      setRemember(localStorage.getItem(REMEMBER_KEY) !== "0");
    } catch {}
  }, []);

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
    if (!isAuthenticated) return;
    // Se o proxy nos devolveu ao login (?next=...), o cookie de sessão pode
    // não estar a ser enviado: recarrega a página inteira para o proxy
    // reavaliar com cookies, em vez de entrar em loop client-side (ecrã branco).
    try {
      const next = new URLSearchParams(window.location.search).get("next");
      if (next && next.startsWith("/") && !next.startsWith("//")) {
        window.location.href = next;
        return;
      }
    } catch {}
    router.push(ROUTES.HOME);
  }, [isAuthenticated, router]);

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

    if (!form.email.trim()) {
      nextErrors.email = "Indica o teu email.";
      valid = false;
    } else if (!validateEmail(form.email)) {
      nextErrors.email = "Indica um email válido.";
      valid = false;
    }
    if (!form.password) {
      nextErrors.password = "Indica a tua palavra-passe.";
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
        if (user) identifyUser(user.id);
        try {
          localStorage.setItem(REMEMBER_KEY, remember ? "1" : "0");
          const pendingBirthdate = localStorage.getItem(PENDING_BIRTHDATE_KEY);
          if (pendingBirthdate) {
            try {
              await userService.updateProfile({ birthDate: pendingBirthdate });
            } catch {}
            localStorage.removeItem(PENDING_BIRTHDATE_KEY);
          }
        } catch {}
        captureEvent("user_signed_in", { method: "email" });
      } else if (errorCode === "EMAIL_NOT_VERIFIED") {
        captureEvent("user_sign_in_failed", { reason: "EMAIL_NOT_VERIFIED" });
        router.push(buildVerifyPendingUrl(form.email));
        return;
      } else {
        const errMsg = error || "Credenciais erradas. Tenta novamente.";
        setLoginError(errMsg);
        captureEvent("user_sign_in_failed", { reason: errMsg });
      }
    } catch (err) {
      const errMsg = "Ocorreu um erro inesperado. Tenta novamente.";
      setLoginError(errMsg);
      captureEvent("user_sign_in_failed", { reason: errMsg });
      captureException(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setIsGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl: ROUTES.GOOGLE_CALLBACK });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const goForgot = () => {
    try {
      if (form.email.trim()) localStorage.setItem(PREFILL_EMAIL_KEY, form.email.trim());
    } catch {}
    router.push("/reset_password");
  };

  const passwordHint = errors.password || loginError || undefined;

  return (
    <AuthRoot>
      <AuthFormShell>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em" }}>
              Entrar na Wundu
            </h1>
            <p style={{ margin: 0, fontSize: 15, color: "var(--text-secondary)" }}>
              Acompanha as tuas contas, metas e gastos num só lugar.
            </p>
          </div>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <DsFieldLabel>Email</DsFieldLabel>
              <DsInput
                icon="mail"
                type="email"
                autoComplete="email"
                placeholder="nome@exemplo.com"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                error={errors.email || loginError || undefined}
                disabled={isSubmitting}
                autoFocus
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <DsFieldLabel>Palavra-passe</DsFieldLabel>
              <DsInput
                icon="lock"
                type={showPw ? "text" : "password"}
                autoComplete="current-password"
                placeholder="A tua palavra-passe"
                value={form.password}
                onChange={(e) => setField("password", e.target.value)}
                trailingIcon={showPw ? "eye-off" : "eye"}
                onTrailingClick={() => setShowPw((v) => !v)}
                error={passwordHint || undefined}
                disabled={isSubmitting}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <DsCheckbox checked={remember} onChange={setRemember} label="Manter sessão iniciada" />
              <DsLink onClick={goForgot}>Esqueceste-te da palavra-passe?</DsLink>
            </div>
          </form>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <DsButton
              variant="primary"
              size="lg"
              block
              loading={isSubmitting}
              disabled={isBlocked || !validateEmail(form.email) || !form.password}
              onClick={() => void handleLogin()}
            >
              {isBlocked ? `Aguarde ${formatCountdown(countdown!)}` : "Entrar"}
            </DsButton>
            <DsDivider />
            <DsButton
              variant="outline"
              size="lg"
              block
              loading={isGoogleLoading}
              disabled={isSubmitting || isBlocked}
              iconLeft={<GoogleLogo size={20} />}
              onClick={() => void handleGoogle()}
            >
              Continuar com Google
            </DsButton>
          </div>

          <p style={{ margin: 0, textAlign: "center", fontSize: 14, color: "var(--text-secondary)" }}>
            Ainda não tens conta?{" "}
            <DsLink onClick={() => router.push(ROUTES.REGISTER)}>Criar conta</DsLink>
          </p>
        </div>
      </AuthFormShell>
      <AuthBrandPanel />
    </AuthRoot>
  );
};

export default LoginPage;
