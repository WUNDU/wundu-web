"use client";

import { Suspense, useEffect, useState, type ReactNode } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { DsButton, DsIconTile } from "@/components/auth/ds";
import { AuthBrandPanel } from "@/components/auth/auth-brand-panel";
import {
  AuthFormShell,
  AuthRoot,
} from "@/components/auth/auth-form-shell";
import { LoadingSpinner } from "@/components/ui";
import { ROUTES } from "@/constants/routes";
import { emailVerificationService } from "@/services/email-verification.service";
import { useUserStore } from "@/store/user-store";
import {
  buildVerifyPendingUrl,
  clearPendingVerificationContext,
  getPendingVerificationEmail,
} from "@/utils/pending-verification";

type VerifyState =
  | { status: "loading" }
  | { status: "success" }
  | { status: "expired" }
  | { status: "already-used" }
  | { status: "invalid" };

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { token: authToken, checkAuthStatus } = useUserStore();
  const token = searchParams.get("token");

  const [state, setState] = useState<VerifyState>({ status: "loading" });
  const [verifiedEmail, setVerifiedEmail] = useState("");

  useEffect(() => {
    if (!token) {
      setState({ status: "invalid" });
      return;
    }

    emailVerificationService
      .verifyEmail(token)
      .then(async () => {
        setVerifiedEmail(getPendingVerificationEmail());
        clearPendingVerificationContext();
        if (authToken) {
          await checkAuthStatus();
        }
        setState({ status: "success" });
      })
      .catch((err: any) => {
        const code: string | undefined = err?.errorCode;
        if (code === "TOKEN_EXPIRED") {
          setState({ status: "expired" });
        } else if (code === "TOKEN_ALREADY_USED") {
          setState({ status: "already-used" });
        } else {
          setState({ status: "invalid" });
        }
      });
  }, [authToken, checkAuthStatus, token]);

  const pendingEmail = getPendingVerificationEmail();
  const requestNewUrl = pendingEmail ? buildVerifyPendingUrl(pendingEmail) : ROUTES.LOGIN;

  return (
    <AuthRoot>
      <AuthFormShell>
        <StateContent
          status={state.status}
          verifiedEmail={verifiedEmail}
          onLogin={() => router.push(ROUTES.LOGIN)}
          onRequestNew={() => router.push(requestNewUrl)}
        />
      </AuthFormShell>
      <AuthBrandPanel />
    </AuthRoot>
  );
}

// ── Resultado no padrão do kit ───────────────────────────────────────────────

function KitResult({
  icon,
  tone,
  title,
  text,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
}: {
  icon: string;
  tone: "brand" | "in" | "yellow" | "green" | "purple";
  title: string;
  text: ReactNode;
  primaryLabel: string;
  onPrimary: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <DsIconTile icon={icon} tone={tone} size="lg" />
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em" }}>
          {title}
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: 15,
            lineHeight: 1.55,
            color: "var(--text-secondary)",
          }}
        >
          {text}
        </p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <DsButton variant="primary" size="lg" block onClick={onPrimary}>
          {primaryLabel}
        </DsButton>
        {secondaryLabel ? (
          <DsButton variant="ghost" size="lg" block onClick={onSecondary}>
            {secondaryLabel}
          </DsButton>
        ) : null}
      </div>
    </div>
  );
}

function StateContent({
  status,
  verifiedEmail,
  onLogin,
  onRequestNew,
}: {
  status: VerifyState["status"];
  verifiedEmail: string;
  onLogin: () => void;
  onRequestNew: () => void;
}) {
  if (status === "loading") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          padding: "32px 0",
          textAlign: "center",
        }}
      >
        <LoadingSpinner size="md" message="" />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em" }}>
            A verificar o teu email...
          </h1>
          <p style={{ margin: 0, fontSize: 15, color: "var(--text-secondary)" }}>
            Aguarda um momento, estamos a processar o teu link.
          </p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <KitResult
        icon="mail-check"
        tone="in"
        title="Email confirmado"
        text={
          verifiedEmail ? (
            <>
              A tua conta{" "}
              <strong style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                {verifiedEmail}
              </strong>{" "}
              está activa. Entra com o teu email e palavra-passe para configurar
              a Wundu.
            </>
          ) : (
            "A tua conta está activa. Entra com o teu email e palavra-passe para configurar a Wundu."
          )
        }
        primaryLabel="Entrar"
        onPrimary={onLogin}
      />
    );
  }

  if (status === "expired") {
    return (
      <KitResult
        icon="mail"
        tone="yellow"
        title="O link de verificação expirou."
        text="Os links de verificação são válidos por 24 horas. Pede um novo link para continuar."
        primaryLabel="Pedir novo link"
        onPrimary={onRequestNew}
        secondaryLabel="Voltar ao login"
        onSecondary={onLogin}
      />
    );
  }

  if (status === "already-used") {
    return (
      <KitResult
        icon="mail-check"
        tone="in"
        title="O teu email já foi verificado."
        text="A tua conta já estava activa. Podes entrar directamente."
        primaryLabel="Entrar"
        onPrimary={onLogin}
      />
    );
  }

  // invalid
  return (
    <KitResult
      icon="mail"
      tone="brand"
      title="Link inválido."
      text="O link que seguiste não é válido ou foi corrompido. Pede um novo link de verificação."
      primaryLabel="Pedir novo link"
      onPrimary={onRequestNew}
      secondaryLabel="Voltar ao login"
      onSecondary={onLogin}
    />
  );
}

// ── Page export (Suspense boundary required for useSearchParams in Next 14) ────

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <AuthRoot>
          <AuthFormShell>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "64px 0",
              }}
            >
              <LoadingSpinner size="lg" message="A verificar o teu email..." />
            </div>
          </AuthFormShell>
          <AuthBrandPanel />
        </AuthRoot>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
