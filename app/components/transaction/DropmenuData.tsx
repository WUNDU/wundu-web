import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import React, { useEffect, useState } from "react";
import { formatTimeInput } from "../../utils/time-mask";

type DropmenuDataProps = {
  isOpen: boolean;
  selected: Date;
  onSelect?: (date: Date) => void;
  /**
   * Quando definido, o calendário só permite este dia em diante
   * (ex. data limite de metas). Por omissão bloqueia dias futuros
   * (ex. data de transações).
   */
  minDate?: Date | null;
  /** Mostra o campo de hora no rodapé do calendário. */
  showTime?: boolean;
  time?: string;
  onTimeChange?: (time: string) => void;
};

const WEEKDAYS = ["D", "S", "T", "Q", "Q", "S", "S"];

const capitalize = (value: string): string =>
  value.charAt(0).toUpperCase() + value.slice(1);

function DropmenuData({ isOpen, selected, onSelect, minDate, showTime, time, onTimeChange }: DropmenuDataProps) {
  const [viewYear, setViewYear] = useState(selected.getFullYear());
  const [viewMonth, setViewMonth] = useState(selected.getMonth());

  useEffect(() => {
    if (isOpen) {
      setViewYear(selected.getFullYear());
      setViewMonth(selected.getMonth());
    }
  }, [isOpen, selected]);

  if (!isOpen) return null;

  const firstDay = new Date(viewYear, viewMonth, 1);
  const startOffset = firstDay.getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();
  const trailingDays =
    (7 - ((startOffset + daysInMonth) % 7)) % 7;
  const monthLabel = capitalize(
    new Intl.DateTimeFormat("pt-PT", {
      month: "long",
      year: "numeric",
    }).format(firstDay),
  );

  const goMonth = (delta: number) => {
    const next = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  };

  const pickDay = (year: number, month: number, day: number) => {
    const next = new Date(selected);
    next.setFullYear(year, month, day);
    setViewYear(year);
    setViewMonth(month);
    onSelect?.(next);
  };

  const today = new Date();
  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const minStart = minDate
    ? new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())
    : null;

  const isCurrentMonthView =
    viewYear === today.getFullYear() && viewMonth === today.getMonth();

  const isDisabledDay = (year: number, month: number, day: number) => {
    const time = new Date(year, month, day).getTime();
    if (minStart) return time < minStart.getTime();
    return time > todayStart.getTime();
  };

  // Navegação: com minDate não se recua antes do mês mínimo mas pode-se
  // avançar à vontade; sem minDate (transações) não se avança além do atual.
  const canGoPrev = minStart
    ? viewYear > minStart.getFullYear() ||
      (viewYear === minStart.getFullYear() &&
        viewMonth > minStart.getMonth())
    : true;
  const canGoNext = minStart ? true : !isCurrentMonthView;

  const isSameDay = (year: number, month: number, day: number) =>    selected.getFullYear() === year &&
    selected.getMonth() === month &&
    selected.getDate() === day;

  const isToday = (year: number, month: number, day: number) =>
    today.getFullYear() === year &&
    today.getMonth() === month &&
    today.getDate() === day;

  const dayClass = (
    year: number,
    month: number,
    day: number,
    inView: boolean,
  ) => {
    if (isDisabledDay(year, month, day))
      return "text-(--text-description)/30 cursor-not-allowed";
    if (!inView)
      return "text-(--text-description)/40 hover:bg-neutrals-300/10";
    if (isSameDay(year, month, day))
      return "bg-(--bg-button) text-base-white hover:bg-(--bg-button)";
    if (isToday(year, month, day))
      return "bg-(--background-variant) text-(--text-title) font-semibold";
    return "text-(--text-title) hover:bg-neutrals-300/10";
  };

  return (
    <article className="inline-flex flex-col items-start p-3 gap-3 rounded-md border border-(--card-barras) bg-(--background)">
      <header className="flex justify-center items-center self-stretch">
        <button
          type="button"
          onClick={() => goMonth(-1)}
          disabled={!canGoPrev}
          aria-label="Mês anterior"
          className="flex w-7 h-7 justify-center items-center rounded-md border border-(--card-barras) bg-(--background) disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="text-(--text-description)" width={16} />
        </button>
        <p className="text-center font-inter text-sm font-medium leading-5 text-(--text-title) flex-1">
          {monthLabel}
        </p>
        <button
          type="button"
          onClick={() => goMonth(1)}
          disabled={!canGoNext}
          aria-label="Próximo mês"
          className="flex w-7 h-7 justify-center items-center rounded-md border border-(--card-barras) bg-(--background) disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronRight width={16} />
        </button>
      </header>
      <div className="grid grid-cols-7 gap-1">
        {WEEKDAYS.map((day, i) => (
          <span
            key={`weekday-${i}`}
            className="flex h-8 w-8 items-center justify-center text-center font-manrope text-sm font-normal leading-5.25 text-(--text-description)"
          >
            {day}
          </span>
        ))}
        {Array.from({ length: startOffset }).map((_, i) => {
          const day = daysInPrevMonth - startOffset + 1 + i;
          const prev = new Date(viewYear, viewMonth - 1, 1);
          return (
            <button
              key={`prev-${day}`}
              type="button"
              disabled={isDisabledDay(
                prev.getFullYear(),
                prev.getMonth(),
                day,
              )}
              onClick={() =>
                pickDay(prev.getFullYear(), prev.getMonth(), day)
              }
              className={`flex h-8 w-8 items-center justify-center text-center font-manrope text-sm font-normal leading-5.25 rounded-md transition-all ${dayClass(prev.getFullYear(), prev.getMonth(), day, false)}`}
            >
              {day}
            </button>
          );
        })}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          return (
            <button
              key={`day-${day}`}
              type="button"
              disabled={isDisabledDay(viewYear, viewMonth, day)}
              onClick={() => pickDay(viewYear, viewMonth, day)}
              className={`flex h-8 w-8 items-center justify-center text-center font-manrope text-sm font-normal leading-5.25 rounded-md transition-all ${dayClass(viewYear, viewMonth, day, true)}`}
            >
              {day}
            </button>
          );
        })}
        {Array.from({ length: trailingDays }).map((_, i) => {
          const day = i + 1;
          const next = new Date(viewYear, viewMonth + 1, 1);
          return (
            <button
              key={`next-${day}`}
              type="button"
              disabled={isDisabledDay(
                next.getFullYear(),
                next.getMonth(),
                day,
              )}
              onClick={() =>
                pickDay(next.getFullYear(), next.getMonth(), day)
              }
              className={`flex h-8 w-8 items-center justify-center text-center font-manrope text-sm font-normal leading-5.25 rounded-md transition-all ${dayClass(next.getFullYear(), next.getMonth(), day, false)}`}
            >
              {day}
            </button>
          );
        })}
      </div>
      {showTime ? (
        <div className="flex items-center justify-center gap-2 self-stretch border-t border-(--card-barras) pt-3">
          <Clock
            width={14}
            height={14}
            aria-hidden="true"
            className="shrink-0 text-(--text-description)"
          />
          <input
            type="text"
            inputMode="numeric"
            value={time ?? ""}
            onChange={(event) => onTimeChange?.(formatTimeInput(event.target.value))}
            placeholder="12:00"
            aria-label="Hora (HH:MM)"
            maxLength={5}
            className="w-[68px] rounded-lg border border-(--border-button) bg-(--background) px-2 py-1.5 text-center font-manrope text-sm font-semibold text-(--text-title) outline-none placeholder:text-(--text-description)/40 focus:border-primary-300"
          />
        </div>
      ) : null}
    </article>
  );
}

export default DropmenuData;
