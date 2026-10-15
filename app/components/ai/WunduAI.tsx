"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import {
  Activity,
  Apple,
  ArrowLeft,
  ArrowUp,
  History,
  PanelLeftClose,
  PanelLeftOpen,
  PiggyBank,
  Plus,
  Search,
  Sparkles,
  Square,
  Target,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { WunduAIAvatar } from "./WunduAIAvatar";
import { Typewriter } from "./Typewriter";
import { MarkdownContent } from "./Markdown";
import {
  aiCategoryKey,
  aiToday,
  localFinancialAnswer,
  type AIData,
  type AIConversation,
  type AIMessage,
} from "app/utils/wundu-ai";
import {
  aiId,
  conversationGroup,
  parseAIHistory,
  serializeAIHistory,
} from "app/utils/ai-history";
import { useTransaction } from "@/hooks/use-transaction";
import { useGoal } from "@/hooks/use-goal";
import { useUserStore } from "@/store/user-store";
import { chatService } from "@/services/chat.service";
import { parseJavaDate, type JavaDate } from "@/types/dtos/chat.dto";

const GROUPS = ["Hoje", "Ontem", "Últimos 7 dias", "Mais antigas"];
const MAX_CONVERSATIONS = 20;

function toDateKey(raw: string | undefined) {
  return (raw ?? "").slice(0, 10);
}

function toLocalMessages(
  messages: { role: string; content: string; timestamp: string }[],
  convId: string,
): AIMessage[] {
  return messages.map((m, i) => ({
    id: `srv-${convId}-${i}`,
    role: m.role === "user" ? ("user" as const) : ("assistant" as const),
    text: m.content,
    created: Date.parse(m.timestamp) || Date.now(),
    engine: m.role === "user" ? undefined : ("openai" as const),
  }));
}

