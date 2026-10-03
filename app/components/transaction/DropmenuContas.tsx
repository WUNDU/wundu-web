import { DotIcon } from "@/constants/icons";
import { Search } from "lucide-react";
import React, { useState } from "react";
import { mockAccounts, type AccountDTO } from "../mock/account";

type DropmenuContasProps = {
  isOpen: boolean;
  onSelect?: (account: AccountDTO) => void;
};

function DropmenuContas({ isOpen, onSelect }: DropmenuContasProps) {
  const [query, setQuery] = useState("");

  const filtered = mockAccounts.filter((account) =>
    account.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <article
      className={`rounded-2xl border border-(--card-barras) bg-(--background) flex flex-col items-start origin-top-right transition-all duration-200 ${isOpen ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"}`}
    >
      <header className="flex items-center p-4 gap-3 self-stretch border-b border-(--card-barras) transition-colors duration-200 hover:border-primary-300 focus-within:border-primary-300">
        <Search width={16} className="text-(--text-description)/60" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Pesquisar"
          className="font-manrope text-[14px] not-italic font-medium leading-[155.99%] tracking-[-0.42px] bg-transparent outline-none flex-1 text-(--text-description) placeholder:text-(--text-description)/60"
        />
      </header>
      <section className="flex max-h-52 p-2 items-start self-stretch overflow-y-auto">
        <ul className="flex flex-col items-start gap-2 flex-1">
          {filtered.map((account) => (
            <li
              key={account.id}
              className="flex flex-col items-start self-stretch"
            >
              <button
                type="button"
                onClick={() => onSelect?.(account)}
                className="group relative flex h-7.5 py-1 px-2.5 items-center gap-2 self-stretch rounded-lg w-full text-left"
              >
                <span
                  aria-hidden="true"
                  className={`absolute inset-0 rounded-lg opacity-0 transition-opacity group-hover:opacity-100 ${account.background}`}
                />
                <span className="relative flex items-center">
                  <DotIcon className={account.color} width={20} />
                  <span
                    aria-hidden="true"
                    className={`absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 ${account.color}`}
                  >
                    <DotIcon width={20} />
                  </span>
                </span>
                <span className="relative font-manrope text-[14px] not-italic font-semibold leading-[155.99%]">
                  <span className="text-(--text-description)">
                    {account.name}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 ${account.color}`}
                  >
                    {account.name}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}

export default DropmenuContas;
