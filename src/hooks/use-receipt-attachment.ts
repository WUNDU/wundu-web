"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { documentService } from "@/services/document.service";
import { transactionService } from "@/services/transaction.service";
import { useUiStore } from "@/store/ui-store";

/** Limites iguais aos do protótipo `wundu`: até 10 comprovativos, 10 MB cada. */
export const MAX_RECEIPT_FILES = 10;
export const MAX_RECEIPT_FILE_SIZE_BYTES = 10 * 1024 * 1024;

/** Intervalo entre pedidos de estado (o scheduler do backend corre a cada 30s). */
const POLL_INTERVAL_MS = 4_000;
/** Tempo máximo de espera pela leitura antes de desistir. */
const POLL_TIMEOUT_MS = 5 * 60 * 1000;
/** Tentativas de upload por ficheiro antes de marcar o item como erro. */
const UPLOAD_ATTEMPTS = 3;
/** Espera entre tentativas de upload (crescente: 1s, 2s, 3s…). */
const UPLOAD_RETRY_DELAY_MS = 1_000;

const ACCEPTED_TYPES = ["application/pdf", "image/jpeg", "image/png"];

export type ReceiptItemStatus =
  | "staged"
  | "reading"
  | "ready"
  | "error"
  | "saved";

/** Dados extraídos do comprovativo, prontos a preencher o formulário. */
export type ReceiptDraft = {
  /** Valor em Kwanzas (o backend devolve já em unidade principal). */
  amount: number | null;
  /** Descrição sugerida (estabelecimento lido no documento). */
  description: string;
  /** Categoria sugerida pelo OCR (pode não existir na lista do utilizador). */
  category: string;
  /** Data em YYYY-MM-DD. */
  date: string | null;
  /** Hora em HH:MM. */
  time: string | null;
};

/** Um comprovativo dentro do formulário. */
export type ReceiptItem = {
  id: string;
  /** Ficheiro original (enquanto está na fila). */
  file: File | null;
  fileName: string;
  fileSize: number;
  status: ReceiptItemStatus;
  error: string;
  /** Aviso a mostrar quando a leitura ficou incompleta (ex.: sem categoria). */
  note: string;
  draft: ReceiptDraft | null;
  documentId: string | null;
  /** Transação criada pelo backend a partir do documento (modo `create`). */
  linkedTransactionId: string | null;
};

type UseReceiptAttachmentOptions = {
  /**
   * `create` — a transação criada pelo backend a partir do comprovativo é a
   *            própria transação do formulário (é actualizada ao guardar).
   * `edit`   — a transação criada pelo backend é apenas um rascunho usado
   *            para ler os dados; é eliminada logo que os dados são extraídos.
   */
  mode?: "create" | "edit";
};

const isAbort = (error: unknown) =>
  error instanceof Error &&
  (error.name === "AbortError" || error.message === "cancelado");

/** Erros do `apiClient` (que já aplaina a resposta em `Error` + `status`). */
type QueueError = Error & { status?: number; errorCode?: string };

const asQueueError = (error: unknown) => error as QueueError | null;

/**
 * Erro transitório: vale a pena repetir (rede em baixo, timeout, 5xx, 429 ou
 * documento que o backend ainda não indexou logo após o upload).
 * Os restantes (400/403/409…) não se resolvem a repetir.
 */
const isTransient = (error: unknown) => {
  const status = asQueueError(error)?.status;
  if (typeof status !== "number") return true; // sem resposta do servidor
  return (
    status === 404 || status === 408 || status === 409 || status === 429 || status >= 500
  );
};

/** Recusa do backend que não se resolve repetindo (sessão/e-mail). */
const isPolicyError = (error: unknown) => {
  const info = asQueueError(error);
  return (
    info?.status === 401 ||
    info?.status === 403 ||
    info?.errorCode === "EMAIL_NOT_VERIFIED"
  );
};

