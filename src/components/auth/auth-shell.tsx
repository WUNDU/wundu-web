import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { LogoType } from "@/components/ui";
import { ROUTES } from "@/constants/routes";

export interface AuthVisual {
  title: string;
  description: string;
  illustration: StaticImageData;
  illustrationAlt: string;
}

interface AuthShellProps {
  visual?: AuthVisual;
  footer?: ReactNode;
  maxWidthClass?: string;
  children: ReactNode;
}

/**
 * Moldura partilhada das telas de autenticação (login, registo, recuperar
 * senha): cabeçalho de marca + cartão central com coluna de formulário e,
 * em ecrãs largos, painel visual no tom dos cartões do dashboard.
 */
export function AuthShell({
  visual,
  footer,
  maxWidthClass = "max-w-255",
  children,
}: AuthShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-(--bg-card) md:bg-(--bg-body)">
      {/* Brand Header */}
      <header className="flex h-16 shrink-0 items-center justify-start px-8 md:px-12">
        <Link
          href={ROUTES.LANDINGPAGE}
          className="transition-opacity hover:opacity-80"
        >
          <div className="w-32">
            <LogoType />
          </div>
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center p-4 md:p-8">
        <div className={`w-full ${maxWidthClass}`}>
          <div className="flex w-full flex-col overflow-hidden bg-(--bg-card) md:flex-row md:rounded-3xl md:border md:border-(--card-barras) md:shadow-[0_1px_2px_rgba(0,0,0,0.01),0_8px_16px_rgba(0,0,0,0.02)]">
            {/* Visual Column */}
            {visual ? (
              <div className="hidden flex-1 flex-col justify-center gap-8 border-r border-(--card-barras)/80 bg-(--bg-filter) p-12 lg:flex">
                <Image
                  src={visual.illustration}
                  alt={visual.illustrationAlt}
                  width={224}
                  height={224}
                  className="mx-auto"
                  priority
                />
                <div>
                  <h2 className="font-manrope text-xl font-bold tracking-tight text-(--text-title)">
                    {visual.title}
                  </h2>
                  <p className="mt-2 font-manrope text-sm font-medium text-(--text-description)">
                    {visual.description}
                  </p>
                </div>
              </div>
            ) : null}

            {/* Form Side */}
            <div className="flex flex-1 flex-col justify-center px-8 py-10 sm:px-12 md:px-14 lg:px-16">
              {children}
            </div>
          </div>

          {footer}
        </div>
      </main>
    </div>
  );
}
