"use client";

import { useState, useEffect, useCallback, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { DsButton, DsFieldLabel, DsIconTile, DsInput } from "@/components/auth/ds";
import { AuthBrandPanel } from "@/components/auth/auth-brand-panel";
import {
  AuthFormShell,
  AuthRoot,
} from "@/components/auth/auth-form-shell";
import { ROUTES } from "@/constants/routes";
import { emailVerificationService } from "@/services/email-verification.service";
import { userService } from "@/services/user.service";
import { useUserStore } from "@/store/user-store";
import { wunduToast } from "@/utils/toast";
import {
  clearPendingVerificationContext,
  getPendingVerificationCooldownSeconds,
  getPendingVerificationEmail,
  setPendingVerificationCooldown,
  setPendingVerificationEmail,
} from "@/utils/pending-verification";
import { getEmailErrorMessage, validateEmail } from "@/utils/validation";

const RESEND_COOLDOWN = 300;
const PREFILL_EMAIL_KEY = "wundu-prefill-email";

export default function VerifyPendingPage() {
  const router = useRouter();
  const { user, setUser, token, prevStep } = useUserStore();
  const queryEmail =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("email") ?? ""
      : "";

  // Resolve email from store or sessionStorage
  const resolvedEmail = user?.email || queryEmail || getPendingVerificationEmail();

  const [email, setEmail] = useState(resolvedEmail);
  const [hasResolvedContext, setHasResolvedContext] = useState(
    Boolean(resolvedEmail)
  );
  const [cooldown, setCooldown] = useState(() => getPendingVerificationCooldownSeconds());
  const [isResending, setIsResending] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  // Change-email section
  const [showEmailChange, setShowEmailChange] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [isSavingEmail, setIsSavingEmail] = useState(false);
  const canChangeEmail = Boolean(user);

  const applyCooldown = useCallback((seconds: number) => {
    setPendingVerificationCooldown(seconds);
    setCooldown(seconds);
  }, []);

  // Sync email when user store populates after hydration
  useEffect(() => {
    const nextEmail = user?.email || queryEmail || getPendingVerificationEmail();
    if (nextEmail && nextEmail !== email) {
      setEmail(nextEmail);
    }
    setHasResolvedContext(true);
  }, [user?.email, queryEmail, email]);

  useEffect(() => {
    if (queryEmail) {
      setPendingVerificationEmail(queryEmail);
    }
  }, [queryEmail]);

  useEffect(() => {
    if (user?.email) {
      setPendingVerificationEmail(user.email);
    }
  }, [user?.email]);

  useEffect(() => {
    if (hasResolvedContext && !email && typeof window !== "undefined") {
      router.replace(ROUTES.LOGIN);
    }
  }, [email, hasResolvedContext, router]);

  // Countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const formatCountdown = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const handleResend = useCallback(async () => {
    const normalizedEmail = email.trim();
    if (cooldown > 0 || isResending) return;
    if (!normalizedEmail) {
      router.push(ROUTES.LOGIN);
      return;
    }

    setEmail(normalizedEmail);
    setIsResending(true);
    try {
      await emailVerificationService.resendVerification(normalizedEmail);
      setPendingVerificationEmail(normalizedEmail);
      applyCooldown(RESEND_COOLDOWN);
      wunduToast.success("Email de verificação reenviado!");
    } catch (error: any) {
      const retryAfterSeconds =
        typeof error?.retryAfterSeconds === "number" ? error.retryAfterSeconds : 0;

      if (retryAfterSeconds > 0) {
        applyCooldown(retryAfterSeconds);
      }

      if (error?.status === 429) {
        wunduToast.error(
          `Aguarda ${formatCountdown(retryAfterSeconds || RESEND_COOLDOWN)} antes de reenviar.`
        );
      } else if (error?.status === 404) {
        wunduToast.error("Não encontrámos uma conta com esse email.");
      } else {
        wunduToast.error(error?.message || "Não foi possível reenviar. Tente novamente.");
      }
    } finally {
      setIsResending(false);
    }
  }, [applyCooldown, cooldown, email, isResending, router]);

  const handleChangeEmail = async () => {
    const normalizedEmail = newEmail.trim();
    if (!validateEmail(normalizedEmail)) {
      wunduToast.error(getEmailErrorMessage());
      return;
    }
    setIsSavingEmail(true);
    try {
      await emailVerificationService.changeEmail(normalizedEmail);
      setPendingVerificationEmail(normalizedEmail);
      applyCooldown(RESEND_COOLDOWN);
      setEmail(normalizedEmail);
      setNewEmail("");
      setShowEmailChange(false);
      wunduToast.success("Email actualizado! Verifique a sua nova caixa de entrada.");
    } catch (error: any) {
      wunduToast.error(error?.message || "Não foi possível alterar o email. Tente novamente.");
    } finally {
      setIsSavingEmail(false);
    }
  };

  const handleAlterEmail = () => {
    if (!user) {
      // Sem sessão (caso pós-signup): volta ao passo 1 do cadastro para
      // corrigir o email, como no kit (changeEmail -> signup1).
      prevStep();
      router.push(ROUTES.REGISTER);
      return;
    }
    setShowEmailChange((v) => !v);
  };

  const handleAlreadyVerified = async () => {
    if (!token) {
      // Sem sessão (caso pós-signup): segue para o login com o email
      // pré-preenchido, como no kit (toLoginFromCheck). O login bloqueia
      // emails por verificar e devolve para cá até à activação.
      try {
        if (email.trim()) {
          localStorage.setItem(PREFILL_EMAIL_KEY, email.trim());
        }
      } catch {}
      router.push(ROUTES.LOGIN);
      return;
    }
    setIsChecking(true);
    try {
      // O isActive do /users/me NÃO reflete a verificação (é sempre true em
      // período de graça) — a fonte de verdade é o status de verificação.
      const status = await emailVerificationService.getEmailVerificationStatus();
      if (status.emailVerified) {
        const fresh = await userService.getUser();
        setUser(fresh);
        clearPendingVerificationContext();
        wunduToast.success("Email verificado! Bem-vindo ao Wundu.");
        router.push(ROUTES.HOME);
      } else {
        wunduToast.error("O email ainda não foi verificado.");
      }
    } catch {
      wunduToast.error("Não foi possível verificar o estado. Tente novamente.");
    } finally {
      setIsChecking(false);
    }
  };

  const steps = [
    `Abre a caixa de entrada de ${email || "o teu email"}. Verifica também o spam.`,
    "Abre o email da Wundu e toca em Activar conta. O link expira em 24 horas.",
    "Volta aqui e entra com o teu email e palavra-passe.",
  ];

  const kitLinkButton: CSSProperties = {
    border: 0,
    background: "none",
    padding: 0,
    font: "inherit",
    fontWeight: 600,
    color: "var(--on-soft-brand)",
    cursor: "pointer",
  };

  const kitText: CSSProperties = {
    margin: 0,
    fontSize: 15,
    lineHeight: 1.55,
    color: "var(--text-secondary)",
  };

  return (
    <AuthRoot>
      <AuthFormShell onBack={() => router.back()}>
        <DsIconTile icon="mail" tone="brand" size="lg" />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em" }}>
            Confirma o teu email
          </h1>
          <p style={kitText}>
            Enviámos um link de activação para{" "}
            <strong style={{ color: "var(--text-primary)", fontWeight: 600 }}>
              {email || "o teu email"}
            </strong>
            . A conta só fica activa depois de abrires esse link. Até lá não é
            possível entrar na Wundu.
          </p>
        </div>

        <ol
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            border: "1px solid var(--border-subtle)",
            borderRadius: 14,
            background: "var(--surface-card)",
          }}
        >
          {steps.map((text, i) => (
            <li
              key={text}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "14px 16px",
                borderTop: i ? "1px solid var(--border-subtle)" : "0",
              }}
            >
              <span
                style={{
                  width: 28,
                  height: 28,
                  flex: "0 0 auto",
                  borderRadius: 999,
                  background: "var(--primary-light)",
                  color: "var(--on-soft-brand)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                {i + 1}
              </span>
              <span
                style={{
                  fontSize: 14,
                  lineHeight: 1.45,
                  color: "var(--text-primary)",
                }}
              >
                {text}
              </span>
            </li>
          ))}
        </ol>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <DsButton
            variant="primary"
            size="lg"
            block
            loading={isChecking}
            onClick={handleAlreadyVerified}
          >
            Já confirmei, entrar
          </DsButton>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              minHeight: 44,
              fontSize: 14,
              color: "var(--text-secondary)",
            }}
          >
            {cooldown > 0 ? (
              <span style={{ fontVariantNumeric: "tabular-nums" }}>
                Reenviar email em {formatCountdown(cooldown)}
              </span>
            ) : (
              <>
                Não recebeste?{" "}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isResending}
                  style={{ ...kitLinkButton, opacity: isResending ? 0.6 : 1 }}
                >
                  {isResending ? "A reenviar..." : "Reenviar email"}
                </button>
              </>
            )}
          </div>
        </div>

        <p style={{ ...kitText, textAlign: "center" }}>
          Email errado?{" "}
          <button type="button" onClick={handleAlterEmail} style={kitLinkButton}>
            Alterar email
          </button>
        </p>

        {canChangeEmail && showEmailChange && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <DsFieldLabel>Novo email</DsFieldLabel>
              <DsInput
                icon="mail"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="novo@email.com"
                disabled={isSavingEmail}
              />
            </div>
            <DsButton
              variant="primary"
              size="lg"
              block
              loading={isSavingEmail}
              disabled={isSavingEmail || !newEmail}
              onClick={handleChangeEmail}
            >
              Actualizar email
            </DsButton>
          </div>
        )}
      </AuthFormShell>
      <AuthBrandPanel />
    </AuthRoot>
  );
}
