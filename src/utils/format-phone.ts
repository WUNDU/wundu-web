export const PHONE_PREFIX = "+244 ";

/**
 * Applies the +244 9XX XXX XXX mask to the typed text.
 * The prefix "+244 " is always preserved.
 */
export const formatPhoneNumber = (text: string): string => {
  const after = text.startsWith(PHONE_PREFIX)
    ? text.slice(PHONE_PREFIX.length)
    : text.replace(/^\+?244\s?/, "");

  const digits = after.replace(/\D/g, "").slice(0, 9);

  let formatted = digits.slice(0, 3);
  if (digits.length > 3) formatted += " " + digits.slice(3, 6);
  if (digits.length > 6) formatted += " " + digits.slice(6, 9);

  return PHONE_PREFIX + formatted;
};

/**
 * Strips formatting and returns "+244" followed by 9 digits (e.g. "+244937226087").
 */
export const unformatPhoneNumber = (text: string): string => {
  const digits = text.replace(/\D/g, "");
  return digits.startsWith("244") ? "+" + digits : "+244" + digits;
};
