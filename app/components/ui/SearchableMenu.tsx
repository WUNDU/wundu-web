"use client";

import { useState } from "react";
import { Search } from "lucide-react";

export type SearchableMenuOption = {
  id: string;
  label: string;
};

type SearchableMenuProps = {
  isOpen: boolean;
  options: SearchableMenuOption[];
  value?: string;
  onSelect?: (id: string) => void;
  placeholder?: string;
  emptyText?: string;
};

/**
 * Lista pesquisável para dropdowns flutuantes — mesmo padrão visual do
 * menu de categorias (pesquisa + lista com scroll).
 */
export default function SearchableMenu({
  isOpen,
  options,
  value,
  onSelect,
  placeholder = "Pesquisar",
  emptyText = "Sem resultados.",
}: SearchableMenuProps) {
  const [query, setQuery] = useState("");

  if (!isOpen) return null;

  const filtered = options.filter((option) =>
    option.label.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <article className="flex w-full flex-col items-start rounded-2xl border border-(--card-barras) bg-(--background)">
      <header className="flex items-center gap-3 self-stretch border-b border-(--card-barras) px-4 py-3 transition-colors duration-200 hover:border-primary-300 focus-within:border-primary-300">
        <Search width={16} className="shrink-0 text-(--text-description)/60" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          className="min-w-0 flex-1 bg-transparent font-manrope text-[14px] not-italic font-medium leading-[155.99%] tracking-[-0.42px] text-(--text-description) outline-none placeholder:text-(--text-description)/60"
        />
      </header>
      <section className="flex max-h-52 items-start self-stretch overflow-y-auto p-2">
        {filtered.length === 0 ? (
          <p className="w-full px-2.5 py-3 text-center font-manrope text-sm text-(--text-description-60)">
            {emptyText}
          </p>
        ) : (
          <ul className="flex flex-1 flex-col items-start gap-1">
            {filtered.map((option) => {
              const isActive = option.id === value;
              return (
                <li key={option.id} className="flex flex-col items-start self-stretch">
                  <button
                    type="button"
                    onClick={() => onSelect?.(option.id)}
                    aria-pressed={isActive}
                    className={`flex w-full items-center gap-2 self-stretch rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-neutrals-300/10 ${
                      isActive
                        ? "font-semibold text-(--text-title)"
                        : "font-medium text-(--text-description)"
                    }`}
                  >
                    <span className="truncate font-manrope text-sm">
                      {option.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </article>
  );
}
