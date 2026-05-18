import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.BACKEND_API_BASE_URL ?? "";
const COOKIE_NAME = "refresh_token";
// Must match the path prefix for all auth proxy routes so the browser
// sends the cookie on /api/proxy/auth/refresh and /api/proxy/auth/logout
const COOKIE_PATH = "/api/proxy/auth";

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
      nextRes.cookies.set(COOKIE_NAME, value, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: COOKIE_PATH,
        maxAge: maxAge ?? 30 * 24 * 60 * 60,
      });
      // Session indicator for middleware (non-sensitive, broad path)
      nextRes.cookies.set("wundu_session", "1", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: maxAge ?? 30 * 24 * 60 * 60,
      });
    }
  }

  return nextRes;
}
