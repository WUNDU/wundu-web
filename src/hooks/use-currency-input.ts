import { useState, useCallback } from "react";
import { maskAOAInput, parseAOA } from "@/lib/currency";

/**
 * Hook for currency-masked inputs.
 * Returns { displayValue, numericValue, onChange }
 * - displayValue: masked string for the input field
 * - numericValue: plain number string for API ("1000.50")
 * - onChange: handler for <input onChange={...} />
 */
export function useCurrencyInput(initial?: number | string) {
  const toDisplay = (v?: number | string) => {
    if (v === undefined || v === null || v === "") return "";
    const num = typeof v === "string" ? parseFloat(v) : v;
    if (isNaN(num)) return "";
    return num
      .toLocaleString("fr-FR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
      .replace(/\u202F/g, " ");
  };

  const [displayValue, setDisplayValue] = useState(() => toDisplay(initial));

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskAOAInput(e.target.value);
    setDisplayValue(masked);
  }, []);

  const numericValue = parseAOA(displayValue);

  return { displayValue, numericValue, onChange };
}
