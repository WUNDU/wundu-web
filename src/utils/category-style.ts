import type { ComponentType, CSSProperties } from "react";
import {
  Apple,
  BookOpen,
  Home,
  Gamepad2,
  Banknote,
  UtensilsCrossed,
  Heart,
  Wrench,
  ShoppingCart,
  Wifi,
  ArrowLeftRight,
  Car,
  Receipt,
  // fallback patterns
  Shirt,
  Smartphone,
  Flame,
  Shield,
  Plane,
  TrendingUp,
} from "lucide-react";

export interface CategoryStyle {
  icon: ComponentType<{ className?: string; style?: CSSProperties }>;
  color: string;
  bg: string;
}

/**
 * System categories (13 default, read-only):
 *   Alimentação, Educação, Habitação, Lazer, Levantamento, Restaurante,
 *   Saúde, Serviços, Supermercado, Telecomunicações, Transferências,
 *   Transporte, Outros
 */
const EXACT: Record<string, CategoryStyle> = {
  "alimentação":     { icon: Apple,           color: "#F97316", bg: "rgba(249,115,22,0.1)" },
  "educação":        { icon: BookOpen,         color: "#0EA5E9", bg: "rgba(14,165,233,0.1)" },
  "habitação":       { icon: Home,             color: "#8B5CF6", bg: "rgba(139,92,246,0.1)" },
  "lazer":           { icon: Gamepad2,         color: "#EC4899", bg: "rgba(236,72,153,0.1)" },
  "levantamento":    { icon: Banknote,         color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
  "restaurante":     { icon: UtensilsCrossed,  color: "#EF4444", bg: "rgba(239,68,68,0.1)"  },
  "saúde":           { icon: Heart,            color: "#10B981", bg: "rgba(16,185,129,0.1)" },
  "serviços":        { icon: Wrench,           color: "#64748B", bg: "rgba(100,116,139,0.1)" },
  "supermercado":    { icon: ShoppingCart,     color: "#14B8A6", bg: "rgba(20,184,166,0.1)" },
  "telecomunicações":{ icon: Wifi,             color: "#06B6D4", bg: "rgba(6,182,212,0.1)"  },
  "transferências":  { icon: ArrowLeftRight,   color: "#6366F1", bg: "rgba(99,102,241,0.1)" },
  "transporte":      { icon: Car,              color: "#3B82F6", bg: "rgba(59,130,246,0.1)" },
  "outros":          { icon: Receipt,          color: "#94a3b8", bg: "rgba(148,163,184,0.1)" },
};

const DEFAULT_STYLE: CategoryStyle = {
  icon: Receipt,
  color: "#00216b",
  bg: "rgba(0,33,107,0.08)",
};

export function getCategoryStyle(name: string): CategoryStyle {
  const lower = name.toLowerCase().trim();

  // Exact system-category match first
  if (EXACT[lower]) return EXACT[lower];

  // Fuzzy fallbacks for user-created categories
  if (/transport|carro|taxi|uber|autocarro|metro/.test(lower))
    return EXACT["transporte"];
  if (/aliment|comida|marmita/.test(lower))
    return EXACT["alimentação"];
  if (/restaur|café|cafe|snack|fast.?food/.test(lower))
    return EXACT["restaurante"];
  if (/habit|renda|aluguel|imov|morad|condom/.test(lower))
    return EXACT["habitação"];
  if (/saúde|saude|médic|medic|farmác|farmac|clínic|hospital/.test(lower))
    return EXACT["saúde"];
  if (/lazer|entret|cinema|jogo|show|concerto/.test(lower))
    return EXACT["lazer"];
  if (/educ|escola|curso|livro|universid|faculdade/.test(lower))
    return EXACT["educação"];
  if (/mercado|superm|compra/.test(lower))
    return EXACT["supermercado"];
  if (/telecom|internet|comunic|telef|celul|móvel/.test(lower))
    return EXACT["telecomunicações"];
  if (/transfer|envio|pagamento|pix/.test(lower))
    return EXACT["transferências"];
  if (/levant|atm|caixa/.test(lower))
    return EXACT["levantamento"];
  if (/servi|manutenção|reparação|limpeza/.test(lower))
    return EXACT["serviços"];

  // Additional fallbacks for other user categories
  if (/vestuário|roupa|moda|calçado/.test(lower))
    return { icon: Shirt,      color: "#F59E0B", bg: "rgba(245,158,11,0.1)" };
  if (/tecnol/.test(lower))
    return { icon: Smartphone, color: "#6366F1", bg: "rgba(99,102,241,0.1)" };
  if (/combust|gasolina/.test(lower))
    return { icon: Flame,      color: "#EF4444", bg: "rgba(239,68,68,0.1)"  };
  if (/seguro/.test(lower))
    return { icon: Shield,     color: "#64748b", bg: "rgba(100,116,139,0.1)" };
  if (/viagem|férias|ferias|turismo/.test(lower))
    return { icon: Plane,      color: "#8B5CF6", bg: "rgba(139,92,246,0.1)" };
  if (/invest/.test(lower))
    return { icon: TrendingUp, color: "#003cc3", bg: "rgba(0,60,195,0.1)"   };

  return DEFAULT_STYLE;
}
