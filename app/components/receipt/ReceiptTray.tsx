"use client";

import { ChevronDown, FileText, ScanLine } from "lucide-react";
import { useState } from "react";
import { useReceipt } from "app/components/layout/ReceiptProvider";

const statusText = (status: string, progress: string) => {
  switch (status) {
    case "reading":
      return progress || "A extrair dados…";
    case "staged":
      return "Na fila";
    case "ready":
      return "Pronto para revisão";
    case "error":
      return "Falha na leitura";
    case "saved":
      return "Despesa já confirmada";
    default:
      return "Na fila";
  }
};

/**
 * Barra de progresso dos comprovativos — portada do protótipo `wundu`
 * (`ReceiptTray`): fica no canto, mostra a leitura em curso e permite abrir a
 * revisão do primeiro documento pronto.
 */
export default function ReceiptTray() {
  const receipt = useReceipt();
  const [collapsed, setCollapsed] = useState(false);
  const pending = receipt.pending;
  if (!pending.length) return null;

  const ready = receipt.ready;
  const reading = pending.filter(
    (item) => item.status === "reading" || item.status === "staged",
  );
  const finished = pending.length - reading.length;

  function reviewFirst() {
    const first = receipt.ready[0];
    if (first) receipt.openReview(first.id);
  }

  return (
    <aside
      className="fixed left-4 right-4 z-40 overflow-hidden rounded-2xl border border-(--card-barras) bg-(--background) shadow-[0_8px_30px_rgba(15,23,42,0.12)] lg:bottom-5 lg:left-auto lg:right-6 lg:w-[350px] lg:max-w-[calc(100vw-2rem)]"
      style={{ bottom: "calc(88px + env(safe-area-inset-bottom))" }}
      aria-label="Progresso dos comprovativos"
    >
      <header className="flex items-center gap-2 px-3 py-3">
        <span className="flex size-9 items-center justify-center rounded-xl bg-primary-300/10 text-primary-300">
          <ScanLine size={19} />
        </span>
        <button
          type="button"
          onClick={reviewFirst}
          className="flex min-w-0 flex-1 flex-col items-start text-left"
        >
          <strong className="w-full truncate font-manrope text-xs font-semibold leading-5 text-(--text-title)">
            {reading.length ? "A ler " : ""}
            {pending.length}{" "}
            {pending.length === 1 ? "comprovativo" : "comprovativos"} ·{" "}
            {ready.length} {ready.length === 1 ? "pronto" : "prontos"}
          </strong>
          <progress
            max={pending.length}
            value={finished}
            className="mt-1 h-1 w-full accent-primary-300"
          />
        </button>
        <button
          type="button"
          onClick={reviewFirst}
          className="rounded-lg bg-primary-300/10 px-2.5 py-1.5 font-manrope text-xs font-semibold leading-5 text-primary-300 transition-colors hover:bg-primary-300/20"
        >
          {ready.length ? "Rever" : "Ver"}
        </button>
        <button
          type="button"
          aria-label={collapsed ? "Expandir leituras" : "Recolher leituras"}
          onClick={() => setCollapsed((value) => !value)}
          className={`hidden rounded-lg p-1 text-(--icon) transition-transform hover:bg-neutrals-300/10 lg:block ${
            collapsed ? "rotate-180" : ""
          }`}
        >
          <ChevronDown size={16} />
        </button>
      </header>

      {!collapsed ? (
        <div className="hidden max-h-[260px] overflow-auto lg:block">
          {pending.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-2 border-t border-(--card-barras) px-4 py-2.5"
            >
              <FileText size={17} className="shrink-0 text-(--icon)" />
              <span className="flex min-w-0 flex-1 flex-col items-start">
                <strong className="w-full truncate font-manrope text-xs font-semibold leading-5 text-(--text-title)">
                  {item.fileName}
                </strong>
                <small className="mt-1 font-manrope text-[10px] font-medium leading-4 text-(--text-description)">
                  {statusText(
                    item.status,
                    item.status === "reading" ? receipt.progress : "",
                  )}
                </small>
              </span>
              {item.status === "ready" ? (
                <button
                  type="button"
                  onClick={() => receipt.openReview(item.id)}
                  className="rounded-lg bg-primary-300/10 px-2.5 py-1.5 font-manrope text-xs font-semibold leading-5 text-primary-300 transition-colors hover:bg-primary-300/20"
                >
                  Rever
                </button>
              ) : null}
              {item.status === "error" ? (
                <button
                  type="button"
                  onClick={() => receipt.retry(item.id)}
                  className="rounded-lg bg-primary-300/10 px-2.5 py-1.5 font-manrope text-xs font-semibold leading-5 text-primary-300 transition-colors hover:bg-primary-300/20"
                >
                  Ver
                </button>
              ) : null}
            </div>
          ))}
          <p className="px-4 py-2.5 font-manrope text-[10px] font-medium leading-4 text-(--text-description)">
            A leitura continua enquanto navegas na Wundu.
          </p>
        </div>
      ) : null}
    </aside>
  );
}
