"use client";

import { useCallback, useEffect, useState } from "react";
import type { Category } from "@/shared/types/category";
import { CategoriesService } from "@/services/categories-service";

type Status = "idle" | "loading" | "success" | "error";

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");

  const fetchCategories = useCallback(async () => {
    setStatus("loading");
    setError("");
    try {
      const data = await CategoriesService.list();
      setCategories(data);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível carregar as categorias.",
      );
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    status,
    error,
    refreshCategories: fetchCategories,
  };
};
