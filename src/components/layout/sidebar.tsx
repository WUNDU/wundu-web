"use client";
import React, { useMemo, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ChartDesktopIcon,
  GoalsIcon,
  HomeDeskIcon,
  IAIcon,
  LibraryIcon,
  ScanIcon,
} from "@/constants/icons";
import Link from "next/link";
import { logo } from "@/constants/images";
import { TrashIcon } from "lucide-react";
import { ROUTES } from "@/constants/routes";

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
}

const navItems = [
  { name: "Início", path: ROUTES.HOME, icon: HomeDeskIcon, exact: true },
  { name: "Finanças", path: ROUTES.FINANCIAL, icon: GoalsIcon, exact: false },
  { name: "Scan", path: ROUTES.SCAN, icon: ScanIcon, exact: false },
  { name: "Análises", path: ROUTES.CONTROL_PANEL, icon: ChartDesktopIcon, exact: false },
  { name: "Biblioteca", path: ROUTES.LIBRARY, icon: LibraryIcon, exact: false },
  { name: "Wundu AI", path: ROUTES.CHAT_IA, icon: IAIcon, exact: false },
];

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const pathname = usePathname() || "";

  const [conversations, setConversations] = useState<Conversation[]>([
    { id: "1", title: "Dicas de Economia", lastMessage: "Muito obrigado Wundo AI", timestamp: "10:30" },
    { id: "2", title: "Investimentos para Iniciantes", lastMessage: "Como posso começar a investir?", timestamp: "Ontem" },
    { id: "3", title: "Planejamento Financeiro", lastMessage: "Preciso de ajuda com orçamento", timestamp: "2 dias" },
    { id: "4", title: "Poupança e Metas", lastMessage: "Qual a melhor estratégia?", timestamp: "1 semana" },
  ]);

  const isInChatPage = pathname.startsWith(ROUTES.CHAT_IA);

  const isActive = (item: typeof navItems[number]) =>
    item.exact ? pathname === item.path : pathname === item.path || pathname.startsWith(item.path + "/");

  const deleteConversation = (id: string) =>
    setConversations((prev) => prev.filter((c) => c.id !== id));

  return (
    <aside
      className={`flex flex-col h-full bg-white border-r border-slate-200/70 flex-shrink-0 transition-all duration-300 ease-out overflow-hidden
        ${collapsed ? "w-14" : "w-14 md:w-[220px]"}`}
    >
      {/* Logo */}
      <div className="flex items-center h-14 px-3 border-b border-slate-200/70 flex-shrink-0">
        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
          <Image src={logo} alt="Wundu" width={32} height={32} className="w-full h-full object-cover" priority />
        </div>
        {!collapsed && (
          <span className="hidden md:block ml-3 font-bold text-gray-900 text-sm tracking-tight whitespace-nowrap">
            WUNDU
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 overflow-y-auto">
        <ul className="space-y-0.5 px-2">
          {navItems.map((item) => {
            const active = isActive(item);
            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  prefetch={true}
                  title={item.name}
                  className={`flex items-center gap-3 px-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                    ${active
                      ? "bg-amber-50 text-amber-700"
                      : "text-gray-600 hover:bg-slate-50 hover:text-gray-900"
                    }`}
                >
                  <item.icon
                    className={`w-5 h-5 flex-shrink-0 ${active ? "text-amber-600" : "text-gray-400"}`}
                  />
                  {!collapsed && (
                    <span className="hidden md:block whitespace-nowrap">{item.name}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Chat history — only on chat page */}
        {isInChatPage && !collapsed && (
          <div className="hidden md:block mt-4 px-2">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                Conversas
              </span>
              <button className="text-xs text-amber-600 hover:text-amber-700 font-medium transition-colors">
                + Nova
              </button>
            </div>
            <div className="space-y-0.5">
              {conversations.map((c) => (
                <div
                  key={c.id}
                  className="group flex items-start px-2 py-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-800 truncate">{c.title}</p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{c.lastMessage}</p>
                  </div>
                  <button
                    onClick={() => deleteConversation(c.id)}
                    className="opacity-0 group-hover:opacity-100 ml-1 p-1 rounded hover:bg-slate-200 transition-all"
                  >
                    <TrashIcon className="w-3.5 h-3.5 text-gray-400 hover:text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
