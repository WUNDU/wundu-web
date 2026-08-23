import posthog from "posthog-js";

let consented = false;

export function initAnalytics(analyticsConsent: boolean): void {
  consented = analyticsConsent;

  if (!analyticsConsent) {
    if (posthog.__loaded) {
      posthog.opt_out_capturing();
      posthog.reset();
    }
    return;
  }

  // PostHog já está inicializado em instrumentation-client.ts com opt_out_capturing_by_default.
  // Apenas activamos a captação se o consentimento for dado.
  if (posthog.__loaded) {
    posthog.opt_in_capturing();
  }
}

export function identifyUser(userId: string, properties?: Record<string, unknown>): void {
  if (!consented) return;
  posthog.identify(userId, properties);
}

export function resetIdentification(): void {
  posthog.reset();
}

export function captureEvent(event: string, properties?: Record<string, unknown>): void {
  if (!consented) return;
  posthog.capture(event, { ...properties, $source: "web" });
}

export function captureException(error: unknown): void {
  if (!consented) return;
  posthog.captureException(error);
}

export function stopAnalytics(): void {
  consented = false;
  if (posthog.__loaded) {
    posthog.opt_out_capturing();
  }
  posthog.reset();
}

export function hasConsent(): boolean {
  return consented;
}
