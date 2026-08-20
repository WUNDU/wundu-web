"use client";
import React, { useEffect, useCallback } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ChartDesktopIcon,
  GoalsIcon,
  HomeDeskIcon,
  IAIcon,
} from "@/constants/icons";
import { Tag, Trash2, Plus } from "lucide-react";
import Link from "next/link";
import { logo, logotype } from "@/constants/images";
import { ROUTES } from "@/constants/routes";
import { motion, AnimatePresence } from "framer-motion";
import { useChatStore } from "@/store/chat-store";
import { formatConvoDate, parseJavaDate } from "@/types/dtos/chat.dto";

const navItems = [
  { name: "Início", path: ROUTES.HOME, icon: HomeDeskIcon, exact: true, dataTutorial: "nav-home" },
  { name: "Objectivos", path: ROUTES.FINANCIAL, icon: GoalsIcon, exact: false, dataTutorial: "nav-goals" },
  { name: "Análises", path: ROUTES.CONTROL_PANEL, icon: ChartDesktopIcon, exact: false, dataTutorial: "nav-analytics" },
  { name: "Categorias", path: ROUTES.CATEGORIES, icon: Tag, exact: false, dataTutorial: "nav-categories" },
  { name: "Wundu AI", path: ROUTES.CHAT_IA, icon: IAIcon, exact: false, dataTutorial: "nav-chat" },
];

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const EASE_OUT_QUART = [0.25, 0.46, 0.45, 0.94] as const;

const Sidebar: React.FC<SidebarProps> = ({ collapsed, mobileOpen, onCloseMobile }) => {
  const pathname = usePathname() || "";

  const {
    history,
    conversationId,
    isLoading: isLoadingHistory,
    fetchHistory,
    loadConversation,
    deleteConversation,
    clearConversation,
  } = useChatStore();

  // Close mobile drawer on route change
  useEffect(() => {
    onCloseMobile();
  }, [pathname, onCloseMobile]);

  const isInChatPage = pathname.startsWith(ROUTES.CHAT_IA);

  // Fetch history when entering the chat page
  useEffect(() => {
    if (isInChatPage) fetchHistory();
  }, [isInChatPage, fetchHistory]);

  const sortedHistory = [...history].sort((a, b) => {
    const da = parseJavaDate(a.updatedAt)?.getTime() ?? 0;
    const db = parseJavaDate(b.updatedAt)?.getTime() ?? 0;
    return db - da;
  });

  const [confirmDeleteId, setConfirmDeleteId] = React.useState<string | null>(null);

  const isActive = (item: (typeof navItems)[number]) =>
    item.exact ? pathname === item.path : pathname === item.path || pathname.startsWith(item.path + "/");

  const handleNewConversation = () => {
    clearConversation();
  };

  const handleSelectConversation = async (id: string) => {
    setConfirmDeleteId(null);
    await loadConversation(id);
  };

  const handleDeleteConversation = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setConfirmDeleteId(null);
    await deleteConversation(id);
  };

  const handleAskConfirm = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setConfirmDeleteId(id);
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmDeleteId(null);
  };

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
            <div className="w-9 h-9 rounded-xl bg-secondary/5 flex items-center justify-center overflow-hidden transition-transform duration-200 hover:rotate-2">
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
                        ? "bg-secondary/10 text-secondary font-bold"
                        : "font-medium text-slate-500 hover:bg-secondary/5 hover:text-slate-900"
                      }`}
                    data-tutorial={item.dataTutorial}
                  >
                    <item.icon
                      className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-105 ${active ? "text-secondary" : "text-slate-400 group-hover:text-secondary"}`}
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
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Conversas
                </span>
                <button
                  onClick={handleNewConversation}
                  className="flex items-center gap-1 text-xs font-semibold text-secondary transition-colors hover:text-secondary/70"
                >
                  <Plus className="w-3 h-3" />
                  Nova
                </button>
              </div>

              {isLoadingHistory ? (
                <div className="space-y-1 animate-pulse">
                  {[72, 60, 80, 55].map((w, i) => (
                    <div key={i} className="flex items-center gap-2 px-2 py-2 rounded-lg">
                      <div className="w-3.5 h-3.5 rounded bg-slate-100 flex-shrink-0" />
                      <div className="h-3 rounded bg-slate-100" style={{ width: `${w}%` }} />
                    </div>
                  ))}
                </div>
              ) : sortedHistory.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4 px-2">
                  Sem conversas ainda
                </p>
              ) : (
                <div className="space-y-0.5">
                  {sortedHistory.map((conv) => {
                    const isActiveConv = conv.id === conversationId;
                    const isConfirming = confirmDeleteId === conv.id;
                    return (
                      <div
                        key={conv.id}
                        onClick={() => !isConfirming && handleSelectConversation(conv.id)}
                        className={`group flex cursor-pointer items-center rounded-lg px-2 py-2 transition-colors ${
                          isActiveConv ? "bg-secondary/10" : "hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-semibold truncate ${isActiveConv ? "text-secondary" : "text-slate-700"}`}>
                            {formatConvoDate(conv.updatedAt)}
                          </p>
                          {isConfirming ? (
                            <div className="flex items-center gap-1 mt-1" onClick={(e) => e.stopPropagation()}>
                              <span className="text-[10px] text-red-500 font-medium">Apagar?</span>
                              <button
                                onClick={(e) => handleDeleteConversation(e, conv.id)}
                                className="text-[10px] font-bold text-white bg-red-500 hover:bg-red-600 px-1.5 py-0.5 rounded transition-colors"
                              >
                                Sim
                              </button>
                              <button
                                onClick={handleCancelDelete}
                                className="text-[10px] font-bold text-slate-500 hover:text-slate-700 px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 transition-colors"
                              >
                                Não
                              </button>
                            </div>
                          ) : (
                            <p className="text-[10px] text-slate-400 truncate mt-0.5">Conversa</p>
                          )}
                        </div>
                        {!isConfirming && (
                          <button
                            onClick={(e) => handleAskConfirm(e, conv.id)}
                            className="ml-1 rounded p-1 opacity-0 transition-all hover:bg-slate-200 group-hover:opacity-100"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-slate-400 hover:text-red-400" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Gradient separator */}
          <div className="mx-3 h-px bg-gradient-to-r from-transparent via-secondary/20 to-transparent" />
        </nav>
      </>
    ),
    [collapsed, history, conversationId, isInChatPage, isLoadingHistory, sortedHistory, confirmDeleteId, onCloseMobile, pathname],
  );

  return (
    <>
      {/* Desktop sidebar — hidden below lg */}
      <motion.aside
        animate={{ width: sidebarWidth }}
        transition={{ duration: 0.2, ease: EASE_OUT_QUART }}
        className="hidden lg:flex flex-col h-full bg-white border-r border-slate-100 flex-shrink-0 overflow-hidden z-40 shadow-[1px_0_0_rgba(0,0,0,0.02)]"
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
