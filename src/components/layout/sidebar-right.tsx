"use client";
import type { FC } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { user as avatar } from "@/constants/images";
import {
  DownArrowIcon,
  HelpIcon,
  LogoutIcon,
  NotificationRightBarIcon,
} from "@/constants/icons";
import { SidebarRightProps } from "@/types/ui";
import { useUserStore } from "@/store/user-store";
import { useUiStore } from "@/store/ui-store";

const EASE_IN: [number, number, number, number] = [0, 0, 0.2, 1];
const EASE_OUT: [number, number, number, number] = [0.4, 0, 1, 1];

const SidebarRight: FC<SidebarRightProps> = ({ isOpen, onClose }) => {
  const { logoutUser, user } = useUserStore();
  const { openNotificationCenter } = useUiStore();

  const handleLogout = async () => {
    await logoutUser();
  };

  const handleSupportClick = () => {
    if (typeof window !== "undefined") {
      window.open(
        "mailto:Support@wundu.tech?subject=Suporte%20e%20feedback",
        "_blank",
      );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex justify-end bg-slate-900/10"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <motion.aside
            className="flex h-full w-full max-w-sm flex-col border-l border-slate-200 bg-white/80 shadow-sm"
            onClick={(e) => e.stopPropagation()}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%", transition: { duration: 0.18, ease: EASE_OUT } }}
            transition={{ duration: 0.2, ease: EASE_IN }}
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3.5 sm:px-5">
              <span className="text-sm font-semibold text-slate-700">
                Perfil
              </span>
              <button
                onClick={onClose}
                className="rounded-lg p-2 transition-colors duration-150 hover:bg-[#003cc3]/5"
                aria-label="Fechar painel de perfil"
              >
                <DownArrowIcon className="h-5 w-5 rotate-90 text-slate-700" />
              </button>
            </div>

            <div className="flex flex-1 flex-col items-center space-y-5 overflow-y-auto px-4 py-5 sm:px-5">
              <div className="rounded-full bg-[#003cc3] p-1 shadow-sm">
                <div className="rounded-full bg-white p-2.5">
                  <Image
                    src={avatar}
                    alt={user?.name || "Usuário"}
                    className="h-11 w-11 rounded-full object-cover"
                  />
                </div>
              </div>

              <span className="text-base font-semibold text-slate-900">
                {user?.name || "Usuário"}
              </span>

              <div className="w-full max-w-md">
                <div className="overflow-hidden rounded-xl border border-slate-100 bg-white/80 shadow-[0_4px_16px_rgba(0,60,195,0.08)]">
                  <ul className="divide-y divide-slate-100">
                    {[
                      {
                        icon: <HelpIcon className="h-5 w-5 text-slate-600" />,
                        text: "Suporte e Feedback",
                        action: handleSupportClick,
                      },
                      {
                        icon: (
                          <NotificationRightBarIcon className="h-5 w-5 text-slate-600" />
                        ),
                        text: "Notificações",
                        action: openNotificationCenter,
                      },
                    ].map((item, index) => (
                      <motion.li
                        key={index}
                        className="flex cursor-pointer items-center justify-between p-3.5 transition-colors duration-150 hover:bg-[#003cc3]/5"
                        onClick={item.action}
                        whileHover={{ x: 1 }}
                        transition={{ duration: 0.12 }}
                      >
                        <div className="flex items-center space-x-4">
                          {item.icon}
                          <span className="text-sm font-medium text-slate-800">
                            {item.text}
                          </span>
                        </div>
                        <svg
                          className="h-4 w-4 text-slate-500"
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
                      </motion.li>
                    ))}
                  </ul>

                  <button onClick={handleLogout} className="w-full">
                    <div className="border-t border-slate-100 p-3.5">
                      <motion.div
                        className="flex items-center space-x-3 rounded-lg p-2.5 text-red-500 transition-colors duration-150 hover:bg-red-50"
                        whileHover={{ x: 1 }}
                        transition={{ duration: 0.12 }}
                      >
                        <LogoutIcon className="h-5 w-5" />
                        <span className="text-sm font-medium">
                          Terminar Sessão
                        </span>
                      </motion.div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SidebarRight;