/** Mensagem legível para o utilizador (a do backend quando existe). */
const readableError = (error: unknown, fallback: string) => {
  const info = asQueueError(error);
  const raw = error instanceof Error ? error.message.trim() : "";
  const generic =
    !raw ||
    /^(request failed|internal server error|timeout of|network error|failed with status)/i.test(
      raw,
    );
  // O backend diz o motivo → usa a mensagem dele.
  if (!generic) return raw;
  if (info?.errorCode === "EMAIL_NOT_VERIFIED" || info?.status === 403) {
    return "Confirma o teu e-mail na Wundu antes de enviar vários comprovativos de cada vez.";
  }
  if (info?.status === 401) {
    return "A sessão expirou. Entra outra vez para continuar a leitura.";
  }
  if (info?.status === 429) {
    return "Demasiados pedidos. Aguarda um momento e tenta outra vez.";
  }
  if (info?.status === 413) return "O ficheiro é demasiado grande (máx. 10 MB).";
  if (typeof info?.status === "number") return `${fallback} (erro ${info.status})`;
  return fallback;
};

const fileKey = (file: File) => `${file.name}:${file.size}:${file.lastModified}`;

/** "2026-10-12T00:00:00" → "2026-10-12" */
function toDateKey(raw?: string | null): string | null {
  if (!raw) return null;
  const match = raw.match(/(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : null;
}

/** "2026-10-12T09:30:00" → "09:30" */
function toTimeLabel(raw?: string | null): string | null {
  if (!raw) return null;
  const match = raw.match(/T(\d{2}):(\d{2})/);
  return match ? `${match[1]}:${match[2]}` : null;
}

/**
 * Fila de comprovativos do formulário de transação.
 *
 * O utilizador escolhe até 10 documentos (como no protótipo `wundu`) e a
 * Wundu lê um a um: cada documento vira uma despesa com os campos preenchidos
 * para revisão. Nada é registado sem a revisão do utilizador.
 */
export function useReceiptAttachment({
  mode = "create",
}: UseReceiptAttachmentOptions = {}) {
  const [items, setItems] = useState<ReceiptItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [error, setError] = useState("");
  /** Mensagem de progresso da leitura (como o `queue.progress` do protótipo). */
  const [progress, setProgress] = useState("");

  const itemsRef = useRef<ReceiptItem[]>([]);
  const cancelled = useRef(false);
  const runId = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const processing = useRef(false);
  /** Fila parada por um erro que não se resolve a repetir (sessão/e-mail). */
  const blocked = useRef(false);

  const update = useCallback(
    (updater: (prev: ReceiptItem[]) => ReceiptItem[]) => {
      // A referência é actualizada de forma síncrona para que a fila de leitura
      // veja sempre o estado mais recente (o `setState` é assíncrono).
      const next = updater(itemsRef.current);
      itemsRef.current = next;
      setItems(next);
    },
    [],
  );

  const patch = useCallback(
    (id: string, changes: Partial<ReceiptItem>) => {
      update((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...changes } : item)),
      );
    },
    [update],
  );

  const clearTimer = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      cancelled.current = true;
      runId.current += 1;
      if (timer.current) clearTimeout(timer.current);
      // Comprovativos por confirmar não sobrevivem ao formulário: sem revisão
      // do utilizador, nada é registado.
      for (const item of itemsRef.current) {
        if (item.status !== "saved" && item.linkedTransactionId) {
          void transactionService
            .delete(item.linkedTransactionId)
            .catch(() => undefined);
        }
      }
    };
  }, []);

  const wait = useCallback(
    (ms: number) =>
      new Promise<void>((resolve) => {
        timer.current = setTimeout(resolve, ms);
      }),
    [],
  );

  /** Consulta o estado do documento até o backend ter os dados prontos. */
  const readDocument = useCallback(
    async (id: string, run: number, ownerId: string) => {
      const startedAt = Date.now();
      /** `getResult` com falhas transitórias a repetir (devolve null). */
      const fetchResult = () =>
        documentService.getResult(id).catch((resultError) => {
          if (!isTransient(resultError)) {
            throw new Error(
              readableError(resultError, "Não foi possível ler os dados extraídos."),
            );
          }
          return null;
        });
      for (;;) {
        if (cancelled.current || runId.current !== run) {
          throw new Error("cancelado");
        }
        if (Date.now() - startedAt > POLL_TIMEOUT_MS) {
          throw new Error(
            "A leitura do comprovativo demorou demasiado. Tenta novamente com um documento mais pequeno.",
          );
        }
        // Logo após o upload o backend ainda pode não conhecer o documento (ou
        // a rede falhou): nesse caso consultamos de novo em vez de travar o
        // item — o timeout do polling continua a ser o limite.
        const document = await documentService.getById(id).catch((statusError) => {
          if (!isTransient(statusError)) {
            throw new Error(
              readableError(statusError, "Não foi possível consultar o estado da leitura."),
            );
          }
          return null;
        });
        if (cancelled.current || runId.current !== run) {
          throw new Error("cancelado");
        }
        if (!document) {
          await wait(POLL_INTERVAL_MS);
          continue;
        }
        const status = (document.status ?? "").toUpperCase();
        setProgress(
          status === "PENDING" ? "A aguardar o servidor…" : "A extrair dados…",
        );

        if (status === "AWAITING_CONFIRMATION") {
          const confirmed = await documentService.confirm(id).catch((confirmError) => {
            // Uma confirmação que ainda não pegou (ou uma rede instável) não
            // deve matar o item: volta a consultar o documento.
            if (!isTransient(confirmError)) {
              throw new Error(
                readableError(confirmError, "Não foi possível confirmar a leitura."),
              );
            }
            return null;
          });
          if (!confirmed) {
            await wait(POLL_INTERVAL_MS);
            continue;
          }
          // A confirmação cria a transação: se entretanto o comprovativo foi
          // descartado, o rascunho é eliminado — não fica nada por reviews.
          const stillThere = itemsRef.current.some((item) => item.id === ownerId);
          if (
            !stillThere ||
            cancelled.current ||
            runId.current !== run
          ) {
            void transactionService
              .delete(confirmed.transactionId)
              .catch(() => undefined);
            throw new Error("cancelado");
          }
          const transaction = await (async () => {
            let found = await transactionService
              .getById(confirmed.transactionId)
              .catch(() => null);
            // A transação acabou de ser criada: dá-lhe uns segundos (3
            // tentativas) em vez de marcar o comprovativo como falhado.
            for (let attempt = 0; !found && attempt < 3; attempt++) {
              await wait(POLL_INTERVAL_MS);
              if (cancelled.current || runId.current !== run) return null;
              found = await transactionService
                .getById(confirmed.transactionId)
                .catch(() => null);
            }
            return found;
          })();
          if (!transaction) {
            if (cancelled.current || runId.current !== run) {
              throw new Error("cancelado");
            }
            throw new Error("A despesa criada não respondeu. Tenta novamente.");
          }
          return { kind: "transaction", transaction } as const;
        }
        if (status === "NEEDS_MANUAL_CATEGORY") {
          // O OCR leu os valores mas não percebeu a categoria: os dados
          // continuam disponíveis, a categoria é escolhida no formulário.
          const result = await fetchResult();
          if (!result) {
            await wait(POLL_INTERVAL_MS);
            continue;
          }
          return {
            kind: "result",
            result,
            note: "A categoria não foi reconhecida. Escolhe-a e guarda a despesa.",
          } as const;
        }
        if (status === "PROCESSED") {
          // O documento já estava confirmado (ex.: sessão anterior): os dados
          // estruturados continuam disponíveis, mas não há transação nova.
          const result = await fetchResult();
          if (!result) {
            await wait(POLL_INTERVAL_MS);
            continue;
          }
          return {
            kind: "result",
            result,
            note: "Este comprovativo já tinha sido lido. Confirma os valores antes de guardar.",
          } as const;
        }
        if (status === "DUPLICATE") {
          throw new Error(
            "Este comprovativo já foi enviado antes. Escolhe outro ficheiro.",
          );
        }
        if (status === "REJECTED_NOT_RECEIPT") {
          throw new Error(
            "O ficheiro não parece um comprovativo. Envia a factura ou o extracto da conta.",
          );
        }
        if (status === "FAILED") {
          throw new Error(
            "Não foi possível ler o comprovativo. Tenta novamente com uma imagem mais nítida.",
          );
        }
        await wait(POLL_INTERVAL_MS);
      }
    },
    [wait],
  );

  /**
   * Upload de um ficheiro com tentativas: falhas de rede, 5xx ou 429 voltam a
   * ser tentadas (1s, 2s, 3s) antes de o item ficar como erro.
   */
  const uploadFile = useCallback(
    async (file: File) => {
      let lastError: unknown = null;
      for (let attempt = 0; attempt < UPLOAD_ATTEMPTS; attempt++) {
        try {
          const formData = new FormData();
          formData.append("file", file);
          return await documentService.upload(formData);
        } catch (error) {
          lastError = error;
          if (
            isPolicyError(error) ||
            !isTransient(error) ||
            attempt === UPLOAD_ATTEMPTS - 1
          ) {
            throw error;
          }
          await wait(UPLOAD_RETRY_DELAY_MS * (attempt + 1));
        }
      }
      throw lastError;
    },
    [wait],
  );

  const processItem = useCallback(
    async (id: string, run: number) => {
      const item = itemsRef.current.find((entry) => entry.id === id);
      if (!item) return;
      if (!item.file) {
        // Sem ficheiro não há envio: marca o item para o loop não ficar preso.
        patch(id, {
          status: "error",
          error: "Ficheiro indisponível. Escolhe o comprovativo outra vez.",
        });
        return;
      }
      patch(id, { status: "reading", error: "" });
      try {
        let documentId = item.documentId;
        if (documentId) {
          // O envio já tinha resultado (retry depois de uma falha a seguir):
          // reutiliza o documento — repetir o upload daria DUPLICATE.
          setProgress("A ler o documento…");
        } else {
          setProgress("A enviar o documento…");
          const upload = await uploadFile(item.file);
          if (cancelled.current || runId.current !== run) return;
          documentId = upload.documentId;
          patch(id, { documentId });
          setProgress("A ler o documento…");
        }

        const outcome = await readDocument(documentId, run, id);
        if (cancelled.current || runId.current !== run) return;

        if (outcome.kind === "transaction" && outcome.transaction) {
          const transaction = outcome.transaction;
          patch(id, {
            status: "ready",
            note: "",
            linkedTransactionId: mode === "create" ? transaction.id : null,
            draft: {
              amount:
                typeof transaction.amount === "number" && transaction.amount > 0
                  ? transaction.amount
                  : null,
              description: transaction.description ?? "",
              category: transaction.category?.name ?? "",
              date: toDateKey(transaction.transactionDate),
              time: toTimeLabel(transaction.transactionDate),
            },
          });
          if (mode === "edit") {
            // Em edição a transação criada pelo backend é só um rascunho para
            // ler os dados — eliminamos para não deixar movimentos a duplicar.
            await transactionService
              .delete(transaction.id)
              .catch(() => undefined);
          }
        } else {
          const result = outcome.result;
          patch(id, {
            status: "ready",
            note: outcome.note ?? "",
            linkedTransactionId: null,
            draft: {
              amount:
                typeof result?.total === "number" && result.total > 0
                  ? result.total
                  : null,
              description: result?.merchant ?? "",
              category: "",
              date: null,
              time: null,
            },
          });
        }
      } catch (uploadError) {
        if (isAbort(uploadError)) return;
        setProgress("");
        const message = readableError(
          uploadError,
          "Não foi possível ler o comprovativo. Tenta novamente.",
        );
        patch(id, { status: "error", error: message });
        // Recusa de sessão/e-mail não se resolve a repetir: para a fila (os
        // restantes ficam na fila, não falham um a um) e explica o motivo.
        if (isPolicyError(uploadError)) {
          blocked.current = true;
          setError(message);
        }
      }
    },
    [mode, patch, readDocument, uploadFile],
  );

  /** Lê os comprovativos escolhidos, um a um. */
  const read = useCallback(async () => {
    if (processing.current) return;
    processing.current = true;
    const run = ++runId.current;
    cancelled.current = false;
    blocked.current = false;
    try {
      for (;;) {
        if (blocked.current) break;
        const next = itemsRef.current.find((item) => item.status === "staged");
        if (!next) break;
        await processItem(next.id, run);
      }
    } finally {
      processing.current = false;
      setProgress("");
    }
    const failed = itemsRef.current.filter((item) => item.status === "error");
    if (failed.length) {
      useUiStore
        .getState()
        .showNotification(
          "error",
          "Leitura concluída com erros",
          `${failed.length} comprovativo(s) não puderam ser lidos.`,
        );
    }
  }, [processItem]);

  /** Junta ficheiros à fila (até 10, como no protótipo). */
  const stage = useCallback(
    (incoming: File[]) => {
      setError("");
      if (!incoming.length) return;
      const unsupported = incoming.find(
        (file) =>
          !ACCEPTED_TYPES.includes(file.type) &&
          !/\.(pdf|jpe?g|png)$/i.test(file.name),
      );
      if (unsupported) {
        setError("Escolhe ficheiros PDF, JPG ou PNG.");
        return;
      }
      const tooBig = incoming.find(
        (file) => file.size > MAX_RECEIPT_FILE_SIZE_BYTES,
      );
      if (tooBig) {
        setError("Cada ficheiro pode ter até 10 MB.");
        return;
      }
      const current = itemsRef.current;
      const room = MAX_RECEIPT_FILES - current.length;
      if (room <= 0) {
        setError("Podes ler até 10 ficheiros de cada vez.");
        return;
      }
      const next: ReceiptItem[] = [];
      for (const file of incoming) {
        if (next.length >= room) break;
        const key = fileKey(file);
        if (current.some((item) => item.file && fileKey(item.file) === key)) {
          continue;
        }
        if (next.some((item) => item.file && fileKey(item.file) === key)) continue;
        next.push({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          file,
          fileName: file.name,
          fileSize: file.size,
          status: "staged",
          error: "",
          note: "",
          draft: null,
          documentId: null,
          linkedTransactionId: null,
        });
      }
      if (!next.length) {
        setError("Estes comprovativos já estão na lista.");
        return;
      }
      if (incoming.length > room) {
        setError("Podes ler até 10 ficheiros de cada vez.");
      }
      update((prev) => [...prev, ...next]);
      // A fila arranca sozinha — quem apenas junta ficheiros não tem de se
      // lembrar de chamar `read()` (o compositor continua a poder chamar).
      void read();
    },
    [read, update],
  );

  /** Remove um comprovativo da lista (e o rascunho que ele criou). */
  const remove = useCallback(
    (id: string) => {
      const item = itemsRef.current.find((entry) => entry.id === id);
      if (item && item.status !== "saved" && item.linkedTransactionId) {
        void transactionService
          .delete(item.linkedTransactionId)
          .catch(() => undefined);
      }
      update((prev) => prev.filter((entry) => entry.id !== id));
    },
    [update],
  );

  /** Volta a ler um comprovativo que falhou. */
  const retry = useCallback(
    (id: string) => {
      const item = itemsRef.current.find((entry) => entry.id === id);
      if (!item?.file) return;
      blocked.current = false;
      setError("");
      patch(id, { status: "staged", error: "" });
      void read();
    },
    [patch, read],
  );

  /** Volta a ler todos os que falharam (usado pelo "Tentar" da barra). */
  const retryAll = useCallback(() => {
    blocked.current = false;
    setError("");
    update((prev) =>
      prev.map((item) =>
        item.status === "error" ? { ...item, status: "staged", error: "" } : item,
      ),
    );
    void read();
  }, [read, update]);

  /** Marca um comprovativo como revisto e guardado. */
  const markSaved = useCallback(
    (id: string) => {
      patch(id, { status: "saved" });
    },
    [patch],
  );

  /** Descarta tudo o que ainda não foi revisto. */
  const discard = useCallback(() => {
    cancelled.current = true;
    runId.current += 1;
    clearTimer();
    for (const item of itemsRef.current) {
      if (item.status !== "saved" && item.linkedTransactionId) {
        void transactionService
          .delete(item.linkedTransactionId)
          .catch(() => undefined);
      }
    }
    update(() => []);
    setActiveId(null);
    setError("");
  }, [clearTimer, update]);

  /** Selecciona o comprovativo em revisão. */
  const select = useCallback((id: string) => {
    setActiveId(id);
  }, []);

  const activeItem = items.find((item) => item.id === activeId) ?? null;
  const stagedCount = items.filter((item) => item.status === "staged").length;

  return {
    items,
    activeItem,
    activeId,
    error,
    progress,
    stagedCount,
    isReading: items.some((item) => item.status === "reading"),
    stage,
    read,
    remove,
    retry,
    retryAll,
    select,
    markSaved,
    discard,
    reset: discard,
  };
}

export type ReceiptAttachment = ReturnType<typeof useReceiptAttachment>;
