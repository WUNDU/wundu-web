const pad2 = (value: number) => String(value).padStart(2, "0");

/** Hora atual em HH:MM. */
export function currentTimeLabel(): string {
  const now = new Date();
  return `${pad2(now.getHours())}:${pad2(now.getMinutes())}`;
}

/** Extrai HH:MM de um datetime ISO; null quando ausente/inválido. */
export function extractTimeLabel(raw?: string | null): string | null {
  if (!raw) return null;
  const match = raw.match(/T(\d{2}):(\d{2})/);
  return match ? `${match[1]}:${match[2]}` : null;
}

/**
 * Máscara de hora 24h enquanto digita ("1" → "1" … "123" → "12:3" …
 * "1234" → "12:34"), com horas ≤ 23 e minutos ≤ 59.
 */
export function formatTimeInput(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  const hours = Math.min(23, Number(digits.slice(0, 2)));
  const minutes = digits.slice(2);
  const clampedMinutes =
    minutes.length === 2
      ? pad2(Math.min(59, Number(minutes)))
      : minutes;
  return `${pad2(hours)}:${clampedMinutes}`;
}

export const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;
