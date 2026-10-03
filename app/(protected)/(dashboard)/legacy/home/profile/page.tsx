"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { Camera, Loader2, Trash2, MapPin, Calendar, UserCircle, Heart, Users, Briefcase, Wallet } from "lucide-react";
import { user as avatar } from "@/constants/images";
import { EditIcon, EmailIcon } from "@/constants/icons";
import { useAuth } from "@/hooks/use-auth";
import { useUserStore } from "@/store/user-store";
import { useUiStore } from "@/store/ui-store";
import { useGoal } from "@/hooks/use-goal";
import { useTransaction } from "@/hooks/use-transaction";
import { formatAOA } from "@/lib/currency";
import { captureEvent } from "@/lib/analytics";
import { useAnalytics } from "@/contexts/analytics-context";
import { useSessions } from "@/hooks/use-sessions";
import { BRAND_COLORS } from "@/constants/brand-colors";
import ProfileVerificationCard from "@/components/profile/profile-verification-card";
import { EditProfileModal } from "@/components/profile/edit-profile-modal";
import { DemographicFieldRow } from "@/components/profile/demographic-field-row";
import { GENDER_OPTIONS, MARITAL_STATUS_OPTIONS, EMPLOYMENT_STATUS_OPTIONS } from "@/constants/profile-options";
import { provinceEnumToLabel } from "@/constants/angola-provinces-fallback";

