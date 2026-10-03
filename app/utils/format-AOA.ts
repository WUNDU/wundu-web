export function formatAOA(value: number) {
  return new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/** Versão curta para tooltips/legendas (ex.: "205.000 Kz"). */
export function formatAOACompact(value: number) {
  return `${new Intl.NumberFormat("pt-AO", {
    maximumFractionDigits: 0,
  }).format(value)} Kz`;
}
