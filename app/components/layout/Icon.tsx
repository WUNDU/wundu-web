import type { ComponentType, SVGProps } from "react";
import {
  ArrowSetIcon,
  ChartDesktopIcon,
  GoalsIcon,
  HelpIcon,
  HomeDeskIcon,
  IAIcon,
  MenuIcon,
  QuizIcon,
  SettingsDeskIcon,
  StatsIcon,
  WalletIcon,
} from "@/constants/icons";

export type MenuIconName =
  | "dashboard"
  | "transactions"
  | "goals"
  | "analytics"
  | "ai"
  | "accounts"
  | "categories"
  | "settings"
  | "support"
  | "menu";

type IconProps = SVGProps<SVGSVGElement> & {
  name: MenuIconName;
};

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

const iconMap: Record<MenuIconName, IconComponent> = {
  dashboard: HomeDeskIcon,
  transactions: ArrowSetIcon,
  goals: GoalsIcon,
  analytics: ChartDesktopIcon,
  ai: IAIcon,
  accounts: WalletIcon,
  categories: StatsIcon,
  settings: SettingsDeskIcon,
  support: QuizIcon,
  menu: MenuIcon,
};

export default function Icon({ name, ...props }: IconProps) {
  const Component = iconMap[name];
  return <Component {...props} />;
}
