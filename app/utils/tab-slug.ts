/**
 * Slugs estáveis para tabs endereçáveis por URL (ex. `?tab=fluxo-financeiro`).
 * Usado pelas páginas de Definições/Análises e pela pesquisa rápida da TopBar.
 */
export function toTabSlug(label: string): string {
  return label
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
}

/** Devolve o tab correspondente ao slug do URL (ou null se inválido). */
export function tabFromSlug<T extends string>(
  tabs: readonly T[],
  slug: string | null,
): T | null {
  if (!slug) return null;
  return tabs.find((tab) => toTabSlug(tab) === slug) ?? null;
}
