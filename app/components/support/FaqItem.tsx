"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { HelpIcon } from "@/constants/icons";

type FaqItemProps = {
  question: string;
  intro?: string;
  steps?: string[];
  tip?: { title: string; description: string };
  defaultOpen?: boolean;
};

function FaqItem({ question, intro, steps, tip, defaultOpen = false }: FaqItemProps) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <article className="flex flex-col items-start justify-start self-stretch border-b border-(--card-barras) last:border-b-0">
      <h3>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex h-24 w-full items-center justify-between gap-4 p-6 text-left transition-colors hover:bg-(--card-bg-hover)"
        >
          <span className="flex min-w-0 flex-1 items-center justify-start gap-2">
            <span
              aria-hidden="true"
              className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-300/10"
            >
              <HelpIcon width={20} height={20} className="text-(--menu-icon-cinza)" />
            </span>
            <span className="font-manrope text-lg font-bold leading-7 text-(--text)">
              {question}
            </span>
          </span>
          <span className="flex shrink-0 items-center justify-center p-1">
            <ChevronDown
              width={24}
              height={24}
              aria-hidden="true"
              className={`text-(--icon) transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            />
          </span>
        </button>
      </h3>

      <div id={panelId} hidden={!open} className="w-full px-6 pb-6">
        <div className="flex flex-col items-start justify-start gap-6 overflow-hidden rounded-xl border border-(--card-barras) bg-(--menu-bg-aside) p-8">
          {intro ? (
            <p className="self-stretch font-manrope text-sm font-normal leading-5 text-(--text-description)">
              {intro}
            </p>
          ) : null}

          {steps?.length ? (
            <ol className="flex flex-col items-start justify-start gap-5 self-stretch">
              {steps.map((step, index) => (
                <li key={step} className="flex items-start justify-start gap-3 self-stretch">
                  <span
                    aria-hidden="true"
                    className="flex size-6 shrink-0 items-center justify-center rounded-md bg-(--settings-bg-config) font-manrope text-sm font-semibold leading-5 text-(--text-title)"
                  >
                    {index + 1}
                  </span>
                  <span className="flex-1 font-manrope text-sm font-normal leading-5 text-(--text-description)">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          ) : null}

          {tip ? (
            <aside className="flex flex-col items-start justify-start gap-1.5 self-stretch rounded-lg bg-(--settings-bg-config) p-4">
              <p className="font-manrope text-sm font-semibold leading-5 text-(--text-title)">
                {tip.title}
              </p>
              <p className="self-stretch font-manrope text-sm font-normal leading-5 text-(--text-description)">
                {tip.description}
              </p>
            </aside>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export default FaqItem;
