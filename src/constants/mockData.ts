import type { Article, InvestmentType } from "../types/article";
import type { Category } from "../types/category";
import type { TimeRange, TransactionProps } from "../types/panel";

export const investmentTypes: InvestmentType[] = [
  {
    id: "1",
    name: "1-Poupança (Baixo risco, baixo retorno)",
    description: "Exemplos: contas poupança, depósitos a prazo.",
    riskLevel: "baixo",
    examples: ["Ideal para emergências, mas rendem pouco."],
  },
  {
    id: "2",
    name: "2-Títulos Públicos e Obrigações (Baixa a médio risco)",
    description:
      "Tu emprestas dinheiro ao governo ou a empresas e recebes com juros.",
    riskLevel: "baixo",
    examples: ["Mais seguro que ações, mas menos rentável."],
  },
  {
    id: "3",
    name: "3-Ações (Médio a alto risco)",
    description: "Tu compras uma parte de uma empresa.",
    riskLevel: "alto",
    examples: [],
  },
];

// Categorias padrão

export const defaultCategories: Category[] = [
  { id: "transport", name: "Transporte" },
  { id: "food", name: "Alimentação" },
  { id: "entertainment", name: "Entretenimento" },
  { id: "health", name: "Saúde" },
  { id: "education", name: "Educação" },
  { id: "leisure", name: "Lazer" },
];

// Fallback mock data for when no transactions are available
export const mockDataByTimeRange = {
  "1D": [
    { month: "09:00", value: 15 },
    { month: "12:00", value: 25 },
    { month: "15:00", value: 20 },
    { month: "18:00", value: 30 },
    { month: "21:00", value: 22 },
  ],
  "1S": [
    { month: "Seg", value: 30 },
    { month: "Ter", value: 45 },
    { month: "Qua", value: 60 },
    { month: "Qui", value: 55 },
    { month: "Sex", value: 70 },
    { month: "Sáb", value: 35 },
    { month: "Dom", value: 25 },
  ],
  "1M": [
    { month: "S1", value: 120 },
    { month: "S2", value: 145 },
    { month: "S3", value: 160 },
    { month: "S4", value: 155 },
  ],
  "6M": [
    { month: "Jul", value: 75 },
    { month: "Ago", value: 90 },
    { month: "Set", value: 85 },
    { month: "Out", value: 120 },
    { month: "Nov", value: 110 },
    { month: "Dez", value: 100 },
  ],
  "1A": [
    { month: "Jan", value: 30 },
    { month: "Fev", value: 45 },
    { month: "Mar", value: 60 },
    { month: "Abr", value: 55 },
    { month: "Mai", value: 70 },
    { month: "Jun", value: 80 },
    { month: "Jul", value: 75 },
    { month: "Ago", value: 90 },
    { month: "Set", value: 85 },
    { month: "Out", value: 120 },
    { month: "Nov", value: 110 },
    { month: "Dez", value: 100 },
  ],
};

// Base transactions with current timestamps for filtering
export const baseTransactions: (TransactionProps & { timestamp: Date })[] = [
  {
    icon: { initials: "T", color: "white", bgColor: "bg-blue-950" },
    title: "Transporte",
    transactions: 5,
    amount: -11000,
    percentage: 55,
    timestamp: new Date(), // Today
  },
  {
    icon: { initials: "S", color: "black", bgColor: "bg-yellow-400" },
    title: "Saúde",
    transactions: 2,
    amount: -5000,
    percentage: 25,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
  },
  {
    icon: { initials: "L", color: "white", bgColor: "bg-green-400" },
    title: "Lazer",
    transactions: 4,
    amount: -4000,
    percentage: 20,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    icon: { initials: "A", color: "white", bgColor: "bg-red-500" },
    title: "Alimentação",
    transactions: 8,
    amount: -8000,
    percentage: 40,
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
  },
  {
    icon: { initials: "C", color: "white", bgColor: "bg-purple-500" },
    title: "Compras",
    transactions: 3,
    amount: -6000,
    percentage: 30,
    timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
  },
  {
    icon: { initials: "E", color: "white", bgColor: "bg-indigo-500" },
    title: "Educação",
    transactions: 2,
    amount: -3000,
    percentage: 15,
    timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
  },
  {
    icon: { initials: "U", color: "white", bgColor: "bg-orange-500" },
    title: "Utilidades",
    transactions: 6,
    amount: -7000,
    percentage: 35,
    timestamp: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
  },
  {
    icon: { initials: "R", color: "white", bgColor: "bg-pink-500" },
    title: "Restaurante",
    transactions: 3,
    amount: -2500,
    percentage: 12,
    timestamp: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
  },
  {
    icon: { initials: "G", color: "white", bgColor: "bg-teal-500" },
    title: "Gasolina",
    transactions: 4,
    amount: -5500,
    percentage: 28,
    timestamp: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), // 180 days ago
  },
];

