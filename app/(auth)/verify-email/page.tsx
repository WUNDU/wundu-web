"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { LogoType, Button, LoadingSpinner } from "@/components/ui";
import { ROUTES } from "@/constants/routes";
import { emailVerificationService } from "@/services/email-verification.service";
import { useUserStore } from "@/store/user-store";
import {
  buildVerifyPendingUrl,
  clearPendingVerificationContext,
  getPendingVerificationEmail,
} from "@/utils/pending-verification";

type VerifyState =
  | { status: "loading" }
  | { status: "success" }
  | { status: "expired" }
  | { status: "already-used" }
  | { status: "invalid" };

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { token: authToken, checkAuthStatus } = useUserStore();
  const token = searchParams.get("token");

  const [state, setState] = useState<VerifyState>({ status: "loading" });

  useEffect(() => {
    if (!token) {
      setState({ status: "invalid" });
      return;
    }

    emailVerificationService
      .verifyEmail(token)
      .then(async () => {
        clearPendingVerificationContext();
        if (authToken) {
          await checkAuthStatus();
        }
        setState({ status: "success" });
      })
      .catch((err: any) => {
        const code: string | undefined = err?.errorCode;
        if (code === "TOKEN_EXPIRED") {
          setState({ status: "expired" });
        } else if (code === "TOKEN_ALREADY_USED") {
          setState({ status: "already-used" });
        } else {
          setState({ status: "invalid" });
        }
      });
  }, [authToken, checkAuthStatus, token]);

  const pendingEmail = getPendingVerificationEmail();
  const requestNewUrl = pendingEmail ? buildVerifyPendingUrl(pendingEmail) : ROUTES.LOGIN;

  return (
    <div className="flex min-h-screen flex-col bg-white md:bg-[#fafafa]">
      <header className="flex h-16 shrink-0 items-center justify-start px-8 md:px-12">
        <Link href={ROUTES.LANDINGPAGE} className="transition-opacity hover:opacity-80">
          <div className="w-30">
            <LogoType />
          </div>
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-255">
          <div className="flex w-full flex-col bg-white md:h-130 md:flex-row md:rounded-3xl md:border md:border-slate-200/50 md:shadow-[0_1px_2px_rgba(0,0,0,0.01),0_8px_16px_rgba(0,0,0,0.02)] overflow-hidden">

            {/* Visual column */}
            <div className="hidden flex-1 items-center justify-center border-r border-slate-100/80 bg-[#f9f9f9]/50 p-12 lg:flex">
              <StateIllustration status={state.status} />
            </div>

            {/* Content side */}
            <div className="flex flex-1 flex-col justify-center px-6 py-10 sm:px-12 md:px-14 lg:px-16">
              <StateContent
                status={state.status}
                onLogin={() => router.push(ROUTES.LOGIN)}
                onRequestNew={() => router.push(requestNewUrl)}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// ── Illustrations ──────────────────────────────────────────────────────────────

function StateIllustration({ status }: { status: VerifyState["status"] }) {
  if (status === "loading") {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-slate-100/60">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            className="h-14 w-14 rounded-full border-4 border-slate-200 border-t-secondary"
          />
        </div>
        <p className="text-sm font-medium text-slate-400">A verificar...</p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-4">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex h-28 w-28 items-center justify-center rounded-full bg-emerald-50"
        >
          <motion.svg
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="h-14 w-14 text-emerald-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <motion.path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            />
          </motion.svg>
        </motion.div>
        <p className="text-sm font-semibold text-emerald-600">Verificação concluída</p>
      </div>
    );
  }

  if (status === "expired") {
    return (
      <div className="flex flex-col items-center gap-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.35 }}
          className="flex h-28 w-28 items-center justify-center rounded-full bg-orange-50"
        >
          <svg className="h-14 w-14 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
        </motion.div>
        <p className="text-sm font-semibold text-orange-500">Link expirado</p>
      </div>
    );
  }

  if (status === "already-used") {
    return (
      <div className="flex flex-col items-center gap-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.35 }}
          className="flex h-28 w-28 items-center justify-center rounded-full bg-blue-50"
        >
          <svg className="h-14 w-14 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
          </svg>
        </motion.div>
        <p className="text-sm font-semibold text-secondary">Já verificado</p>
      </div>
    );
  }

  // invalid
  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.35 }}
        className="flex h-28 w-28 items-center justify-center rounded-full bg-red-50"
      >
        <svg className="h-14 w-14 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      </motion.div>
      <p className="text-sm font-semibold text-red-500">Link inválido</p>
    </div>
  );
}

