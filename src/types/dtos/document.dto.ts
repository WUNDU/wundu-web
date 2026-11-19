export interface UploadResponse {
  documentId: string;
  status: string;
  message?: string;
}

export interface LineItem {
  description: string;
  amount: number;
}

export interface DocumentResult {
  merchant: string;
  total: number;
  lineItems: LineItem[];
  confidence: number;
  docType: string;
}

export interface DocumentList {
  id: string;
  fileName: string;
  contentType: string;
  fileSize: number;
  status: string;
  createdAt: string;
}

export interface DocumentStatus {
  id: string;
  fileName: string;
  status: string;
  fileSize: number;
  extractedText?: string;
  createdAt: string;
}

/**
 * Estados do documento no pipeline de OCR.
 * `AWAITING_CONFIRMATION` é o estado em que o OCR terminou e o backend
 * guarda os dados extraídos, mas ainda não expôs o resultado ao cliente —
 * só depois de `POST /documents/{id}/confirm` o documento passa a
 * `PROCESSED` (e a transação é criada).
 */
export type DocumentState =
  | "PENDING"
  | "OCR_PROCESSING"
  | "AWAITING_CONFIRMATION"
  | "PROCESSED"
  | "NEEDS_MANUAL_CATEGORY"
  | "DUPLICATE"
  | "REJECTED_NOT_RECEIPT"
  | "FAILED";

/** Resposta de `POST /documents/{id}/confirm`. */
export interface DocumentConfirmResponse {
  transactionId: string;
  status: string;
  amount: number;
  category?: string;
  itemCount?: number;
}
