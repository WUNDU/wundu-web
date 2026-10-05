"use client";

import { Monitor } from "lucide-react";
import { useSessions } from "@/hooks/use-sessions";

/** "Chrome · Windows" a partir do user-agent; fallback para texto truncado. */
function prettyDevice(userAgent: string): string {
  const lower = userAgent.toLowerCase();
  const os = lower.includes("windows")
    ? "Windows"
    : lower.includes("mac os")
      ? "macOS"
      : lower.includes("android")
        ? "Android"
        : lower.includes("iphone") || lower.includes("ipad")
          ? "iOS"
          : lower.includes("linux")
            ? "Linux"
            : null;
  const browser = lower.includes("edg")
    ? "Edge"
    : lower.includes("chrome")
      ? "Chrome"
      : lower.includes("safari")
        ? "Safari"
        : lower.includes("firefox")
          ? "Firefox"
          : null;
  const pretty = [browser, os].filter(Boolean).join(" · ");
  if (pretty) return pretty;
  return userAgent.length > 42 ? `${userAgent.slice(0, 42)}…` : userAgent;
}

function formatExpiry(iso: string): string {
  const date = new Date(iso);
  if (!Number.isFinite(date.getTime())) return "—";
  return date.toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function SessionsCard() {
  const { sessions, isLoading, revokingId, isRevokingAll, revokeSession, logoutAll } =
    useSessions();

  return (
    <section
      aria-labelledby="sessions-title"
      className="flex flex-col items-start justify-start gap-2 self-stretch rounded-2xl border border-(--card-barras) bg-(--bg-card) p-6"
    >
      <div className="flex items-start justify-between self-stretch">
        <div className="flex items-center justify-start gap-3">
          <Monitor
            width={16}
            height={16}
            aria-hidden="true"
            className="text-(--icon-hover-2)"
          />
          <h2
            id="sessions-title"
            className="font-manrope text-lg font-bold leading-7 text-(--text)"
          >
            Sessões
          </h2>
        </div>
        {sessions.length > 0 ? (
          <button
            type="button"
            onClick={() => void logoutAll()}
            disabled={isRevokingAll}
            className="rounded-lg px-4 py-2 font-manrope text-base font-semibold text-(--text-title) transition-all hover:bg-neutrals-300/10 active:scale-[0.98] disabled:cursor-wait disabled:opacity-60"
          >
            {isRevokingAll ? "A terminar…" : "Terminar todas"}
          </button>
        ) : null}
      </div>

      {isLoading && sessions.length === 0 ? (
        <div aria-label="A carregar sessões" className="flex flex-col self-stretch gap-3 py-2">
          {[0, 1].map((index) => (
            <div
              key={index}
              aria-hidden="true"
              className="h-16 animate-pulse rounded-xl bg-(--bg-filter)"
            />
          ))}
          <span className="sr-only">A carregar sessões…</span>
        </div>
      ) : sessions.length === 0 ? (
        <p className="font-manrope text-sm font-normal leading-5 text-(--text-description)">
          Nenhuma sessão activa.
        </p>
      ) : (
        <ul className="flex flex-col self-stretch">
          {sessions.map((session, index) => {
            const revoking = revokingId === session.id;
            return (
              <li
                key={session.id}
                className={`flex min-h-20 items-center justify-between gap-4 self-stretch py-4 ${
                  index < sessions.length - 1
                    ? "border-b border-(--card-barras)"
                    : ""
                }`}
              >
                <div className="flex min-w-0 flex-1 items-center justify-start gap-4">
                  <span
                    aria-hidden="true"
                    className="flex size-12 shrink-0 flex-col items-center justify-center rounded-xl bg-primary-300/10"
                  >
                    <Monitor width={20} height={20} className="text-(--icon)" />
                  </span>
                  <div className="flex w-64 min-w-0 flex-col items-start justify-start gap-1.5">
                    <p className="flex items-center justify-start gap-2">
                      <span className="truncate font-manrope text-base font-semibold text-(--text)">
                        {prettyDevice(session.userAgent)}
                      </span>
                      <span
                        aria-hidden="true"
                        className="size-1.5 shrink-0 rounded-full bg-primary-300"
                      />
                    </p>
                    <p className="flex items-center justify-start gap-2.5 self-stretch">
                      <span className="truncate font-manrope text-sm font-normal leading-5 text-(--text-description)">
                        {session.ipAddress}
                      </span>
                      <span
                        aria-hidden="true"
                        className="h-4 w-px shrink-0 bg-(--text-description)"
                      />
                      <span className="shrink-0 font-manrope text-sm font-normal leading-5 text-(--text-description)">
                        Expira {formatExpiry(session.expiresAt)}
                      </span>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => void revokeSession(session.id)}
                  disabled={revoking}
                  aria-label={`Terminar sessão ${prettyDevice(session.userAgent)} ${session.ipAddress}`}
                  className="flex shrink-0 items-center justify-center gap-2 rounded-lg bg-danger-300/10 px-4 py-2 transition-all hover:opacity-80 active:scale-[0.98] disabled:cursor-wait disabled:opacity-60"
                >
                  <span className="font-manrope text-sm font-bold leading-5 text-danger-300">
                    {revoking ? "A terminar…" : "Terminar"}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default SessionsCard;
