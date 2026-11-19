"use client";

import ChartCard from "./ChartCard";

type AnalysisEmptyProps = {
  title: string;
  description: string;
  message: string;
};

/**
 * Estado honesto quando não há fonte de dados (ex. património e contas
 * sem API) — em vez de gráficos com valores mock.
 */
export default function AnalysisEmpty({
  title,
  description,
  message,
}: AnalysisEmptyProps) {
  return (
    <ChartCard title={title} description={description}>
      <div className="flex min-h-48 flex-col items-center justify-center gap-2 p-8 text-center">
        <p className="font-manrope text-base font-semibold text-(--text-title)">
          Sem dados disponíveis
        </p>
        <p className="font-manrope text-sm text-(--text-description)">
          {message}
        </p>
      </div>
    </ChartCard>
  );
}
