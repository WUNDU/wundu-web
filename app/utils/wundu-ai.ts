"use client";

/**
 * Motor local da Wundu IA — port fiel de `wundu/lib/wundu-ai.ts`.
 * Diferença: na wundu-web os valores estão em Kz (não em cêntimos).
 */

export type AIMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  created: number;
  engine?: "local" | "openai";
};

export type AIConversation = {
  id: string;
  title: string;
  created: number;
  updated: number;
  messages: AIMessage[];
};

export type AIDataTransaction = {
  id: string;
  name: string;
  category: string;
  type: "income" | "expense";
  amount: number;
  date: string;
};

export type AIDataAccount = { id: string; name: string; bank: string; balance: number };
export type AIDataGoal = {
  id: string;
  name: string;
  target: number;
  saved: number;
  date: string;
};
export type AIDataBudget = { category: string; limit: number };

export type AIData = {
  accounts: AIDataAccount[];
  transactions: AIDataTransaction[];
  goals: AIDataGoal[];
  budgets: AIDataBudget[];
};

export const emptyAIData: AIData = {
  accounts: [],
  transactions: [],
  goals: [],
  budgets: [],
};

const MONTHS = [
  "janeiro",
  "fevereiro",
  "marco",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

export function aiCategoryKey(name: string) {
  return name
    .trim()
    .replace(/\s+/g, " ")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLocaleLowerCase("pt-AO");
}

export function aiMoney(value: number) {
  return (
    new Intl.NumberFormat("pt-AO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
      .format(value)
      .replace(/[   ]/g, ".") + " Kz"
  );
}

export function aiToday() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Luanda",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)!.value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}

export function questionMonth(question: string, today: string) {
  const norm = aiCategoryKey(question);
  const now = new Date(today + "T12:00:00Z");
  const explicit = /\b(20\d{2})[-/](0[1-9]|1[0-2])\b/.exec(norm);
  if (explicit) return explicit[1] + "-" + explicit[2];
  if (/mes (?:passado|anterior)|ultimo mes/.test(norm)) {
    now.setUTCDate(1);
    now.setUTCMonth(now.getUTCMonth() - 1);
    return now.toISOString().slice(0, 7);
  }
  const named = [...norm.matchAll(new RegExp(`\\b(${MONTHS.join("|")})\\b`, "g"))].at(-1)?.[1];
  const index = named ? MONTHS.indexOf(named) : -1;
  if (index >= 0) {
    const year = /\b(20\d{2})\b/.exec(norm)?.[1] || today.slice(0, 4);
    return year + "-" + String(index + 1).padStart(2, "0");
  }
  return today.slice(0, 7);
}

export function financialContext(data: AIData, question: string, today: string) {
  const month = questionMonth(question, today);
  const past = data.transactions.filter((t) => t.date.slice(0, 10) <= today);
  const rows = past.filter((t) => t.date.slice(0, 7) === month);
  const sum = (type: "income" | "expense") =>
    rows.filter((t) => t.type === type).reduce((s, t) => s + t.amount, 0);
  const grouped = new Map<string, number>();
  for (const t of rows)
    if (t.type === "expense") grouped.set(t.category, (grouped.get(t.category) || 0) + t.amount);
  return {
    asOf: today,
    month,
    income: sum("income"),
    expenses: sum("expense"),
    net: sum("income") - sum("expense"),
    count: rows.length,
    categories: [...grouped]
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount),
    accounts: data.accounts.map((a) => ({ name: a.name, bank: a.bank, balance: a.balance })),
    goals: data.goals.map((g) => ({
      name: g.name,
      target: g.target,
      saved: g.saved,
      remaining: Math.max(0, g.target - g.saved),
      date: g.date,
    })),
    budgets: data.budgets.map((b) => ({
      category: b.category,
      limit: b.limit,
      spent: grouped.get(b.category) || 0,
    })),
    currency: "AOA",
    unit: "kwanzas",
    source:
      "Registos da Wundu; exclui movimentos futuros; poupanças de metas não são somadas aos saldos.",
  };
}

export function localFinancialAnswer(
  data: AIData,
  question: string,
  today: string,
  previousQuestion = "",
) {
  let q = aiCategoryKey(question);
  if (/^(e |e\?|mais|explica|detalha|nesse mes|entao)/.test(q) && previousQuestion)
    q = aiCategoryKey(previousQuestion + " " + question);
  const context = financialContext(data, q, today);
  const label = new Intl.DateTimeFormat("pt-AO", {
    month: "long",
    year: "numeric",
    timeZone: "Africa/Luanda",
  }).format(new Date(context.month + "-01T12:00:00Z"));
  const heading = `Nos registos de ${label}${context.month === today.slice(0, 7) ? ", até hoje" : ""}`;
  if (/(?:comprar|vender) (?:accoes|acoes)|investir em|criptomoeda|bitcoin/.test(q))
    return "Posso ajudar-te a acompanhar as contas e a preparar um orçamento. Os registos da Wundu não permitem avaliar um investimento ou garantir rentabilidade. Consulta a página Bolsa e investimentos para aprender com a simulação.";
  if (/meta|objectivo|objetivo/.test(q)) {
    const selected = context.goals.filter((g) => q.includes(aiCategoryKey(g.name)));
    const goals = selected.length ? selected : context.goals;
    if (!goals.length)
      return "Ainda não tens metas registadas. Cria uma meta com valor e prazo para calcularmos o progresso e o valor em falta.";
    return goals
      .map((g) => {
        const monthsLeft = Math.max(
          1,
          (Number(g.date.slice(0, 4)) - Number(today.slice(0, 4))) * 12 +
            Number(g.date.slice(5, 7)) -
            Number(today.slice(5, 7)) +
            1,
        );
        const progress = g.target > 0 ? Math.min(100, Math.floor((g.saved / g.target) * 100)) : 0;
        return (
          `${g.name}: ${aiMoney(g.saved)} de ${aiMoney(g.target)} (${progress}%). ` +
          (g.remaining === 0
            ? "Meta concluída."
            : `Faltam ${aiMoney(g.remaining)}.` +
              (g.date < today
                ? " O prazo terminou. Revê o prazo ou a contribuição."
                : ` Para distribuir o valor em falta pelos ${monthsLeft} meses de calendário até ${new Intl.DateTimeFormat("pt-AO", { month: "long", year: "numeric" }).format(new Date(g.date + "T12:00:00"))}, precisarias de cerca de ${aiMoney(Math.ceil(g.remaining / monthsLeft))} por mês. É uma estimativa, sem novos rendimentos garantidos.`))
        );
      })
      .join("\n\n");
  }
  if (/conta|saldo|patrimonio/.test(q))
    return context.accounts.length
      ? context.accounts
          .map(
            (a) =>
              `${a.name} (${a.bank}): ${aiMoney(a.balance)} de saldo calculado até ${today.split("-").reverse().join("/")}.`,
          )
          .join("\n") +
          "\n\nOs saldos resultam do saldo inicial e dos movimentos registados; não são consultados no banco."
      : "Adiciona uma conta e o respectivo saldo inicial para acompanhar os saldos.";
  if (/poupar|poupanca|economizar|fim de semana|posso gastar/.test(q))
    return (
      `${heading}, a diferença entre entradas e gastos é ${aiMoney(context.net)} (${aiMoney(context.income)} − ${aiMoney(context.expenses)}).\n\n` +
      (context.net > 0
        ? "Este resultado é positivo, mas não representa automaticamente dinheiro livre para gastar. Confere compromissos ainda não registados e valores reservados antes de decidir quanto poupar ou gastar."
        : "Não há excedente neste período para estimar uma nova poupança. Confere se todas as entradas foram registadas e revê os gastos.") +
      "\n\nO mês pode ainda estar incompleto. Não extrapolo rendimentos ou despesas que não registaste."
    );
  if (/orcamento|limite/.test(q))
    return context.budgets.length
      ? context.budgets
          .map(
            (b) =>
              `${b.category}: ${aiMoney(b.spent)} gastos no período face ao limite mensal de ${aiMoney(b.limit)}.` +
              (b.spent > b.limit ? ` O limite foi ultrapassado em ${aiMoney(b.spent - b.limit)}.` : ""),
          )
          .join("\n")
      : "Ainda não definiste orçamentos. Cria um limite por categoria para comparar com os gastos registados.";
  if (/gasto|despesa|categoria|alimentacao|transporte|cortar|onde/.test(q)) {
    const category = context.categories.find((c) => q.includes(aiCategoryKey(c.name)));
    const selected = category ? [category] : context.categories.slice(0, 5);
    if (!selected.length)
      return `${heading}, não existem despesas registadas. Confere o mês ou regista os movimentos para analisar os gastos.`;
    return (
      `${heading}, registaste ${aiMoney(context.expenses)} em despesas.\n\n` +
      selected
        .map(
          (c) =>
            `${c.name}: ${aiMoney(c.amount)} (${context.expenses ? Math.round((c.amount / context.expenses) * 100) : 0}% dos gastos).`,
        )
        .join("\n") +
      `\n\n${/cortar|reduzir/.test(q) ? "Estas são as categorias para rever. Os registos não dizem quais despesas são essenciais; escolhe os cortes de acordo com as tuas necessidades." : "Podes consultar a aba Análises para ver a distribuição completa."}`
    );
  }
  if (/resumo|mes|financa|entrada|receita|como (?:estao|estou)/.test(q))
    return (
      `${heading}, existem ${context.count} movimentos.\n\nEntradas: ${aiMoney(context.income)}\nGastos: ${aiMoney(context.expenses)}\nResultado: ${aiMoney(context.net)}\n\n` +
      (context.count
        ? "Este resultado reflecte os movimentos registados no período. Movimentos futuros não foram incluídos."
        : "Ainda não há movimentos neste período. Não é possível tirar conclusões sobre os teus hábitos.")
    );
  return "No modo local consigo calcular o resumo do mês, gastos por categoria, saldos, orçamentos e progresso das metas. Experimenta perguntar “Onde gasto mais?”, “Qual é o saldo das contas?” ou “Como estão as minhas metas?”. Para perguntas mais abertas, activa a ligação ao serviço de IA quando estiver configurado.";
}
