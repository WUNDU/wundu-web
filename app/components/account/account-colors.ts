export type AccountColor = {
  id: string;
  /** Classe do ponto/sólido (ex.: bg-info). */
  dot: string;
  /** Classe de texto (ex.: text-info). */
  text: string;
  /** Fundo tintado 10% (ex.: bg-info/10). */
  soft: string;
  /** Variável CSS da cor (ex.: --color-info). */
  cssVar: string;
};

/**
 * Paleta partilhada pelos formulários de conta e categoria.
 * NOTA: usar apenas tokens registados no `@theme` do globals.css.
 */
export const ACCOUNT_COLORS: AccountColor[] = [
  { id: "blue", dot: "bg-info", text: "text-info", soft: "bg-info/10", cssVar: "--color-info" },
  { id: "purple", dot: "bg-purple", text: "text-purple", soft: "bg-purple/10", cssVar: "--color-purple" },
  { id: "secondary", dot: "bg-secondary-300", text: "text-secondary-300", soft: "bg-secondary-300/10", cssVar: "--color-secondary-300" },
  { id: "warning", dot: "bg-warning", text: "text-warning", soft: "bg-warning/10", cssVar: "--color-warning" },
  { id: "orange", dot: "bg-orange", text: "text-orange", soft: "bg-orange/10", cssVar: "--color-orange" },
  { id: "danger", dot: "bg-danger-300", text: "text-danger-300", soft: "bg-danger-300/10", cssVar: "--color-danger-300" },
  { id: "success", dot: "bg-success", text: "text-success", soft: "bg-success/10", cssVar: "--color-success" },
  { id: "primary", dot: "bg-primary-300", text: "text-primary-300", soft: "bg-primary-300/10", cssVar: "--color-primary-300" },
];
