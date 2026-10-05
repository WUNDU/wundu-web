"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import Toggle from "./Toggle";
import { useAnalytics } from "@/contexts/analytics-context";

function PrivacyCard() {
  const { analyticsConsent, setAnalyticsConsent } = useAnalytics();
  const [saving, setSaving] = useState(false);

  async function handleToggle() {
    if (saving) return;
    setSaving(true);
    try {
      await setAnalyticsConsent(!analyticsConsent);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section
      aria-labelledby="privacy-title"
      className="flex flex-col items-start justify-start gap-2 self-stretch rounded-2xl border border-(--card-barras) bg-(--bg-card) p-6"
    >
      <div className="flex items-center justify-start gap-3">
        <Lock
          width={16}
          height={16}
          aria-hidden="true"
          className="text-(--icon-hover-2)"
        />
        <h2
          id="privacy-title"
          className="font-manrope text-lg font-bold leading-7 text-(--text)"
        >
          Privacidade e Dados
        </h2>
      </div>
      <div className="flex items-center justify-between gap-4 self-stretch py-4">
        <div className="flex min-w-0 flex-1 flex-col items-start justify-start gap-1">
          <p className="font-manrope text-base font-semibold text-(--text)">
            Dados Analíticos
          </p>
          <p className="font-manrope text-sm font-normal leading-5 text-(--text-description)">
            Recolha anónima de dados de uso para melhorar a aplicação. Não
            inclui dados financeiros.
          </p>
        </div>
        <Toggle
          checked={analyticsConsent}
          onToggle={() => void handleToggle()}
          label="Dados Analíticos"
        />
      </div>
    </section>
  );
}

export default PrivacyCard;
