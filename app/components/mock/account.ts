export interface AccountDTO {
  id: string;
  name: string;
  /** Cor do dot e do texto no hover */
  color: string;
  /** Fundo tintado no hover */
  background: string;
  /** Saldo atual em Kz (partilhado com análises) */
  balance: number;
  /** Variável CSS da cor (gráficos) */
  colorVar: string;
  /** Tipo exibido na lista (ex.: Banco, Dinheiro, Carteira) */
  kind?: string;
  /** Sigla exibida no cartão de pré-visualização (ex.: BAI) */
  shortName?: string;
  /** Moeda da conta (ex.: Kwanza (Kz)) */
  currency?: string;
  /** Classe do ponto colorido na lista (ex.: bg-success) */
  dotClassName?: string;
}

export const mockAccounts: AccountDTO[] = [
  {
    id: "bai",
    name: "Banco Angolano de Investimento (BAI)",
    color: "text-info",
    background: "bg-info/10",
    balance: 3350500,
    colorVar: "--color-info",
    kind: "Banco",
    shortName: "BAI",
    currency: "Kwanza (Kz)",
    dotClassName: "bg-info",
  },
  {
    id: "sba",
    name: "Standard Bank Angola (SBA)",
    color: "text-primary-300",
    background: "bg-primary-300/10",
    balance: 3350500,
    colorVar: "--color-primary-300",
    kind: "Banco",
    shortName: "SBA",
    currency: "Kwanza (Kz)",
    dotClassName: "bg-primary-300",
  },
  {
    id: "unitel",
    name: "Unitel Money",
    color: "text-warning",
    background: "bg-warning/10",
    balance: 2000,
    colorVar: "--color-warning",
    kind: "Carteira",
    shortName: "MONEY",
    currency: "Kwanza (Kz)",
    dotClassName: "bg-warning",
  },
  {
    id: "bic",
    name: "Banco de Investimento e Comércio (BIC)",
    color: "text-danger-300",
    background: "bg-danger-300/10",
    balance: 3350500,
    colorVar: "--color-danger-300",
    kind: "Banco",
    shortName: "BIC",
    currency: "Kwanza (Kz)",
    dotClassName: "bg-danger-300",
  },
  {
    id: "cash",
    name: "Cash",
    color: "text-success",
    background: "bg-success/10",
    balance: 3350500,
    colorVar: "--color-success",
    kind: "Dinheiro",
    shortName: "CASH",
    currency: "Kwanza (Kz)",
    dotClassName: "bg-success",
  },
];
