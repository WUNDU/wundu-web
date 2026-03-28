"use client";

import { Input, Button, LoadingSpinner, LogoType } from "@/shared/components";
import {
  loginIllustration,
  errorIllustration,
  logoLogin,
} from "@/constants/images";
import { EmailIcon, SecurityIcon } from "@/constants/icons";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { useState, useEffect } from "react";
import { useRegisterContext } from "@/contexts/use-register-context";
import { useLoginForm } from "@/hooks/auth/use-login-form";

const LoginPage: React.FC = () => {
  const [hasError, setHasError] = useState(false);
  const { isAuthenticated, clearError } = useRegisterContext();

  // Clear global errors on mount
  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleErrorChange = (error: boolean) => {
    setHasError(error);
  };

  const {
    form,
    errors,
    setField,
    submit,
    contextError,
    isSubmitting,
    isLoading,
  } = useLoginForm(handleErrorChange);

  useEffect(() => {
    if (isAuthenticated) setHasError(false);
  }, [isAuthenticated]);

  return (
    <div className="flex min-h-screen flex-col bg-white md:bg-[#fafafa]">
      <header className="flex h-16 shrink-0 items-center justify-start px-8 md:justify-start md:px-12">
        <Link
          href={ROUTES.LANDINGPAGE}
          className="transition-opacity hover:opacity-80"
        >
          <div className="w-30">
            <LogoType />
          </div>
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-255">
          {/* Surface Container - Fixed height on desktop to prevent resizing */}
          <div className="flex w-full flex-col bg-white md:h-130 md:flex-row md:rounded-3xl md:border md:border-slate-200/50 md:shadow-[0_1px_2px_rgba(0,0,0,0.01),0_8px_16px_rgba(0,0,0,0.02)] overflow-hidden">
            {/* Visual Column */}
            <div className="hidden flex-1 items-center justify-center border-r border-slate-100/80 bg-[#f9f9f9]/50 p-12 lg:flex">
              <div className="relative">
                <Image
                  src={hasError ? errorIllustration : loginIllustration}
                  alt="Status"
                  className="h-64 w-64 transition-opacity duration-300"
                  priority
                />
              </div>
            </div>

            {/* Form Side - Vertical centering within fixed height */}
            <div className="flex flex-1 flex-col justify-center px-6 py-10 sm:px-12 md:px-14 lg:px-16">
              <header className="mb-6">
                <h1 className="text-2xl font-bold tracking-tighter text-slate-900 md:text-3xl">
                  Acesse sua conta
                </h1>
                <p className="mt-2 text-sm font-medium text-slate-500">
                  Gestão financeira de alta precisão.
                </p>
              </header>

              {isLoading || isSubmitting ? (
                <div className="flex h-80 flex-col items-center justify-center">
                  <LoadingSpinner size="md" message="A verificar..." />
                </div>
              ) : (
                <form onSubmit={submit} className="flex w-full flex-col">
                  <div className="flex flex-col gap-4">
                    <Input
                      id="email"
                      label="E-mail"
                      type="email"
                      leftIcon={<EmailIcon className="w-5 h-5" />}
                      value={form.email}
                      onChange={(e) => setField("email", e.target.value)}
                      placeholder="exemplo@email.com"
                      required
                      isError={!!errors.email || !!contextError}
                      className="h-11 border-slate-200 bg-slate-50/40 text-[14px] transition-all focus:border-slate-900 focus:bg-white"
                    />

                    <div className="space-y-1.5">
                      <Input
                        id="password"
                        label="Palavra-passe"
                        type="password"
                        leftIcon={<SecurityIcon className="w-5 h-5" />}
                        value={form.password}
                        onChange={(e) => setField("password", e.target.value)}
                        placeholder="Sua senha"
                        isError={!!errors.password || !!contextError}
                        required
                        className="h-11 border-slate-200 bg-slate-50/40 text-[14px] transition-all focus:border-slate-900 focus:bg-white"
                      />
                      <div className="flex justify-end">
                        <Link
                          href={ROUTES.RESET_PASSWORD}
                          className="text-xs font-bold text-slate-500 transition-colors hover:text-slate-900"
                        >
                          Esqueceu a senha?
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Reserved Space for Feedback - Prevents layout jump */}
                  <div className="min-h-17 py-3 flex items-center">
                    {(errors.password || contextError) && (
                      <div className="flex w-full items-center gap-3 rounded-lg border border-red-100 bg-red-50/30 p-3 animate-in fade-in slide-in-from-top-1">
                        <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                        <p className="text-xs font-bold text-red-600">
                          {errors.password || contextError}
                        </p>
                      </div>
                    )}
                  </div>

                  <Button
                    variant="warning"
                    type="submit"
                    fullWidth
                    className="h-11 rounded-xl text-sm font-extrabold shadow-sm transition-all active:scale-[0.98]"
                  >
                    Entrar no Wundu
                  </Button>

                  <footer className="mt-6 border-t border-slate-100 pt-6 text-center">
                    <p className="text-sm font-medium text-slate-500">
                      Novo por aqui?{" "}
                      <Link
                        href={ROUTES.REGISTER}
                        className="font-bold text-slate-900 decoration-yellow-400 decoration-2 underline-offset-4 hover:underline"
                      >
                        Crie uma conta
                      </Link>
                    </p>
                  </footer>
                </form>
              )}
            </div>
          </div>

          <footer className="mt-8 px-8 text-center">
            <p className="text-[10px] leading-relaxed text-slate-400 font-medium max-w-sm mx-auto">
              Ao acessar, você aceita nossos{" "}
              <Link
                href={ROUTES.LEGAL}
                className="text-slate-500 hover:text-slate-900 transition-colors underline underline-offset-2"
              >
                Termos
              </Link>{" "}
              e{" "}
              <Link
                href={ROUTES.LEGAL}
                className="text-slate-500 hover:text-slate-900 transition-colors underline underline-offset-2"
              >
                Privacidade
              </Link>
              .
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
