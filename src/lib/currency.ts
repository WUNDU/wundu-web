/**
 * Format a number to AOA display mask: "1 000,00"
 * Space = thousands separator, comma = decimal separator
 */
export function formatAOA(value: number | string | null | undefined): string {
  const num =
    typeof value === "string"
      ? parseFloat(value.replace(/[\s\u202F]/g, "").replace(",", "."))
      : Number(value);
  if (isNaN(num)) return "0,00";
  return num
    .toLocaleString("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    .replace(/\u202F/g, " "); // normalize narrow no-break space → regular space
}

/**
 * Parse a masked input string back to a plain number string for API calls.
 * "1 000,50" → "1000.50"
 */
export function parseAOA(masked: string): string {
  return masked.replace(/[\s\u202F]/g, "").replace(",", ".");
}

/**
 * Apply AOA mask to a raw input string as the user types.
 * Returns the masked string to display.
 */
export function maskAOAInput(raw: string): string {
  // Remove everything except digits and comma
  const clean = raw.replace(/[^\d,]/g, "");
  const [intPart = "", decPart] = clean.split(",");
  // Format integer part with spaces
  const intFormatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return decPart !== undefined
    ? `${intFormatted},${decPart.slice(0, 2)}`
    : intFormatted;
}
