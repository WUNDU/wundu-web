import posthog from "posthog-js";

// Consentimento (analyticsConsent) controla APENAS a gravação de sessão
// (screen recording). Acessos ($pageview), eventos e identify funcionam
// sempre, com ou sem consentimento.
let recordingConsented = false;

function isLoaded(): boolean {
  return typeof window !== "undefined" && posthog.__loaded;
}

// Eventos/acessos/identify são enfileirados pelo SDK mesmo antes do init
// terminar — por isso só bloqueiam no SSR, nunca por falta de consentimento
// ou por SDK ainda a carregar.
function isClient(): boolean {
  return typeof window !== "undefined";
}

export function initAnalytics(recordingConsent: boolean): void {
  recordingConsented = recordingConsent;
  if (!isLoaded()) return;

  // Eventos/acessos sempre activos — garante que um opt-out anterior não bloqueie.
  posthog.opt_in_capturing();

  if (recordingConsent) {
    posthog.startSessionRecording();
  } else {
    posthog.stopSessionRecording();
  }
}

export function identifyUser(userId: string, properties?: Record<string, unknown>): void {
  if (!isClient()) return;
  posthog.identify(userId, properties);
}

export function resetIdentification(): void {
  if (!isClient()) return;
  posthog.reset();
}

export function captureEvent(event: string, properties?: Record<string, unknown>): void {
  if (!isClient()) return;
  posthog.capture(event, { ...properties, $source: "web" });
}

export function capturePageview(extra?: Record<string, unknown>): void {
  if (!isClient()) return;
  posthog.capture("$pageview", extra);
}

export function captureException(error: unknown): void {
  if (!isClient()) return;
  posthog.captureException(error);
}

export function stopAnalytics(): void {
  recordingConsented = false;
  if (!isClient()) return;
  // Para a gravação mas MANTÉM a captura de eventos/acessos activa.
  if (isLoaded()) posthog.stopSessionRecording();
  posthog.reset();
}

export function hasConsent(): boolean {
  return recordingConsented;
}
