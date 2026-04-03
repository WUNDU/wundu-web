"use client";

import { useState, useEffect } from "react";
import { useCookieConsent } from "@/contexts/cookie-conset-context";

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const { showPreferences, setShowPreferences } = useCookieConsent();

  const setCookie = (name: string, value: string, days: number) => {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value || ""}; expires=${date.toUTCString()}; path=/; SameSite=Lax`;
  };

  const getCookie = (name: string) => {
    if (typeof document === "undefined") return null;
    const nameEQ = name + "=";
    for (let c of document.cookie.split(";")) {
      c = c.trimStart();
      if (c.startsWith(nameEQ)) return c.substring(nameEQ.length);
    }
    return null;
  };

  const acceptAllCookies = () => {
    setCookie("wundu_cookie_consent", "true", 365);
    setCookie("wundu_essential_cookies", "true", 365);
    setCookie("wundu_functional_cookies", "true", 365);
    setCookie("wundu_analytics_cookies", "true", 365);
    setCookie("wundu_marketing_cookies", "true", 365);
    setShowBanner(false);
  };

  const savePreferences = () => {
    const get = (id: string) =>
      (document.getElementById(id) as HTMLInputElement)?.checked ?? false;
    setCookie("wundu_cookie_consent", "true", 365);
    setCookie("wundu_essential_cookies", "true", 365);
    setCookie("wundu_functional_cookies", String(get("functional-cookies")), 365);
    setCookie("wundu_analytics_cookies", String(get("analytics-cookies")), 365);
    setCookie("wundu_marketing_cookies", String(get("marketing-cookies")), 365);
    setShowBanner(false);
    setShowPreferences(false);
  };

  useEffect(() => {
    if (!getCookie("wundu_cookie_consent")) setShowBanner(true);
  }, []);

  if (!showBanner && !showPreferences) return null;

  return (
    <>
      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50 transition-transform duration-500 animate-in slide-in-from-bottom-full">
          <div className="container mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg mb-2">
                  Nós valorizamos sua privacidade
                </h3>
                <p className="text-gray-600 text-sm">
                  Utilizamos cookies para melhorar sua experiência, personalizar conteúdo e
                  analisar o tráfego do site.{" "}
                  <a href="/privacy-policy" className="text-blue-600 hover:text-blue-800">
                    Saiba mais sobre nossa política de cookies
                  </a>
                  .
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowPreferences(true)}
                  className="px-6 py-3 border border-blue-600 text-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition-colors whitespace-nowrap"
                >
                  Personalizar
                </button>
                <button
                  onClick={acceptAllCookies}
                  className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors whitespace-nowrap"
                >
                  Aceitar todos
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showPreferences && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-900 text-xl">Preferências de Cookies</h3>
              <button
                onClick={() => setShowPreferences(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>
            <p className="text-gray-600 mb-4">Selecione quais cookies você aceita:</p>
            <div className="space-y-4 mb-6">
              {[
                { id: "essential-cookies", label: "Essenciais", desc: "Necessários para o funcionamento do site. Não podem ser desativados.", disabled: true },
                { id: "functional-cookies", label: "Funcionais", desc: "Permitem recursos avançados e personalização.", disabled: false },
                { id: "analytics-cookies", label: "Analíticos", desc: "Ajudam a entender como você usa o site e melhorar a experiência.", disabled: false },
                { id: "marketing-cookies", label: "Marketing", desc: "Utilizados para exibir anúncios relevantes e compartilhar com parceiros.", disabled: false },
              ].map(({ id, label, desc, disabled }) => (
                <div key={id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-gray-900">{label}</h4>
                    <p className="text-gray-500 text-sm">{desc}</p>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      id={id}
                      className="cookie-toggle sr-only"
                      defaultChecked={disabled}
                      disabled={disabled}
                    />
                    <label
                      htmlFor={id}
                      className={`cookie-toggle-label block w-14 h-7 rounded-full bg-gray-300 ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      <span className="cookie-toggle-dot absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform" />
                    </label>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <button
                onClick={savePreferences}
                className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              >
                Salvar preferências
              </button>
            </div>
          </div>
        </div>
      )}
      <style jsx>{`
        .cookie-toggle:checked + .cookie-toggle-label { background-color: #2563eb; }
        .cookie-toggle:checked + .cookie-toggle-label .cookie-toggle-dot { transform: translateX(28px); }
      `}</style>
    </>
  );
}
