"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthBrandPanel } from "@/components/auth/auth-brand-panel";
import {
  AuthFormShell,
  AuthRoot,
} from "@/components/auth/auth-form-shell";
import {
  DsButton,
  DsDivider,
  DsFieldLabel,
  DsIcon,
  DsInput,
  DsLink,
  GoogleLogo,
} from "@/components/auth/ds";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/use-auth";
import { useUserStore } from "@/store/user-store";
import { wunduToast } from "@/utils/toast";
import { getApiErrorMessage, getRegisterErrorField } from "@/utils/api-error";
import {
  buildVerifyPendingUrl,
  setPendingVerificationEmail,
} from "@/utils/pending-verification";
import {
  validateEmail,
  validateName,
  validatePasswordDetailed,
  validatePhoneNumber,
} from "@/utils/validation";
import { identifyUser, captureEvent, captureException } from "@/lib/analytics";

const PREFILL_EMAIL_KEY = "wundu-prefill-email";
const PENDING_BIRTHDATE_KEY = "wundu-pending-birthdate";

const digits = (v: string, n: number) => v.replace(/\D/g, "").slice(0, n);
const maskDate = (v: string) => {
  const d = digits(v, 8);
  return [d.slice(0, 2), d.slice(2, 4), d.slice(4)].filter(Boolean).join("/");
};
const maskPhone = (v: string) => {
  const d = digits(v, 9);
  return [d.slice(0, 3), d.slice(3, 6), d.slice(6)].filter(Boolean).join(" ");
};
const dobToISO = (dob: string): string | null => {
  const m = dob.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  return m ? `${m[3]}-${m[2]}-${m[1]}` : null;
};

type StrengthRule = { text: string; ok: boolean };