export default function WunduAI() {
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const queryClient = useQueryClient();
  const displayName = user?.name?.trim() || "";
  const scope = useMemo(() => `wundu-ai:${user?.id ?? "anon"}`, [user?.id]);

  const { notPaginated: apiTransactions, getAllNotPaginated } = useTransaction({
    autoFetch: false,
  });
  const { goals: apiGoals } = useGoal();

  useEffect(() => {
    void getAllNotPaginated();
  }, [getAllNotPaginated]);

  /* Dados locais — usados pelo motor de fallback quando a API falha. */
  const data: AIData = useMemo(() => {
    const transactions = (apiTransactions ?? []).map((tx, i) => ({
      id: tx.id ?? `tx-${i}`,
      name: (tx.description ?? tx.category?.name ?? "Movimento").trim() || "Movimento",
      category: tx.category?.name?.trim() || "Outros",
      type: (tx.type === "INCOME" ? "income" : "expense") as "income" | "expense",
      amount: Number(tx.amount) || 0,
      date: toDateKey(tx.transactionDate ?? tx.createdAt),
    })).filter((t) => /^\d{4}-\d{2}-\d{2}$/.test(t.date));
    const goals = (apiGoals ?? []).map((g, i) => ({
      id: g.id ?? `goal-${i}`,
      name: (g.title ?? `Meta ${i + 1}`).trim() || `Meta ${i + 1}`,
      target: Number(g.targetAmount) || 0,
      saved: Number(g.currentAmount) || 0,
      date: (g.endDate ?? "").slice(0, 10),
    }));
    return { accounts: [], transactions, goals, budgets: [] };
  }, [apiTransactions, apiGoals]);

  const [conversations, setConversations] = useState<AIConversation[]>([]);
  const [selected, setSelected] = useState("");
  const [query, setQuery] = useState("");
  const [input, setInput] = useState("");
  const [ready, setReady] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [sidebar, setSidebar] = useState(true);
  const [busy, setBusy] = useState("");
  const [typing, setTyping] = useState<string | null>(null);
  const [streaming, setStreaming] = useState<{ id: string; text: string } | null>(null);
  const [error, setError] = useState("");
  const [storageError, setStorageError] = useState("");
  const [historyNow, setHistoryNow] = useState(0);
  const [remote, setRemote] = useState(false);
  const [rateLimit, setRateLimit] = useState<number | null>(null);

  const stored = useRef<AIConversation[]>([]);
  const remoteIds = useRef<Set<string>>(new Set());
  const abortRef = useRef<AbortController | null>(null);
  const sendingRef = useRef(false);
  const activeIdRef = useRef<string | null>(null);
  const selectedRef = useRef("");
  const timerRef = useRef<number | null>(null);
  const bottom = useRef<HTMLDivElement>(null);
  const composer = useRef<HTMLTextAreaElement>(null);

  /* Auto-grow do campo (como o protótipo: 1 linha, cresce até 130px). */
  useEffect(() => {
    const el = composer.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 130)}px`;
  }, [input]);

  const conversation = conversations.find((c) => c.id === selected);
  const messages = conversation?.messages || [];
  const finishTyping = useCallback(() => setTyping(null), []);

  const commit = useCallback(
    (next: AIConversation[]) => {
      const bounded = next
        .slice(0, MAX_CONVERSATIONS)
        .map((c) => ({ ...c, messages: c.messages.slice(-40) }));
      stored.current = bounded;
      setConversations(bounded);
      try {
        localStorage.setItem(scope, serializeAIHistory(bounded));
        setStorageError("");
      } catch {
        setStorageError(
          "Não foi possível guardar o histórico neste navegador. As mensagens desta sessão continuam disponíveis.",
        );
      }
    },
    [scope],
  );

  /* --- Carga local --- */
  useEffect(() => {
    try {
      const list = parseAIHistory(localStorage.getItem(scope));
      stored.current = list;
      setConversations(list);
    } catch {
      setStorageError(
        "O navegador não permite guardar conversas. O chat funciona apenas nesta sessão.",
      );
    }
    setHistoryNow(Date.now());
    setReady(true);
    remoteIds.current.clear();
    setRemote(false);
    return () => {
      abortRef.current?.abort();
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, [scope, commit]);

  /* --- Sync com a API via React Query (cache 60s, sem refetch no focus) --- */
  const loadRemoteConversation = useCallback(
    async (id: string, createdAt: JavaDate, updatedAt: JavaDate) => {
      try {
        const conv = await chatService.getConversation(id);
        const msgs = toLocalMessages(conv.messages, id);
        const upd = parseJavaDate(updatedAt)?.getTime() ?? msgs.at(-1)?.created ?? Date.now();
        const crt = parseJavaDate(createdAt)?.getTime() ?? upd;
        const firstUser = msgs.find((m) => m.role === "user")?.text ?? "Conversa";
        return {
          id,
          title: firstUser.slice(0, 70),
          created: crt,
          updated: upd,
          messages: msgs,
        } as AIConversation;
      } catch {
        return null;
      }
    },
    [],
  );

  const syncQuery = useQuery({
    queryKey: ["wundu-ai", "sync", scope],
    queryFn: async () => {
      const summaries = await chatService.getHistory();
      summaries.forEach((s) => remoteIds.current.add(s.id));
      const known = new Set(stored.current.map((c) => c.id));
      const missing = summaries.filter((s) => !known.has(s.id));
      const loaded = (
        await Promise.all(
          missing.map((s) => loadRemoteConversation(s.id, s.createdAt, s.updatedAt)),
        )
      ).filter((c) => c !== null);
      return { summaries, loaded };
    },
    enabled: ready && !!user?.id,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
  const loadingRemote = syncQuery.isPending || syncQuery.isFetching;

  useEffect(() => {
    if (syncQuery.isError) {
      setRemote(false);
      return;
    }
    if (!syncQuery.data) return;
    const { summaries, loaded } = syncQuery.data;
    const summaryIds = new Set(summaries.map((s) => s.id));
    let merged = stored.current.map((c) => {
      const s = summaries.find((x) => x.id === c.id);
      if (!s) return c;
      const upd = parseJavaDate(s.updatedAt)?.getTime();
      return upd && upd > c.updated ? { ...c, updated: upd } : c;
    });
    // Cura gémeas: conversa temporária só com pergunta (sem resposta) cujo
    // servidor já tem cópia com o mesmo título + 1ª pergunta. Nunca toca na
    // conversa visível nem na que está a receber resposta.
    const serverConvs = [
      ...loaded,
      ...merged.filter((c) => summaryIds.has(c.id)),
    ];
    merged = merged.filter((c) => {
      if (summaryIds.has(c.id)) return true;
      if (c.id === selectedRef.current || c.id === activeIdRef.current) return true;
      if (c.messages.some((m) => m.role === "assistant")) return true;
      const firstUser = c.messages.find((m) => m.role === "user")?.text;
      if (!firstUser) return true;
      return !serverConvs.some(
        (o) =>
          o.id !== c.id &&
          o.title === c.title &&
          o.messages.find((m) => m.role === "user")?.text === firstUser,
      );
    });
    if (loaded.length) {
      merged = [...loaded.filter((l) => !merged.some((m) => m.id === l.id)), ...merged].sort(
        (a, b) => b.updated - a.updated,
      );
    }
    commit(merged);
    setRemote(true);
  }, [syncQuery.data, syncQuery.isError, commit]);

  const refreshSync = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ["wundu-ai", "sync", scope] });
  }, [queryClient, scope]);

  /* Contagem decrescente do rate limit (429). */
  useEffect(() => {
    if (rateLimit == null || rateLimit <= 0) return;
    if (rateLimit === 0) {
      setRateLimit(null);
      return;
    }
    const t = window.setTimeout(() => setRateLimit((c) => (c != null ? c - 1 : null)), 1000);
    return () => window.clearTimeout(t);
  }, [rateLimit]);

  useEffect(() => {
    bottom.current?.scrollIntoView({ block: "end" });
  }, [messages.length, busy, streaming?.text]);

  const newConversation = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    setBusy("");
    setStreaming(null);
    setHistoryNow(Date.now());
    setSelected("");
    selectedRef.current = "";
    setInput("");
    setTyping(null);
    setError("");
    setHistoryOpen(false);
    composer.current?.focus();
  }, []);

  function select(id: string) {
    setHistoryNow(Date.now());
    setSelected(id);
    selectedRef.current = id;
    setTyping(null);
    setError("");
    setHistoryOpen(false);
  }

  function remove(id: string) {
    const item = stored.current.find((c) => c.id === id);
    if (!item) return;
    if (busy === id) {
      abortRef.current?.abort();
      abortRef.current = null;
      setBusy("");
      setStreaming(null);
    }
    if (remoteIds.current.has(id)) {
      remoteIds.current.delete(id);
      chatService
        .deleteConversation(id)
        .then(() => refreshSync())
        .catch(() => {});
    }
    commit(stored.current.filter((c) => c.id !== id));
    if (selectedRef.current === id) {
      setSelected("");
      selectedRef.current = "";
      setTyping(null);
    }
    toast("Conversa eliminada", {
      duration: 8000,
      action: {
        label: "Desfazer",
        onClick: () => {
          if (!stored.current.some((c) => c.id === id))
            commit([item, ...stored.current].sort((a, b) => b.updated - a.updated));
        },
      },
    });
  }

  /* Resposta local (fallback quando a API falha). */
  const answerLocal = useCallback(
    async (id: string, question: string, prevQuestion: string, controller: AbortController) => {
      await new Promise<void>((resolve) => {
        timerRef.current = window.setTimeout(() => resolve(), 650);
        controller.signal.addEventListener(
          "abort",
          () => {
            if (timerRef.current !== null) {
              window.clearTimeout(timerRef.current);
              timerRef.current = null;
            }
            resolve();
          },
          { once: true },
        );
      });
      if (controller.signal.aborted) return;
      const text = localFinancialAnswer(data, question, aiToday(), prevQuestion);
      if (controller.signal.aborted) return;
      const answer: AIMessage = {
        id: aiId(),
        role: "assistant",
        text,
        created: Date.now(),
        engine: "local",
      };
      if (stored.current.some((c) => c.id === id)) {
        commit(
          stored.current.map((c) =>
            c.id === id
              ? { ...c, updated: answer.created, messages: [...c.messages, answer] }
              : c,
          ),
        );
        setTyping(answer.id);
      }
    },
    [data, commit],
  );

  /* Adota o id do servidor (temporário -> remoto), fundindo sem duplicar. */
  const adoptId = useCallback((prev: string, next: string): string => {
    remoteIds.current.add(next);
    if (prev === next) return next;
    remoteIds.current.delete(prev);
    const base = stored.current.find((c) => c.id === next);
    const moving = stored.current.find((c) => c.id === prev);
    if (!base && !moving) return next;
    const msgs = [...(base?.messages ?? []), ...(moving?.messages ?? [])];
    const deduped = msgs.filter(
      (m, i) => i === 0 || !(msgs[i - 1].role === m.role && msgs[i - 1].text === m.text),
    );
    const mergedConv: AIConversation = {
      id: next,
      title: base?.title ?? moving?.title ?? "Conversa",
      created: Math.min(base?.created ?? Date.now(), moving?.created ?? Date.now()),
      updated: Math.max(base?.updated ?? 0, moving?.updated ?? 0, Date.now()),
      messages: deduped,
    };
    const out = [mergedConv, ...stored.current.filter((c) => c.id !== prev && c.id !== next)].sort(
      (a, b) => b.updated - a.updated,
    );
    stored.current = out;
    setConversations(out);
    if (selectedRef.current === prev) {
      setSelected(next);
      selectedRef.current = next;
    }
    setBusy((b) => (b === prev ? next : b));
    setStreaming((s) => (s && s.id === prev ? { id: next, text: s.text } : s));
    if (activeIdRef.current === prev) activeIdRef.current = next;
    return next;
  }, []);

  /* Resposta via API (stream SSE). Devolve false se for preciso o fallback. */
  const answerRemote = useCallback(
    async (
      id: string,
      question: string,
      controller: AbortController,
    ): Promise<{ handled: boolean; convId: string }> => {
      let convId = id;
      let accumulated = "";
      const token = useUserStore.getState().token;
      const response = await fetch("/api/proxy/chat/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          message: question,
          conversationId: remoteIds.current.has(id) ? id : undefined,
        }),
        signal: controller.signal,
      });
      if (!response.ok || !response.body) {
        if (response.status === 429) {
          // Limite atingido: remove a mensagem optimista e mostra contagem.
          commit(
            stored.current
              .map((c) => (c.id === convId ? { ...c, messages: c.messages.slice(0, -1) } : c))
              .filter((c) => c.id !== convId || c.messages.length > 0),
          );
          if (selectedRef.current === convId) {
            const left = stored.current.find((c) => c.id === convId);
            if (!left || left.messages.length === 0) {
              setSelected("");
              selectedRef.current = "";
            }
          }
          setRateLimit(60);
          return { handled: true, convId };
        }
        return { handled: false, convId };
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let eventName = "";
      let eventData = "";
      // Guarda o que a IA já disse: o parcial nunca é deitado fora para cair
      // no fallback local — só há fallback quando nada chegou.
      const saveAccumulated = () => {
        if (!accumulated || !stored.current.some((c) => c.id === convId)) return false;
        const msg: AIMessage = {
          id: aiId(),
          role: "assistant",
          text: accumulated,
          created: Date.now(),
          engine: "openai",
        };
        stored.current = stored.current.map((c) =>
          c.id === convId
            ? { ...c, updated: msg.created, messages: [...c.messages, msg] }
            : c,
        );
        commit(stored.current);
        setStreaming(null);
        return true;
      };
      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            if (line.startsWith("event:")) eventName = line.slice(6).trim();
            else if (line.startsWith("data:")) eventData = line.slice(5).trim();
            else if (line === "") {
              if (!eventName || !eventData) {
                eventName = "";
                eventData = "";
                continue;
              }
              let parsed: { type?: string; conversationId?: string; content?: string; message?: string };
              try {
                parsed = JSON.parse(eventData);
              } catch {
                eventName = "";
                eventData = "";
                continue;
              }
              eventName = "";
              eventData = "";
              if (parsed.type === "start" && parsed.conversationId)
                convId = adoptId(convId, parsed.conversationId);
              else if (parsed.type === "token") {
                accumulated += parsed.content ?? "";
                setStreaming({ id: convId, text: accumulated });
              } else if (parsed.type === "done") {
                if (parsed.conversationId) convId = adoptId(convId, parsed.conversationId);
              } else if (parsed.type === "error") {
                const msg = parsed.message || "Erro do assistente.";
                if (msg.toLowerCase().includes("limite")) {
                  saveAccumulated();
                  setRateLimit(60);
                  return { handled: true, convId };
                }
                if (saveAccumulated()) {
                  // Mantém a resposta parcial e informa — sem fallback local.
                  setError(msg);
                  return { handled: true, convId };
                }
                throw new Error(msg);
              }
            }
          }
        }
      } catch (e) {
        // Paragem manual ou corte da ligação: guarda o parcial já recebido.
        if (saveAccumulated()) {
          if (!controller.signal.aborted) refreshSync();
          return { handled: true, convId };
        }
        throw e;
      } finally {
        reader.releaseLock();
      }
      if (!accumulated) return { handled: false, convId };
      saveAccumulated();
      refreshSync();
      return { handled: true, convId };
    },
    [commit, refreshSync, adoptId],
  );

  const ask = useCallback(
    async (question: string, retry = false) => {
      question = question.trim();
      if (
        !question ||
        question.length > 2000 ||
        busy ||
        sendingRef.current ||
        abortRef.current ||
        !ready ||
        (rateLimit != null && rateLimit > 0)
      )
        return;
      const now = Date.now();
      const id = selectedRef.current || aiId();
      const previous = stored.current.find((c) => c.id === id);
      if (!previous && stored.current.length >= MAX_CONVERSATIONS) {
        setError("Tens 20 conversas guardadas. Elimina uma para começar outra.");
        return;
      }
      sendingRef.current = true;
      activeIdRef.current = id;
      const userMsg: AIMessage = { id: aiId(), role: "user", text: question, created: now };
      const history = previous?.messages || [];
      // Reenvio da pergunta pendente (sem resposta): não duplica a bolha.
      const lastIsSameUser =
        history.at(-1)?.role === "user" && history.at(-1)?.text === question;
      const next: AIConversation = previous
        ? {
            ...previous,
            updated: now,
            messages: retry || lastIsSameUser ? history : [...history, userMsg],
          }
        : { id, title: question.slice(0, 70), created: now, updated: now, messages: [userMsg] };
      commit([next, ...stored.current.filter((c) => c.id !== id)]);
      setSelected(id);
      selectedRef.current = id;
      setInput("");
      setBusy(id);
      setStreaming(null);
      setTyping(null);
      setError("");

      const controller = new AbortController();
      abortRef.current = controller;
      const prevQuestion = history.filter((m) => m.role === "user").at(-1)?.text || "";
      try {
        let convId = id;
        let handled = false;
        if (remote) {
          try {
            const result = await answerRemote(id, question, controller);
            handled = result.handled;
            convId = result.convId;
          } catch {
            handled = false;
          }
          if (controller.signal.aborted) return;
        }
        if (!handled && !controller.signal.aborted) {
          await answerLocal(convId, question, prevQuestion, controller);
        }
      } catch (e) {
        if (abortRef.current === controller)
          setError(
            controller.signal.aborted
              ? "Resposta interrompida. Podes enviar novamente a pergunta."
              : (e as Error).message,
          );
      } finally {
        if (abortRef.current === controller) {
          abortRef.current = null;
          setBusy("");
          setStreaming(null);
        }
        sendingRef.current = false;
        activeIdRef.current = null;
      }
    },
    [busy, ready, selectedRef, remote, rateLimit, commit, answerRemote, answerLocal],
  );

  function submit(event: FormEvent) {
    event.preventDefault();
    void ask(input);
  }

  function stop() {
    abortRef.current?.abort();
    abortRef.current = null;
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    // O parcial do stream é guardado pelo answerRemote; aqui só se limpa o estado.
    setBusy("");
    setStreaming(null);
  }

  const month = new Intl.DateTimeFormat("pt-AO", { month: "long" }).format(
    new Date(aiToday() + "T12:00:00"),
  );
  const suggestions = [
    { title: "Resumo do mês", text: `Como estão as minhas finanças em ${month}?`, Icon: Activity, tone: "blue" },
    { title: "Onde gasto mais", text: "Em que categorias posso cortar?", Icon: Apple, tone: "green" },
    { title: "Metas", text: "Como estão as minhas metas e quanto falta poupar?", Icon: Target, tone: "purple" },
    { title: "Poupar", text: "Quanto posso poupar por mês com o meu ritmo actual?", Icon: PiggyBank, tone: "orange" },
  ];
  const sendingDisabled = !input.trim() || !ready || !!busy || (rateLimit != null && rateLimit > 0);

  return (
    <div className={`ai-workspace${!sidebar ? " ai-sidebar-closed" : ""}`}>
      <aside className="ai-conversations" aria-label="Conversas">
        <header>
          <div>
            <h2>Conversas</h2>
            <p>
              {loadingRemote ? "A carregar…" : `${conversations.length} conversas`}
            </p>
          </div>
          <button type="button" onClick={newConversation}>
            <Plus size={16} />
            Nova
          </button>
        </header>
        <label className="ai-history-search">
          <Search size={17} />
          <input
            aria-label="Pesquisar conversas"
            placeholder="Pesquisar conversas"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <HistoryList
          conversations={conversations}
          query={query}
          selected={selected}
          onSelect={select}
          onRemove={remove}
          now={historyNow}
        />
        <p className="ai-local-history">
          {remote ? "Histórico sincronizado com a tua conta." : "Histórico guardado neste navegador."}
        </p>
      </aside>

      <section className="ai-chat">
        <header className="ai-chat-header">
          <button
            type="button"
            className="ai-mobile-back"
            aria-label="Voltar"
            onClick={() => router.back()}
          >
            <ArrowLeft size={20} />
          </button>
          <button
            type="button"
            className="ai-sidebar-toggle"
            aria-label={sidebar ? "Recolher conversas" : "Mostrar conversas"}
            onClick={() => setSidebar((v) => !v)}
          >
            {sidebar ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
          </button>
          <div className="min-w-0 flex-1">
            <h1>
              <span className="ai-desktop-title">{conversation?.title || "Nova conversa"}</span>
              <span className="ai-mobile-title">Wundu IA</span>
            </h1>
            <p>
              <span className="ai-desktop-subtitle">Wundu IA</span>
              <span className="ai-mobile-subtitle">{conversation?.title || "Nova conversa"}</span>
            </p>
          </div>
          <button
            type="button"
            className="ai-mobile-history"
            aria-label="Ver conversas"
            onClick={() => setHistoryOpen(true)}
          >
            <History size={21} />
          </button>
        </header>

        <div className="ai-chat-scroll" role="log" aria-label="Mensagens da conversa">
          {!messages.length && !streaming ? (
            <div className="ai-welcome">
              <WunduAIAvatar size={64} />
              <h2>Olá, {displayName && displayName !== "O meu espaço" ? displayName : "bem-vindo"}</h2>
              <p>
                Pergunta o que quiseres sobre os teus gastos, metas e contas.
                <span className="ai-desktop-intro"> A Wundu IA responde com base nos teus registos.</span>
              </p>
              <div className="ai-suggestions">
                {suggestions.map((s) => (
                  <button
                    key={s.title}
                    type="button"
                    disabled={!ready || !!busy || (rateLimit != null && rateLimit > 0)}
                    onClick={() => void ask(s.text)}
                  >
                    <span className={`ai-suggestion-icon ${s.tone}`}>
                      <s.Icon size={23} />
                    </span>
                    <div>
                      <strong>{s.title}</strong>
                      <p>{s.text}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="ai-messages">
              {messages.map((message) => (
                <article key={message.id} className={`ai-message ${message.role}`}>
                  {message.role === "assistant" && (
                    <WunduAIAvatar
                      size={32}
                      animated={typing === message.id || message.id === messages.at(-1)?.id}
                    />
                  )}
                  <div>
                    {message.role === "assistant" && typing === message.id ? (
                      <>
                        <span className="sr-only">{message.text}</span>
                        <div aria-hidden="true">
                          <Typewriter
                            words={[message.text]}
                            speed={9}
                            cursorChar="|"
                            loop={false}
                            onComplete={finishTyping}
                          />
                        </div>
                        <button type="button" className="ai-show-answer" onClick={finishTyping}>
                          Mostrar resposta completa
                        </button>
                      </>
                    ) : (
                      <MarkdownContent text={message.text} />
                    )}
                    {message.role === "assistant" && (
                      <small>
                        {message.engine === "local"
                          ? "Análise local · calculada dos teus registos"
                          : "Wundu IA"}
                      </small>
                    )}
                  </div>
                </article>
              ))}
              {streaming && streaming.id === selected && (
                <article className="ai-message assistant">
                  <WunduAIAvatar size={32} />
                  <div>
                    <MarkdownContent text={streaming.text} />
                    <span className="wundu-typewriter-cursor" aria-hidden="true">
                      |
                    </span>
                    <small>Wundu IA</small>
                  </div>
                </article>
              )}
              {busy === selected && !streaming && (
                <article className="ai-message assistant">
                  <WunduAIAvatar size={32} />
                  <div className="ai-thinking" role="status">
                    <Typewriter
                      words={["A analisar os teus registos…", "A preparar a resposta…"]}
                      speed={40}
                      delayBetweenWords={900}
                    />
                  </div>
                </article>
              )}
              <div ref={bottom} />
            </div>
          )}
        </div>

        <footer className="ai-composer">
          <div className="ai-mode-label">
            <Sparkles size={12} />
            {remote ? "Wundu IA · respostas do servidor" : "Modo local · cálculos dos registos"}
          </div>
          {storageError && (
            <p role="status" className="ai-feedback">
              {storageError}
            </p>
          )}
          {rateLimit != null && rateLimit > 0 && (
            <p role="status" className="ai-feedback">
              Limite de mensagens atingido. Podes enviar em {rateLimit}s.
            </p>
          )}
          {error && (
            <div className="ai-feedback" role="alert">
              <p>{error}</p>
              {messages.at(-1)?.role === "user" && (
                <button type="button" disabled={!!busy} onClick={() => void ask(messages.at(-1)!.text, true)}>
                  Tentar novamente
                </button>
              )}
            </div>
          )}
          <form onSubmit={submit}>
            <textarea
              ref={composer}
              aria-label="Pergunta à Wundu IA"
              placeholder={
                rateLimit != null && rateLimit > 0
                  ? `Aguarda ${rateLimit}s…`
                  : "Pergunta à Wundu IA sobre as tuas finanças..."
              }
              rows={1}
              maxLength={2000}
              value={input}
              disabled={!ready}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  if (!busy && !(rateLimit != null && rateLimit > 0)) void ask(input);
                }
              }}
            />
            {busy ? (
              <button type="button" aria-label="Parar resposta" onClick={stop}>
                <Square size={17} />
              </button>
            ) : (
              <button type="submit" disabled={sendingDisabled} aria-label="Enviar pergunta">
                <ArrowUp size={20} />
                <span>Enviar</span>
              </button>
            )}
          </form>
          <p className="ai-disclaimer">
            Baseado no histórico das tuas contas, transações e metas. A Wundu IA pode cometer erros.
          </p>
        </footer>
      </section>

      {historyOpen && (
        <div
          className="fixed inset-0 z-80 flex items-end justify-center bg-black/50 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-label="Conversas"
          onClick={() => setHistoryOpen(false)}
        >
          <div
            className="ai-history-sheet flex max-h-[86dvh] w-full max-w-lg flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mobile-sheet-handle" />
            <header>
              <div>
                <h2 className="font-manrope text-base font-bold text-(--text-title)">Conversas</h2>
                <p className="font-manrope text-xs text-(--text-description)">
                  {conversations.length} conversas ·{" "}
                  {remote ? "sincronizadas com a conta" : "guardadas neste navegador"}
                </p>
              </div>
              <button
                type="button"
                className="icon-button"
                aria-label="Fechar conversas"
                onClick={() => setHistoryOpen(false)}
              >
                <X size={22} />
              </button>
            </header>
            <label className="ai-history-search">
              <Search size={17} />
              <input
                aria-label="Pesquisar conversas no histórico"
                placeholder="Pesquisar conversas"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            <div className="min-h-0 flex-1 overflow-y-auto">
              <HistoryList
                conversations={conversations}
                query={query}
                selected={selected}
                onSelect={select}
                onRemove={remove}
                now={historyNow}
              />
            </div>
            <footer>
              <button type="button" className="primary-button" onClick={newConversation}>
                <Plus size={19} />
                Nova conversa
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}

function HistoryList({
  conversations,
  query,
  selected,
  onSelect,
  onRemove,
  now,
}: {
  conversations: AIConversation[];
  query: string;
  selected: string;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
  now: number;
}) {
  const filtered = conversations.filter((c) =>
    aiCategoryKey(c.title + " " + c.messages.map((m) => m.text).join(" ")).includes(
      aiCategoryKey(query),
    ),
  );
  return (
    <div className="ai-history-list">
      {GROUPS.map((group) => {
        const list = filtered.filter((c) => conversationGroup(c.updated, now) === group);
        return list.length > 0 ? (
          <section key={group}>
            <h3>{group}</h3>
            {list.map((c) => (
              <div key={c.id} className={c.id === selected ? "selected" : ""}>
                <button type="button" onClick={() => onSelect(c.id)}>
                  <strong>{c.title}</strong>
                  <small>
                    {c.messages.length} {c.messages.length === 1 ? "mensagem" : "mensagens"} ·{" "}
                    {new Intl.DateTimeFormat("pt-AO", {
                      ...(group === "Hoje" || group === "Ontem"
                        ? { hour: "2-digit", minute: "2-digit" }
                        : { day: "numeric", month: "long" }),
                      timeZone: "Africa/Luanda",
                    }).format(c.updated)}
                  </small>
                </button>
                <button
                  type="button"
                  aria-label={`Eliminar conversa ${c.title}`}
                  className="ai-delete"
                  onClick={() => onRemove(c.id)}
                >
                  <Trash2 size={17} />
                </button>
              </div>
            ))}
          </section>
        ) : null;
      })}
      {!filtered.length && (
        <p className="ai-history-empty">
          {query ? "Nenhuma conversa encontrada." : "As tuas conversas aparecem aqui depois da primeira pergunta."}
        </p>
      )}
    </div>
  );
}
