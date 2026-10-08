"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { capturePageview } from "@/lib/analytics";

// Regista acessos ($pageview) em navegações client-side do App Router.
// O autocapture do PostHog só cobre o load inicial; sem isto as transições
// /login → /home, /home/transactions, etc. nunca aparecem como acessos.
// Funciona SEMPRE — o consentimento controla só a gravação de sessão.
export function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;
    const query = searchParams?.size ? `?${searchParams.toString()}` : "";
    // URL completa — o PostHog espera $current_url com origem para filtros/breakdowns.
    const url = `${window.location.origin}${pathname}${query}`;
    capturePageview({ $current_url: url });
  }, [pathname, searchParams]);

  return null;
}
