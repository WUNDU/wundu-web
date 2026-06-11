import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.BACKEND_API_BASE_URL ?? "";
const COOKIE_NAME = "refresh_token";
// Deve coincidir com o prefixo usado pelas rotas /auth/refresh e /auth/logout.
const COOKIE_PATH = "/";

function parseCookieValue(header: string, name: string): string | null {
  const match = header.match(new RegExp(`(?:^|,)\\s*${name}=([^;,]+)`));
  return match ? match[1].trim() : null;
}

function parseCookieMaxAge(header: string): number | null {
  const match = header.match(/max-age=(\d+)/i);
  return match ? Number(match[1]) : null;
}

/**
 * Reencaminha um POST de autenticação para o backend e re-emite o cookie
 * HttpOnly `refresh_token` (+ indicador `wundu_session`) na origem do proxy,
 * tal como a rota /api/proxy/auth. Usado pelos endpoints Google.
 */
export async function proxyAuthWithCookie(req: NextRequest, backendPath: string) {
  const body = await req.json().catch(() => ({}));

  const backendRes = await fetch(`${BACKEND}${backendPath}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await backendRes.json().catch(() => ({}));
  const nextRes = NextResponse.json(data, { status: backendRes.status });

  const setCookie = backendRes.headers.get("set-cookie");
  if (setCookie) {
    const value = parseCookieValue(setCookie, COOKIE_NAME);
    const maxAge = parseCookieMaxAge(setCookie);
    if (value) {
      nextRes.cookies.set(COOKIE_NAME, value, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: COOKIE_PATH,
        maxAge: maxAge ?? 30 * 24 * 60 * 60,
      });
      nextRes.cookies.set("wundu_session", "1", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: maxAge ?? 30 * 24 * 60 * 60,
      });
    }
  }

  return nextRes;
}
