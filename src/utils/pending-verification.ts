"use client";

const EMAIL_KEY = "pending_verification_email";
const COOLDOWN_UNTIL_KEY = "pending_verification_cooldown_until";

const isBrowser = () => typeof window !== "undefined";

export function getPendingVerificationEmail() {
  if (!isBrowser()) return "";
  return sessionStorage.getItem(EMAIL_KEY) ?? "";
}

export function setPendingVerificationEmail(email: string) {
  if (!isBrowser()) return;

  const normalizedEmail = email.trim();

  if (!normalizedEmail) {
    sessionStorage.removeItem(EMAIL_KEY);
    return;
  }

  sessionStorage.setItem(EMAIL_KEY, normalizedEmail);
}

export function clearPendingVerificationEmail() {
  if (!isBrowser()) return;
  sessionStorage.removeItem(EMAIL_KEY);
}

export function getPendingVerificationCooldownSeconds() {
  if (!isBrowser()) return 0;

  const raw = sessionStorage.getItem(COOLDOWN_UNTIL_KEY);
  if (!raw) return 0;

  const cooldownUntil = Number(raw);
  if (!Number.isFinite(cooldownUntil)) {
    sessionStorage.removeItem(COOLDOWN_UNTIL_KEY);
    return 0;
  }

  const remainingSeconds = Math.ceil((cooldownUntil - Date.now()) / 1000);
  if (remainingSeconds <= 0) {
    sessionStorage.removeItem(COOLDOWN_UNTIL_KEY);
    return 0;
  }

  return remainingSeconds;
}

export function setPendingVerificationCooldown(seconds: number) {
  if (!isBrowser()) return;

  if (!Number.isFinite(seconds) || seconds <= 0) {
    sessionStorage.removeItem(COOLDOWN_UNTIL_KEY);
    return;
  }

  sessionStorage.setItem(COOLDOWN_UNTIL_KEY, String(Date.now() + seconds * 1000));
}

export function clearPendingVerificationCooldown() {
  if (!isBrowser()) return;
  sessionStorage.removeItem(COOLDOWN_UNTIL_KEY);
}

export function clearPendingVerificationContext() {
  clearPendingVerificationEmail();
  clearPendingVerificationCooldown();
}

export function buildVerifyPendingUrl(email?: string) {
  const normalizedEmail = email?.trim();
  if (!normalizedEmail) return "/verify-pending";

  const params = new URLSearchParams({ email: normalizedEmail });
  return `/verify-pending?${params.toString()}`;
}
