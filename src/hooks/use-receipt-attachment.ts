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

const errorMessage = (error: unknown, fallback: string) =>
  error instanceof Error && error.message ? error.message : fallback;

const isAbort = (error: unknown) =>
  error instanceof Error &&
  (error.name === "AbortError" || error.message === "cancelado");

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
      for (;;) {
        if (cancelled.current || runId.current !== run) {
          throw new Error("cancelado");
        }
        if (Date.now() - startedAt > POLL_TIMEOUT_MS) {
          throw new Error(
            "A leitura do comprovativo demorou demasiado. Tenta novamente com um documento mais pequeno.",
          );
        }
        const document = await documentService.getById(id);
        if (cancelled.current || runId.current !== run) {
          throw new Error("cancelado");
        }
        const status = (document.status ?? "").toUpperCase();
        setProgress(
          status === "PENDING" ? "A aguardar o servidor…" : "A extrair dados…",
        );

        if (status === "AWAITING_CONFIRMATION") {
          const confirmed = await documentService.confirm(id);
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
          const transaction = await transactionService.getById(
            confirmed.transactionId,
          );
          return { kind: "transaction", transaction } as const;
        }
        if (status === "NEEDS_MANUAL_CATEGORY") {
          // O OCR leu os valores mas não percebeu a categoria: os dados
          // continuam disponíveis, a categoria é escolhida no formulário.
          const result = await documentService.getResult(id);
          return {
            kind: "result",
            result,
            note: "A categoria não foi reconhecida. Escolhe-a e guarda a despesa.",
          } as const;
        }
        if (status === "PROCESSED") {
          // O documento já estava confirmado (ex.: sessão anterior): os dados
          // estruturados continuam disponíveis, mas não há transação nova.
          const result = await documentService.getResult(id);
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

  const processItem = useCallback(
    async (id: string, run: number) => {
      const item = itemsRef.current.find((entry) => entry.id === id);
      if (!item?.file) return;
      patch(id, { status: "reading", error: "" });
      setProgress("A enviar o documento…");
      try {
        const formData = new FormData();
        formData.append("file", item.file);
        const upload = await documentService.upload(formData);
        if (cancelled.current || runId.current !== run) return;
        patch(id, { documentId: upload.documentId });
        setProgress("A ler o documento…");

        const outcome = await readDocument(upload.documentId, run, id);
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
        patch(id, {
          status: "error",
          error: errorMessage(
            uploadError,
            "Não foi possível ler o comprovativo. Tenta novamente.",
          ),
        });
      }
    },
    [mode, patch, readDocument],
  );

  /** Lê os comprovativos escolhidos, um a um. */
  const read = useCallback(async () => {
    if (processing.current) return;
    processing.current = true;
    const run = ++runId.current;
    cancelled.current = false;
    try {
      for (;;) {
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
    },
    [update],
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
      patch(id, { status: "staged", error: "" });
      void read();
    },
    [patch, read],
  );

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
    select,
    markSaved,
    discard,
    reset: discard,
  };
}

export type ReceiptAttachment = ReturnType<typeof useReceiptAttachment>;
