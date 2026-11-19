"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthBrandPanel } from "@/components/auth/auth-brand-panel";
import {
  AuthFormShell,
  AuthRoot,
} from "@/components/auth/auth-form-shell";
import {
  DsButton,
  DsFieldLabel,
  DsIcon,
  DsIconTile,
  DsInput,
} from "@/components/auth/ds";
import { ROUTES } from "@/constants/routes";
import { PasswordResetData } from "@/types/ui";
import { validatePasswordDetailed } from "@/utils/validation";
import { wunduToast } from "@/utils/toast";
import { usePasswordRecovery } from "@/hooks/use-password-recovery";

const PREFILL_EMAIL_KEY = "wundu-prefill-email";
const RESEND_COOLDOWN = 45;

function strength(pw: string) {
  const rules = [
    { text: "Pelo menos 8 caracteres", ok: pw.length >= 8 },
    { text: "Uma letra maiúscula", ok: /[A-Z]/.test(pw) },
    { text: "Um número", ok: /\d/.test(pw) },
    { text: "Um símbolo", ok: /[^A-Za-z0-9]/.test(pw) },
  ];
  const score = pw ? rules.filter((r) => r.ok).length : 0;
  const lv = [
    null,
    { label: "Fraca", color: "var(--danger)" },
    { label: "Razoável", color: "var(--warning)" },
    { label: "Boa", color: "var(--info)" },
    { label: "Forte", color: "var(--success)" },
  ][score] as { label: string; color: string } | null;
  return {
    score,
    label: lv ? lv.label : "",
    color: lv ? lv.color : "var(--text-tertiary)",
    segs: [0, 1, 2, 3].map((i) =>
      i < score && lv ? lv.color : "var(--surface-track)",
    ),
    rules: rules.map((r) => ({
      ...r,
      color: r.ok ? "var(--success)" : "var(--text-tertiary)",
    })),
  };
}

function ScreenHeader({ title, subtitle }: { title: string; subtitle: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em" }}>
        {title}
      </h1>
      <p style={{ margin: 0, fontSize: 15, color: "var(--text-secondary)" }}>
        {subtitle}
      </p>
    </div>
  );
}

// ── Step 1: Email ──
function StepEmail({
  initialEmail,
  nextStep,
  setResetData,
  sendRequestEmail,
}: {
  initialEmail: string;
  nextStep: () => void;
  setResetData: (d: PasswordResetData) => void;
  sendRequestEmail: (email: string) => Promise<{ success: boolean; retryAfter?: number }>;
}) {
  const [email, setEmail] = useState(initialEmail);
  const [invalid, setInvalid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!email.includes("@")) {
      setInvalid(true);
      return;
    }
    setInvalid(false);
    setIsLoading(true);
    const result = await sendRequestEmail(email);
    setIsLoading(false);
    if (result.success) {
      setResetData({ phoneOrEmail: email });
      nextStep();
    } else {
      setInvalid(true);
      wunduToast.error("Não foi possível enviar o código", {
        description: "Tenta novamente dentro de instantes.",
      });
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <DsIconTile icon="key-round" tone="brand" size="lg" />
      <ScreenHeader
        title="Recuperar palavra-passe"
        subtitle="Indica o email da tua conta. Vais receber um código de 6 dígitos para definires uma nova palavra-passe."
      />
      <form onSubmit={submit} noValidate style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <DsFieldLabel>Email</DsFieldLabel>
        <DsInput
          icon="mail"
          type="email"
          autoComplete="email"
          placeholder="nome@exemplo.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setInvalid(false);
          }}
          invalid={invalid}
          autoFocus
        />
      </form>
      <DsButton variant="primary" size="lg" block loading={isLoading} onClick={() => void submit()}>
        Enviar código
      </DsButton>
      <p style={{ margin: 0, textAlign: "center", fontSize: 14, color: "var(--text-secondary)" }}>
        Lembraste-te?{" "}
        <DsLinkButton to={ROUTES.LOGIN}>Voltar a entrar</DsLinkButton>
      </p>
    </div>
  );
}

function DsLinkButton({ to, children }: { to: string; children: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      className="wa-link"
      onClick={() => router.push(to)}
    >
      {children}
    </button>
  );
}

