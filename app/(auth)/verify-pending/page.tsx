"use client";

import { useState, useEffect, useCallback, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { LogoType, Button, Input, LoadingSpinner } from "@/components/ui";
import { DsButton, DsIconTile } from "@/components/auth/ds";
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
  }, [applyCooldown, cooldown, email, isResending]);

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
      const fresh = await userService.getUser();
      if (fresh.isActive) {
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

  return (
    <div className="wundu-auth flex min-h-screen flex-col bg-white md:bg-[#fafafa]">
      <header className="flex h-16 shrink-0 items-center justify-start px-8 md:px-12">
        <Link href={ROUTES.LANDINGPAGE} className="transition-opacity hover:opacity-80">
          <div className="w-30">
            <LogoType />
          </div>
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-255">
          <div className="flex w-full flex-col bg-white md:h-130 md:flex-row md:rounded-3xl md:border md:border-slate-200/50 md:shadow-[0_1px_2px_rgba(0,0,0,0.01),0_8px_16px_rgba(0,0,0,0.02)] overflow-hidden">

            {/* Visual column */}
            <div className="hidden flex-1 items-center justify-center border-r border-slate-100/80 bg-[#f9f9f9]/50 p-12 lg:flex">
              <div className="flex flex-col items-center gap-6">
                {/* Animated envelope */}
                <div className="relative">
                  <motion.div
                    animate={{ scale: [1, 1.06, 1] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                    className="flex h-28 w-28 items-center justify-center rounded-full bg-secondary/8 motion-reduce:animate-none"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.04, 1] }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                      className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary/12 motion-reduce:animate-none"
                    >
                      <svg
                        className="h-10 w-10 text-secondary"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                        />
                      </svg>
                    </motion.div>
                  </motion.div>

                  {/* Orbiting dot */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 motion-reduce:hidden"
                  >
                    <div className="absolute -top-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-primary" />
                  </motion.div>
                </div>

                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-600">
                    Verifica a tua caixa de entrada
                  </p>
                </div>
              </div>
            </div>

            {/* Content side */}
            <div className="flex flex-1 flex-col justify-center gap-6 px-6 py-10 sm:px-12 md:px-14 lg:px-16">
              <DsIconTile icon="mail" tone="brand" size="lg" />
              <header className="flex flex-col gap-2">
                <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em" }}>
                  Confirma o teu email
                </h1>
                <p style={{ margin: 0, fontSize: 15, lineHeight: 1.55, color: "var(--text-secondary)" }}>
                  Enviámos um link de activação para{" "}
                  <strong style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                    {email || "o teu email"}
                  </strong>
                  . A conta só fica activa depois de abrires esse link. Até lá não é possível entrar na Wundu.
                </p>
              </header>

              <ol style={{ listStyle: "none", margin: 0, padding: 0, border: "1px solid var(--border-subtle)", borderRadius: 14, background: "var(--surface-card)" }}>
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
                    <span style={{ fontSize: 14, lineHeight: 1.45, color: "var(--text-primary)" }}>
                      {text}
                    </span>
                  </li>
                ))}
              </ol>

              <div className="flex flex-col gap-2.5">
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

                {/* Change email section */}
                <div className="text-center">
                  <p style={{ margin: 0, fontSize: 14, color: "var(--text-secondary)" }}>
                    Email errado?{" "}
                    <button
                      type="button"
                      onClick={handleAlterEmail}
                      style={kitLinkButton}
                    >
                      Alterar email
                    </button>
                  </p>
                  {canChangeEmail && (
                    <AnimatePresence>
                      {showEmailChange && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.22, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="mt-3 flex flex-col gap-3">
                            <Input
                              id="new-email"
                              label="Novo email"
                              type="email"
                              value={newEmail}
                              onChange={(e) => setNewEmail(e.target.value)}
                              placeholder="novo@email.com"
                              disabled={isSavingEmail}
                              className="h-11 border-slate-200 bg-slate-50/40 text-[14px] transition-all focus:border-slate-900 focus:bg-white"
                            />
                            <Button
                              variant="primary"
                              fullWidth
                              disabled={isSavingEmail || !newEmail}
                              onClick={handleChangeEmail}
                              className="h-10 rounded-xl text-sm font-bold"
                            >
                              {isSavingEmail ? (
                                <span className="flex items-center gap-2">
                                  <LoadingSpinner size="sm" />
                                  A guardar...
                                </span>
                              ) : (
                                "Actualizar email"
                              )}
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
