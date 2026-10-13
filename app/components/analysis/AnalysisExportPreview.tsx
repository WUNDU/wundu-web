"use client";

import type { CSSProperties } from "react";
import { formatAOA } from "app/utils/format-AOA";
import type { AnalysisReport } from "app/utils/analysis-report";

/** Divide o CSV em células (todas vêm entre aspas, com "" escaped). */
function parseCsvRows(csv: string): string[][] {
  return csv.split("\r\n").map((line) => {
    const cells: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (inQuotes) {
        if (char === '"') {
          if (line[i + 1] === '"') {
            current += '"';
            i++;
          } else {
            inQuotes = false;
          }
        } else {
          current += char;
        }
      } else if (char === '"') {
        inQuotes = true;
      } else if (char === ";") {
        cells.push(current);
        current = "";
      } else {
        current += char;
      }
    }
    cells.push(current);
    return cells;
  });
}

/**
 * Pré-visualização do relatório — espelha o preview do protótipo
 * (`analytics-export`). Excel: folha com cores, % e barras. CSV: tabela
 * simples com os dados em colunas (células vazias ocultas), sem cores.
 */
export default function AnalysisExportPreview({
  report,
  format,
  csv,
}: {
  report: AnalysisReport;
  format: "csv" | "xlsx";
  csv: string;
}) {
  if (format === "csv") {
    const rows = parseCsvRows(csv)
      .map((cells) => cells.map((cell) => cell.trim()).filter((cell) => cell !== ""))
      .filter((cells) => cells.length > 0);
    return (
      <div className="overflow-auto rounded-xl border border-(--card-barras) bg-white">
        <table className="w-full border-collapse font-mono text-xs text-[#364152]">
          <caption className="sr-only">
            Pré-visualização do ficheiro CSV (células vazias ocultas)
          </caption>
          <tbody>
            {rows.map((cells, index) => (
              <tr key={index} className="border-b border-[#eef1f4] last:border-0">
                {cells.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="max-w-60 truncate whitespace-nowrap px-3 py-1.5"
                    title={cell}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td className="p-4 text-center font-sans text-(--text-description)">
                  Sem dados neste período.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <p className="border-t border-(--card-barras) px-3 py-2 font-manrope text-[11px] text-(--text-description)">
          Células vazias ocultas na pré-visualização. O ficheiro mantém todas as
          colunas.
        </p>
      </div>
    );
  }
  const toKz = (cents: number) => cents / 100;
  const value = (amount: number | null) =>
    amount === null ? "—" : formatAOA(toKz(amount));
  const ratio = report.ratio === null ? null : Math.min(100, Math.max(0, report.ratio * 100));
  const maxBlock = Math.max(1, ...report.blocks.slice(1).map((block) => block.actual));
  const lineCount = Math.max(8, ...report.blocks.map((block) => block.lines.length));

  return (
    <div className="overflow-auto rounded-xl border border-(--card-barras) bg-white">
      <div
        className="min-w-180 p-4 text-[#364152]"
        style={{ fontFamily: "Calibri, Arial, sans-serif", fontSize: 11 }}
        aria-label="Pré-visualização do relatório"
      >
        <header className="-m-4 mb-3 flex items-center justify-between border-b border-[#d5c5cc] bg-[#f2e7ec] px-5 py-3">
          <h2 className="text-[23px] font-medium">{report.title}</h2>
          <span className="text-[11px] text-[#62748e]">
            {report.range.start} — {report.range.end} · Kz
          </span>
        </header>

        <div className="mb-5 grid grid-cols-[1fr_1fr_.8fr_1.2fr] items-center gap-3">
          <div>
            <h3 className="border border-[#a9b9c2] bg-[#e8eef1] p-1 text-center text-[11px] font-semibold">
              RESUMO TOTAL REALIZADO
            </h3>
            {report.blocks.slice(1).map((block) => (
              <p
                key={block.name}
                className="flex justify-between gap-2 border border-t-0 border-[#a9b9c2] px-1.5 py-1 text-[10px]"
                style={{ backgroundColor: `#${block.color}` }}
              >
                <span>{block.name}</span>
                <strong className="font-medium whitespace-nowrap">
                  {formatAOA(toKz(block.actual))}
                </strong>
              </p>
            ))}
            <p className="flex justify-between gap-2 border border-t-0 border-[#a9b9c2] px-1.5 py-1 text-[10px]">
              <span>Património total</span>
              <strong className="font-medium whitespace-nowrap">
                {formatAOA(toKz(report.wealth))}
              </strong>
            </p>
          </div>

          <div className="grid gap-2.5">
            {[
              { label: "Entradas", amount: report.income, bg: "#bedceb" },
              { label: "Total realizado", amount: report.expenses, bg: "#d4e8c6" },
              { label: "Resta", amount: report.remaining, bg: "#fff0ad" },
            ].map((kpi) => (
              <p
                key={kpi.label}
                className="flex justify-between gap-2 border border-[#98a8ad] px-2.5 py-2"
                style={{ backgroundColor: kpi.bg }}
              >
                <span>{kpi.label}</span>
                <strong className="font-medium whitespace-nowrap">
                  {formatAOA(toKz(kpi.amount))}
                </strong>
              </p>
            ))}
          </div>

          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] text-[#62748e]">% Realizado</span>
            <div
              className="grid h-25 w-25 place-items-center rounded-full"
              style={{ background: `conic-gradient(#a9ce8d ${ratio ?? 0}%, #fff0ad 0)` }}
            >
              <strong className="grid h-16 w-16 place-items-center rounded-full bg-white text-[23px]">
                {ratio === null ? "—" : `${Math.round(ratio)}%`}
              </strong>
            </div>
            <small className="text-[10px] text-[#62748e]">Gastos / entradas</small>
          </div>

          <div className="text-center">
            <span className="text-[10px] text-[#62748e]">Total realizado</span>
            <div className="flex items-end justify-center">
              {report.blocks.slice(1).map((block) => (
                <div key={block.name} className="flex flex-1 flex-col items-center">
                  <strong className="font-medium whitespace-nowrap">
                    {formatAOA(toKz(block.actual))}
                  </strong>
                  <i
                    className="block w-6"
                    style={{
                      height: `${Math.max(1, (block.actual / maxBlock) * 70)}px`,
                      backgroundColor: `#${block.color}`,
                    }}
                  />
                  <small className="text-[9px]">{block.name}</small>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 items-start gap-3">
          {report.blocks.map((block) => (
            <section
              key={block.name}
              className="min-w-0"
              style={
                {
                  "--report-tint": `#${block.color}`,
                  "--report-border": `#${block.border}`,
                } as CSSProperties
              }
            >
              <h3 className="border border-(--report-border) bg-(--report-tint) p-1 text-center text-[11px] font-semibold">
                {block.name}
              </h3>
              <div className="mb-2 border border-t-0 border-(--report-border) bg-white px-1 py-0.5">
                <p className="flex items-center justify-between gap-1 text-[9px] leading-6">
                  <span>Total orçado</span>
                  <strong className="font-normal whitespace-nowrap">
                    {value(block.planned)}
                  </strong>
                </p>
                <p className="flex items-center justify-between gap-1 text-[9px] leading-6">
                  <span>Total realizado</span>
                  <strong className="font-normal whitespace-nowrap">
                    {formatAOA(toKz(block.actual))}
                  </strong>
                </p>
                <p className="flex items-center justify-between gap-1 text-[9px] leading-6">
                  <span>Diferença</span>
                  <strong className="font-normal whitespace-nowrap">
                    {value(block.difference)}
                  </strong>
                </p>
              </div>
              <table className="w-full table-fixed border-collapse text-[9px]">
                <thead>
                  <tr className="bg-(--report-tint)">
                    <th className="h-5 border border-(--report-border) px-1 py-0.5 text-left font-normal">
                      Descrição
                    </th>
                    <th className="h-5 border border-(--report-border) px-1 py-0.5 text-right font-normal">
                      Orçado
                    </th>
                    <th className="h-5 border border-(--report-border) px-1 py-0.5 text-right font-normal">
                      Realizado
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: lineCount }, (_, index) => {
                    const line = block.lines[index];
                    return (
                      <tr key={index}>
                        <td className="h-5 truncate border border-(--report-border) px-1 py-0.5 text-left font-normal">
                          {line?.description || " "}
                        </td>
                        <td className="h-5 border border-(--report-border) px-1 py-0.5 text-right font-normal">
                          {line ? value(line.planned) : ""}
                        </td>
                        <td className="h-5 border border-(--report-border) px-1 py-0.5 text-right font-normal">
                          {line ? formatAOA(toKz(line.actual)) : ""}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-(--report-tint)">
                    <th className="h-5 border border-(--report-border) px-1 py-0.5 text-left font-normal">
                      Total
                    </th>
                    <td className="h-5 border border-(--report-border) px-1 py-0.5 text-right font-normal">
                      {value(block.planned)}
                    </td>
                    <td className="h-5 border border-(--report-border) px-1 py-0.5 text-right font-normal">
                      {formatAOA(toKz(block.actual))}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
