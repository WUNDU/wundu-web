import { useCallback, useRef, useState } from "react";
import { documentService } from "@/services/document.service";
import type { DocumentStatus } from "@/types/dtos/document.dto";

export type DocQueueEntry = {
  id: string;
  fileName: string;
  status: string;
  doc: DocumentStatus | null;
  isPolling: boolean;
  isCategorizing: boolean;
  categorizeError: string;
};

const TERMINAL_STATUSES = [
  "PROCESSED",
  "NEEDS_MANUAL_CATEGORY",
  "DUPLICATE",
  "REJECTED_NOT_RECEIPT",
  "FAILED",
];

const POLL_INTERVAL_MS = 4_000;
const POLL_TIMEOUT_MS = 5 * 60 * 1000;

interface UseDocumentQueueOptions {
  onProcessed?: (doc: DocumentStatus) => void;
}

export function useDocumentQueue({ onProcessed }: UseDocumentQueueOptions = {}) {
  const [entries, setEntries] = useState<DocQueueEntry[]>([]);
  const entriesRef = useRef<DocQueueEntry[]>([]);
  const timersRef = useRef<Record<string, { interval: ReturnType<typeof setInterval>; timeout: ReturnType<typeof setTimeout> }>>({});
  const onProcessedRef = useRef(onProcessed);
  onProcessedRef.current = onProcessed;

  const updateEntries = useCallback(
    (updater: (prev: DocQueueEntry[]) => DocQueueEntry[]) => {
      setEntries((prev) => {
        const next = updater(prev);
        entriesRef.current = next;
        return next;
      });
    },
    [],
  );

  const stopPolling = useCallback(
    (id: string) => {
      const t = timersRef.current[id];
      if (t) {
        clearInterval(t.interval);
        clearTimeout(t.timeout);
        delete timersRef.current[id];
      }
      updateEntries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, isPolling: false } : e)),
      );
    },
    [updateEntries],
  );

  const dismiss = useCallback(
    (id: string) => {
      const t = timersRef.current[id];
      if (t) {
        clearInterval(t.interval);
        clearTimeout(t.timeout);
        delete timersRef.current[id];
      }
      updateEntries((prev) => prev.filter((e) => e.id !== id));
    },
    [updateEntries],
  );

  const startPolling = useCallback(
    (documentId: string, fileName: string) => {
      updateEntries((prev) => [
        ...prev,
        {
          id: documentId,
          fileName,
          status: "PENDING",
          doc: null,
          isPolling: true,
          isCategorizing: false,
          categorizeError: "",
        },
      ]);

      const poll = async () => {
        try {
          const result = await documentService.getById(documentId);
          updateEntries((prev) =>
            prev.map((e) =>
              e.id === documentId
                ? { ...e, doc: result, status: result.status.toUpperCase() }
                : e,
            ),
          );
          if (TERMINAL_STATUSES.includes(result.status.toUpperCase())) {
            stopPolling(documentId);
            if (result.status.toUpperCase() === "PROCESSED") {
              onProcessedRef.current?.(result);
            }
          }
        } catch {
          // ignore transient network errors
        }
      };

      poll();
      const interval = setInterval(poll, POLL_INTERVAL_MS);
      const timeout = setTimeout(() => stopPolling(documentId), POLL_TIMEOUT_MS);
      timersRef.current[documentId] = { interval, timeout };
    },
    [stopPolling, updateEntries],
  );

  const categorize = useCallback(
    async (id: string, categoryId: string) => {
      updateEntries((prev) =>
        prev.map((e) =>
          e.id === id ? { ...e, isCategorizing: true, categorizeError: "" } : e,
        ),
      );
      try {
        await documentService.categorize(id, categoryId);
        const entry = entriesRef.current.find((e) => e.id === id);
        if (entry?.doc) onProcessedRef.current?.(entry.doc);
        updateEntries((prev) => prev.filter((e) => e.id !== id));
      } catch {
        updateEntries((prev) =>
          prev.map((e) =>
            e.id === id
              ? { ...e, isCategorizing: false, categorizeError: "Erro ao atribuir. Tente novamente." }
              : e,
          ),
        );
      }
    },
    [updateEntries],
  );

  return { entries, startPolling, dismiss, categorize };
}
