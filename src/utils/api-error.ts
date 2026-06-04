import type { ApiError } from "@/api/api";

export type RegisterErrorField = "name" | "email" | "phone" | null;

export function getApiErrorMessage(error: unknown, fallbackMessage: string) {
  const candidate = error as
    | (ApiError & { response?: { data?: { message?: string } } })
    | undefined;

  return (
    candidate?.message ||
    candidate?.response?.data?.message ||
    fallbackMessage
  );
}

export function getRegisterErrorField(message: string): RegisterErrorField {
  const normalizedMessage = message.toLowerCase();

  if (
    normalizedMessage.includes("telefone") ||
    normalizedMessage.includes("telemóvel") ||
    normalizedMessage.includes("phone")
  ) {
    return "phone";
  }

  if (normalizedMessage.includes("email")) {
    return "email";
  }

  if (normalizedMessage.includes("nome")) {
    return "name";
  }

  return null;
}
