import posthog from "posthog-js";

const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;

// Sem chave o PostHog fica desactivado (evita init com undefined em prod).
if (key) {
  posthog.init(key, {
    api_host: "/ingest",
    ui_host: "https://us.posthog.com",
    defaults: "2026-01-30",
    capture_exceptions: true,
    // Acessos e eventos SEMPRE activos. O consentimento (analyticsConsent)
    // controla APENAS a gravação de sessão (screen recording), gerida em
    // src/lib/analytics.ts via start/stopSessionRecording.
    opt_out_capturing_by_default: false,
    disable_session_recording: true,
    // Pageview manual via PostHogPageView (mount + cada navegação SPA).
    // Manter o autocapture ligado duplicaria o acesso do load inicial.
    capture_pageview: false,
  });
}
