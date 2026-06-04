import { useCallback, useRef, useState } from "react";
import { documentService } from "@/services/document.service";
import type { DocumentStatus } from "@/types/dtos/document.dto";

const TERMINAL_STATUSES = [
  "PROCESSED",
  "NEEDS_MANUAL_CATEGORY",
  "DUPLICATE",
  "REJECTED_NOT_RECEIPT",
  "FAILED",
];

const POLL_INTERVAL_MS = 4_000;
const POLL_TIMEOUT_MS = 5 * 60 * 1000;

interface UseDocumentPollingOptions {
  onTerminal?: (doc: DocumentStatus) => void;
}

export function useDocumentPolling({ onTerminal }: UseDocumentPollingOptions = {}) {
  const [doc, setDoc] = useState<DocumentStatus | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onTerminalRef = useRef(onTerminal);
  onTerminalRef.current = onTerminal;

  const stopPolling = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timerRef.current = null;
    timeoutRef.current = null;
    setIsPolling(false);
  }, []);

  const startPolling = useCallback(
    (documentId: string) => {
      setIsPolling(true);

      const poll = async () => {
        try {
          const result = await documentService.getById(documentId);
          setDoc(result);
          if (TERMINAL_STATUSES.includes(result.status.toUpperCase())) {
            stopPolling();
            onTerminalRef.current?.(result);
          }
        } catch {
          // ignore transient network errors during polling
        }
      };

      poll();
      timerRef.current = setInterval(poll, POLL_INTERVAL_MS);
      timeoutRef.current = setTimeout(stopPolling, POLL_TIMEOUT_MS);
    },
    [stopPolling],
  );

  const reset = useCallback(() => {
    stopPolling();
    setDoc(null);
  }, [stopPolling]);

  return { doc, isPolling, startPolling, stopPolling, reset };
}