// ── Content panels ─────────────────────────────────────────────────────────────

function StateContent({
  status,
  onLogin,
  onRequestNew,
}: {
  status: VerifyState["status"];
  onLogin: () => void;
  onRequestNew: () => void;
}) {
  if (status === "loading") {
    return (
      <div className="flex flex-col items-center gap-6 py-8 text-center lg:items-start lg:text-left">
        <LoadingSpinner size="md" message="" />
        <div>
          <h1 className="text-2xl font-bold tracking-tighter text-slate-900 md:text-3xl">
            A verificar o teu email...
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            Aguarda um momento, estamos a processar o teu link.
          </p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-6"
      >
        <header>
          <h1 className="text-2xl font-bold tracking-tighter text-slate-900 md:text-3xl">
            Email verificado com sucesso!
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            A tua conta está agora activa. Podes entrar e começar a usar o Wundu.
          </p>
        </header>
        <Button
          variant="warning"
          fullWidth
          onClick={onLogin}
          className="h-11 rounded-xl text-sm font-extrabold shadow-sm transition-all active:scale-[0.98]"
        >
          Ir para login
        </Button>
      </motion.div>
    );
  }

  if (status === "expired") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-6"
      >
        <header>
          <h1 className="text-2xl font-bold tracking-tighter text-slate-900 md:text-3xl">
            O link de verificação expirou.
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            Os links de verificação são válidos por 24 horas. Pede um novo link para continuar.
          </p>
        </header>
        <div className="flex flex-col gap-3">
          <Button
            variant="warning"
            fullWidth
            onClick={onRequestNew}
            className="h-11 rounded-xl text-sm font-extrabold shadow-sm transition-all active:scale-[0.98]"
          >
            Pedir novo link
          </Button>
          <Button
            variant="secondary"
            fullWidth
            onClick={onLogin}
            className="h-11 rounded-xl text-sm font-semibold"
          >
            Voltar ao login
          </Button>
        </div>
      </motion.div>
    );
  }

  if (status === "already-used") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-6"
      >
        <header>
          <h1 className="text-2xl font-bold tracking-tighter text-slate-900 md:text-3xl">
            O teu email já foi verificado.
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            A tua conta já estava activa. Podes entrar directamente.
          </p>
        </header>
        <Button
          variant="warning"
          fullWidth
          onClick={onLogin}
          className="h-11 rounded-xl text-sm font-extrabold shadow-sm transition-all active:scale-[0.98]"
        >
          Ir para login
        </Button>
      </motion.div>
    );
  }

  // invalid
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6"
    >
      <header>
        <h1 className="text-2xl font-bold tracking-tighter text-slate-900 md:text-3xl">
          Link inválido.
        </h1>
        <p className="mt-2 text-sm font-medium text-slate-500">
          O link que seguiste não é válido ou foi corrompido. Pede um novo link de verificação.
        </p>
      </header>
      <div className="flex flex-col gap-3">
        <Button
          variant="warning"
          fullWidth
          onClick={onRequestNew}
          className="h-11 rounded-xl text-sm font-extrabold shadow-sm transition-all active:scale-[0.98]"
        >
          Pedir novo link
        </Button>
        <Button
          variant="secondary"
          fullWidth
          onClick={onLogin}
          className="h-11 rounded-xl text-sm font-semibold"
        >
          Voltar ao login
        </Button>
      </div>
    </motion.div>
  );
}

// ── Page export (Suspense boundary required for useSearchParams in Next 14) ────

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <LoadingSpinner size="lg" message="A verificar o teu email..." />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
