import type { GoalDTO } from "../../types/dto/goal.dto";

export type GoalStatusConfig = {
  label: string;
  /** Fundo tintado (10%) */
  tint: string;
  /** Cor do texto/ícone */
  color: string;
  /** Cor da barra de progresso */
  bar: string;
};

/** Percentagem de conclusão de uma meta (0–100). */
export function goalPercent(goal: GoalDTO): number {
  return goal.targetAmount > 0
    ? Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100))
    : 0;
}

/** Estado visual derivado da percentagem (Figma: Concluído/Em progresso/Iniciado/Pendente). */
export function statusFor(percent: number): GoalStatusConfig {
  if (percent >= 100)
    return {
      label: "Concluído",
      tint: "bg-success/10",
      color: "text-success-text",
      bar: "bg-success",
    };
  if (percent >= 70)
    return {
      label: "Em progresso",
      tint: "bg-warning/10",
      color: "text-warning",
      bar: "bg-warning",
    };
  if (percent >= 40)
    return {
      label: "Iniciado",
      tint: "bg-info/10",
      color: "text-info",
      bar: "bg-info",
    };
  return {
    label: "Pendente",
    tint: "bg-danger-300/10",
    color: "text-danger-text",
    bar: "bg-danger-300",
  };
}
