/**
 * Web adaptation of mobile's category-icon.ts (wundu-mobile/src/utils/category-icon.ts).
 * Returns lucide-react icon names instead of Ionicons names — same keyword
 * dictionary, same Angolan-Portuguese context, same fallback philosophy
 * (neutral finance icons, never decorative planets/diamonds).
 */

export type LucideIconName =
  | "Utensils"
  | "ShoppingCart"
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
  | "ArrowDownCircle"
  | "ArrowLeftRight"
  | "Send"
  | "Wallet"
  | "Hammer"
  | "Store"
  | "Users"
  | "MoreHorizontal"
  | "Tag"
  | "Receipt"
  | "CreditCard"
  | "Layers"
  | "LayoutGrid"
  | "Folder"
  | "Grid3x3";

interface CategoryStyle {
  keywords: string[];
  icon: LucideIconName;
  color: string;
}

// Keyword → icon/color mappings (Portuguese-first, Angolan context, checks
// substrings case-insensitively, with and without accentuation). Mirrors
// wundu-mobile's dictionary 1:1 so both apps stay in sync.
const CATEGORY_STYLES: CategoryStyle[] = [
  {
    keywords: [
      "alimentação", "alimentacao", "comida", "refeição", "refeicao",
      "almoço", "almoco", "jantar", "pequeno-almoço", "pequeno almoco",
      "lanche", "merenda", "cozinha", "cozinhar", "fast food", "fastfood",
      "comida de rua", "comida rua", "take away", "takeaway", "delivery",
      "funge", "funje", "muamba", "moamba", "kizaka", "quizaca", "calulu",
      "mufete", "feijão", "feijao", "jinguba", "kitaba", "cacusso",
      "gindungo", "quissangua", "peixe frito", "peixe seco", "carne seca",
      "carne de porco", "frango assado", "bombó", "bombo", "funge de bombó",
      "mercearia", "padaria", "pão", "pao", "bolo", "doce", "sobremesa",
    ],
    icon: "Utensils",
    color: "#FFC727",
  },
  {
    keywords: [
      "restauran", "café", "cafe", "bar", "cantina", "esplanada",
      "churrascaria", "pizzaria", "marisqueira", "snack-bar", "snackbar",
      "geladaria", "confeitaria", "petisqueira",
    ],
    icon: "Utensils",
    color: "#EF4444",
  },
  {
    keywords: [
      "supermercado", "minimercado", "quitanda", "talho", "açougue",
      "acougue", "mercado", "roboshop", "shoprite", "kero", "candando",
      "maxi", "jumbo", "loja de conveniência", "loja de conveniencia",
      "compras do mês", "compras do mes",
    ],
    icon: "ShoppingCart",
    color: "#F59E0B",
  },
  {
    keywords: [
      "transporte", "combustível", "combustivel", "gasolina", "gasóleo",
      "gasoleo", "táxi", "taxi", "uber", "autocarro", "candongueiro",
      "kupapata", "moto-táxi", "mototaxi", "moto táxi", "zenza",
      "passagem", "bilhete de transporte", "estacionamento", "parqueamento",
      "portagem", "oficina", "garagem", "pneu", "mecânico", "mecanico",
      "carro", "veículo", "veiculo", "automóvel", "automovel", "moto",
      "motorizada", "combóio", "comboio", "metrô", "metro", "ônibus",
      "onibus", "bus", "revisão do carro", "revisao do carro", "seguro auto",
    ],
    icon: "Car",
    color: "#66A8E3",
  },
  {
    keywords: [
      "viagem", "turismo", "férias", "ferias", "avião", "aviao", "voo",
      "hotel", "hospedagem", "pousada", "resort", "passaporte", "visto",
      "bagagem", "excursão", "excursao", "cruzeiro",
    ],
    icon: "Plane",
    color: "#0EA5E9",
  },
  {
    keywords: [
      "saúde", "saude", "médic", "medic", "farmácia", "farmacia",
      "clínica", "clinica", "hospital", "dentist", "consulta", "exame",
      "análises", "analises", "laboratório", "laboratorio",
      "plano de saúde", "plano de saude", "seguro saúde", "seguro saude",
      "vacina", "maternidade", "parto", "fisioterapia", "óculos", "oculos",
      "oftalmolog", "psicólog", "psicolog", "nutricionista", "cirurgia",
      "internamento",
    ],
    icon: "Stethoscope",
    color: "#EF4444",
  },
  {
    keywords: [
      "educaç", "educac", "escola", "livro", "formação", "formacao",
      "curso", "faculdade", "universidade", "estudos", "propina",
      "propinas", "mensalidade escolar", "explicaç", "explicac",
      "material escolar", "uniforme escolar", "creche", "infantário",
      "infantario", "matrícula", "matricula", "papelaria", "cadernos",
      "professor particular", "explicador",
    ],
    icon: "BookOpen",
    color: "#9C52F1",
  },
  {
    keywords: [
      "lazer", "entret", "diversão", "diversao", "cinema", "teatro",
      "concerto", "jogo", "recreação", "recreacao", "festa", "aniversário",
      "aniversario", "casamento", "batizado", "bar noturno", "discoteca",
      "boate", "praia", "piscina", "parque", "zoo", "passeio", "convívio",
      "convivio", "karaoke", "kizomba", "semba", "festival",
    ],
    icon: "Gamepad2",
    color: "#49B58F",
  },
  {
    keywords: [
      "casa", "habitaç", "habitac", "renda", "hipoteca", "aluguel",
      "aluguer", "imóvel", "imovel", "condomínio", "condominio",
      "mobília", "mobilia", "decoração", "decoracao", "obras",
      "reforma da casa", "eletrodomésticos", "eletrodomesticos",
      "arrendamento", "quintal", "vedação", "vedacao", "portão", "portao",
    ],
    icon: "Home",
    color: "#F97316",
  },
  {
    keywords: [
      "roupa", "vestuário", "vestuario", "moda", "calçado", "calcado",
      "sapato", "ténis", "tenis", "boutique", "têxtil", "textil", "fato",
      "camisa", "capulana", "tecido", "costureira", "alfaiate",
    ],
    icon: "Shirt",
    color: "#EC4899",
  },
  {
    keywords: [
      "tecnologia", "informátic", "informatic", "computad", "software",
      "hardware", "gadget", "electrón", "electron", "smartphone",
      "tablet", "impressora", "acessórios de informática",
      "acessorios de informatica",
    ],
    icon: "Laptop",
    color: "#6366F1",
  },
  {
    keywords: [
      "telemóvel", "telemovel", "telefon", "comunic", "internet", "dados",
      "operadora", "unitel", "movicel", "africell", "netone", "wifi",
      "crédito telefónico", "credito telefonico", "saldo do telemóvel",
      "saldo do telemovel", "recarga", "pacote de internet",
    ],
    icon: "Smartphone",
    color: "#0EA5E9",
  },
  {
    keywords: [
      "streaming", "subscriç", "subscric", "netflix", "spotify",
      "assinatura", "dstv", "zap", "tv cabo", "showmax",
    ],
    icon: "RefreshCw",
    color: "#8B5CF6",
  },
  {
    keywords: [
      "beleza", "estética", "estetica", "cabelei", "salão", "salao",
      "spa", "cosmétic", "cosmetic", "manicure", "pedicure", "penteado",
      "tranças", "trancas", "barbearia", "maquilhagem", "perfume",
      "unhas", "depilação", "depilacao",
    ],
    icon: "Palette",
    color: "#EC4899",
  },
  {
    keywords: [
      "desporto", "ginásio", "ginasio", "fitness", "sport", "academia",
      "treino", "futebol", "basquete", "corrida", "maratona", "natação",
      "natacao", "personal trainer", "yoga",
    ],
    icon: "Dumbbell",
    color: "#10B981",
  },
  {
    keywords: [
      "poupança", "poupanca", "investimento", "invest", "acções", "acoes",
      "fundos", "aplicação", "aplicacao", "título", "titulo", "obrigações",
      "obrigacoes", "criptomoeda", "cripto",
    ],
    icon: "TrendingUp",
    color: "#10B981",
  },
  {
    keywords: [
      "seguro", "segura", "proteção", "protecao", "apólice", "apolice",
      "seguro de vida", "seguro residencial",
    ],
    icon: "Shield",
    color: "#003cc3",
  },
  {
    keywords: [
      "água", "agua", "luz", "electricidade", "electricid", "gás", "gas",
      "epal", "ende", "factura de água", "factura de agua",
      "factura de luz", "conta de água", "conta de agua", "conta de luz",
      "gerador", "gasóleo do gerador", "gasoleo do gerador",
    ],
    icon: "Zap",
    color: "#F59E0B",
  },
  {
    keywords: [
      "animal", "pet", "cão", "cao", "gato", "veterinár", "veterinar",
      "ração", "racao",
    ],
    icon: "PawPrint",
    color: "#8B5CF6",
  },
  {
    keywords: [
      "presente", "prenda", "oferta", "dons", "donativo", "caridade",
      "esmola", "dízimo", "dizimo", "oferta na igreja", "ofertório",
      "ofertorio",
    ],
    icon: "Gift",
    color: "#EC4899",
  },
  {
    keywords: [
      "restauro", "manutenç", "manutenc", "reparo", "reparaç", "reparac",
      "canalizador", "eletricista", "pedreiro", "pintor", "carpinteiro",
      "serralheiro",
    ],
    icon: "Wrench",
    color: "#14B8A6",
  },
  {
    keywords: [
      "financ", "banco", "crédito", "credito", "empréstimo", "emprestimo",
      "divida", "dívida", "juros", "bai", "bfa", "bic", "standard bank",
      "millennium", "banco sol", "atm", "multicaixa", "taxa bancária",
      "taxa bancaria", "comissão", "comissao", "mensalidade do banco",
      "cartão", "cartao",
    ],
    icon: "Banknote",
    color: "#0EA5E9",
  },
  {
    keywords: ["levantamento", "saque", "retirada", "levantar dinheiro"],
    icon: "ArrowDownCircle",
    color: "#22C55E",
  },
  {
    keywords: [
      "transferênc", "transferenc", "transferir", "envio de dinheiro",
      "tpa", "multicaixa express",
    ],
    icon: "ArrowLeftRight",
    color: "#8B5CF6",
  },
  {
    keywords: [
      "remessa", "remessas", "envio do exterior", "dinheiro de fora",
      "money gram", "moneygram", "western union",
    ],
    icon: "Send",
    color: "#0EA5E9",
  },
  {
    keywords: [
      "salário", "salario", "ordenado", "vencimento", "pagamento mensal",
      "folha salarial", "subsídio de férias", "subsidio de ferias",
      "13º mês", "13o mes", "décimo terceiro", "decimo terceiro",
    ],
    icon: "Wallet",
    color: "#10B981",
  },
  {
    keywords: [
      "biscato", "biscatos", "bico", "trabalho informal", "ganha-pão",
      "ganha pao", "zungueira", "zunga", "venda ambulante",
      "mercado informal", "feira",
    ],
    icon: "Hammer",
    color: "#F59E0B",
  },
  {
    keywords: [
      "negócio", "negocio", "comércio", "comercio", "loja própria",
      "loja propria", "vendas", "lucro", "empresa", "empreendedor",
      "autónomo", "autonomo", "freelance", "freela", "consultoria própria",
      "consultoria propria",
    ],
    icon: "Store",
    color: "#3B82F6",
  },
  {
    keywords: [
      "kixikila", "kixikilas", "kixiquila", "poupança rotativa",
      "poupanca rotativa", "junta de poupança", "junta de poupanca",
      "roscas de poupança", "roscas de poupanca",
    ],
    icon: "Users",
    color: "#8B5CF6",
  },
  {
    keywords: [
      "serviços", "servicos", "serviço", "servico",
      "prestação de serviços", "prestacao de servicos", "honorários",
      "honorarios", "consultoria",
    ],
    icon: "Wrench",
    color: "#14B8A6",
  },
  {
    keywords: [
      "outro", "outros", "geral", "misc", "diverso", "diversos", "vário",
      "vario", "indefinido", "não especificado", "nao especificado",
    ],
    icon: "MoreHorizontal",
    color: "#94a3b8",
  },
];

