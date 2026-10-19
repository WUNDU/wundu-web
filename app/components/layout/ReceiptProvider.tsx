"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useReceiptAttachment } from "@/hooks/use-receipt-attachment";
import type { ReceiptItem } from "@/hooks/use-receipt-attachment";
import ReceiptTray from "app/components/receipt/ReceiptTray";
import ReceiptReviewSheet from "app/components/receipt/ReceiptReviewSheet";

type ReceiptContextValue = {
  /** Todos os comprovativos da fila (os "jobs" do protótipo). */
  items: ReceiptItem[];
  /** Comprovativos ainda por guardar. */
  pending: ReceiptItem[];
  /** Comprovativos já lidos, prontos a rever. */
  ready: ReceiptItem[];
  /** Comprovativo em leitura. */
  reading: ReceiptItem | null;
  isReading: boolean;
  /** Mensagem de progresso da leitura ("A extrair dados…"). */
  progress: string;
  error: string;
  stage: (files: File[]) => void;
  read: () => Promise<void>;
  remove: (id: string) => void;
  retry: (id: string) => void;
  markSaved: (id: string) => void;
  /** Abre a folha de revisão de um comprovativo. */
  openReview: (id: string) => void;
  closeReview: () => void;
  reviewId: string | null;
};

const ReceiptContext = createContext<ReceiptContextValue | null>(null);

export function useReceipt() {
  const context = useContext(ReceiptContext);
  if (!context) {
    throw new Error("useReceipt must be used within ReceiptProvider");
  }
  return context;
}

/**
 * Fila de comprovativos da Wundu.
 *
 * Igual ao protótipo: a leitura corre em segundo plano (a app continua a
 * poder usar-se), a barra de progresso fica no canto e a revisão de cada
 * documento abre numa folha própria.
 */
export default function ReceiptProvider({ children }: { children: ReactNode }) {
  const queue = useReceiptAttachment();
  const [reviewId, setReviewId] = useState<string | null>(null);

  const pending = useMemo(
    () => queue.items.filter((item) => item.status !== "saved"),
    [queue.items],
  );
  const ready = useMemo(
    () => queue.items.filter((item) => item.status === "ready"),
    [queue.items],
  );
  const reading = useMemo(
    () => queue.items.find((item) => item.status === "reading") ?? null,
    [queue.items],
  );

  const value: ReceiptContextValue = {
    items: queue.items,
    pending,
    ready,
    reading,
    isReading: queue.isReading,
    progress: queue.progress,
    error: queue.error,
    stage: queue.stage,
    read: queue.read,
    remove: queue.remove,
    retry: queue.retry,
    markSaved: queue.markSaved,
    openReview: setReviewId,
    closeReview: () => setReviewId(null),
    reviewId,
  };

  return (
    <ReceiptContext.Provider value={value}>
      {children}
      <ReceiptTray />
      <ReceiptReviewSheet
        open={reviewId !== null}
        onClose={() => setReviewId(null)}
      />
    </ReceiptContext.Provider>
  );
}
