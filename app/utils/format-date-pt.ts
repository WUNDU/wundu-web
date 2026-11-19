const capitalize = (value: string): string =>
  value.charAt(0).toUpperCase() + value.slice(1);

const abbreviate = (value: string, length = 3): string =>
  capitalize(value.replace(/\./g, "").slice(0, length));

/**
 * Formata uma data no padrão curto "Qua, 23 de Set de 2026, 12:30".
 * Usa dia da semana e mês abreviados para não quebrar o layout.
 * Se nenhuma data for passada, usa a data atual.
 */
export function formatFullDatePT(date: Date = new Date()): string {
  const weekday = abbreviate(
    new Intl.DateTimeFormat("pt-PT", { weekday: "short" }).format(date),
  );
  const month = abbreviate(
    new Intl.DateTimeFormat("pt-PT", { month: "short" }).format(date),
  );
  const time = new Intl.DateTimeFormat("pt-PT", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);

  return `${weekday}, ${date.getDate()} de ${month} de ${date.getFullYear()}, ${time}`;
}
