"use client";

import { useEffect, useState } from "react";

/** Lê uma variável CSS do `:root` / `[data-theme]` em runtime. */
export function readCssVar(name: string): string {
  if (typeof window === "undefined") return "";
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}

/**
 * Devolve o tema atual (`data-theme`) e força novo render
 * sempre que ele muda — os gráficos recriam-se com as cores do tema.
 */
export function useChartTheme(): string {
  const [theme, setTheme] = useState<string>(() =>
    typeof document === "undefined"
      ? "light"
      : (document.documentElement.getAttribute("data-theme") ?? "light"),
  );

  useEffect(() => {
    const root = document.documentElement;
    const sync = () =>
      setTheme(root.getAttribute("data-theme") ?? "light");
    /* TopBar corre primeiro e pode já ter definido o tema: sincroniza já */
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  return theme;
}
