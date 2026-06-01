"use client";

import { useRouter } from "next/navigation";
import { X, BarChart2, Calendar, TrendingUp, TrendingDown, Mail } from "lucide-react";
import type { NotificationResponse } from "@/types/dtos/notification.dto";
import { ROUTES } from "@/constants/routes";

// ── Config ────────────────────────────────────────────────────────────────────

const REPORT_CONFIG = {
  WEEKLY_REPORT:    { label: "Resumo da Semana",   Icon: BarChart2 },
  BIWEEKLY_REPORT:  { label: "Resumo Quinzenal",   Icon: BarChart2 },
  MONTHLY_REPORT:   { label: "Relatório do Mês",   Icon: Calendar  },
} as const;

type ReportType = keyof typeof REPORT_CONFIG;

// ── Message parser ─────────────────────────────────────────────────────────────

interface ParsedReport {
  totalExpenses?: string;
  transactionCount?: number;
  comparison?: string;
  topCategory?: string;
  pdfSentByEmail: boolean;
}

function parseReportMessage(message: string): ParsedReport {
  const parts = message.split("  ·  ");
  const result: ParsedReport = { pdfSentByEmail: false };

  for (const part of parts) {
    if (part.startsWith("Total gasto:")) {
      result.totalExpenses = part.replace("Total gasto:", "").replace("Kz", "").trim();
    } else if (part.includes("transacções")) {
      const n = parseInt(part);
      if (!isNaN(n)) result.transactionCount = n;
    } else if (part.includes("vs ")) {
      result.comparison = part.trim();
    } else if (part.startsWith("Top:")) {
      result.topCategory = part.replace("Top:", "").trim();
    } else if (part.includes("PDF enviado")) {
      result.pdfSentByEmail = true;
    }
  }

  return result;
}

// ── Component ─────────────────────────────────────────────────────────────────

interface ReportNotificationModalProps {
  notification: NotificationResponse;
  onClose: () => void;
}

export function ReportNotificationModal({ notification, onClose }: ReportNotificationModalProps) {
  const router = useRouter();
  const config = REPORT_CONFIG[notification.type as ReportType] ?? REPORT_CONFIG.WEEKLY_REPORT;
  const { Icon, label } = config;
  const { totalExpenses, transactionCount, comparison, topCategory, pdfSentByEmail } =
    parseReportMessage(notification.message);

  const isPositiveTrend = comparison?.startsWith("+");
  const hasTwoStats = transactionCount !== undefined && !!topCategory;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div
          className="rounded-t-2xl p-6 text-white relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #00216b, #003cc3)" }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.15)" }}
          >
            <X size={16} />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <Icon size={16} className="opacity-75" />
            <span className="text-xs font-semibold opacity-75">{label}</span>
          </div>

          <p className="text-sm opacity-70 mb-2 pr-10 leading-snug">{notification.title}</p>

          {totalExpenses && (
            <>
              <p className="text-3xl font-black">{totalExpenses} Kz</p>
              <p className="text-xs opacity-60 mt-1">total gasto</p>
            </>
          )}

          {comparison && (
            <div
              className="inline-flex items-center gap-1 mt-3 px-2 py-1 rounded-full text-xs font-bold"
              style={{
                background: isPositiveTrend ? "rgba(239,68,68,0.2)" : "rgba(34,197,94,0.2)",
                color: isPositiveTrend ? "#FCA5A5" : "#86EFAC",
              }}
            >
              {isPositiveTrend ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {comparison}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {(transactionCount !== undefined || topCategory) && (
            <div className={`grid gap-3 ${hasTwoStats ? "grid-cols-2" : "grid-cols-1"}`}>
              {transactionCount !== undefined && (
                <div className="bg-slate-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-slate-400 font-semibold">Transacções</p>
                  <p className="text-sm font-black text-secondary mt-1">{transactionCount}</p>
                </div>
              )}
              {topCategory && (
                <div className="bg-slate-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-slate-400 font-semibold">Top categoria</p>
                  <p className="text-sm font-black text-secondary-dark mt-1 truncate">{topCategory}</p>
                </div>
              )}
            </div>
          )}

          {pdfSentByEmail && (
            <div className="flex items-start gap-3 bg-blue-50 rounded-xl p-4 border border-blue-100">
              <Mail size={18} className="text-secondary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-slate-600 leading-relaxed">
                O teu relatório detalhado em PDF foi enviado para o teu email.
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => { onClose(); router.push(ROUTES.CONTROL_PANEL); }}
              className="flex-1 py-3 rounded-xl font-bold text-sm border border-secondary text-secondary transition-colors hover:bg-secondary/5"
            >
              Ver Detalhes
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-bold text-white text-sm"
              style={{ background: "linear-gradient(135deg, #00216b, #003cc3)" }}
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
