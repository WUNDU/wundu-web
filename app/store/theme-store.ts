import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeName = "light" | "dark";

const LEGACY_KEY = "wundu-theme";

interface ThemeStore {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  toggleTheme: () => void;
}

/**
 * Tema inicial (só corre no cliente):
 * 1. valor JSON já persistido (hidratação trata disso — aqui devolve-se light);
 * 2. migra a chave antiga ("dark"/"light" em texto) se existir;
 * 3. senão, respeita o sistema operativo.
 */
function initialTheme(): ThemeName {
  if (typeof window === "undefined") return "light";
  try {
    const legacy = window.localStorage.getItem(LEGACY_KEY);
    if (legacy === "dark" || legacy === "light") {
      window.localStorage.removeItem(LEGACY_KEY);
      return legacy;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  } catch {
    return "light";
  }
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: initialTheme(),
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set({ theme: get().theme === "dark" ? "light" : "dark" }),
    }),
    {
      /* Chave nova (JSON) para não colidir com a antiga em texto simples */
      name: "wundu-theme-store",
    },
  ),
);
