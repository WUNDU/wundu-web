"use client";

import { useCookieConsent } from "@/src/contexts/CookieConsetContext";
import { useEffect, useState } from "react";

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const { showPreferences, setShowPreferences } = useCookieConsent();

  // Cookie functions (mantenha as mesmas funções do código anterior)
  const setCookie = (name: string, value: string, days: number) => {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie =
      name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
  };

  const getCookie = (name: string) => {
    if (typeof document === "undefined") return null;

    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
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
    applyCookieSettings();
  };

  const savePreferences = () => {
    const functionalCookies =
      (document.getElementById("functional-cookies") as HTMLInputElement)
        ?.checked || false;
    const analyticsCookies =
      (document.getElementById("analytics-cookies") as HTMLInputElement)
        ?.checked || false;
    const marketingCookies =
      (document.getElementById("marketing-cookies") as HTMLInputElement)
        ?.checked || false;

    setCookie("wundu_cookie_consent", "true", 365);
    setCookie("wundu_essential_cookies", "true", 365);
    setCookie("wundu_functional_cookies", functionalCookies.toString(), 365);
    setCookie("wundu_analytics_cookies", analyticsCookies.toString(), 365);
    setCookie("wundu_marketing_cookies", marketingCookies.toString(), 365);

    applyCookieSettings();
    setShowBanner(false);
    setShowPreferences(false);
  };

  const applyCookieSettings = () => {
    if (getCookie("wundu_analytics_cookies") === "true") {
      // loadGoogleAnalytics();
    }
    if (getCookie("wundu_marketing_cookies") === "true") {
      // loadMarketingScripts();
    }
  };

  useEffect(() => {
    if (!getCookie("wundu_cookie_consent")) {
      setShowBanner(true);
    }
  }, []);

  if (!showBanner && !showPreferences) return null;

  return (
    <>
      {/* Cookie Consent Banner */}
      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50 transition-transform duration-500 animate-in slide-in-from-bottom-full">
          <div className="container mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg mb-2">
                  Nós valorizamos sua privacidade
                </h3>
                <p className="text-gray-600 text-sm">
                  Utilizamos cookies para melhorar sua experiência, personalizar
                  conteúdo e analisar o tráfego do site. Você pode escolher
                  quais cookies deseja permitir e alterar suas preferências a
                  qualquer momento.
                  <a
                    href="/privacy-policy"
                    className="text-blue-600 hover:text-blue-800 ml-1"
                  >
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

      {/* Cookie Preferences Modal */}
      {showPreferences && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-50 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-900 text-xl">
                Preferências de Cookies
              </h3>
              <button
                onClick={() => setShowPreferences(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Selecione quais cookies você aceita:
              </p>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-gray-900">Essenciais</h4>
                    <p className="text-gray-500 text-sm">
                      Necessários para o funcionamento do site. Não podem ser
                      desativados.
                    </p>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="essential-cookies"
                      className="sr-only"
                      checked
                      disabled
                    />
                    <label
                      htmlFor="essential-cookies"
                      className="block w-14 h-7 rounded-full bg-gray-300 cursor-not-allowed"
                    >
                      <span className="absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform transform translate-x-7"></span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-gray-900">Funcionais</h4>
                    <p className="text-gray-500 text-sm">
                      Permitem recursos avançados e personalização.
                    </p>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="functional-cookies"
                      className="cookie-toggle sr-only"
                    />
                    <label
                      htmlFor="functional-cookies"
                      className="cookie-toggle-label block w-14 h-7 rounded-full bg-gray-300 cursor-pointer"
                    >
                      <span className="cookie-toggle-dot absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform"></span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-gray-900">Analíticos</h4>
                    <p className="text-gray-500 text-sm">
                      Ajudam a entender como você usa o site e melhorar a
                      experiência.
                    </p>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="analytics-cookies"
                      className="cookie-toggle sr-only"
                    />
                    <label
                      htmlFor="analytics-cookies"
                      className="cookie-toggle-label block w-14 h-7 rounded-full bg-gray-300 cursor-pointer"
                    >
                      <span className="cookie-toggle-dot absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform"></span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-gray-900">Marketing</h4>
                    <p className="text-gray-500 text-sm">
                      Utilizados para exibir anúncios relevantes e compartilhar
                      com parceiros.
                    </p>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="marketing-cookies"
                      className="cookie-toggle sr-only"
                    />
                    <label
                      htmlFor="marketing-cookies"
                      className="cookie-toggle-label block w-14 h-7 rounded-full bg-gray-300 cursor-pointer"
                    >
                      <span className="cookie-toggle-dot absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-end">
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
        .cookie-toggle:checked + .cookie-toggle-label {
          background-color: #2563eb;
        }
        .cookie-toggle:checked + .cookie-toggle-label .cookie-toggle-dot {
          transform: translateX(28px);
        }
      `}</style>
    </>
  );
};

export default CookieConsent;
