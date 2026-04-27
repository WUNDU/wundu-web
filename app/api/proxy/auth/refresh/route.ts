import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.BACKEND_API_BASE_URL ?? "";
const COOKIE_NAME = "refresh_token";
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
  const token = req.cookies.get(COOKIE_NAME)?.value;

  const backendRes = await fetch(`${BACKEND}/auth/refresh`, {
    method: "POST",
    headers: token ? { Cookie: `${COOKIE_NAME}=${token}` } : {},
  });

  if (!backendRes.ok) {
    return NextResponse.json({}, { status: backendRes.status });
  }

  const data = await backendRes.json().catch(() => ({}));
  const nextRes = NextResponse.json(data, { status: 200 });

  // Rotate the refresh_token cookie (backend issues a new one on each refresh)
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
    }
  }

  return nextRes;
}
