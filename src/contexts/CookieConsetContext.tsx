// src/contexts/CookieConsentContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface CookieConsentContextType {
  showPreferences: boolean;
  setShowPreferences: (show: boolean) => void;
  openCookiePreferences: () => void;
}

const CookieConsentContext = createContext<
  CookieConsentContextType | undefined
>(undefined);

export const useCookieConsent = () => {
  const context = useContext(CookieConsentContext);
  if (context === undefined) {
    throw new Error(
      "useCookieConsent must be used within a CookieConsentProvider"
    );
  }
  return context;
};

interface CookieConsentProviderProps {
  children: ReactNode;
}

export const CookieConsentProvider = ({
  children,
}: CookieConsentProviderProps) => {
  const [showPreferences, setShowPreferences] = useState(false);

  const openCookiePreferences = () => {
    setShowPreferences(true);
  };

  return (
    <CookieConsentContext.Provider
      value={{
        showPreferences,
        setShowPreferences,
        openCookiePreferences,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
};
