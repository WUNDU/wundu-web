"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { HelpIcon } from "@/constants/icons";

type SupportHeaderProps = {
  title: string;
  onClose?: () => void;
};

function SupportHeader({ title, onClose }: SupportHeaderProps) {
  return (
    <header className="flex h-24 shrink-0 items-center justify-between gap-4 self-stretch border-b border-(--card-barras) p-6">
      <div className="flex min-w-0 items-center justify-start gap-2">
        <span
          aria-hidden="true"
          className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-300/10"
        >
          <HelpIcon width={20} height={20} className="text-(--menu-icon-cinza)" />
        </span>
        <h2 className="truncate font-manrope text-lg font-bold leading-7 text-(--text)">{title}</h2>
      </div>
      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="flex shrink-0 items-center justify-center rounded p-1 transition-all hover:bg-(--card-bg-hover) active:scale-90"
        >
          <X width={24} height={24} className="text-(--icon)" />
        </button>
      ) : null}
    </header>
  );
}

export default SupportHeader;
