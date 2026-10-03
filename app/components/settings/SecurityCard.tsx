"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";

type SecurityCardProps = {
  onChangePassword?: () => void;
  onViewSessions?: () => void;
};

function SecurityCard({ onChangePassword, onViewSessions }: SecurityCardProps) {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const rows = [
    {
      id: "2fa",
      title: "Autenticação de dois factores",
      description: "Adicione uma camada extra de segurança",
      action: (
        <button
          type="button"
          onClick={() => setTwoFactorEnabled((value) => !value)}
          aria-pressed={twoFactorEnabled}
          className="flex shrink-0 items-center justify-center gap-2 rounded-lg bg-primary-300/10 px-4 py-2 transition-all hover:opacity-80 active:scale-[0.98]"
        >
          <span className="font-manrope text-sm font-bold leading-5 text-(--text-link)">
            {twoFactorEnabled ? "Habilitado" : "Habilitar"}
          </span>
        </button>
      ),
    },
    {
      id: "password",
      title: "Palavra-passe",
      description: "Última alteração há 3 meses",
      action: (
        <button
          type="button"
          onClick={onChangePassword}
          className="flex shrink-0 items-center justify-center gap-2 rounded-lg bg-primary-300/10 px-4 py-2 transition-all hover:opacity-80 active:scale-[0.98]"
        >
          <span className="font-manrope text-sm font-bold leading-5 text-(--text-link)">
            Mudar
          </span>
        </button>
      ),
    },
    {
      id: "sessions",
      title: "Sessões activas",
      description: "Gerencie suas sessões activas",
      action: (
        <button
          type="button"
          onClick={onViewSessions}
          className="flex shrink-0 items-center justify-center gap-2 rounded-lg bg-primary-300/10 px-4 py-2 transition-all hover:opacity-80 active:scale-[0.98]"
        >
          <span className="font-manrope text-sm font-bold leading-5 text-(--text-link)">
            Visualizar
          </span>
        </button>
      ),
    },
  ];

  return (
    <section
      aria-labelledby="security-title"
      className="flex flex-col items-start justify-start gap-2 self-stretch rounded-2xl border border-(--card-barras) bg-(--background) p-6"
    >
      <div className="flex items-center justify-start gap-3">
        <ShieldCheck
          width={16}
          height={16}
          aria-hidden="true"
          className="text-(--icon-hover-2)"
        />
        <h2
          id="security-title"
          className="font-manrope text-lg font-bold leading-7 text-(--text)"
        >
          Segurança
        </h2>
      </div>
      {rows.map((row, index) => (
        <div
          key={row.id}
          className={`flex min-h-20 items-center justify-between gap-4 self-stretch py-4 ${
            index < rows.length - 1 ? "border-b border-(--card-barras)" : ""
          }`}
        >
          <div className="flex min-w-0 flex-1 flex-col items-start justify-start gap-1">
            <p className="font-manrope text-base font-semibold text-(--text)">
              {row.title}
            </p>
            <p className="font-manrope text-sm font-normal leading-5 text-(--text-description)">
              {row.description}
            </p>
          </div>
          {row.action}
        </div>
      ))}
    </section>
  );
}

export default SecurityCard;
