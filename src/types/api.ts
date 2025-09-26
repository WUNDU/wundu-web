export interface ApiErrorResponse {
  message?: string; // Optional, as the backend might not always return a message
  [key: string]: any; // Allow other fields (flexible for different error shapes)
}