const MAX_PHOTO_BYTES = 20 * 1024 * 1024;
const ACCEPTED_PHOTO_TYPES = ["image/jpeg", "image/png"];

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function Toggle({ enabled, onChange, disabled }: { enabled: boolean; onChange: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={disabled ? undefined : onChange}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none disabled:cursor-not-allowed ${enabled ? "bg-secondary" : "bg-slate-200"}`}
    >
      <motion.span
        className="inline-block h-4 w-4 rounded-full bg-white shadow-sm"
        animate={{ x: enabled ? 24 : 4 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
}

const STAGGER: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const FADE_UP: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
};

export default function Profile() {
  const { user } = useAuth();
  const uploadAvatar = useUserStore((s) => s.uploadAvatar);
  const removeAvatar = useUserStore((s) => s.removeAvatar);
  const showNotification = useUiStore((s) => s.showNotification);
  const { goals } = useGoal();
  const { transactions } = useTransaction();
  const [monthlyReports, setMonthlyReports] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { sessions, isLoading: sessionsLoading, revokingId, isRevokingAll, revokeSession, logoutAll } = useSessions();
  const { analyticsConsent, setAnalyticsConsent } = useAnalytics();
  const [consentLoading, setConsentLoading] = useState(false);

  const handleConsentToggle = async () => {
    setConsentLoading(true);
    await setAnalyticsConsent(!analyticsConsent);
    setConsentLoading(false);
  };

  const totalSaved = goals.reduce((acc, g) => acc + (g.currentAmount ?? 0), 0);
  const isPremium = user?.planType === "PREMIUM";
  const isVerified = !!user?.isActive;
  const photoUrl = user?.profilePhotoUrl;

  const demographicFields = [
    {
      icon: <MapPin className="h-5 w-5 text-secondary" />,
      label: "Província",
      fieldKey: "province" as const,
      kind: "province" as const,
      rawValue: user?.province ?? null,
      displayValue: user?.province ? provinceEnumToLabel(user.province) : null,
    },
    {
      icon: <MapPin className="h-5 w-5 text-secondary" />,
      label: "Município",
      fieldKey: "municipality" as const,
      kind: "municipality" as const,
      rawValue: user?.municipality ?? null,
      displayValue: user?.municipality || null,
    },
    {
      icon: <Calendar className="h-5 w-5 text-secondary" />,
      label: "Data de nascimento",
      fieldKey: "birthDate" as const,
      kind: "date" as const,
      rawValue: user?.birthDate ?? null,
      displayValue: user?.birthDate || null,
    },
    {
      icon: <UserCircle className="h-5 w-5 text-secondary" />,
      label: "Género",
      fieldKey: "gender" as const,
      kind: "chips" as const,
      rawValue: user?.gender ?? null,
      displayValue: user?.gender ? GENDER_OPTIONS.find((o) => o.value === user.gender)?.label ?? null : null,
      options: GENDER_OPTIONS,
    },
    {
      icon: <Heart className="h-5 w-5 text-secondary" />,
      label: "Estado civil",
      fieldKey: "maritalStatus" as const,
      kind: "chips" as const,
      rawValue: user?.maritalStatus ?? null,
      displayValue: user?.maritalStatus
        ? MARITAL_STATUS_OPTIONS.find((o) => o.value === user.maritalStatus)?.label ?? null
        : null,
      options: MARITAL_STATUS_OPTIONS,
    },
    {
      icon: <Users className="h-5 w-5 text-secondary" />,
      label: "Dependentes",
      fieldKey: "dependents" as const,
      kind: "number" as const,
      rawValue: user?.dependents ?? null,
      displayValue: user?.dependents != null ? String(user.dependents) : null,
    },
    {
      icon: <Briefcase className="h-5 w-5 text-secondary" />,
      label: "Situação laboral",
      fieldKey: "employmentStatus" as const,
      kind: "chips" as const,
      rawValue: user?.employmentStatus ?? null,
      displayValue: user?.employmentStatus
        ? EMPLOYMENT_STATUS_OPTIONS.find((o) => o.value === user.employmentStatus)?.label ?? null
        : null,
      options: EMPLOYMENT_STATUS_OPTIONS,
    },
    {
      icon: <Wallet className="h-5 w-5 text-secondary" />,
      label: "Receita mensal esperada",
      fieldKey: "expectedMonthlyIncome" as const,
      kind: "number" as const,
      rawValue: user?.expectedMonthlyIncome ?? null,
      displayValue:
        user?.expectedMonthlyIncome != null ? `${user.expectedMonthlyIncome.toLocaleString("pt-AO")} Kz` : null,
      suffix: "Kz",
    },
  ];
  const demographicFilledCount = demographicFields.filter((f) => !!f.displayValue).length;

  const handlePhotoPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!ACCEPTED_PHOTO_TYPES.includes(file.type)) {
      showNotification("error", "Formato inválido", "Use uma imagem JPEG ou PNG.");
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      showNotification("error", "Ficheiro muito grande", "A foto não pode exceder 20 MB.");
      return;
    }
    setUploadingPhoto(true);
    await uploadAvatar(file);
    setUploadingPhoto(false);
  };

  const handleRemovePhoto = async () => {
    if (uploadingPhoto) return;
    setUploadingPhoto(true);
    await removeAvatar();
    setUploadingPhoto(false);
  };

  return (
    <motion.div
      className="mx-auto flex w-full max-w-340 flex-col gap-4 pb-6"
      variants={STAGGER}
      initial="hidden"
      animate="visible"
    >
      {/* Page header */}
      <motion.div variants={FADE_UP} className="flex items-center justify-between">
        <div>
          <h1 className="text-sm font-bold text-slate-900 tracking-tight">Meu Perfil</h1>
          <p className="mt-0.5 text-sm text-slate-400">Gerencie as suas informações pessoais e preferências</p>
        </div>
        <span
          className="rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest"
          style={{ backgroundColor: isPremium ? BRAND_COLORS.yellow : "#e2e8f0", color: isPremium ? "#001a4d" : "#64748b" }}
        >
          {isPremium ? "Premium" : "Free"}
        </span>
      </motion.div>

      {/* Main layout: left identity + right sections */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[300px_1fr]">

        {/* ── Left: identity card ── */}
        <motion.div variants={FADE_UP} className="flex flex-col gap-4">
          {/* Profile card */}
          <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_2px_12px_rgba(0,60,195,0.05)]">
            {/* Accent bar */}
            <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #003cc3 0%, #ffd400 100%)" }} />
            <div className="flex flex-col items-center gap-3 px-5 py-6">
              <div className="relative">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  className="hidden"
                  onChange={handlePhotoPick}
                />
                <button
                  type="button"
                  onClick={() => !uploadingPhoto && fileInputRef.current?.click()}
                  className="group relative block rounded-full border-2 p-0.5"
                  style={{ borderColor: BRAND_COLORS.yellow }}
                  aria-label="Alterar foto de perfil"
                >
                  {photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={photoUrl}
                      alt={user?.name || "Usuário"}
                      className="h-20 w-20 rounded-full object-cover"
                    />
                  ) : (
                    <Image
                      src={avatar}
                      alt={user?.name || "Usuário"}
                      className="h-20 w-20 rounded-full object-cover"
                    />
                  )}
                  {/* Hover / upload overlay */}
                  <span
                    className={`absolute inset-0.5 flex items-center justify-center rounded-full bg-black/45 transition-opacity ${uploadingPhoto ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                  >
                    {uploadingPhoto ? (
                      <Loader2 className="h-5 w-5 animate-spin text-white" />
                    ) : (
                      <Camera className="h-5 w-5 text-white" />
                    )}
                  </span>
                </button>
                {photoUrl && !uploadingPhoto && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="absolute -top-0.5 -left-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-white text-red-500 shadow ring-1 ring-slate-100 transition-colors hover:bg-red-500 hover:text-white"
                    aria-label="Remover foto de perfil"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                )}
                <div
                  className={`absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full ring-2 ring-white ${isVerified ? "bg-emerald-400" : "bg-amber-400"}`}
                >
                  {isVerified ? (
                    <svg className="h-3.5 w-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="h-3.5 w-3.5 text-amber-950" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
              <div className="text-center">
                <p className="text-base font-semibold text-slate-900">{user?.name || "Usuário"}</p>
                <p className="mt-0.5 text-sm text-slate-400">{user?.email || "—"}</p>
              </div>
              {isVerified ? (
                <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1">
                  <ShieldIcon className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-[11px] font-medium text-emerald-600">Conta verificada</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1">
                  <ShieldIcon className="h-3.5 w-3.5 text-amber-500" />
                  <span className="text-[11px] font-medium text-amber-600">Conta por verificar</span>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="border-t border-slate-50">
              {[
                { label: "Metas criadas", value: goals.length.toString(), sub: "objectivos activos" },
                { label: "Transações", value: transactions.length.toString(), sub: "movimentos registados" },
                { label: "Total poupado", value: formatAOA(totalSaved), sub: "nas metas" },
              ].map((s, i, arr) => (
                <div
                  key={i}
                  className={`flex items-center justify-between px-5 py-3.5 ${i < arr.length - 1 ? "border-b border-slate-50" : ""}`}
                >
                  <div>
                    <p className="text-xs text-slate-400">{s.label}</p>
                    <p className="text-[11px] text-slate-300">{s.sub}</p>
                  </div>
                  <span className="text-sm font-semibold text-slate-800">{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Email verification — visível apenas para contas por verificar */}
          <ProfileVerificationCard />

          {/* Plan card */}
          <div
            className="overflow-hidden rounded-2xl p-5"
            style={{ background: isPremium ? "linear-gradient(135deg, #001a4d 0%, #003cc3 100%)" : undefined, backgroundColor: isPremium ? undefined : "white", border: isPremium ? undefined : "1px solid #f1f5f9" }}
          >
            <p className={`text-xs font-semibold uppercase tracking-widest ${isPremium ? "text-white/50" : "text-slate-400"}`}>
              Plano Actual
            </p>
            <p className={`mt-1.5 text-lg font-bold ${isPremium ? "text-white" : "text-slate-900"}`}>
              Wundu {isPremium ? "Premium" : "Free"}
            </p>
            <p className={`mt-0.5 text-sm ${isPremium ? "text-white/60" : "text-slate-400"}`}>
              {isPremium ? "Todos os recursos desbloqueados" : "Recursos básicos disponíveis"}
            </p>
            {!isPremium && (
              <button
                className="mt-3 w-full rounded-xl bg-secondary py-2 text-sm font-semibold text-white transition-colors hover:bg-secondary-dark"
                onClick={() => captureEvent("premium_upgrade_clicked", { current_plan: "free" })}
              >
                Actualizar para Premium
              </button>
            )}
          </div>
        </motion.div>

        {/* ── Right: settings sections ── */}
        <div className="flex flex-col gap-4">
          {/* Dados Pessoais */}
          <motion.div variants={FADE_UP} className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_2px_12px_rgba(0,60,195,0.05)]">
            <div className="border-b border-slate-50 px-5 py-4">
              <h2 className="text-sm font-semibold text-slate-800">Dados Pessoais</h2>
              <p className="mt-0.5 text-xs text-slate-400">As suas informações de contacto e identificação</p>
            </div>
            <div className="divide-y divide-slate-50">
              {[
                {
                  icon: <EmailIcon className="h-5 w-5 text-secondary" />,
                  label: "Endereço de email",
                  value: user?.email || "—",
                  hint: "Usado para entrar na conta",
                },
                {
                  icon: <PhoneIcon className="h-5 w-5 text-secondary" />,
                  label: "Número de telefone",
                  value: user?.phoneNumber || "—",
                  hint: "Número de contacto principal",
                },
              ].map((row, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary/10">
                      {row.icon}
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">{row.label}</p>
                      <p className="mt-0.5 text-sm font-medium text-slate-800">{row.value}</p>
                      <p className="text-[11px] text-slate-300">{row.hint}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setEditOpen(true)}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-500 transition-all duration-150 hover:border-secondary/30 hover:bg-secondary/5 hover:text-secondary"
                  >
                    <EditIcon className="h-3.5 w-3.5" />
                    Editar
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Perfil Demográfico — cada campo edita-se no próprio sítio (clicar no lápis), sem modal */}
          <motion.div variants={FADE_UP} className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_2px_12px_rgba(0,60,195,0.05)]">
            <div className="border-b border-slate-50 px-5 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-slate-800">Perfil Demográfico</h2>
                  <p className="mt-0.5 text-xs text-slate-400">Usado para personalizar limites, recomendações e análises</p>
                </div>
                <span className="rounded-full bg-secondary/10 px-2.5 py-1 text-[11px] font-bold text-secondary flex-shrink-0">
                  {demographicFilledCount}/{demographicFields.length}
                </span>
              </div>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <motion.div
                  className="h-full w-full origin-left rounded-full"
                  style={{ backgroundColor: demographicFilledCount === demographicFields.length ? "#10b981" : "#003cc3" }}
                  initial={false}
                  animate={{ scaleX: demographicFilledCount / demographicFields.length }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>
            </div>
            <div>
              {demographicFields.map((row, i) => (
                <DemographicFieldRow key={row.fieldKey} {...row} isLast={i === demographicFields.length - 1} />
              ))}
            </div>
          </motion.div>

          {/* Preferências */}
          <motion.div variants={FADE_UP} className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_2px_12px_rgba(0,60,195,0.05)]">
            <div className="border-b border-slate-50 px-5 py-4">
              <h2 className="text-sm font-semibold text-slate-800">Preferências</h2>
              <p className="mt-0.5 text-xs text-slate-400">Controle as notificações e comportamento da conta</p>
            </div>
            <div className="divide-y divide-slate-50">
              {[
                {
                  label: "Relatórios Mensais",
                  sublabel: "Receba um resumo mensal do desempenho financeiro por email",
                  enabled: monthlyReports,
                  onChange: () => setMonthlyReports((v) => !v),
                  disabled: false,
                },
                {
                  label: "Suporte Prioritário",
                  sublabel: isPremium ? "Activo — resposta em até 4h úteis" : "Disponível apenas no plano Premium",
                  enabled: isPremium,
                  onChange: () => {},
                  disabled: true,
                },
                {
                  label: "Modo Escuro",
                  sublabel: "Interface em tema escuro — em breve",
                  enabled: false,
                  onChange: () => {},
                  disabled: true,
                },
              ].map((pref, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between gap-6 px-5 py-4 ${pref.disabled ? "opacity-50" : ""}`}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800">{pref.label}</p>
                    <p className="mt-0.5 text-xs text-slate-400">{pref.sublabel}</p>
                  </div>
                  <Toggle enabled={pref.enabled} onChange={pref.onChange} disabled={pref.disabled} />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Privacidade e Dados */}
          <motion.div variants={FADE_UP} className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_2px_12px_rgba(0,60,195,0.05)]">
            <div className="border-b border-slate-50 px-5 py-4">
              <h2 className="text-sm font-semibold text-slate-800">Privacidade e Dados</h2>
              <p className="mt-0.5 text-xs text-slate-400">Controlo o tratamento dos seus dados pessoais</p>
            </div>
            <div className="px-5 py-4">
              <div className="flex items-start justify-between gap-6">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-800">Dados Analíticos</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">
                    Recolha anónima de dados de uso para melhorar a aplicação.
                    Não inclui dados financeiros.
                  </p>
                </div>
                {consentLoading ? (
                  <div className="flex h-6 w-11 shrink-0 items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin text-slate-300" />
                  </div>
                ) : (
                  <Toggle
                    enabled={analyticsConsent}
                    onChange={handleConsentToggle}
                    disabled={false}
                  />
                )}
              </div>
            </div>
          </motion.div>

          {/* Sessões Activas */}
          <motion.div variants={FADE_UP} className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_2px_12px_rgba(0,60,195,0.05)]">
            <div className="flex items-center justify-between border-b border-slate-50 px-5 py-4">
              <div>
                <h2 className="text-sm font-semibold text-slate-800">Sessões Activas</h2>
                <p className="mt-0.5 text-xs text-slate-400">Dispositivos com sessão iniciada na sua conta</p>
              </div>
              <button
                onClick={logoutAll}
                disabled={isRevokingAll || sessions.length === 0}
                className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-500 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isRevokingAll ? "A terminar..." : "Terminar todas"}
              </button>
            </div>

            {sessionsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-secondary" />
              </div>
            ) : sessions.length === 0 ? (
              <p className="px-5 py-6 text-center text-sm text-slate-400">Nenhuma sessão encontrada.</p>
            ) : (
              <div className="divide-y divide-slate-50">
                {sessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between gap-4 px-5 py-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                        <svg className="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-medium text-slate-700">{session.userAgent || "Dispositivo desconhecido"}</p>
                        <p className="text-[11px] text-slate-400">{session.ipAddress} · Expira {new Date(session.expiresAt).toLocaleDateString("pt-AO")}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => revokeSession(session.id)}
                      disabled={revokingId === session.id}
                      className="shrink-0 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:border-red-200 hover:text-red-500 disabled:opacity-40"
                    >
                      {revokingId === session.id ? "..." : "Terminar"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Edit profile modal */}
      <AnimatePresence>
        {editOpen && user && <EditProfileModal user={user} onClose={() => setEditOpen(false)} />}
      </AnimatePresence>
    </motion.div>
  );
}


