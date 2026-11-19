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

/**
 * Valor para o centro do donut de categorias: igual ao compacto abaixo de
 * 1 milhão, abrevia acima ("12,5 M Kz", "2,5 B Kz") para o texto caber
 * sempre no buraco do anel sem pintar por cima das fatias.
 */
export function formatAOACenter(value: number): string {
  if (!Number.isFinite(value)) return "—";
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  const one = (n: number) => {
    const label = (Math.round(n * 10) / 10).toString().replace(".", ",");
    return label.endsWith(",0") ? label.slice(0, -2) : label;
  };
  if (abs >= 1_000_000) {
    const units: Array<[number, string]> = [
      [1_000_000_000_000, "T"],
      [1_000_000_000, "B"],
      [1_000_000, "M"],
    ];
    let tier = units[units.length - 1];
    for (const u of units) {
      if (abs >= u[0]) {
        tier = u;
        break;
      }
    }
    let q = Math.round((abs / tier[0]) * 10) / 10;
    if (q >= 1000) {
      // o arredondamento a 1 casa empurrou para a unidade seguinte (ex.: 999,95 M -> 1 B)
      const idx = units.findIndex((u) => u[0] === tier[0]);
      if (idx > 0) {
        tier = units[idx - 1];
        q = Math.round((abs / tier[0]) * 10) / 10;
      }
    }
    return `${sign}${one(q)} ${tier[1]} Kz`;
  }
  return formatAOACompact(value);
}
