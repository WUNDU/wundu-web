/**
 * Aceita "1 000,00" ou "1000.00"; null quando inválido ou <= 0.
 */
export function parseAmountPt(raw: string): number | null {
  const normalized = raw.trim().replace(/\s/g, "");
  if (!normalized) return null;
  const withDot = normalized.includes(",")
    ? normalized.replace(/\./g, "").replace(",", ".")
    : normalized;
  const value = Number(withDot);
  return Number.isFinite(value) && value > 0 ? value : null;
}

/**
 * Máscara de moeda pt-AO enquanto digita: só guarda dígitos, os últimos
 * 2 são os cêntimos ("1" → "0,01" … "100" → "1,00" … "100000" → "1 000,00").
 */
export function formatAmountInput(raw: string): string {
  const digits = raw.replace(/\D/g, "").replace(/^0+(?=\d)/, "");
  if (!digits) return "";
  const cents = digits.slice(-2).padStart(2, "0");
  const int = digits.length > 2 ? digits.slice(0, -2) : "0";
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${grouped},${cents}`;
}

/**
 * Número → texto mascarado (ex. 500000 → "500 000,00").
 */
export function formatAmountValue(value: number): string {
  if (!Number.isFinite(value)) return "";
  return formatAmountInput(String(Math.round(value * 100)));
}
