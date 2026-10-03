import type { ReactNode } from "react";

type ChartCardProps = {
  title: string;
  description: string;
  /** Legenda, segmented control, etc. */
  actions?: ReactNode;
  children: ReactNode;
  /** Espaço entre cabeçalho e corpo (varia por card no Figma) */
  contentGapClass?: string;
};

export default function ChartCard({
  title,
  description,
  actions,
  children,
  contentGapClass = "gap-2.5",
}: ChartCardProps) {
  return (
    <article
      className={`flex min-w-0 flex-col ${contentGapClass} rounded-3xl border border-(--card-barras) bg-(--bg-card) p-6 shadow-[0px_2px_6px_0px_rgba(13,10,44,0.08)]`}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-1">
            <h2 className="font-manrope text-xl font-semibold leading-8 text-(--text-title)">
              {title}
            </h2>
            <p className="font-manrope text-base font-semibold text-(--text-description)">
              {description}
            </p>
          </div>
          {actions}
        </div>
        <hr className="border-0 border-t border-(--card-barras)" />
      </div>
      <div className="flex min-h-0 flex-1 flex-col justify-center">
        {children}
      </div>
    </article>
  );
}