// Neutral, finance-appropriate icons/colors for truly unmatched category
// names — no decorative planets/diamonds/trophies that don't relate to
// money categories.
const FALLBACK_ICONS: LucideIconName[] = [
  "Tag",
  "Receipt",
  "Wallet",
  "CreditCard",
  "Layers",
  "LayoutGrid",
  "Folder",
  "Grid3x3",
];
const FALLBACK_COLORS: string[] = [
  "#64748B",
  "#0EA5E9",
  "#8B5CF6",
  "#F59E0B",
  "#10B981",
  "#EC4899",
  "#3B82F6",
  "#94a3b8",
];

function findStyle(name: string): CategoryStyle | undefined {
  const lower = name.toLowerCase();
  return CATEGORY_STYLES.find((entry) =>
    entry.keywords.some((kw) => lower.includes(kw)),
  );
}

/**
 * Returns a semantically meaningful lucide-react icon name for a category.
 * Matches by keyword against the category name (case-insensitive, substring).
 * Falls back to a distinct icon based on the item's index so every pill looks different.
 */
export function getCategoryIcon(
  name: string,
  fallbackIndex: number = 0,
): LucideIconName {
  const match = findStyle(name);
  if (match) return match.icon;
  return FALLBACK_ICONS[fallbackIndex % FALLBACK_ICONS.length];
}

/** Returns the matching accent color for a category, same lookup as getCategoryIcon. */
export function getCategoryColor(name: string, fallbackIndex: number = 0): string {
  const match = findStyle(name);
  if (match) return match.color;
  return FALLBACK_COLORS[fallbackIndex % FALLBACK_COLORS.length];
}

/** Combined icon + color lookup — the one call sites should prefer. */
export function getCategoryVisual(
  name: string,
  fallbackIndex: number = 0,
): { icon: LucideIconName; color: string } {
  const match = findStyle(name);
  if (match) return { icon: match.icon, color: match.color };
  return {
    icon: FALLBACK_ICONS[fallbackIndex % FALLBACK_ICONS.length],
    color: FALLBACK_COLORS[fallbackIndex % FALLBACK_COLORS.length],
  };
}
