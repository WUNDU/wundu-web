"use client";

import { createContext, useContext, useEffect, useRef, useCallback, ReactNode } from "react";
import { useUserStore } from "@/store/user-store";
import { analyticsConsentService } from "@/services/analytics-consent.service";
import { initAnalytics, stopAnalytics } from "@/lib/analytics";

const ANALYTICS_CONSENT_KEY = "wundu_analytics_consent";

function getLocalConsent(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(ANALYTICS_CONSENT_KEY) === "true";
}

function setLocalConsent(value: boolean): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ANALYTICS_CONSENT_KEY, String(value));
}

function clearLocalConsent(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ANALYTICS_CONSENT_KEY);
}

interface AnalyticsContextType {
  analyticsConsent: boolean;
  setAnalyticsConsent: (granted: boolean) => Promise<void>;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error("useAnalytics must be used within an AnalyticsProvider");
  }
  return context;
};

interface AnalyticsProviderProps {
  children: ReactNode;
}

export const AnalyticsProvider = ({ children }: AnalyticsProviderProps) => {
  const user = useUserStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser);
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);

  // Estado: usa backend se logado, senão usa localStorage.
  // O consentimento controla APENAS a gravação de sessão; eventos e acessos
  // fluem sempre (ver src/lib/analytics.ts).
  const analyticsConsent = isAuthenticated
    ? (user?.analyticsConsent ?? false)
    : getLocalConsent();

  // Aplica o consentimento (gravação on/off) sempre que muda, incluindo mount.
  useEffect(() => {
    initAnalytics(analyticsConsent);
  }, [analyticsConsent]);

  // Sincroniza consentimento local com backend após login
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const localConsent = getLocalConsent();
    if (localConsent && !user.analyticsConsent) {
      analyticsConsentService.updateConsent(true).then((updated) => {
        setUser(updated);
      }).catch(() => {});
    }
  }, [isAuthenticated, user, setUser]);

  // Para a gravação quando utilizador faz logout. O evento user_signed_out é
  // capturado de forma síncrona no handler de logout (sidebar-right) porque
  // o redirect por window.location.href mata beacons disparados em useEffect.
  const prevAuthRef = useRef(isAuthenticated);
  useEffect(() => {
    if (prevAuthRef.current && !isAuthenticated) {
      // Transição de logado → deslogado
      stopAnalytics();
      clearLocalConsent();
    }
    prevAuthRef.current = isAuthenticated;
  }, [isAuthenticated]);

  const setAnalyticsConsent = useCallback(
    async (granted: boolean) => {
      setLocalConsent(granted);

      if (!isAuthenticated) {
        initAnalytics(granted);
        return;
      }

      try {
        const updatedUser = await analyticsConsentService.updateConsent(granted);
        setUser(updatedUser);
        if (granted) {
          initAnalytics(true);
        } else {
          stopAnalytics();
        }
      } catch {
        // Erro de rede — consentimento local já está guardado
      }
    },
    [isAuthenticated, setUser],
  );

  return (
    <AnalyticsContext.Provider value={{ analyticsConsent, setAnalyticsConsent }}>
      {children}
    </AnalyticsContext.Provider>
  );
};
