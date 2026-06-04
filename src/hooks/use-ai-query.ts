"use client";

import { useState, useCallback } from "react";
import { aiService, type AiQueryFilter, type AiQueryResponse } from "@/services/ai.service";
import type { TransactionResponse } from "@/types/dtos/transaction.dto";

interface AiQueryState {
  question: string;
  filter: AiQueryFilter | null;
  results: TransactionResponse[];
  isLoading: boolean;
  error: string | null;
  rateLimitSeconds: number | null;
  hasQueried: boolean;
}

interface UseAiQuery extends AiQueryState {
  query(question: string): Promise<void>;
  reset(): void;
}

export function useAiQuery(): UseAiQuery {
  const [state, setState] = useState<AiQueryState>({
    question: "",
    filter: null,
    results: [],
    isLoading: false,
    error: null,
    rateLimitSeconds: null,
    hasQueried: false,
  });

  const query = useCallback(async (question: string) => {
    if (!question.trim()) return;
    setState((s) => ({ ...s, question, isLoading: true, error: null, rateLimitSeconds: null }));
    try {
      const res: AiQueryResponse = await aiService.query(question);
      setState((s) => ({
        ...s,
        filter: res.filter,
        results: res.transactions ?? [],
        isLoading: false,
        hasQueried: true,
      }));
    } catch (err: any) {
      if (err?.response?.status === 429) {
        const retryAfter = err?.response?.data?.retryAfterSeconds ?? 60;
        setState((s) => ({ ...s, isLoading: false, rateLimitSeconds: retryAfter }));
      } else {
        const msg = err?.response?.data?.message || "Erro ao processar consulta";
        setState((s) => ({ ...s, isLoading: false, error: msg }));
      }
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      question: "",
      filter: null,
      results: [],
      isLoading: false,
      error: null,
      rateLimitSeconds: null,
      hasQueried: false,
    });
  }, []);

  return { ...state, query, reset };
}
