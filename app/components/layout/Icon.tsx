import type { ComponentType, SVGProps } from "react";
import {
  ArrowSetIcon,
  ChartDesktopIcon,
  GoalsIcon,
  HelpIcon,
  HomeDeskIcon,
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
  | "accounts"
  | "categories"
  | "settings"
  | "support";

type IconProps = SVGProps<SVGSVGElement> & {
  name: MenuIconName;
};

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

const iconMap: Record<MenuIconName, IconComponent> = {
  dashboard: HomeDeskIcon,
  transactions: ArrowSetIcon,
  goals: GoalsIcon,
  analytics: ChartDesktopIcon,
  accounts: WalletIcon,
  categories: StatsIcon,
  settings: SettingsDeskIcon,
  support: QuizIcon,
};

export default function Icon({ name, ...props }: IconProps) {
  const Component = iconMap[name];
  return <Component {...props} />;
}