// ── Step 2: Code ──
function StepCode({
  data,
  setResetData,
  nextStep,
  prevStep,
  verifyOtp,
  sendRequestEmail,
  onResend,
  resendIn,
}: {
  data: PasswordResetData;
  setResetData: (d: PasswordResetData) => void;
  nextStep: () => void;
  prevStep: () => void;
  verifyOtp: (d: { email: string; otp: string }) => Promise<{ success: boolean; errorMessage?: string; retryAfter?: number }>;
  sendRequestEmail: (email: string) => Promise<{ success: boolean; retryAfter?: number }>;
  onResend: () => void;
  resendIn: number;
}) {
  const [code, setCode] = useState("");
  const [incorrect, setIncorrect] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const fillFrom = (start: number, text: string) => {
    const chars = text.replace(/\D/g, "").slice(0, 6 - start).split("");
    if (!chars.length) return;
    setCode((prev) => {
      let next = prev;
      chars.forEach((c, k) => {
        next = next.slice(0, start + k) + c + next.slice(start + k + 1);
      });
      return next.slice(0, 6);
    });
    setIncorrect(false);
    inputRefs.current[Math.min(5, start + chars.length)]?.focus();
  };

  const setCell = (index: number, val: string) => {
    const clean = val.replace(/\D/g, "");
    let next = code;
    if (clean.length > 1) {
      const chars = clean.slice(0, 6 - index).split("");
      chars.forEach((c, k) => {
        next = next.slice(0, index + k) + c + next.slice(index + k + 1);
      });
    } else {
      next = next.slice(0, index) + clean + next.slice(index + 1);
    }
    setCode(next.slice(0, 6));
    setIncorrect(false);
    const nextIndex = clean.length > 1 ? Math.min(5, index + clean.length) : clean ? index + 1 : index;
    if (nextIndex !== index && inputRefs.current[nextIndex]) {
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const pasteCode = (index: number, text: string) => {
    fillFrom(index, text);
  };

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (code.length !== 6 || !data.phoneOrEmail) return;
    setIsLoading(true);
    const result = await verifyOtp({ email: data.phoneOrEmail, otp: code });
    setIsLoading(false);
    if (result.success) {
      setIncorrect(false);
      setCorrect(true);
      setResetData({ code });
      setTimeout(nextStep, 400);
    } else {
      setIncorrect(true);
      setCorrect(false);
    }
  };

  const resend = async () => {
    if (!data.phoneOrEmail || resendIn > 0) return;
    setIsResending(true);
    const result = await sendRequestEmail(data.phoneOrEmail);
    setIsResending(false);
    if (result.success) onResend();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <DsIconTile icon="mail-check" tone="brand" size="lg" />
      <ScreenHeader
        title="Introduz o código"
        subtitle={
          <>
            Enviámos um código de 6 dígitos para{" "}
            <strong style={{ color: "var(--text-primary)", fontWeight: 600 }}>
              {data.phoneOrEmail}
            </strong>
            . Expira em 2 minutos.
          </>
        }
      />
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <DsFieldLabel>Código de verificação</DsFieldLabel>
        <div style={{ display: "flex", gap: 8 }}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <input
              key={i}
              ref={(el) => {
                inputRefs.current[i] = el;
              }}
              value={code[i] || ""}
              onChange={(e) => setCell(i, e.target.value)}
              onPaste={(e) => {
                e.preventDefault();
                pasteCode(i, e.clipboardData.getData("text"));
              }}
              onKeyDown={(e) => {
                if (e.key === "Backspace" && !code[i] && i > 0) {
                  inputRefs.current[i - 1]?.focus();
                }
              }}
              onFocus={(e) => e.target.select()}
              inputMode="numeric"
              autoComplete="one-time-code"
              aria-label={`Dígito ${i + 1}`}
              maxLength={1}
              className={`wa-code${incorrect ? " wa-code--error" : ""}${correct ? " wa-code--success" : ""}`}
            />
          ))}
        </div>
        {incorrect ? (
          <p style={{ margin: 0, fontSize: 14, color: "var(--danger)" }}>
            Código incorreto. Tenta novamente.
          </p>
        ) : null}
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, color: "var(--text-secondary)" }}>
          {resendIn > 0 ? (
            <span style={{ fontVariantNumeric: "tabular-nums" }}>
              Reenviar código em {Math.floor(resendIn / 60)}:{String(resendIn % 60).padStart(2, "0")}
            </span>
          ) : (
            <>
              Não recebeste?{" "}
              <button
                type="button"
                className="wa-link"
                disabled={isResending}
                onClick={() => void resend()}
              >
                {isResending ? "A reenviar..." : "Reenviar código"}
              </button>
            </>
          )}
        </div>
      </form>
      <DsButton
        variant="primary"
        size="lg"
        block
        loading={isLoading}
        disabled={code.length !== 6}
        onClick={() => void submit()}
      >
        Confirmar
      </DsButton>
      <p style={{ margin: 0, textAlign: "center", fontSize: 14, color: "var(--text-secondary)" }}>
        Email errado?{" "}
        <button type="button" className="wa-link" onClick={prevStep}>
          Alterar email
        </button>
      </p>
    </div>
  );
}

