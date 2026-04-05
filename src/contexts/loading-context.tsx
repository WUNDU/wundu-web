"use client";

import React, { createContext, useContext, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserStore } from "@/store/user-store";

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

  if (!context) return null;

  const { isLoading: globalIsLoading, message } = context;
  const isAnyLoading = globalIsLoading || authIsLoading;

  return (
    <AnimatePresence>
      {isAnyLoading && (
        <motion.div
          className="fixed inset-0 bg-[#FDFCFB]/90 flex flex-col items-center justify-center z-[9999]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
        >
          <div className="relative flex flex-col items-center gap-6">
            {/* CSS spinner — matches Google link page speed */}
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 border-[3px] border-[#ffd400]/15 rounded-full" />
              <div className="absolute inset-0 border-[3px] border-t-[#ffd400] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
            </div>

            {/* Subtle Message */}
            <div className="flex flex-col items-center gap-1">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#003cc3]/70 italic">
                {message || (authIsLoading ? "Autenticando" : "Carregando")}
              </p>
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1 h-1 bg-[#ffd400]/50 rounded-full"
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
