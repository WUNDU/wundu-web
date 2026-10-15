import type { ComponentType } from "react";
import {
  BasketIcon,
  BillfoldIcon,
  CarIcon,
  MoneyIcon,
  MoneyPouchIcon,
  SmartphoneIcon,
  TransferIcon,
  UsersIcon,
} from "@/constants/icons";
import {
  Apple,
  Banknote,
  Car,
  GraduationCap,
  HeartPulse,
  House,
  TriangleAlert,
  Wallet,
} from "lucide-react";
import { ACCOUNT_COLORS, type AccountColor } from "./account-colors";

export type CategoryIconOption = {
  id: string;
  label: string;
  Icon: ComponentType<{ className?: string }>;
};

export const CATEGORY_ICONS: CategoryIconOption[] = [
  { id: "money", label: "Dinheiro", Icon: MoneyIcon },
  { id: "apple", label: "Alimentação", Icon: Apple },
  { id: "basket", label: "Supermercado", Icon: BasketIcon },
  { id: "billfold", label: "Restaurante", Icon: BillfoldIcon },
  { id: "car", label: "Transporte", Icon: Car },
  { id: "services", label: "Serviços", Icon: CarIcon },
  { id: "house", label: "Habitação", Icon: House },
  { id: "graduation", label: "Educação", Icon: GraduationCap },
  { id: "heart", label: "Saúde", Icon: HeartPulse },
  { id: "smartphone", label: "Telecomunicações", Icon: SmartphoneIcon },
  { id: "transfer", label: "Transferências", Icon: TransferIcon },
  { id: "users", label: "Kixikila", Icon: UsersIcon },
  { id: "money-pouch", label: "Remessa", Icon: MoneyPouchIcon },
  { id: "banknote", label: "Banco", Icon: Banknote },
  { id: "wallet", label: "Carteira", Icon: Wallet },
  { id: "alert", label: "Alerta", Icon: TriangleAlert },
];

export const iconById = (id?: string | null): CategoryIconOption =>
  CATEGORY_ICONS.find((option) => option.id === id) ?? CATEGORY_ICONS[0];

export const colorById = (id?: string | null): AccountColor =>
  ACCOUNT_COLORS.find((color) => color.id === id) ?? ACCOUNT_COLORS[0];
