import { NextRequest, NextResponse } from "next/server";
import { setRefreshToken } from "@/server/auth-cookie";

const BACKEND = process.env.BACKEND_API_BASE_URL ?? "";
const COOKIE_NAME = "refresh_token";

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
      // Última operação de cookies da resposta (inclui limpar o path legado "/").
      setRefreshToken(nextRes, req, value, maxAge);
    }
  }

  return nextRes;
}