export const baseCreditTransactions: (TransactionProps & {
  timestamp: Date;
})[] = [
  {
    icon: { initials: "T", color: "white", bgColor: "bg-slate-950" },
    title: "Transporte",
    transactions: 5,
    amount: -11000,
    percentage: 55,
    timestamp: new Date(),
  },
  {
    icon: { initials: "S", color: "black", bgColor: "bg-yellow-400" },
    title: "Saúde",
    transactions: 2,
    amount: -5000,
    percentage: 25,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    icon: { initials: "R", color: "white", bgColor: "bg-green-500" },
    title: "Recebido",
    transactions: 1,
    amount: +30000,
    percentage: 20,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
];

export const tabRanges = ["1D", "1S", "1M", "6M", "1A"] as TimeRange[];

export const objectives = [
  {
    id: 1,
    title: "Comprar carro",
    valorAlvo: "1.000.000,00kz",
    valorPoupado: "600.000,00kz",
    percentage: 60,
  },
  {
    id: 2,
    title: "Comprar roupa",
    valorAlvo: "2.000.000,00kz",
    valorPoupado: "800.000,00kz",
    percentage: 40,
  },
  {
    id: 3,
    title: "Comprar casa",
    valorAlvo: "5.000.000,00kz",
    valorPoupado: "5.000.000,00kz",
    percentage: 100,
  },
  {
    id: 4,
    title: "Viagem",
    valorAlvo: "1.500.000,00kz",
    valorPoupado: "1.500.000,00kz",
    percentage: 100,
  },
  {
    id: 5,
    title: "Comprar eletrônicos",
    valorAlvo: "900.000,00kz",
    valorPoupado: "300.000,00kz",
    percentage: 33,
  },
  {
    id: 6,
    title: "Comprar carro",
    valorAlvo: "1.000.000,00kz",
    valorPoupado: "600.000,00kz",
    percentage: 60,
  },
  {
    id: 7,
    title: "Comprar roupa",
    valorAlvo: "2.000.000,00kz",
    valorPoupado: "800.000,00kz",
    percentage: 40,
  },
  {
    id: 8,
    title: "Comprar casa",
    valorAlvo: "5.000.000,00kz",
    valorPoupado: "5.000.000,00kz",
    percentage: 100,
  },
  {
    id: 9,
    title: "Viagem",
    valorAlvo: "1.500.000,00kz",
    valorPoupado: "1.500.000,00kz",
    percentage: 100,
  },
  {
    id: 10,
    title: "Comprar eletrônicos",
    valorAlvo: "900.000,00kz",
    valorPoupado: "300.000,00kz",
    percentage: 33,
  },
];

export const categories = ["Finanças", "Investimentos", "Poupança", "Gestão"];

export const mockArticles: Article[] = [
  {
    id: "1",
    title: "Gerencie o seu dinheiro",
    description:
      "Aprenda a cuidar do seudinheiro da maneira certa investindo em...",
    imageUrl:
      "https://cdn.pixabay.com/photo/2016/11/27/21/42/stock-1863880_1280.jpg",
    category: "finanças",
    isNew: true,
  },
  {
    id: "2",
    title: "Como investir o seu dinheiro",
    description:
      "Aprenda a cuidar do seudinheiro da maneira certa investindo em...",
    imageUrl:
      "https://cdn.pixabay.com/photo/2016/11/27/21/42/stock-1863880_1280.jpg",
    category: "investimentos",
    isNew: true,
  },
  {
    id: "3",
    title: "Gerencie o seu dinheiro",
    description:
      "Aprenda a cuidar do seudinheiro da maneira certa investindo em...",
    imageUrl:
      "https://cdn.pixabay.com/photo/2016/11/27/21/42/stock-1863880_1280.jpg",
    category: "finanças",
  },
  {
    id: "4",
    title: "Investimentos",
    description:
      "Aprenda a cuidar do seudinheiro da maneira certa investindo em...",
    imageUrl:
      "https://cdn.pixabay.com/photo/2016/11/27/21/42/stock-1863880_1280.jpg",
    category: "investimentos",
  },
];
