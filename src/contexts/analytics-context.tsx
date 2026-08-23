"use client";

import { createContext, useContext, useEffect, useRef, useCallback, ReactNode } from "react";
import { useUserStore } from "@/store/user-store";
import { analyticsConsentService } from "@/services/analytics-consent.service";
import { initAnalytics, stopAnalytics, captureEvent } from "@/lib/analytics";

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

  // Estado: usa backend se logado, senão usa localStorage
  const analyticsConsent = isAuthenticated
    ? (user?.analyticsConsent ?? false)
    : getLocalConsent();

  // Guarda o consentimento anterior para detectar mudanças
  const prevConsentRef = useRef(analyticsConsent);

  useEffect(() => {
    // Evita chamadas duplicadas se o consentimento não mudou
    if (prevConsentRef.current === analyticsConsent) return;
    prevConsentRef.current = analyticsConsent;

    initAnalytics(analyticsConsent);
  }, [analyticsConsent]);

  // Init na primeira renderização (mount)
  useEffect(() => {
    initAnalytics(analyticsConsent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  // Para analytics quando utilizador faz logout
  const prevAuthRef = useRef(isAuthenticated);
  useEffect(() => {
    if (prevAuthRef.current && !isAuthenticated) {
      // Transição de logado → deslogado
      captureEvent("user_signed_out");
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
