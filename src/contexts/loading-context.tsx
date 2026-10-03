"use client";

import React, { createContext, useContext, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserStore } from "@/store/user-store";
import { usePathname } from "next/navigation";

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  message?: string;
  setMessage: (message?: string) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | undefined>();

  const value = useMemo(
    () => ({ isLoading, setIsLoading, message, setMessage }),
    [isLoading, message]
  );

  return (
    <LoadingContext.Provider value={value}>
      {children}
      <GlobalLoadingOverlay />
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within LoadingProvider");
  }
  return context;
}

function GlobalLoadingOverlay() {
  const context = useContext(LoadingContext);
  const authIsLoading = useUserStore((state) => state.isLoading);
  const user = useUserStore((state) => state.user);
  const pathname = usePathname();

  if (!context) return null;

  const { isLoading: globalIsLoading, message } = context;

  // Do not show any loading overlay on the Landing Page
  if (pathname === "/") return null;

  // Only block UI when no cached user — silent re-auth never shows overlay
  const isAnyLoading = globalIsLoading || (authIsLoading && !user);

  return (
    <AnimatePresence>
      {isAnyLoading && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-(--bg-body)/80 backdrop-blur-[2px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          role="status"
          aria-label={message || "A carregar"}
        >
          <div className="flex items-center gap-3 rounded-2xl border border-(--card-barras) bg-(--bg-card) px-5 py-4 shadow-[0px_8px_30px_rgba(2,21,69,0.12)]">
            <span
              aria-hidden="true"
              className="size-6 shrink-0 animate-spin rounded-full border-2 border-primary-300/20 border-t-primary-300"
            />
            <p className="font-manrope text-sm font-semibold text-(--text-title)">
              {message || (authIsLoading ? "Autenticando…" : "Carregando…")}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
