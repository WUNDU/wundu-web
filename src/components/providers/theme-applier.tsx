"use client";

import { useEffect } from "react";
import { useThemeStore } from "../../../app/store/theme-store";

/**
 * Aplica o tema guardado (`light`/`dark`) no `data-theme` do documento em
 * todas as rotas — incluindo as telas de autenticação, que não montam o
 * TopBar (onde o atributo era aplicado antes).
 */
export function ThemeApplier() {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return null;
}
