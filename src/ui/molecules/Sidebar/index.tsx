"use client";
import React, { useMemo, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChartDesktopIcon, GoalsIcon, HomeDeskIcon } from "@/constants/icons";
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

const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = useMemo(
    () => [
      { name: "Home", path: ROUTES.HOME, icon: HomeDeskIcon },
      { name: "Análises", path: ROUTES.CONTROL_PANEL, icon: ChartDesktopIcon },
      {
        name: "Objetivos Financeiros",
        path: ROUTES.FINANCIAL,
        icon: GoalsIcon,
      },
    ],
    []
  );

  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      title: "Dicas de Economia",
      lastMessage: "Muito obrigado Wundo AI",
      timestamp: "10:30",
    },
    {
      id: "2",
      title: "Investimentos para Iniciantes",
      lastMessage: "Como posso começar a investir?",
      timestamp: "Ontem",
    },
    {
      id: "3",
      title: "Planejamento Financeiro",
      lastMessage: "Preciso de ajuda com orçamento",
      timestamp: "2 dias",
    },
    {
      id: "4",
      title: "Poupança e Metas",
      lastMessage: "Qual a melhor estratégia?",
      timestamp: "1 semana",
    },
    {
      id: "5",
      title: "Gestão de Gastos",
      lastMessage: "Como controlar melhor os gastos?",
      timestamp: "2 semanas",
    },
  ]);

  const isInChatPage = useMemo(
    () => pathname.includes("/chat") || pathname.includes("/ai"),
    [pathname]
  );

  const activeItem = useMemo(() => {
    if (isInChatPage) return "Wundu AI";
    return menuItems.find((item) => item.path === pathname)?.name || "Home";
  }, [pathname, isInChatPage, menuItems]);

  return (
    <nav className="flex flex-col h-full w-64 bg-white py-5 shadow-sm border-r border-gray-200 overflow-hidden">
      {/* Logo Header */}
      <div className="flex items-center justify-center mb-6 border-b-2 pb-5 border-gray-300 px-4">
        <Image
          src={logo}
          alt="Wundu Logo"
          className="w-12 h-12 rounded-full bg-gray-100"
          priority
        />
        <span className="text-xl font-bold ml-2">WUNDU</span>
      </div>

      {/* Menu Navigation */}
      <div className="px-4 mb-6">
        <p className="text-gray-400 text-sm mb-3">Menu</p>
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = activeItem === item.name;
            return (
              <li key={item.name}>
                <Link
                  href={item.path}
                  prefetch={true}
                  className={`flex items-center space-x-3 p-3 rounded-xl font-semibold text-sm transition-all duration-200 ease-out ${
                    isActive
                      ? "bg-yellow-300 text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Container flexível para conversas */}
      <div className="flex-1 flex flex-col px-4 overflow-hidden">
        <div
          className={`flex flex-col transition-all duration-300 ease-out flex-1 ${
            isInChatPage ? "opacity-100 visible" : "opacity-0 invisible h-0"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-500 flex items-center flex-1">
              <span className="mr-2">Conversas anteriores</span>
              <div className="flex-1 border-b border-gray-300"></div>
            </div>
            <button className="ml-2 text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-md hover:bg-blue-100 transition-colors duration-200">
              + Nova
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="space-y-2">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className="group flex items-start p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {conversation.title}
                    </h4>
                    <p className="text-xs text-gray-500 truncate mt-1">
                      {conversation.lastMessage}
                    </p>
                    <span className="text-xs text-gray-400 mt-1 block">
                      {conversation.timestamp}
                    </span>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 ml-2 p-1 rounded hover:bg-gray-200 transition-all duration-200">
                    <TrashIcon className="w-4 h-4 text-gray-400 hover:text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
