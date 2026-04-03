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
