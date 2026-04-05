"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { user as avatar } from "@/constants/images";
import { HelpIcon, LogoutIcon } from "@/constants/icons";
import { useAuth } from "@/hooks/use-auth";

export default function Profile() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const handleSupportClick = () => {
    if (typeof window !== "undefined") {
      window.open(
        "mailto:Support@wundu.tech?subject=Suporte%20e%20feedback",
        "_blank",
      );
    }
  };

  const menuItems = [
    {
      icon: <HelpIcon className="text-[#003cc3]" />,
      text: "Suporte e Feedback",
      action: handleSupportClick,
    },
    {
      icon: <LogoutIcon className="text-red-500" />,
      text: "Sair",
      action: handleLogout,
    },
  ];

  const handleMenuClick = (item: (typeof menuItems)[0]) => {
    if (item.action) item.action();
  };

  return (
    <div className="flex flex-col justify-center h-full my-3 sm:my-4 bg-slate-50">
      <div className="flex-1 justify-center flex flex-col overflow-auto pb-4 sm:pb-6 gap-3 sm:gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" as const }}
          className="bg-white rounded-xl mx-3 sm:mx-4 p-3 lg:p-4 border border-slate-100 shadow-sm"
        >
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="relative">
              <div className="p-1.5 rounded-full border-2 border-[#ffd400] bg-white">
                <div className="bg-white p-2 rounded-full relative">
                  <Image
                    src={avatar}
                    alt={user?.name || "Usuário"}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 right-0.5 p-1.5 bg-white rounded-full shadow-sm border border-[#ffd400]">
                  <svg
                    className="w-4 h-4 text-[#003cc3]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Conta</p>
              <h1 className="text-base font-semibold text-slate-900 mt-1">{user?.name}</h1>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" as const, delay: 0.05 }}
          className="px-4"
        >
          <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
            {menuItems.map((item, index) => (
              <motion.button
                key={index}
                onClick={() => handleMenuClick(item)}
                whileTap={{ scale: 0.99 }}
                className="w-full flex items-center justify-between p-3.5 sm:p-4 border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition-colors duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-slate-100">{item.icon}</div>
                  <span
                    className={`text-sm font-medium ${
                      item.text === "Sair" ? "text-red-500" : "text-slate-700"
                    }`}
                  >
                    {item.text}
                  </span>
                </div>
                {item.text === "Sair" ? null : (
                  <svg
                    className="w-4 h-4 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
