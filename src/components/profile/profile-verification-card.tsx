"use client";

import { useCallback, useEffect, useState } from "react";
import { emailVerificationService } from "@/services/email-verification.service";
import { useUserStore } from "@/store/user-store";
import { wunduToast } from "@/utils/toast";
import {
  getPendingVerificationCooldownSeconds,
  setPendingVerificationCooldown,
} from "@/utils/pending-verification";

const RESEND_COOLDOWN = 300;

function formatCountdown(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/**
 * Card de verificação de email exibido no perfil.
 *
 * Novo paradigma: a conta funciona sem verificação. Este card é o único lugar
 * onde o utilizador é avisado de que o email não está verificado e pode optar
 * por verificar quando quiser. Não bloqueia o acesso à aplicação.
 */
export default function ProfileVerificationCard() {
  const { user } = useUserStore();
  const [cooldown, setCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    setCooldown(getPendingVerificationCooldownSeconds());
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const handleResend = useCallback(async () => {
    if (!user?.email || cooldown > 0 || isResending) return;
    setIsResending(true);
    try {
      await emailVerificationService.resendVerification(user.email);
      setPendingVerificationCooldown(RESEND_COOLDOWN);
      setCooldown(RESEND_COOLDOWN);
      wunduToast.success("Email de verificação enviado!", {
        description: "Verifica a tua caixa de entrada para confirmar a conta.",
      });
    } catch (error: any) {
      const retryAfterSeconds =
        typeof error?.retryAfterSeconds === "number" ? error.retryAfterSeconds : 0;
      if (retryAfterSeconds > 0) {
        setPendingVerificationCooldown(retryAfterSeconds);
        setCooldown(retryAfterSeconds);
      }
      if (error?.status === 429) {
        wunduToast.error(
          `Aguarda ${formatCountdown(retryAfterSeconds || RESEND_COOLDOWN)} antes de reenviar.`
        );
      } else {
        wunduToast.error(
          error?.message || "Não foi possível enviar. Tenta novamente."
        );
      }
    } finally {
      setIsResending(false);
    }
  }, [user?.email, cooldown, isResending]);

  // Verificada ou ainda sem utilizador → nada a mostrar.
  if (!user || user.isActive) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-amber-200 bg-amber-50/60">
      <div className="flex items-start gap-3 px-5 py-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400/20">
          <svg className="h-5 w-5 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2.94 6.412A2 2 0 0 0 2 8.236V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.236a2 2 0 0 0-.94-1.714l-6-3.75a2 2 0 0 0-2.12 0l-6 3.75ZM10 11a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm0 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-amber-900">
            Conta por verificar
          </p>
          <p className="mt-0.5 text-xs leading-relaxed text-amber-700">
            A tua conta funciona normalmente. Verifica o email{" "}
            <span className="font-semibold">{user.email}</span> quando quiseres
            para protegeres o acesso.
          </p>
        </div>
      </div>
      <div className="flex justify-end border-t border-amber-200/60 px-5 py-3">
        <button
          onClick={handleResend}
          disabled={cooldown > 0 || isResending}
          className="rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isResending
            ? "A enviar..."
            : cooldown > 0
              ? `Reenviar em ${formatCountdown(cooldown)}`
              : "Verificar agora"}
        </button>
      </div>
    </div>
  );
}
