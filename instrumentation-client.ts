import posthog from "posthog-js";

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: "/ingest",
  ui_host: "https://us.posthog.com",
  defaults: "2026-01-30",
  capture_exceptions: true,
  // Consentimento é verificado em src/lib/analytics.ts antes de capturar.
  // PostHog fica inicializado mas em modo opt-out até consentimento ser dado.
  opt_out_capturing_by_default: true,
});
