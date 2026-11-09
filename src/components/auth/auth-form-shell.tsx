"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { DsIconButton } from "./ds";

export function AuthFormShell({
  backTo,
  onBack,
  stepLabel = "",
  children,
}: {
  backTo?: string;
  onBack?: () => void;
  stepLabel?: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const goBack = onBack ?? (backTo ? () => router.push(backTo) : undefined);

  return (
    <div className="wa-formcol">
      <div
        style={{
          height: 56,
          flex: "0 0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        {goBack ? (
          <DsIconButton onClick={goBack} label="Voltar" />
        ) : (
          <Image
            src="/assets/logotype.svg"
            alt="Wundu"
            width={103}
            height={34}
            style={{ height: 34, width: "auto" }}
            priority
          />
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            style={{
              fontSize: 13,
              color: "var(--text-tertiary)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {stepLabel}
          </span>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          margin: "0 -4px",
          padding: "0 4px",
        }}
      >
        <div
          style={{
            margin: "auto 0",
            padding: "28px 0",
            width: "100%",
            maxWidth: 400,
            alignSelf: "center",
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          {children}
        </div>
      </div>

      <div
        style={{
          flex: "0 0 auto",
          paddingTop: 12,
          fontSize: 12,
          color: "var(--text-tertiary)",
          textAlign: "center",
        }}
      >
        © 2026 Wundu · Versão 2.0
      </div>
    </div>
  );
}

export function AuthRoot({ children }: { children: ReactNode }) {
  return <div className="wundu-auth wa-authroot">{children}</div>;
}
