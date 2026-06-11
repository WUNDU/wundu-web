"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { LogoType } from "@/components/ui";
import { ROUTES } from "@/constants/routes";
import { useUserStore } from "@/store/user-store";
import { wunduToast } from "@/utils/toast";
import posthog from "posthog-js";

/**
 * Ponto de retorno do OAuth Google.
 *
 * NextAuth já autenticou o utilizador e expôs o `idToken` na sessão. Aqui
 * trocamos esse idToken por uma sessão Wundu: tentamos o login; se a conta não
 * existir (404), encaminhamos para o registo Google.
 */
export default function GoogleCallbackPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { loginWithGoogle } = useUserStore();
  const handled = useRef(false);

  useEffect(() => {
    if (status === "loading" || handled.current) return;

    if (status === "unauthenticated") {
      router.replace(ROUTES.LOGIN);
      return;
    }

    const idToken = session?.idToken;
    if (!idToken) {
      router.replace(ROUTES.LOGIN);
      return;
    }

    handled.current = true;

    (async () => {
      try {
        await loginWithGoogle(idToken);
        posthog.capture("user_signed_in", { method: "google" });
        if (session?.user?.email) {
          posthog.identify(session.user.email, { email: session.user.email });
        }
        router.replace(ROUTES.HOME);
      } catch (error: any) {
        const httpStatus = error?.status ?? error?.response?.status;
        if (httpStatus === 404) {
          // Conta inexistente → seguir para o registo com Google.
          router.replace(ROUTES.REGISTER_GOOGLE);
        } else {
          wunduToast.error(error?.message || "Não foi possível entrar com o Google.");
          router.replace(ROUTES.LOGIN);
        }
      }
    })();
  }, [status, session, loginWithGoogle, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-white md:bg-[#fafafa]">
      <div className="w-32">
        <LogoType />
      </div>
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-secondary" />
      <p className="text-sm font-medium text-slate-500">A concluir a entrada com o Google…</p>
    </div>
  );
}
