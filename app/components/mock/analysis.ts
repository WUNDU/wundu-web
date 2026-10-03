export const cashflowMonths = [
  "JAN",
  "FEV",
  "MAR",
  "ABR",
  "MAI",
  "JUN",
  "JUL",
  "AGO",
  "SET",
  "OUT",
  "NOV",
  "DEZ",
] as const;

// Valores em Kz (mock temporário até ligar à API)
// Geometria 1:1 com o Figma: eixo 0–6k, base y=328, 1k ≈ 54,7px
export const cashflowIncome = [
  5_268, 4_098, 3_220, 5_268, 4_098, 3_220,
  4_683, 5_268, 4_098, 5_268, 4_098, 3_220,
];

export const cashflowExpenses = [
  585, 1_756, 2_634, 585, 1_756, 2_634,
  1_463, 732, 1_756, 585, 1_756, 2_634,
];

export const cashflowBalance = [
  397, 2_253, 3_117, 1_801, 2_587, 4_600,
  1_801, 1_801, 1_251, 2_724, 3_608, 1_801,
];

export const equityPeriods = ["Anual", "Mensal", "Semanal"] as const;
export type EquityPeriod = (typeof equityPeriods)[number];

export const equityLabels: Record<EquityPeriod, string[]> = {
  Anual: [
    "JAN", "FEV", "MAR", "ABR", "MAI", "JUN",
    "JUL", "AGO", "SET", "OUT", "NOV", "DEZ",
  ],
  Mensal: ["S1", "S2", "S3", "S4"],
  Semanal: ["SEG", "TER", "QUA", "QUI", "SEX", "SÁB", "DOM"],
};

export const equitySeries: Record<EquityPeriod, number[]> = {
  Anual: [
    1_800, 2_200, 2_600, 3_100, 2_900, 3_900,
    3_600, 3_100, 2_800, 3_300, 3_000, 3_400,
  ],
  Mensal: [2_600, 3_900, 3_300, 3_000],
  /* Amostrados da curva exata do Figma (dots 1:1 sobre a linha) */
  Semanal: [2_461, 2_231, 3_343, 3_252, 3_368, 2_613, 3_742],
};

export const equityFullDay: Record<string, string> = {
  SEG: "Segunda",
  TER: "Terça",
  QUA: "Quarta",
  QUI: "Quinta",
  SEX: "Sexta",
  SÁB: "Sábado",
  DOM: "Domingo",
};

export type CategorySlice = {
  name: string;
  value: number;
  /** token de cor (variável CSS lida em runtime) */
  colorVar: string;
};

export const expenseCategories: CategorySlice[] = [
  { name: "Freelancer", value: 9_478, colorVar: "--color-success" },
  { name: "Lazer", value: 9_478, colorVar: "--color-danger-300" },
  { name: "Alimentação", value: 2_439, colorVar: "--color-orange" },
  { name: "Saúde", value: 205_510, colorVar: "--color-secondary-300" },
  { name: "Habitação", value: 172_439, colorVar: "--color-purple" },
  { name: "Educação", value: 18_197, colorVar: "--color-info" },
  { name: "Outros", value: 179_060, colorVar: "--color-primary-300" },
];

export type AccountShare = {
  name: string;
  value: number;
  colorVar: string;
};

export const accountShares: AccountShare[] = [
  { name: "Banco Angolano de Investimento", value: 121_799, colorVar: "--color-primary-300" },
  { name: "Standard Bank Angola", value: 50_799, colorVar: "--bg-chart-info" },
  { name: "Banco Sol", value: 25_567, colorVar: "--color-secondary-300" },
  { name: "Manual", value: 5_789, colorVar: "--color-info" },
];

export const heatmapDays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"] as const;
export const heatmapPeriods = ["Manhã", "Tarde", "Noite"] as const;

/** Intensidade 0–4 por [período][dia] */
export const spendingHeat: number[][] = [
  [1, 2, 2, 3, 4, 3, 2],
  [1, 3, 3, 3, 4, 2, 1],
  [2, 2, 3, 3, 4, 4, 2],
];

/** Gasto em Kz por [período][dia] (tooltip do heatmap) */
export const spendingHeatValues: number[][] = [
  [12_000, 18_500, 15_200, 22_800, 45_200, 26_900, 14_800],
  [14_500, 31_200, 28_700, 26_400, 48_900, 19_800, 12_300],
  [18_900, 17_400, 29_600, 27_300, 52_100, 53_400, 16_600],
];

export type GoalShare = {
  name: string;
  progress: number;
  colorVar: string;
};

export const goalShares: GoalShare[] = [
  { name: "Comprar Apartamento T2 - Kilamba", progress: 80, colorVar: "--color-success" },
  { name: "Depósito à prazo", progress: 65, colorVar: "--color-info" },
  { name: "Carro BMW X6", progress: 45, colorVar: "--color-secondary-300" },
  { name: "Fundo para o mestrado", progress: 30, colorVar: "--color-danger-300" },
];