function strength(pw: string): {
  score: number;
  label: string;
  color: string;
  segs: string[];
  rules: (StrengthRule & { color: string })[];
} {
  const rules: StrengthRule[] = [
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

const RegisterPage = () => {
  const { currentStep, prevStep, nextStep, data, setRegisterData } =
    useUserStore();
  const { registerUser, error, clearError } = useAuth();
  const router = useRouter();

  useEffect(() => {
    clearError();
  }, [clearError]);

  const [personalForm, setPersonalFormState] = useState({
    name: data.name || "",
    email: data.email || "",
    phone: data.phone ? maskPhone(data.phone.replace(/^\+244\s?/, "")) : "",
    dob: "",
  });
  const [fieldError, setFieldError] = useState({ name: false, email: false, phone: false, dob: false });
  const [existsErr, setExistsErr] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const [securityForm, setSecurityFormState] = useState({
    password: data.password || "",
    confirmPassword: "",
  });
  const [showNewPw, setShowNewPw] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mismatchTouched, setMismatchTouched] = useState(false);

  const st = strength(securityForm.password);
  const mismatch =
    mismatchTouched && securityForm.confirmPassword
      ? securityForm.confirmPassword !== securityForm.password
      : false;

  const disSignup1 =
    !personalForm.name.trim() ||
    !validateEmail(personalForm.email) ||
    digits(personalForm.phone, 9).length < 9 ||
    personalForm.dob.length < 10 ||
    existsErr;

  const setPersonalField = (field: "name" | "email" | "phone" | "dob", value: string) => {
    const normalized =
      field === "email" ? value.toLowerCase()
      : field === "phone" ? maskPhone(value)
      : field === "dob" ? maskDate(value)
      : value;
    setPersonalFormState((prev) => ({ ...prev, [field]: normalized }));
    setFieldError((prev) => ({ ...prev, [field]: false }));
    if (field === "email") setExistsErr(false);
    if (error) clearError();
  };

  const submitPersonal = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (existsErr) return;
    const next = {
      name: !personalForm.name.trim() || !validateName(personalForm.name),
      email: !validateEmail(personalForm.email),
      phone: !validatePhoneNumber(`+244 ${personalForm.phone}`),
      dob: personalForm.dob.length < 10,
    };
    setFieldError(next);
    if (next.name || next.email || next.phone || next.dob) {
      wunduToast.error("Verifica os teus dados", {
        description: "Há campos por corrigir antes de continuar.",
      });
      return;
    }
    setRegisterData({
      name: personalForm.name,
      email: personalForm.email,
      phone: `+244 ${personalForm.phone}`,
    });
    captureEvent("user_registration_step_completed", { step: 1 });
    nextStep();
  };

  const setSecurityField = (field: "password" | "confirmPassword", value: string) => {
    setSecurityFormState((prev) => ({ ...prev, [field]: value }));
    if (field === "confirmPassword") setMismatchTouched(true);
    if (error) clearError();
  };

  const submitSecurity = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (isSubmitting) return;
    if (st.score < 3 || securityForm.password !== securityForm.confirmPassword) return;
    const detailed = validatePasswordDetailed(securityForm.password);
    if (!detailed.isValid) {
      wunduToast.error("Senha fraca", { description: detailed.messages.join(" ") });
      return;
    }
    clearError();
    setIsSubmitting(true);
    try {
      const ok = await registerUser({ ...data, password: securityForm.password });
      if (ok) {
        setRegisterData({ password: securityForm.password });
        const user = useUserStore.getState().user;
        if (user) identifyUser(user.id);
        captureEvent("user_registered", { name: data.name, email: data.email });
        const iso = dobToISO(personalForm.dob);
        if (iso) {
          try {
            localStorage.setItem(PENDING_BIRTHDATE_KEY, iso);
          } catch {}
        }
        setPendingVerificationEmail(data.email!);
        wunduToast.success("Cadastro concluído!", {
          description: "Enviámos um link de verificação para o teu email.",
        });
        router.push(buildVerifyPendingUrl(data.email));
      } else {
        const message = useUserStore.getState().error || "Falha ao concluir o cadastro.";
        const field = getRegisterErrorField(message);
        if (field === "email") {
          setExistsErr(true);
          clearError();
        } else {
          wunduToast.error("Erro no cadastro", { description: message });
        }
        captureEvent("user_registration_failed", { reason: message });
      }
    } catch (err) {
      const message = getApiErrorMessage(err, "Falha ao concluir o cadastro.");
      wunduToast.error("Erro no cadastro", { description: message });
      captureException(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setIsGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl: ROUTES.GOOGLE_CALLBACK });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const prefillAndGo = (path: string) => {
    try {
      localStorage.setItem(PREFILL_EMAIL_KEY, personalForm.email.trim());
    } catch {}
    setExistsErr(false);
    router.push(path);
  };

  return (
    <AuthRoot>
      <AuthFormShell
        onBack={currentStep === 2 ? prevStep : undefined}
        backTo={currentStep === 1 ? ROUTES.LOGIN : undefined}
        stepLabel={currentStep === 1 ? "Passo 1 de 2" : "Passo 2 de 2"}
      >
        {currentStep === 1 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em" }}>
                Criar conta
              </h1>
              <p style={{ margin: 0, fontSize: 15, color: "var(--text-secondary)" }}>
                Começa pelos teus dados pessoais.
              </p>
            </div>

            <form onSubmit={submitPersonal} noValidate style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <DsFieldLabel>Nome completo</DsFieldLabel>
                <DsInput
                  icon="circle-user"
                  autoComplete="name"
                  placeholder="Ex.: Domkandembe Ferreira"
                  value={personalForm.name}
                  onChange={(e) => setPersonalField("name", e.target.value)}
                  invalid={fieldError.name}
                  autoFocus
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <DsFieldLabel>Email</DsFieldLabel>
                <DsInput
                  icon="mail"
                  type="email"
                  autoComplete="email"
                  placeholder="nome@exemplo.com"
                  value={personalForm.email}
                  onChange={(e) => setPersonalField("email", e.target.value)}
                  invalid={fieldError.email || existsErr}
                  error={existsErr ? "Já existe uma conta com este email." : false}
                />
                {existsErr ? (
                  <div style={{ background: "var(--surface-muted)", borderRadius: 12, padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
                    <span style={{ fontSize: 14, color: "var(--text-secondary)" }}>
                      Entra com este email ou define uma nova palavra-passe.
                    </span>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <DsButton variant="secondary" size="sm" onClick={() => prefillAndGo(ROUTES.LOGIN)}>
                        Entrar com este email
                      </DsButton>
                      <DsButton variant="ghost" size="sm" onClick={() => prefillAndGo("/reset_password")}>
                        Recuperar palavra-passe
                      </DsButton>
                    </div>
                  </div>
                ) : null}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <DsFieldLabel>Telefone</DsFieldLabel>
                <div style={{ display: "flex", gap: 8 }}>
                  <div style={{ height: 48, padding: "0 14px", display: "flex", alignItems: "center", gap: 8, background: "var(--surface-field)", borderRadius: 12, fontSize: 15, fontWeight: 600, color: "var(--text-primary)", flex: "0 0 auto" }}>
                    +244
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <DsInput
                      icon="phone"
                      type="tel"
                      autoComplete="tel-national"
                      placeholder="923 000 000"
                      value={personalForm.phone}
                      onChange={(e) => setPersonalField("phone", e.target.value)}
                      invalid={fieldError.phone}
                    />
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <DsFieldLabel>Nascimento</DsFieldLabel>
                <DsInput
                  icon="calendar"
                  inputMode="numeric"
                  placeholder="DD/MM/AAAA"
                  value={personalForm.dob}
                  onChange={(e) => setPersonalField("dob", e.target.value)}
                  invalid={fieldError.dob}
                />
              </div>
            </form>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <DsButton
                variant="primary"
                size="lg"
                block
                disabled={disSignup1}
                onClick={() => void submitPersonal()}
              >
                Continuar
              </DsButton>
              <DsDivider />
              <DsButton
                variant="outline"
                size="lg"
                block
                loading={isGoogleLoading}
                iconLeft={<GoogleLogo size={20} />}
                onClick={() => void handleGoogle()}
              >
                Continuar com Google
              </DsButton>
            </div>

            <p style={{ margin: 0, textAlign: "center", fontSize: 14, color: "var(--text-secondary)" }}>
              Já tens conta?{" "}
              <DsLink onClick={() => router.push(ROUTES.LOGIN)}>Entrar</DsLink>
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em" }}>
                Cria a tua palavra-passe
              </h1>
              <p style={{ margin: 0, fontSize: 15, color: "var(--text-secondary)" }}>
                É com ela e com o teu email que entras na Wundu.
              </p>
            </div>

            <form onSubmit={submitSecurity} noValidate style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <DsFieldLabel>Palavra-passe</DsFieldLabel>
                <DsInput
                  icon="lock"
                  type={showNewPw ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Mínimo 8 caracteres"
                  value={securityForm.password}
                  onChange={(e) => setSecurityField("password", e.target.value)}
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
                  value={securityForm.confirmPassword}
                  onChange={(e) => setSecurityField("confirmPassword", e.target.value)}
                  error={mismatch ? "As palavras-passe não coincidem." : false}
                />
              </div>
            </form>

            <DsButton
              variant="primary"
              size="lg"
              block
              loading={isSubmitting}
              disabled={st.score < 3 || securityForm.password !== securityForm.confirmPassword}
              onClick={() => void submitSecurity()}
            >
              Criar conta
            </DsButton>
          </div>
        )}
      </AuthFormShell>
      <AuthBrandPanel />
    </AuthRoot>
  );
};

export default RegisterPage;
