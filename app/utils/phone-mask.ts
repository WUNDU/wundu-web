/**
 * Máscara de telefone angolano enquanto digita: agrupa de 3 em 3
 * ("9" → "9" … "914939238" → "914 939 238").
 * Com indicativo: "+244914939238" → "+244 914 939 238".
 */
export function formatPhoneInput(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  let prefix = "";
  let local = digits;
  if (digits.length > 9) {
    if (digits.startsWith("244")) {
      prefix = "+244 ";
      local = digits.slice(3);
    } else {
      local = digits.slice(-9);
    }
  }
  local = local.slice(0, 9);
  const groups = [local.slice(0, 3), local.slice(3, 6), local.slice(6, 9)].filter(
    Boolean,
  );
  return `${prefix}${groups.join(" ")}`;
}

/** Remove espaços para enviar à API ("914 939 238" → "914939238"). */
export function stripPhoneSpaces(raw: string): string {
  return raw.replace(/\s+/g, "");
}
