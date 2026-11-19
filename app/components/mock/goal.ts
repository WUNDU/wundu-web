import type { GoalDTO } from "../../types/dto/goal.dto";

const toKey = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const shiftDays = (n: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return toKey(d);
};

export const mockGoals: GoalDTO[] = [
  {
    id: "1",
    title: "Comprar apartamento T2 - Kilamba",
    type: "LONG_TERM",
    targetAmount: 4000000,
    currentAmount: 4000000,
    startDate: shiftDays(-365),
    endDate: shiftDays(30),
    category: "Habitação",
    categoryId: "cat-habitacao",
  },
  {
    id: "2",
    title: "Viagem a Lisboa",
    type: "SHORT_TERM",
    targetAmount: 1500000,
    currentAmount: 975000,
    startDate: shiftDays(-60),
    endDate: shiftDays(120),
    category: "Lazer",
    categoryId: "cat-lazer",
  },
  {
    id: "3",
    title: "Carro novo - Toyota Starlet",
    type: "LONG_TERM",
    targetAmount: 8500000,
    currentAmount: 1700000,
    startDate: shiftDays(-90),
    endDate: shiftDays(365),
    category: "Transporte",
    categoryId: "cat-transporte",
  },
  {
    id: "4",
    title: "Fundo de emergência",
    type: "SHORT_TERM",
    targetAmount: 1000000,
    currentAmount: 250000,
    startDate: shiftDays(-30),
    endDate: shiftDays(180),
    category: "Outros",
    categoryId: "cat-outros",
  },
  {
    id: "5",
    title: "Depósito a prazo",
    type: "LONG_TERM",
    targetAmount: 2000000,
    currentAmount: 1300000,
    startDate: shiftDays(-120),
    endDate: shiftDays(240),
    category: "Outros",
    categoryId: "cat-outros",
  },
  {
    id: "6",
    title: "Carro BMW X6",
    type: "LONG_TERM",
    targetAmount: 12000000,
    currentAmount: 5400000,
    startDate: shiftDays(-200),
    endDate: shiftDays(540),
    category: "Transporte",
    categoryId: "cat-transporte",
  },
];
