import { ChevronDown, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
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
  const [yearOpen, setYearOpen] = useState(false);
  const [monthOpen, setMonthOpen] = useState(false);
  const yearWrapRef = useRef<HTMLDivElement>(null);
  const yearListRef = useRef<HTMLDivElement>(null);
  const selectedYearRef = useRef<HTMLButtonElement>(null);
  const monthWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setViewYear(selected.getFullYear());
      setViewMonth(selected.getMonth());
      setYearOpen(false);
      setMonthOpen(false);
    }
  }, [isOpen, selected]);

  // Fecha a lista de anos ao clicar fora ou ao premir Escape.
  useEffect(() => {
    if (!yearOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (
        yearWrapRef.current &&
        !yearWrapRef.current.contains(event.target as Node)
      ) {
        setYearOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setYearOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [yearOpen]);

  // Fecha a lista de meses ao clicar fora ou ao premir Escape.
  useEffect(() => {
    if (!monthOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (
        monthWrapRef.current &&
        !monthWrapRef.current.contains(event.target as Node)
      ) {
        setMonthOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMonthOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [monthOpen]);

  // Leva o ano atual para a vista sempre que a lista abre (só mexe no
  // scroll da própria lista, nunca no da página).
  useEffect(() => {
    if (!yearOpen) return;
    const list = yearListRef.current;
    const selected = selectedYearRef.current;
    if (list && selected) {
      list.scrollTop = selected.offsetTop - list.clientHeight / 2;
    }
  }, [yearOpen]);

  const today = new Date();
  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const minStart = minDate
    ? new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())
    : null;

  const firstDay = new Date(viewYear, viewMonth, 1);
  const startOffset = firstDay.getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();
  const trailingDays =
    (7 - ((startOffset + daysInMonth) % 7)) % 7;

  const monthNames = useMemo(
    () =>
      Array.from({ length: 12 }, (_, month) =>
        capitalize(
          new Intl.DateTimeFormat("pt-PT", { month: "long" }).format(
            new Date(2000, month, 1),
          ),
        ),
      ),
    [],
  );

  // Atalhos de mês/ano (ex. nascimento em 1984 sem 480 cliques nas setas),
  // com os mesmos limites da navegação: sem minDate vai de há 120 anos até
  // ao mês atual; com minDate vai do mês mínimo até +20 anos.
  const minYear = minStart ? minStart.getFullYear() : today.getFullYear() - 120;
  const maxYear = Math.max(
    minStart ? minStart.getFullYear() + 20 : today.getFullYear(),
    viewYear,
  );
  const years = useMemo(() => {
    const list: number[] = [];
    for (let year = minYear; year <= maxYear; year += 1) list.push(year);
    return list;
  }, [minYear, maxYear]);

  const minMonthFor = (year: number) =>
    minStart && year === minStart.getFullYear() ? minStart.getMonth() : 0;
  const maxMonthFor = (year: number) =>
    !minStart && year === today.getFullYear() ? today.getMonth() : 11;

  const changeMonth = (month: number) => {
    setViewMonth(
      Math.min(Math.max(month, minMonthFor(viewYear)), maxMonthFor(viewYear)),
    );
  };

  const changeYear = (year: number) => {
    const next = Math.min(Math.max(year, minYear), maxYear);
    setViewYear(next);
    setViewMonth((prev) =>
      Math.min(Math.max(prev, minMonthFor(next)), maxMonthFor(next)),
    );
  };

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

  if (!isOpen) return null;

  return (
    <article className="inline-flex flex-col items-start p-3 gap-3 rounded-md border border-(--card-barras) bg-(--background)">
      <header className="flex justify-center items-center self-stretch gap-1">
        <button
          type="button"
          onClick={() => goMonth(-1)}
          disabled={!canGoPrev}
          aria-label="Mês anterior"
          className="flex w-7 h-7 shrink-0 justify-center items-center rounded-md border border-(--card-barras) bg-(--background) disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="text-(--text-description)" width={16} />
        </button>
        <div className="flex min-w-0 flex-1 items-center justify-center gap-1 px-1">
          <div className="relative min-w-0" ref={monthWrapRef}>
            <button
              type="button"
              aria-label="Escolher mês"
              aria-haspopup="listbox"
              aria-expanded={monthOpen}
              onClick={() => setMonthOpen((value) => !value)}
              className="flex max-w-28 cursor-pointer items-center gap-0.5 rounded-md bg-transparent px-1 py-1 font-inter text-sm font-medium leading-5 text-(--text-title) outline-none transition-colors hover:bg-neutrals-300/10 focus:bg-neutrals-300/10"
            >
              <span className="truncate">{monthNames[viewMonth]}</span>
              <ChevronDown
                width={14}
                aria-hidden="true"
                className={`shrink-0 text-(--text-description) transition-transform ${monthOpen ? "rotate-180" : ""}`}
              />
            </button>
            {monthOpen ? (
              <div
                role="listbox"
                aria-label="Mês"
                className="absolute left-1/2 top-full z-20 mt-1 max-h-48 w-36 -translate-x-1/2 overflow-y-auto rounded-md border border-(--card-barras) bg-(--background) p-1 shadow-lg"
              >
                <div className="flex flex-col gap-1">
                  {monthNames.map((label, month) => {
                    const disabled =
                      month < minMonthFor(viewYear) ||
                      month > maxMonthFor(viewYear);
                    return (
                      <button
                        key={label}
                        type="button"
                        role="option"
                        aria-selected={month === viewMonth}
                        disabled={disabled}
                        onClick={() => {
                          changeMonth(month);
                          setMonthOpen(false);
                        }}
                        className={`flex items-center justify-start rounded-md px-2 py-1.5 font-manrope text-sm font-normal leading-5 transition-all ${
                          month === viewMonth
                            ? "bg-(--bg-button) text-base-white"
                            : "text-(--text-title) hover:bg-neutrals-300/10"
                        } ${disabled ? "cursor-not-allowed text-(--text-description)/30 hover:bg-transparent" : ""}`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>
          <div className="relative" ref={yearWrapRef}>
            <button
              type="button"
              aria-label="Escolher ano"
              aria-haspopup="listbox"
              aria-expanded={yearOpen}
              onClick={() => setYearOpen((value) => !value)}
              className="flex cursor-pointer items-center gap-0.5 rounded-md bg-transparent px-1 py-1 font-inter text-sm font-medium leading-5 text-(--text-title) outline-none transition-colors hover:bg-neutrals-300/10 focus:bg-neutrals-300/10"
            >
              {viewYear}
              <ChevronDown
                width={14}
                aria-hidden="true"
                className={`shrink-0 text-(--text-description) transition-transform ${yearOpen ? "rotate-180" : ""}`}
              />
            </button>
            {yearOpen ? (
              <div
                role="listbox"
                aria-label="Ano"
                ref={yearListRef}
                className="absolute left-1/2 top-full z-20 mt-1 max-h-48 w-36 -translate-x-1/2 overflow-y-auto rounded-md border border-(--card-barras) bg-(--background) p-1 shadow-lg"
              >
                <div className="grid grid-cols-3 gap-1">
                  {years.map((year) => (
                    <button
                      key={year}
                      ref={year === viewYear ? selectedYearRef : undefined}
                      type="button"
                      role="option"
                      aria-selected={year === viewYear}
                      onClick={() => {
                        changeYear(year);
                        setYearOpen(false);
                      }}
                      className={`flex items-center justify-center rounded-md px-1 py-1.5 font-manrope text-sm font-normal leading-5 transition-all ${
                        year === viewYear
                          ? "bg-(--bg-button) text-base-white"
                          : "text-(--text-title) hover:bg-neutrals-300/10"
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
        <button
          type="button"
          onClick={() => goMonth(1)}
          disabled={!canGoNext}
          aria-label="Próximo mês"
          className="flex w-7 h-7 shrink-0 justify-center items-center rounded-md border border-(--card-barras) bg-(--background) disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronRight width={16} />
        </button>
      </header>
      <div className="grid grid-cols-7 gap-1">
        {WEEKDAYS.map((day, i) => (
          <span
            key={`weekday-${i}`}
            className="flex h-8 w-8 items-center justify-center text-center font-manrope text-sm font-normal leading-5 text-(--text-description)"
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
              className={`flex h-8 w-8 items-center justify-center text-center font-manrope text-sm font-normal leading-5 rounded-md transition-all ${dayClass(prev.getFullYear(), prev.getMonth(), day, false)}`}
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
              className={`flex h-8 w-8 items-center justify-center text-center font-manrope text-sm font-normal leading-5 rounded-md transition-all ${dayClass(viewYear, viewMonth, day, true)}`}
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
              className={`flex h-8 w-8 items-center justify-center text-center font-manrope text-sm font-normal leading-5 rounded-md transition-all ${dayClass(next.getFullYear(), next.getMonth(), day, false)}`}
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
            className="w-17 rounded-lg border border-(--border-button) bg-(--background) px-2 py-1.5 text-center font-manrope text-sm font-semibold text-(--text-title) outline-none placeholder:text-(--text-description)/40 focus:border-primary-300"
          />
        </div>
      ) : null}
    </article>
  );
}

export default DropmenuData;
