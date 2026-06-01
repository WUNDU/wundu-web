import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.BACKEND_API_BASE_URL ?? "";
const COOKIE_NAME = "refresh_token";
const COOKIE_PATH = "/";

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

  if (!token) {
    return NextResponse.json({ message: "No refresh token" }, { status: 401 });
  }

  const backendRes = await fetch(`${BACKEND}/auth/refresh`, {
    method: "POST",
    headers: token ? { Cookie: `${COOKIE_NAME}=${token}` } : {},
  });

  if (!backendRes.ok) {
    const res = NextResponse.json(
      { message: "Refresh failed" },
      { status: backendRes.status }
    );

    // If session is invalid at backend, clear it on frontend too
    if (backendRes.status === 401 || backendRes.status === 403) {
      res.cookies.set(COOKIE_NAME, "", { path: COOKIE_PATH, maxAge: 0 });
      res.cookies.set("wundu_session", "", { path: "/", maxAge: 0 });
    }

    return res;
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
        sameSite: "lax",
        path: COOKIE_PATH,
        maxAge: maxAge ?? 30 * 24 * 60 * 60,
      });
      // Rotate session indicator too
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
