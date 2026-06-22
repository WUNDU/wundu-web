"use client";
import type { FC } from "react";
import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { user as avatar } from "@/constants/images";
import {
  DownArrowIcon,
  HelpIcon,
  LogoutIcon,
  NotificationRightBarIcon,
  ProfileIcon,
} from "@/constants/icons";
import { SidebarRightProps } from "@/types/ui";
import { useUserStore } from "@/store/user-store";
import { useUiStore } from "@/store/ui-store";
import { useGoal } from "@/hooks/use-goal";
import { useTransaction } from "@/hooks/use-transaction";
import { formatAOA } from "@/lib/currency";
import { ROUTES } from "@/constants/routes";
import posthog from "posthog-js";
import { BRAND_COLORS } from "@/constants/brand-colors";

const EASE_IN: [number, number, number, number] = [0, 0, 0.2, 1];
const EASE_OUT: [number, number, number, number] = [0.4, 0, 1, 1];

const ChevronRight = () => (
  <svg className="h-4 w-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
  </svg>
);

const ChevronRightDark = () => (
  <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
  </svg>
);

const SidebarRight: FC<SidebarRightProps> = ({ isOpen, onClose }) => {
  const { logoutUser, user } = useUserStore();
  const { openNotificationCenter } = useUiStore();
  const { goals, hasFetched: goalsFetched, getAll: fetchGoals } = useGoal();
  const { transactions, hasFetched: txFetched, getTransactions: fetchTx } = useTransaction();
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      if (!goalsFetched) fetchGoals();
      if (!txFetched) fetchTx();
    }
  }, [isOpen, goalsFetched, txFetched, fetchGoals, fetchTx]);

  const totalSaved = goals.reduce((acc, g) => acc + (g.currentAmount ?? 0), 0);
  const isPremium = user?.planType === "PREMIUM";

  const handleLogout = async () => {
    posthog.capture("user_signed_out");
    posthog.reset();
    await logoutUser();
  };

  const handleSupportClick = () => {
    if (typeof window !== "undefined") {
      window.open("mailto:Support@wundu.tech?subject=Suporte%20e%20feedback", "_blank");
    }
  };

  const handleMyData = () => {
    onClose();
    router.push(ROUTES.PROFILE);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex justify-end bg-slate-900/20"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <motion.aside
            className="flex h-full w-full max-w-sm flex-col overflow-hidden border-l border-slate-200/60 bg-slate-100 shadow-xl"
            onClick={(e) => e.stopPropagation()}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%", transition: { duration: 0.18, ease: EASE_OUT } }}
            transition={{ duration: 0.22, ease: EASE_IN }}
          >
            {/* Close button */}
            <div className="absolute right-3 top-3 z-10">
              <button
                onClick={onClose}
                className="rounded-full bg-white/20 p-2 transition-colors duration-150 hover:bg-white/30"
                aria-label="Fechar perfil"
              >
                <DownArrowIcon className="h-4 w-4 rotate-90 text-white" />
              </button>
            </div>

            <div className="flex flex-1 flex-col overflow-y-auto">
              {/* Hero card — gradient + avatar + stats */}
              <motion.div
                className="relative overflow-hidden px-5 pb-7 pt-10"
                style={{ background: "linear-gradient(135deg, #001a4d 0%, #003cc3 100%)" }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                {/* Subtle radial glow */}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background: "radial-gradient(ellipse at 60% 0%, rgba(255,212,0,0.12) 0%, transparent 65%)",
                  }}
                />

                {/* Avatar + identity */}
                <div className="relative mb-5 flex flex-col items-center gap-2">
                  <div className="relative">
                    {/* Pulsing ring */}
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{ border: "2px solid #ffd400", margin: -5 }}
                      animate={{ scale: [1, 1.14, 1], opacity: [0.55, 0.2, 0.55] }}
                      transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <div className="rounded-full border-2 p-0.5" style={{ borderColor: BRAND_COLORS.yellow }}>
                      <Image
                        src={avatar}
                        alt={user?.name || "Usuário"}
                        className="h-16 w-16 rounded-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-base font-semibold text-white">
                      {user?.name || "Usuário"}
                    </p>
                    <div className="mt-1 flex items-center justify-center gap-1.5">
                      <div
                        className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                        style={{ backgroundColor: isPremium ? BRAND_COLORS.yellow : "rgba(255,255,255,0.15)", color: isPremium ? "#001a4d" : "rgba(255,255,255,0.7)" }}
                      >
                        {isPremium ? "Premium" : "Free"}
                      </div>
                      <div className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        <span className="text-[10px] text-white/70">Verificado</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 divide-x divide-white/10 rounded-2xl bg-white/10">
                  {[
                    { label: "Metas", value: goals.length.toString() },
                    { label: "Transações", value: transactions.length.toString() },
                    { label: "Economizado", value: formatAOA(totalSaved) },
                  ].map((stat, i) => {
                    const len = stat.value.length;
                    const fontSize =
                      len <= 4 ? "text-base" :
                      len <= 7 ? "text-sm" :
                      len <= 10 ? "text-xs" :
                      "text-[10px]";
                    return (
                      <div key={i} className="flex flex-col items-center gap-0.5 py-3 px-1 min-w-0">
                        <span className={`font-bold text-white leading-tight text-center ${fontSize}`}>
                          {stat.value}
                        </span>
                        <span className="text-[10px] text-white/55 text-center leading-tight">{stat.label}</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Menu */}
              <div className="flex flex-col gap-2.5 p-4">
                <motion.div
                  className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_2px_12px_rgba(0,60,195,0.06)]"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: 0.05, ease: "easeOut" }}
                >
                  {[
                    {
                      icon: <ProfileIcon className="h-5 w-5 text-secondary" />,
                      label: "Meus Dados",
                      sublabel: "Informações pessoais",
                      action: handleMyData,
                      accent: true,
                    },
                    {
                      icon: <NotificationRightBarIcon className="h-5 w-5 text-slate-500" />,
                      label: "Notificações",
                      sublabel: "Alertas e avisos",
                      action: openNotificationCenter,
                    },
                    {
                      icon: <HelpIcon className="h-5 w-5 text-slate-500" />,
                      label: "Suporte e Feedback",
                      sublabel: "Fale connosco",
                      action: handleSupportClick,
                    },
                  ].map((item, i) => (
                    <motion.button
                      key={i}
                      onClick={item.action}
                      className="flex w-full items-center justify-between border-b border-slate-50 px-4 py-3.5 transition-colors duration-150 last:border-b-0 hover:bg-slate-50/80"
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className="flex h-9 w-9 items-center justify-center rounded-xl"
                          style={{ backgroundColor: item.accent ? "rgba(0,60,195,0.08)" : "#F1F5F9" }}
                        >
                          {item.icon}
                        </div>
                        <div className="text-left">
                          <p className={`text-sm font-medium ${item.accent ? "text-secondary" : "text-slate-800"}`}>
                            {item.label}
                          </p>
                          <p className="text-[11px] text-slate-400">{item.sublabel}</p>
                        </div>
                      </div>
                      <ChevronRightDark />
                    </motion.button>
                  ))}
                </motion.div>

                {/* Logout */}
                <motion.button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3.5 rounded-2xl border border-red-100 bg-white px-4 py-3.5 transition-colors duration-150 hover:bg-red-50"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: 0.1, ease: "easeOut" }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50">
                    <LogoutIcon className="h-5 w-5 text-red-500" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-red-500">Terminar Sessão</p>
                    <p className="text-[11px] text-red-300">Sair da conta</p>
                  </div>
                </motion.button>
              </div>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SidebarRight;
