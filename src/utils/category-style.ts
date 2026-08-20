import type { ComponentType, CSSProperties } from "react";
import {
  Utensils,
  ShoppingCart,
  Car,
  Plane,
  Stethoscope,
  BookOpen,
  Gamepad2,
  Home,
  Shirt,
  Laptop,
  Smartphone,
  RefreshCw,
  Palette,
  Dumbbell,
  TrendingUp,
  Shield,
  Zap,
  PawPrint,
  Gift,
  Wrench,
  Banknote,
  ArrowDownCircle,
  ArrowLeftRight,
  Send,
  Wallet,
  Hammer,
  Store,
  Users,
  MoreHorizontal,
  Tag,
  Receipt,
  CreditCard,
  Layers,
  LayoutGrid,
  Folder,
  Grid3x3,
} from "lucide-react";
import { getCategoryVisual, type LucideIconName } from "@/utils/category-icon";

export interface CategoryStyle {
  icon: ComponentType<{ className?: string; style?: CSSProperties }>;
  color: string;
  bg: string;
}

const ICON_COMPONENTS: Record<LucideIconName, CategoryStyle["icon"]> = {
  Utensils,
  ShoppingCart,
  Car,
  Plane,
  Stethoscope,
  BookOpen,
  Gamepad2,
  Home,
  Shirt,
  Laptop,
  Smartphone,
  RefreshCw,
  Palette,
  Dumbbell,
  TrendingUp,
  Shield,
  Zap,
  PawPrint,
  Gift,
  Wrench,
  Banknote,
  ArrowDownCircle,
  ArrowLeftRight,
  Send,
  Wallet,
  Hammer,
  Store,
  Users,
  MoreHorizontal,
  Tag,
  Receipt,
  CreditCard,
  Layers,
  LayoutGrid,
  Folder,
  Grid3x3,
};

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean.length === 3 ? clean.repeat(2) : clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function hashName(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return hash;
}

/**
 * Icon + color + background for a category name. Delegates the actual
 * keyword→icon/color lookup to the shared Angolan-context dictionary in
 * `category-icon.ts` (kept 1:1 in sync with wundu-mobile), so this file no
 * longer maintains its own separate/weaker keyword list.
 */
export function getCategoryStyle(name: string): CategoryStyle {
  const { icon, color } = getCategoryVisual(name, hashName(name));
  return {
    icon: ICON_COMPONENTS[icon],
    color,
    bg: hexToRgba(color, 0.1),
  };
}
