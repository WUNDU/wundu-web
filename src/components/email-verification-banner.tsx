"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/user-store";
import { ROUTES } from "@/constants/routes";

const DISMISS_KEY = "wundu_verify_banner_dismissed";

export default function EmailVerificationBanner() {
  const { user } = useUserStore();
  const router = useRouter();
  const [dismissed, setDismissed] = useState(true); // start hidden to avoid flash

  useEffect(() => {
    if (typeof window !== "undefined") {
      const wasDismissed = sessionStorage.getItem(DISMISS_KEY) === "1";
      setDismissed(wasDismissed);
    }
  }, []);

  if (!user || user.isActive || dismissed) return null;

  const handleDismiss = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(DISMISS_KEY, "1");
    }
    setDismissed(true);
  };

  return (
    <div className="sticky top-0 z-50 flex items-center justify-between gap-3 bg-amber-400 px-4 py-2 text-amber-950">
      <div className="flex items-center gap-2 text-sm font-medium">
        {/* Warning envelope icon */}
        <svg
          className="h-4 w-4 shrink-0"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M2.94 6.412A2 2 0 0 0 2 8.236V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.236a2 2 0 0 0-.94-1.714l-6-3.75a2 2 0 0 0-2.12 0l-6 3.75ZM10 11a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm0 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
        </svg>
        <span>
          O teu email não está verificado.{" "}
          <button
            onClick={() => router.push(ROUTES.VERIFY_PENDING)}
            className="font-bold underline underline-offset-2 hover:no-underline"
          >
            Reenviar verificação
          </button>
        </span>
      </div>
      <button
        onClick={handleDismiss}
        aria-label="Fechar aviso"
        className="shrink-0 rounded p-0.5 transition-colors hover:bg-amber-500/30"
      >
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 0 1 1.414 0L10 8.586l4.293-4.293a1 1 0 1 1 1.414 1.414L11.414 10l4.293 4.293a1 1 0 0 1-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 0 1-1.414-1.414L8.586 10 4.293 5.707a1 1 0 0 1 0-1.414Z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}
