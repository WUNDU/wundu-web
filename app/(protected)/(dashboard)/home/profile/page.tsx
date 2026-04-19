"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { user as avatar } from "@/constants/images";
import { EditIcon, EmailIcon } from "@/constants/icons";
import { useAuth } from "@/hooks/use-auth";
import { useGoalStore } from "@/store/goal-store";
import { useTransactionStore } from "@/store/transaction-store";
import { formatAOA } from "@/lib/currency";
import posthog from "posthog-js";

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
      className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none disabled:cursor-not-allowed ${enabled ? "bg-[#003cc3]" : "bg-slate-200"}`}
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
  const { goals } = useGoalStore();
  const { transactions } = useTransactionStore();
  const [monthlyReports, setMonthlyReports] = useState(false);

  const totalSaved = goals.reduce((acc, g) => acc + (g.currentAmount ?? 0), 0);
  const isPremium = user?.planType === "PREMIUM";

  return (
    <motion.div
      className="mx-auto flex w-full max-w-[1360px] flex-col gap-4 pb-6"
      variants={STAGGER}
      initial="hidden"
      animate="visible"
    >
      {/* Page header */}
      <motion.div variants={FADE_UP} className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Meu Perfil</h1>
          <p className="mt-0.5 text-sm text-slate-400">Gerencie as suas informações pessoais e preferências</p>
        </div>
        <span
          className="rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest"
          style={{ backgroundColor: isPremium ? "#ffd400" : "#e2e8f0", color: isPremium ? "#001a4d" : "#64748b" }}
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
                <div className="rounded-full border-2 p-0.5" style={{ borderColor: "#ffd400" }}>
                  <Image
                    src={avatar}
                    alt={user?.name || "Usuário"}
                    className="h-20 w-20 rounded-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400 ring-2 ring-white">
                  <svg className="h-3.5 w-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div className="text-center">
                <p className="text-base font-semibold text-slate-900">{user?.name || "Usuário"}</p>
                <p className="mt-0.5 text-sm text-slate-400">{user?.email || "—"}</p>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1">
                <ShieldIcon className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-[11px] font-medium text-emerald-600">Conta verificada</span>
              </div>
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
                className="mt-3 w-full rounded-xl bg-[#003cc3] py-2 text-sm font-semibold text-white transition-colors hover:bg-[#00216b]"
                onClick={() => posthog.capture("premium_upgrade_clicked", { current_plan: "free" })}
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
                  icon: <EmailIcon className="h-5 w-5 text-[#003cc3]" />,
                  label: "Endereço de email",
                  value: user?.email || "—",
                  hint: "Usado para entrar na conta",
                },
                {
                  icon: <PhoneIcon className="h-5 w-5 text-[#003cc3]" />,
                  label: "Número de telefone",
                  value: user?.phoneNumber || "—",
                  hint: "Número de contacto principal",
                },
              ].map((row, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#EEF3FF]">
                      {row.icon}
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">{row.label}</p>
                      <p className="mt-0.5 text-sm font-medium text-slate-800">{row.value}</p>
                      <p className="text-[11px] text-slate-300">{row.hint}</p>
                    </div>
                  </div>
                  <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-500 transition-all duration-150 hover:border-[#003cc3]/30 hover:bg-[#003cc3]/5 hover:text-[#003cc3]">
                    <EditIcon className="h-3.5 w-3.5" />
                    Editar
                  </button>
                </div>
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
        </div>
      </div>
    </motion.div>
  );
}


