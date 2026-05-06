"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { LogoType, Button, Input, LoadingSpinner } from "@/components/ui";
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

const RESEND_COOLDOWN = 120;

export default function VerifyPendingPage() {
  const router = useRouter();
  const { user, setUser } = useUserStore();
  const queryEmail =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("email") ?? ""
      : "";

  // Resolve email from store or sessionStorage
  const resolvedEmail = user?.email || queryEmail || getPendingVerificationEmail();

  const [email, setEmail] = useState(resolvedEmail);
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
    if (!email && typeof window !== "undefined") {
      router.replace(ROUTES.LOGIN);
    }
  }, [email, router]);

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

  const handleAlreadyVerified = async () => {
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

  return (
    <div className="flex min-h-screen flex-col bg-white md:bg-[#fafafa]">
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
                    className="flex h-28 w-28 items-center justify-center rounded-full bg-[#0048f0]/8"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.04, 1] }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                      className="flex h-20 w-20 items-center justify-center rounded-full bg-[#0048f0]/12"
                    >
                      <svg
                        className="h-10 w-10 text-[#0048f0]"
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
                    className="absolute inset-0"
                  >
                    <div className="absolute -top-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-[#ffd400]" />
                  </motion.div>
                </div>

                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-400">
                    Verifica a tua caixa de entrada
                  </p>
                </div>
              </div>
            </div>

            {/* Content side */}
            <div className="flex flex-1 flex-col justify-center px-6 py-10 sm:px-12 md:px-14 lg:px-16">
              <header className="mb-6">
                <h1 className="text-2xl font-bold tracking-tighter text-slate-900 md:text-3xl">
                  Verifica o teu email
                </h1>
                <p className="mt-2 text-sm font-medium text-slate-500">
                  Enviámos um link de verificação para{" "}
                  <span className="font-bold text-slate-800">
                    {email || "o teu email"}
                  </span>
                  . Clica no link para activar a tua conta.
                </p>
              </header>

              <div className="flex flex-col gap-4">
                {/* Expiry note */}
                <div className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50/60 px-4 py-3">
                  <svg
                    className="h-4 w-4 shrink-0 text-slate-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-xs font-medium text-slate-500">
                    O link expira em 24 horas
                  </p>
                </div>

                {/* Resend button */}
                <Button
                  variant="warning"
                  fullWidth
                  disabled={cooldown > 0 || isResending}
                  onClick={handleResend}
                  className="h-11 rounded-xl text-sm font-extrabold shadow-sm transition-all active:scale-[0.98]"
                >
                  {isResending ? (
                    <span className="flex items-center gap-2">
                      <LoadingSpinner size="sm" />
                      A enviar...
                    </span>
                  ) : cooldown > 0 ? (
                    `Reenviar em ${formatCountdown(cooldown)}`
                  ) : (
                    "Reenviar email de verificação"
                  )}
                </Button>

                {/* Already verified */}
                <Button
                  variant="secondary"
                  fullWidth
                  disabled={isChecking}
                  onClick={handleAlreadyVerified}
                  className="h-11 rounded-xl text-sm font-semibold transition-all active:scale-[0.98]"
                >
                  {isChecking ? (
                    <span className="flex items-center gap-2">
                      <LoadingSpinner size="sm" />
                      A verificar...
                    </span>
                  ) : (
                    "Já verifiquei"
                  )}
                </Button>

                {/* Change email section */}
                {canChangeEmail && (
                  <div className="mt-1 text-center">
                    <button
                      onClick={() => setShowEmailChange((v) => !v)}
                      className="text-xs font-bold text-slate-400 transition-colors hover:text-slate-700"
                    >
                      Email errado?
                    </button>

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
                  </div>
                )}
              </div>

              <footer className="mt-6 border-t border-slate-100 pt-5 text-center">
                <p className="text-sm font-medium text-slate-500">
                  Voltar para{" "}
                  <Link
                    href={ROUTES.LOGIN}
                    className="font-bold text-slate-900 decoration-yellow-400 decoration-2 underline-offset-4 hover:underline"
                  >
                    entrar na conta
                  </Link>
                </p>
              </footer>
            </div>
          </div>

          <footer className="mt-8 px-8 text-center">
            <p className="text-[10px] leading-relaxed text-slate-400 font-medium max-w-sm mx-auto">
              Verifica a pasta de spam se não encontrares o email de verificação.
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
