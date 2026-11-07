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

export async function POST(req: NextRequest) {
  const body = await req.json();

  const backendRes = await fetch(`${BACKEND}/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await backendRes.json().catch(() => ({}));
  const nextRes = NextResponse.json(data, { status: backendRes.status });

  // Re-set the refresh_token cookie with the frontend proxy path so the
  // browser includes it in subsequent /refresh and /logout calls.
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
