/**
 * Web adaptation of mobile's category-icon.ts.
 * Returns lucide-react icon component names instead of Ionicons names.
 */

export type LucideIconName =
  | "Utensils"
  | "Bus"
  | "Car"
  | "Plane"
  | "Stethoscope"
  | "BookOpen"
  | "Gamepad2"
  | "Home"
  | "Shirt"
  | "Laptop"
  | "Smartphone"
  | "RefreshCw"
  | "Palette"
  | "Dumbbell"
  | "TrendingUp"
  | "Shield"
  | "Zap"
  | "PawPrint"
  | "Gift"
  | "Wrench"
  | "Banknote"
  | "MoreHorizontal"
  | "Wallet"
  | "CreditCard"
  | "ShoppingBag"
  | "Store"
  | "Bike"
  | "Leaf"
  | "Star"
  | "Diamond"
  | "Box"
  | "Layers";

const ICON_MAP: { keywords: string[]; icon: LucideIconName }[] = [
  {
    keywords: [
      "alimentação", "comida", "restauran", "refeição", "refeicao",
      "mercearia", "supermercado", "padaria", "pão", "pao",
    ],
    icon: "Utensils",
  },
  {
    keywords: [
      "transporte", "combustível", "combustivel", "gasolina",
      "táxi", "taxi", "uber", "autocarro", "metrô", "metro", "ônibus", "onibus", "bus",
    ],
    icon: "Bus",
  },
  {
    keywords: ["carro", "veículo", "veiculo", "automóvel", "automovel", "oficina", "garagem"],
    icon: "Car",
  },
  {
    keywords: ["viagem", "turismo", "férias", "ferias", "avião", "aviao", "voo", "hotel", "hospedagem"],
    icon: "Plane",
  },
  {
    keywords: ["saúde", "saude", "médic", "medic", "farmácia", "farmacia", "clínica", "clinica", "hospital", "dentist"],
    icon: "Stethoscope",
  },
  {
    keywords: ["educaç", "educac", "escola", "livro", "formação", "formacao", "curso", "faculdade", "universidade", "estudos"],
    icon: "BookOpen",
  },
  {
    keywords: ["lazer", "entret", "diversão", "diversao", "cinema", "teatro", "concerto", "jogo", "recreação", "recreacao"],
    icon: "Gamepad2",
  },
  {
    keywords: ["casa", "habitaç", "habitac", "renda", "hipoteca", "aluguel", "aluguer", "imóvel", "imovel", "condomínio", "condominio"],
    icon: "Home",
  },
  {
    keywords: ["roupa", "vestuário", "vestuario", "moda", "calçado", "calcado", "boutique", "têxtil", "textil"],
    icon: "Shirt",
  },
  {
    keywords: ["tecnologia", "informátic", "informatic", "computad", "software", "hardware", "gadget", "electrón", "electron"],
    icon: "Laptop",
  },
  {
    keywords: ["telemóvel", "telemovel", "telefon", "comunic", "internet", "dados", "operadora"],
    icon: "Smartphone",
  },
  {
    keywords: ["streaming", "subscriç", "subscric", "netflix", "spotify", "assinatura"],
    icon: "RefreshCw",
  },
  {
    keywords: ["beleza", "estética", "estetica", "cabelei", "salão", "salao", "spa", "cosmétic", "cosmetic", "manicure"],
    icon: "Palette",
  },
  {
    keywords: ["desporto", "ginásio", "ginasio", "fitness", "sport", "academia", "treino"],
    icon: "Dumbbell",
  },
  {
    keywords: ["poupança", "poupanca", "investimento", "invest", "acções", "acoes", "fundos"],
    icon: "TrendingUp",
  },
  { keywords: ["seguro", "segura", "proteção", "protecao"], icon: "Shield" },
  {
    keywords: ["água", "agua", "luz", "electricidade", "electricid", "gás", "gas", "serviço público", "servico publico"],
    icon: "Zap",
  },
  {
    keywords: ["animal", "pet", "cão", "cao", "gato", "veterinár", "veterinar"],
    icon: "PawPrint",
  },
  { keywords: ["presente", "prenda", "oferta", "dons", "donativo"], icon: "Gift" },
  {
    keywords: ["restauro", "manutenç", "manutenc", "reparo", "reparaç", "reparac"],
    icon: "Wrench",
  },
  {
    keywords: ["financ", "banco", "crédito", "credito", "emprést", "emprest", "divida", "dívida"],
    icon: "Banknote",
  },
  { keywords: ["outro", "geral", "misc", "diverso", "vário", "vario"], icon: "MoreHorizontal" },
];

const FALLBACK_ICONS: LucideIconName[] = [
  "Wallet", "CreditCard", "ShoppingBag", "Store",
  "Bike", "Leaf", "Star", "Diamond", "Box", "Layers",
];

/**
 * Returns a semantically meaningful lucide-react icon name for a category.
 * Falls back to distinct icons cycled by fallbackIndex.
 */
export function getCategoryIcon(name: string, fallbackIndex: number = 0): LucideIconName {
  const lower = name.toLowerCase();
  for (const entry of ICON_MAP) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      return entry.icon;
    }
  }
  return FALLBACK_ICONS[fallbackIndex % FALLBACK_ICONS.length];
}
