"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/** Texto apresentado no lugar dos valores monetários ocultos. */
export const MASKED_VALUE = "••••••";

type ValuesVisibility = {
  /** true quando os valores monetários estão ocultos. */
  hidden: boolean;
  setHidden: (hidden: boolean) => void;
  toggle: () => void;
  /** Devolve o valor mascarado enquanto os valores estiverem ocultos. */
  mask: (value: string) => string;
};

const ValuesVisibilityContext = createContext<ValuesVisibility>({
  hidden: false,
  setHidden: () => {},
  toggle: () => {},
  mask: (value) => value,
});

/**
 * Estado partilhado do "olho" do dashboard: permite ocultar os valores
 * monetários (modo de privacidade) em todos os cards do dashboard.
 */
export function ValuesVisibilityProvider({ children }: { children: ReactNode }) {
  const [hidden, setHidden] = useState(false);

  const toggle = useCallback(() => setHidden((value) => !value), []);
  const mask = useCallback(
    (value: string) => (hidden ? MASKED_VALUE : value),
    [hidden],
  );

  const value = useMemo(
    () => ({ hidden, setHidden, toggle, mask }),
    [hidden, toggle, mask],
  );

  return (
    <ValuesVisibilityContext.Provider value={value}>
      {children}
    </ValuesVisibilityContext.Provider>
  );
}

export function useValuesVisibility() {
  return useContext(ValuesVisibilityContext);
}
