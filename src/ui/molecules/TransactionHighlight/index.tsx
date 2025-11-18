"use client";

import React from "react";

export interface TransactionHighlightProps {
  title: string;
  description: string;
  amount: number;
  isIncome: boolean;
  category: string;
  timestamp?: string;
  icon: React.ElementType;
  badgeClassName: string;
  gradientClassName: string;
  iconAccentClass?: string;
}

const formatTimestampLabel = (timestamp?: string) => {
  if (!timestamp) return "Agora mesmo";

  let dateLabel: string | null = null;
  let timeLabel: string | null = null;

  const isoMatch = timestamp.match(
    /^(\d{4}-\d{2}-\d{2})(?:[T\s](\d{2}:\d{2})(?::\d{2})?)?/
  );

  if (isoMatch) {
    const [, datePart, timePart] = isoMatch;
    const dateOnly = new Date(`${datePart}T00:00:00`);
    dateLabel = Number.isNaN(dateOnly.getTime())
      ? datePart
      : dateOnly.toLocaleDateString("pt-AO", {
          day: "2-digit",
          month: "short",
        });

    if (timePart) {
      timeLabel = timePart;
    }
  }

  if (!dateLabel || !timeLabel) {
    const parsedDate = new Date(timestamp);
    if (!Number.isNaN(parsedDate.getTime())) {
      dateLabel = parsedDate.toLocaleDateString("pt-AO", {
        day: "2-digit",
        month: "short",
      });
      timeLabel = parsedDate.toLocaleTimeString("pt-AO", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  }

  if (dateLabel && timeLabel) {
    return `${dateLabel}, ${timeLabel}`;
  }

  if (dateLabel) {
    return dateLabel;
  }

  return timestamp;
};

const TransactionHighlight: React.FC<TransactionHighlightProps> = ({
  title,
  description,
  amount,
  isIncome,
  category,
  timestamp,
  icon: Icon,
  badgeClassName,
  gradientClassName,
  iconAccentClass,
}) => {
  const formattedAmount = new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
    minimumFractionDigits: 2,
  }).format(Math.abs(amount));

  const formattedTimestamp = formatTimestampLabel(timestamp);

  return (
    <article className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white px-3 py-2 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${gradientClassName}`}
      />

      <div className="relative flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-inner ${
                iconAccentClass || "shadow-slate-100"
              }`}
            >
              <Icon className="h-4 w-4 text-slate-800" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-[13px] font-semibold text-gray-900 leading-tight line-clamp-1">{title}</h3>
              <p className="text-[11px] text-gray-500 leading-tight line-clamp-1">{description}</p>
              <span className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
                {formattedTimestamp}
              </span>
            </div>
          </div>
          <span
            className={`text-[10px] font-semibold uppercase tracking-wide rounded-full px-2 py-0.5 whitespace-nowrap ${badgeClassName}`}
          >
            {category}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <p
            className={`text-sm sm:text-base font-semibold ${
              isIncome ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {isIncome ? "+" : "-"} {formattedAmount}
          </p>
          <div
            className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
              isIncome
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-700"
            }`}
          >
            {isIncome ? "Receita" : "Despesa"}
          </div>
        </div>
      </div>
    </article>
  );
};

export default TransactionHighlight;