// ── Step 3: New password ──
function StepNewPassword({
  data,
  nextStep,
  resetPassword,
}: {
  data: PasswordResetData;
  nextStep: () => void;
  resetPassword: (d: { email: string; otp: string; newPassword: string; confirmPassword: string }) => Promise<{ success: boolean; retryAfter?: number }>;
}) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showNewPw, setShowNewPw] = useState(false);
  const [mismatchTouched, setMismatchTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const st = strength(password);
  const mismatch = mismatchTouched && confirm ? confirm !== password : false;

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (st.score < 3 || password !== confirm || !data.phoneOrEmail || !data.code) return;
    const detailed = validatePasswordDetailed(password);
    if (!detailed.isValid) {
      wunduToast.error("Senha fraca", { description: detailed.messages.join(" ") });
      return;
    }
    setIsLoading(true);
    const result = await resetPassword({
      email: data.phoneOrEmail,
      otp: data.code,
      newPassword: password,
      confirmPassword: confirm,
    });
    setIsLoading(false);
    if (result.success) {
      nextStep();
    } else {
      wunduToast.error("Não foi possível actualizar", {
        description: "Tenta novamente dentro de instantes.",
      });
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <ScreenHeader
        title="Define uma nova palavra-passe"
        subtitle="Escolhe uma palavra-passe que não tenhas usado antes nesta conta."
      />
      <form onSubmit={submit} noValidate style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <DsFieldLabel>Nova palavra-passe</DsFieldLabel>
          <DsInput
            icon="lock"
            type={showNewPw ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Mínimo 8 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            trailingIcon={showNewPw ? "eye-off" : "eye"}
            onTrailingClick={() => setShowNewPw((v) => !v)}
            autoFocus
          />
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 4 }}>
            <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6 }}>
              {st.segs.map((bg, i) => (
                <div key={i} style={{ height: 6, borderRadius: 999, background: bg }} />
              ))}
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, minWidth: 64, textAlign: "right", color: st.color }}>
              {st.label}
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: "8px 12px", marginTop: 4 }}>
            {st.rules.map((r) => (
              <div key={r.text} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: r.color }}>
                <DsIcon name={r.ok ? "circle-check" : "circle"} size={16} />
                {r.text}
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <DsFieldLabel>Confirmar palavra-passe</DsFieldLabel>
          <DsInput
            icon="lock"
            type={showNewPw ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Repete a palavra-passe"
            value={confirm}
            onChange={(e) => {
              setConfirm(e.target.value);
              setMismatchTouched(true);
            }}
            error={mismatch ? "As palavras-passe não coincidem." : false}
          />
        </div>
      </form>
      <DsButton
        variant="primary"
        size="lg"
        block
        loading={isLoading}
        disabled={st.score < 3 || password !== confirm}
        onClick={() => void submit()}
      >
        Actualizar palavra-passe
      </DsButton>
    </div>
  );
}

// ── Step 4: Done ──
function StepDone() {
  const router = useRouter();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <DsIconTile icon="shield-check" tone="in" size="lg" />
      <ScreenHeader
        title="Palavra-passe actualizada"
        subtitle="Já podes entrar com a nova palavra-passe. As outras sessões activas foram terminadas."
      />
      <DsButton variant="primary" size="lg" block onClick={() => router.push(ROUTES.LOGIN)}>
        Entrar
      </DsButton>
    </div>
  );
}

export default function PasswordReset() {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<PasswordResetData>({});
  const [prefill, setPrefill] = useState("");
  const [resendIn, setResendIn] = useState(0);
  const { sendRequestEmail, verifyOtp, resetPassword } = usePasswordRecovery();

  useEffect(() => {
    try {
      const saved = localStorage.getItem(PREFILL_EMAIL_KEY);
      if (saved) {
        setPrefill(saved);
        localStorage.removeItem(PREFILL_EMAIL_KEY);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (resendIn <= 0) return;
    const id = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [resendIn]);

  const setResetData = (d: PasswordResetData) => setData((prev) => ({ ...prev, ...d }));
  const startResendCooldown = () => setResendIn(RESEND_COOLDOWN);

  return (
    <AuthRoot>
      <AuthFormShell
        backTo={currentStep === 1 ? ROUTES.LOGIN : undefined}
        onBack={
          currentStep === 2
            ? () => setCurrentStep(1)
            : currentStep === 3
              ? () => setCurrentStep(2)
              : undefined
        }
      >
        {currentStep === 1 ? (
          <StepEmail
            initialEmail={prefill}
            nextStep={() => {
              setCurrentStep(2);
              startResendCooldown();
            }}
            setResetData={setResetData}
            sendRequestEmail={sendRequestEmail}
          />
        ) : null}
        {currentStep === 2 ? (
          <StepCode
            data={data}
            setResetData={setResetData}
            nextStep={() => setCurrentStep(3)}
            prevStep={() => setCurrentStep(1)}
            verifyOtp={verifyOtp}
            sendRequestEmail={sendRequestEmail}
            onResend={startResendCooldown}
            resendIn={resendIn}
          />
        ) : null}
        {currentStep === 3 ? (
          <StepNewPassword
            data={data}
            nextStep={() => setCurrentStep(4)}
            resetPassword={resetPassword}
          />
        ) : null}
        {currentStep === 4 ? <StepDone /> : null}
      </AuthFormShell>
      <AuthBrandPanel />
    </AuthRoot>
  );
}
