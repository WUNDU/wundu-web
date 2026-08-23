"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { LogoType, Button } from "@/components/ui";
import { ROUTES } from "@/constants/routes";
import { useUserStore } from "@/store/user-store";
import { wunduToast } from "@/utils/toast";
import { identifyUser, captureEvent } from "@/lib/analytics";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

/**
 * Conclusão do registo via Google.
 *
 * O utilizador chega aqui quando o login Google devolveu 404 (conta ainda não
 * existe). O backend extrai tudo do idToken, por isso basta uma confirmação —
 * não há formulário adicional.
 */
export default function GoogleRegisterPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { registerWithGoogle } = useUserStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sem sessão Google → recomeçar pelo login.
  useEffect(() => {
    if (status === "unauthenticated") router.replace(ROUTES.LOGIN);
  }, [status, router]);

  const handleCreate = async () => {
    const idToken = session?.idToken;
    if (!idToken) {
      // Sessão Google expirou — reiniciar o fluxo OAuth.
      signIn("google", { callbackUrl: ROUTES.REGISTER_GOOGLE });
      return;
    }
    setIsSubmitting(true);
    try {
      await registerWithGoogle(idToken);
      const user = useUserStore.getState().user;
      if (user) {
        identifyUser(user.id, { email: user.email, name: user.name });
      }
      captureEvent("user_registered", { method: "google", email: session?.user?.email });
      wunduToast.success("Conta criada com sucesso!", {
        description: "Bem-vindo à Wundu.",
      });
      router.replace(ROUTES.HOME);
    } catch (error: any) {
      const httpStatus = error?.status ?? error?.response?.status;
      if (httpStatus === 409) {
        wunduToast.error("Esta conta já existe. Entra com o Google.");
        router.replace(ROUTES.LOGIN);
      } else {
        wunduToast.error(error?.message || "Não foi possível criar a conta. Tente novamente.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white md:bg-[#fafafa]">
      <header className="flex h-16 shrink-0 items-center justify-start px-8 md:px-12">
        <Link href={ROUTES.LANDINGPAGE} className="transition-opacity hover:opacity-80">
          <div className="w-32">
            <LogoType />
          </div>
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-110"
        >
          <div className="flex w-full flex-col bg-white px-8 py-10 sm:px-12 md:rounded-3xl md:border md:border-slate-200/50 md:px-14 md:shadow-[0_1px_2px_rgba(0,0,0,0.01),0_8px_16px_rgba(0,0,0,0.02)]">
            <header className="mb-8">
              <h1 className="text-2xl font-bold tracking-tighter text-slate-900 md:text-3xl">
                Quase lá
              </h1>
              <p className="mt-2 text-sm font-medium leading-relaxed text-slate-500">
                Reconhecemos a tua conta Google. Confirma para criares a tua conta Wundu.
              </p>
            </header>

            {/* Cartão da conta Google */}
            {session?.user && (
              <div className="mb-6 flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-slate-50/50 px-5 py-4">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || ""}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-500">
                    {(session.user.name || session.user.email || "?").charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-900">{session.user.name}</p>
                  <p className="truncate text-xs text-slate-500">{session.user.email}</p>
                </div>
                <GoogleIcon className="ml-auto h-5 w-5 shrink-0" />
              </div>
            )}

            <Button
              variant="warning"
              fullWidth
              loading={isSubmitting}
              disabled={isSubmitting || status === "loading"}
              onClick={handleCreate}
              className="h-12 rounded-xl text-sm font-extrabold shadow-sm transition-all active:scale-[0.98]"
            >
              {isSubmitting ? "A criar conta..." : "Criar conta com Google"}
            </Button>

            <footer className="mt-8 border-t border-slate-100 pt-6 text-center">
              <p className="text-sm font-medium text-slate-500">
                Já tens conta?{" "}
                <Link
                  href={ROUTES.LOGIN}
                  className="font-bold text-slate-900 decoration-yellow-400 decoration-2 underline-offset-4 hover:underline"
                >
                  Entrar
                </Link>
              </p>
            </footer>
          </div>

          <footer className="mt-8 px-8 text-center">
            <p className="mx-auto max-w-sm text-[10px] font-medium leading-relaxed text-slate-400">
              Ao criar conta, aceitas os nossos{" "}
              <Link href={ROUTES.LEGAL} className="underline underline-offset-2 hover:text-slate-600">
                Termos
              </Link>{" "}
              e{" "}
              <Link href={ROUTES.LEGAL} className="underline underline-offset-2 hover:text-slate-600">
                Privacidade
              </Link>
              .
            </p>
          </footer>
        </motion.div>
      </main>
    </div>
  );
}
