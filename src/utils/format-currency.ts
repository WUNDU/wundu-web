/**
 * Format a number to AOA display string.
 * Uses "1 000,00" format (space = thousands, comma = decimal).
 * Mirrors the mobile app's formatCurrency utility.
 */
export const formatCurrency = (value: number | string): string => {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "0,00";
  return num
    .toFixed(2)
    .replace(".", ",")
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};
