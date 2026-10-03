import {
  AppleIcon,
  Banknote,
  Briefcase,
  Bus,
  Gamepad2,
  GraduationCap,
  Hammer,
  HeartPulse,
  House,
  Laptop,
  Shapes,
  Wallet,
} from "lucide-react";
import { TransactionCategory, CategoryConfig } from "../../types/transaction";

/**
 * Sistema global de cores por categoria.
 * Fonte única usada na dashboard, transações, objetivos e próximas telas.
 * Paleta: Colors/Alerts do Figma (Success, Warning, Orange, Danger, Info/Blue, Purple)
 * + Colors/Base/Primary para "Outros".
 *
 * NOTA: usar apenas tokens registados no `@theme` do globals.css
 * (modificador `/10` para os fundos tintados). Tokens declarados só no
 * `:root` (ex.: `success-10`) NÃO geram utilities no Tailwind v4.
 */
export const transactionCategoryConfig: Record<
  TransactionCategory,
  CategoryConfig
> = {
  Levantamento: {
    flow: "EXPENSE",
    icon: Banknote,
    color: "text-warning",
    background: "bg-warning/10",
  },
  Transporte: {
    flow: "EXPENSE",
    icon: Bus,
    color: "text-warning",
    background: "bg-warning/10",
  },
  Freelance: {
    flow: "INCOME",
    icon: Laptop,
    color: "text-info",
    background: "bg-info/10",
  },
  Educação: {
    flow: "EXPENSE",
    icon: GraduationCap,
    color: "text-info",
    background: "bg-info/10",
  },
  Salário: {
    flow: "INCOME",
    icon: Wallet,
    color: "text-success-text",
    iconColor: "text-success",
    background: "bg-success/10",
  },
  Saúde: {
    flow: "EXPENSE",
    icon: HeartPulse,
    color: "text-success-text",
    iconColor: "text-success",
    background: "bg-success/10",
  },
  Outros: {
    flow: "EXPENSE",
    icon: Shapes,
    color: "text-primary-300",
    background: "bg-primary-300/10",
  },
  Alimentação: {
    flow: "EXPENSE",
    icon: AppleIcon,
    color: "text-orange",
    background: "bg-orange/10",
  },
  Habitação: {
    flow: "EXPENSE",
    icon: House,
    color: "text-purple",
    background: "bg-purple/10",
  },
  Lazer: {
    flow: "EXPENSE",
    icon: Gamepad2,
    color: "text-danger-text",
    iconColor: "text-danger-300",
    background: "bg-danger-300/10",
  },
  Negócio: {
    flow: "INCOME",
    icon: Briefcase,
    color: "text-success-text",
    iconColor: "text-success",
    background: "bg-success/10",
  },
  Biscato: {
    flow: "INCOME",
    icon: Hammer,
    color: "text-info",
    background: "bg-info/10",
  },
};
