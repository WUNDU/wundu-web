"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ChartDesktopIcon,
  GoalsIcon,
  HomeDeskIcon,
  IAIcon,
} from "@/constants/icons";
import Link from "next/link";
import { logo, logotype } from "@/constants/images";
import { TrashIcon } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { motion, AnimatePresence } from "framer-motion";

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
}

const navItems = [
  { name: "Início", path: ROUTES.HOME, icon: HomeDeskIcon, exact: true },
  { name: "Finanças", path: ROUTES.FINANCIAL, icon: GoalsIcon, exact: false },
  { name: "Análises", path: ROUTES.CONTROL_PANEL, icon: ChartDesktopIcon, exact: false },
  { name: "Wundu AI", path: ROUTES.CHAT_IA, icon: IAIcon, exact: false },
];

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const EASE_OUT_QUART = [0.25, 0.46, 0.45, 0.94] as const;

const Sidebar: React.FC<SidebarProps> = ({ collapsed, mobileOpen, onCloseMobile }) => {
  const pathname = usePathname() || "";

  // Close mobile drawer on route change
  useEffect(() => {
    onCloseMobile();
  }, [pathname, onCloseMobile]);

  const [conversations, setConversations] = useState<Conversation[]>([
    { id: "1", title: "Dicas de Economia", lastMessage: "Muito obrigado Wundo AI", timestamp: "10:30" },
    { id: "2", title: "Investimentos para Iniciantes", lastMessage: "Como posso começar a investir?", timestamp: "Ontem" },
    { id: "3", title: "Planejamento Financeiro", lastMessage: "Preciso de ajuda com orçamento", timestamp: "2 dias" },
    { id: "4", title: "Poupança e Metas", lastMessage: "Qual a melhor estratégia?", timestamp: "1 semana" },
  ]);

  const isInChatPage = pathname.startsWith(ROUTES.CHAT_IA);

  const isActive = (item: (typeof navItems)[number]) =>
    item.exact ? pathname === item.path : pathname === item.path || pathname.startsWith(item.path + "/");

  const deleteConversation = (id: string) =>
    setConversations((prev) => prev.filter((c) => c.id !== id));

  const sidebarWidth = collapsed ? 72 : 220;

  /** Shared sidebar content — `isMobile` controls whether labels are always visible */
  const renderContent = useCallback(
    (isMobile: boolean) => (
      <>
        {/* Logo */}
        <div className="flex items-center justify-center h-12 border-b border-slate-100/60 flex-shrink-0 lg:h-14 px-3">
          {(isMobile || !collapsed) ? (
            <AnimatePresence>
              <motion.div
                key="logotype"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
              >
                <Image src={logotype} alt="Wundu" height={28} className="h-7 w-auto object-contain" priority />
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="w-9 h-9 rounded-xl bg-[#003cc3]/5 flex items-center justify-center overflow-hidden transition-transform duration-200 hover:rotate-2">
              <Image src={logo} alt="Wundu" width={32} height={32} className="w-8 h-8 object-contain" priority />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
          <ul className="space-y-1.5 px-2.5">
            {navItems.map((item) => {
              const active = isActive(item);
              return (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    prefetch={true}
                    title={item.name}
                    onClick={isMobile ? onCloseMobile : undefined}
                    className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200
                      ${active
                        ? "bg-[#003cc3]/10 text-[#003cc3] font-bold"
                        : "font-medium text-slate-500 hover:bg-[#003cc3]/5 hover:text-slate-900"
                      }`}
                  >
                    <item.icon
                      className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-105 ${active ? "text-[#003cc3]" : "text-slate-400 group-hover:text-[#003cc3]"}`}
                    />
                    {(isMobile || !collapsed) && (
                      <AnimatePresence>
                        <motion.span
                          key={`nav-label-${item.path}`}
                          className="whitespace-nowrap"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.12 }}
                        >
                          {item.name}
                        </motion.span>
                      </AnimatePresence>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Chat history — only on chat page when expanded */}
          {isInChatPage && (isMobile || !collapsed) && (
            <div className="mt-3 px-2">
              <div className="mb-2 flex items-center justify-between px-1">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Conversas
                </span>
                <button onClick={() => setConversations([])} className="text-xs font-medium text-[#003cc3] transition-colors hover:text-[#003cc3]/70">
                  + Nova
                </button>
              </div>
              <div className="space-y-0.5">
                {conversations.map((c) => (
                  <div
                    key={c.id}
                    className="group flex cursor-pointer items-start rounded-lg px-2 py-2 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-800 truncate">{c.title}</p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{c.lastMessage}</p>
                    </div>
                    <button
                      onClick={() => deleteConversation(c.id)}
                      className="ml-1 rounded p-1 opacity-0 transition-all hover:bg-slate-200 group-hover:opacity-100"
                    >
                      <TrashIcon className="w-3.5 h-3.5 text-gray-400 hover:text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gradient separator */}
          <div className="mx-3 h-px bg-gradient-to-r from-transparent via-[#003cc3]/20 to-transparent" />
        </nav>
      </>
    ),
    [collapsed, conversations, isInChatPage, onCloseMobile, pathname],
  );

  return (
    <>
      {/* Desktop sidebar — hidden below lg */}
      <motion.aside
        animate={{ width: sidebarWidth }}
        transition={{ duration: 0.2, ease: EASE_OUT_QUART }}
        className="hidden lg:flex flex-col h-full bg-white border-r border-white/30 flex-shrink-0 overflow-hidden z-40 shadow-[1px_0_0_rgba(0,0,0,0.04)]"
      >
        {renderContent(false)}
      </motion.aside>

      {/* Mobile sidebar drawer — visible below lg */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-50 bg-slate-900/30 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" as const }}
              onClick={onCloseMobile}
            />
            {/* Drawer */}
            <motion.aside
              className="fixed left-0 top-0 z-50 flex h-full w-[264px] flex-col bg-white shadow-sm lg:hidden overflow-hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.18, ease: EASE_OUT_QUART }}
            >
              {renderContent(true)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
