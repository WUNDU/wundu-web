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
  contentGapClass = "gap-4",
}: ChartCardProps) {
  return (
    <article
      className={`flex min-w-0 flex-col ${contentGapClass} rounded-xl border border-(--card-barras) bg-(--bg-card) p-4 sm:p-6`}
    >
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-4">
          <div className="flex min-w-0 flex-col gap-1">
            <h2 className="font-manrope text-lg font-semibold leading-7 text-(--text-title) sm:text-xl sm:leading-8">
              {title}
            </h2>
            <p className="font-manrope text-sm font-semibold text-(--text-description) sm:text-base">
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
