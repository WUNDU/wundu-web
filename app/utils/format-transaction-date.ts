export function formatTransactionDate(value?: string | null): string {
  if (!value) return "—";

  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "—";

  const hasTime = /T\d{2}:\d{2}/.test(value);
  return new Intl.DateTimeFormat(
    "pt-AO",
    hasTime
      ? {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      : { day: "2-digit", month: "2-digit", year: "numeric" },
  ).format(date);
}
