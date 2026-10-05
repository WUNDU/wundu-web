/** Milhares sem decimais em pt-AO (ex.: "4.000.000"). */
export function formatGoalAmount(value: number): string {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("pt-AO", {
    maximumFractionDigits: 0,
  }).format(value);
}
