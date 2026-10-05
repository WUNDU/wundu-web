"use client";

import { Clock } from "lucide-react";
import { IAIcon } from "@/constants/icons";
import { useUserStore } from "@/store/user-store";

type InsightSeverity = "urgent" | "warning" | "positive";

type InsightSegment = {
  text: string;
  bold?: boolean;
};

export type AiInsight = {
  severity: InsightSeverity;
  segments: InsightSegment[];
  clamp: "line-clamp-2" | "line-clamp-3" | "line-clamp-4";
};

const SEVERITY_STYLE: Record<
  InsightSeverity,
  { label: string; badge: string; text: string }
> = {
  urgent: {
    label: "Urgente",
    badge: "bg-danger-300/10",
    text: "text-danger-300",
  },
  warning: {
    label: "Atenção",
    badge: "bg-warning/10",
    text: "text-warning",
  },
  positive: {
    label: "Positivo",
    badge: "bg-success/10",
    text: "text-success",
  },
};

type AiNotifyProps = {
  className?: string;
  userName?: string;
  insights?: AiInsight[];
};

function defaultInsights(userName: string): AiInsight[] {
  return [
    {
      severity: "urgent",
      clamp: "line-clamp-4",
      segments: [
        { text: userName, bold: true },
        { text: ", os teus gastos em " },
        { text: "alimentação aumentaram 24%", bold: true },
        { text: ". Se mantiveres este ritmo, poderás terminar o mês com " },
        { text: "saldo negativo", bold: true },
        { text: "." },
      ],
    },
    {
      severity: "warning",
      clamp: "line-clamp-2",
      segments: [
        { text: "Com tendência baixa de " },
        { text: "crescimento em 12,4%", bold: true },
        { text: " neste mês." },
      ],
    },
    {
      severity: "positive",
      clamp: "line-clamp-3",
      segments: [
        { text: "Já " },
        { text: "concluíste 67%", bold: true },
        {
          text: " do valor total das tuas metas. Cada meta concluída representa um passo para a tua ",
        },
        { text: "liberdade financeira", bold: true },
        { text: "." },
      ],
    },
  ];
}

export default function AiNotify({
  className,
  userName,
  insights,
}: AiNotifyProps) {
  const storeName = useUserStore((s) => s.user?.name?.trim());
  const displayName =
    userName ?? (storeName ? storeName.split(" ")[0] : "Utilizador");
  const items = insights ?? defaultInsights(displayName);

  return (
    <article
      className={[
        "flex w-full min-w-0 flex-col items-start overflow-hidden rounded-[20px] border border-(--card-barras) bg-(--bg-card) shadow-[0px_4px_12px_0px_rgba(0,0,0,0.04)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label="Insights inteligentes da Wundu AI"
    >
      <div className="flex h-20 items-center justify-start self-stretch gap-2 overflow-hidden border-b border-(--card-barras) px-4 py-2 sm:px-5">
        <div className="flex h-9 flex-1 items-center justify-between">
          <div className="flex h-9 items-center justify-start">
            <span className="flex size-10 shrink-0 items-center justify-center">
              <IAIcon className="size-7" aria-hidden="true" />
            </span>
            <span className="flex min-w-0 flex-col items-start justify-center">
              <span className="h-5 font-manrope text-sm font-semibold leading-5 text-(--text-description)">
                WUNDU AI
              </span>
              <span className="font-manrope text-sm font-bold leading-5 text-(--text-title)">
                Insights inteligentes
              </span>
            </span>
          </div>
          <span className="flex h-7 w-24 shrink-0 items-center justify-center gap-2 rounded-2xl border border-(--border-button) bg-(--background-variant) px-2.5 py-[4.87px]">
            <Clock
              className="size-3.5 shrink-0 text-(--menu-icon-cinza)"
              aria-hidden="true"
            />
            <span className="font-inter text-[10px] font-semibold text-(--text-title)">
              Actualizado
            </span>
          </span>
        </div>
      </div>

      <div className="flex flex-col items-start justify-start gap-4 self-stretch p-4 sm:p-6">
        {items.map((insight, index) => {
          const style = SEVERITY_STYLE[insight.severity];
          return (
            <div key={`${insight.severity}-${index}`} className="self-stretch">
              <div className="flex flex-col items-start justify-start gap-2 overflow-hidden">
                <div className="flex flex-col items-end justify-start gap-2.5">
                  <span
                    className={`inline-flex items-center justify-center gap-2.5 rounded-2xl px-3 py-1 ${style.badge}`}
                  >
                    <span
                      className={`font-inter text-xs font-bold ${style.text}`}
                    >
                      {style.label}
                    </span>
                  </span>
                </div>
                <p
                  className={`text-justify font-manrope text-sm leading-5 text-(--text-description) ${insight.clamp}`}
                >
                  {insight.segments.map((segment, segmentIndex) => (
                    <span
                      key={segmentIndex}
                      className={segment.bold ? "font-bold" : "font-medium"}
                    >
                      {segment.text}
                    </span>
                  ))}
                </p>
              </div>
              {index < items.length - 1 ? (
                <hr className="mt-4 border-0 border-t border-(--card-barras)" />
              ) : null}
            </div>
          );
        })}
      </div>
    </article>
  );
}
