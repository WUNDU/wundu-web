"use client";

import {
  emailVerificationService,
} from "@/services/email-verification.service";
import {
  buildVerifyPendingUrl,
  getPendingVerificationEmail,
  setPendingVerificationEmail,
} from "@/utils/pending-verification";

/**
 * Barreira de verificação para sessões restauradas (refresh no arranque).
 *
 * O `isActive` do `/users/me` NÃO reflete a verificação do email (é sempre
 * `true` em período de graça) — a fonte de verdade é o
 * `GET /auth/email-verification-status`. Se a conta não estiver verificada,
 * desvia para a verificação e devolve `true`.
 *
 * Caminho rápido sem rede: havendo email pendente (signup, login bloqueado),
 * vai direto para a verificação. Em erro de rede, deixa passar (fail open):
 * uma sessão válida não fica bloqueada por falta de rede.
 */
export async function redirectUnverifiedToPending(
  fallbackEmail: string | undefined,
  navigate: (url: string) => void
): Promise<boolean> {
  const pending = getPendingVerificationEmail();
  if (pending) {
    navigate(buildVerifyPendingUrl(pending));
    return true;
  }

  if (!fallbackEmail) return false;

  try {
    const status = await emailVerificationService.getEmailVerificationStatus();
    if (status.emailVerified === false) {
      const email = status.email || fallbackEmail;
      setPendingVerificationEmail(email);
      navigate(buildVerifyPendingUrl(email));
      return true;
    }
  } catch {
    // fail open
  }
  return false;
}
