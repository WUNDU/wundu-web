import type { ComponentType, CSSProperties } from "react";
import {
  Car,
  UtensilsCrossed,
  Home,
  Heart,
  Gamepad2,
  BookOpen,
  Shirt,
  Smartphone,
  ShoppingCart,
  Flame,
  Wifi,
  Banknote,
  TrendingUp,
  Shield,
  Plane,
  Receipt,
} from "lucide-react";

export interface CategoryStyle {
  icon: ComponentType<{ className?: string; style?: CSSProperties }>;
  color: string;
  bg: string;
}

export function getCategoryStyle(name: string): CategoryStyle {
  const n = name.toLowerCase();
  if (n.includes("transport") || n.includes("carro") || n.includes("taxi") || n.includes("uber"))
    return { icon: Car, color: "#3B82F6", bg: "rgba(59,130,246,0.1)" };
  if (n.includes("aliment") || n.includes("comida") || n.includes("restaur") || n.includes("café") || n.includes("cafe"))
    return { icon: UtensilsCrossed, color: "#F97316", bg: "rgba(249,115,22,0.1)" };
  if (n.includes("renda") || n.includes("aluguel") || n.includes("habit") || n.includes("imov"))
    return { icon: Home, color: "#8B5CF6", bg: "rgba(139,92,246,0.1)" };
  if (n.includes("saúde") || n.includes("saude") || n.includes("médic") || n.includes("medic") || n.includes("farmác"))
    return { icon: Heart, color: "#10B981", bg: "rgba(16,185,129,0.1)" };
  if (n.includes("lazer") || n.includes("entret") || n.includes("cinema") || n.includes("jogo"))
    return { icon: Gamepad2, color: "#EC4899", bg: "rgba(236,72,153,0.1)" };
  if (n.includes("educ") || n.includes("escola") || n.includes("curso") || n.includes("livro"))
    return { icon: BookOpen, color: "#0EA5E9", bg: "rgba(14,165,233,0.1)" };
  if (n.includes("vestuário") || n.includes("roupa") || n.includes("moda"))
    return { icon: Shirt, color: "#F59E0B", bg: "rgba(245,158,11,0.1)" };
  if (n.includes("tecnol") || n.includes("tel") || n.includes("celul"))
    return { icon: Smartphone, color: "#6366F1", bg: "rgba(99,102,241,0.1)" };
  if (n.includes("mercado") || n.includes("superm") || n.includes("compra"))
    return { icon: ShoppingCart, color: "#14B8A6", bg: "rgba(20,184,166,0.1)" };
  if (n.includes("combustível") || n.includes("combustivel") || n.includes("gasolina"))
    return { icon: Flame, color: "#EF4444", bg: "rgba(239,68,68,0.1)" };
  if (n.includes("internet") || n.includes("comunic"))
    return { icon: Wifi, color: "#06B6D4", bg: "rgba(6,182,212,0.1)" };
  if (n.includes("salário") || n.includes("salario") || n.includes("rendimento"))
    return { icon: Banknote, color: "#10B981", bg: "rgba(16,185,129,0.1)" };
  if (n.includes("invest"))
    return { icon: TrendingUp, color: "#003cc3", bg: "rgba(0,60,195,0.1)" };
  if (n.includes("seguro"))
    return { icon: Shield, color: "#64748b", bg: "rgba(100,116,139,0.1)" };
  if (n.includes("viagem") || n.includes("férias") || n.includes("ferias"))
    return { icon: Plane, color: "#8B5CF6", bg: "rgba(139,92,246,0.1)" };
  return { icon: Receipt, color: "#00216b", bg: "rgba(0,33,107,0.08)" };
}
