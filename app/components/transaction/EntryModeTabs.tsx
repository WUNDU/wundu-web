"use client";

type EntryModeTabsProps = {
  value: "manual" | "receipt";
  onChange: (next: "manual" | "receipt") => void;
};

/**
 * Tab "Preencher manualmente | Ler comprovativo".
 *
 * No protótipo `wundu` a escolha da forma de registar a despesa é um grupo de
 * botões (`receipt-entry-mode`): a leitura de comprovativos substitui os
 * campos do formulário em vez de se misturar com eles.
 */
export default function EntryModeTabs({ value, onChange }: EntryModeTabsProps) {
  const base =
    "flex-1 min-w-0 rounded-lg px-3 py-2.5 font-manrope text-sm font-medium leading-5 transition-all active:scale-95";
  const selected = "bg-(--bg-body) text-(--text-title) shadow-[0_1px_4px_rgba(0,0,0,0.06)]";
  const idle = "text-(--text-description) hover:bg-neutrals-300/10";

  return (
    <div
      role="group"
      aria-label="Forma de adicionar despesa"
      className="flex w-full items-center gap-1 rounded-xl border border-(--border-button) bg-(--background) p-1"
    >
      <button
        type="button"
        aria-pressed={value === "manual"}
        onClick={() => onChange("manual")}
        className={`${base} ${value === "manual" ? selected : idle}`}
      >
        <span className="hidden lg:inline">Preencher manualmente</span>
        <span className="lg:hidden">Manual</span>
      </button>
      <button
        type="button"
        aria-pressed={value === "receipt"}
        onClick={() => onChange("receipt")}
        className={`${base} ${value === "receipt" ? selected : idle}`}
      >
        Ler comprovativo
      </button>
    </div>
  );
}
