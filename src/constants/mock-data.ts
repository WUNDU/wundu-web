import type { Article, InvestmentType } from "../shared/types/article";
import type { Category } from "../shared/types/category";
import type { TimeRange } from "../shared/types/panel";

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

export const defaultCategories: Category[] = [
  { id: "transport", name: "Transporte" },
  { id: "food", name: "Alimentação" },
  { id: "entertainment", name: "Entretenimento" },
  { id: "health", name: "Saúde" },
  { id: "education", name: "Educação" },
  { id: "leisure", name: "Lazer" },
];

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
