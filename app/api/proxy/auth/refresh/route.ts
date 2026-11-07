import { NextRequest, NextResponse } from "next/server";
import { clearSessionCookies, setRefreshToken } from "@/server/auth-cookie";

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
      clearSessionCookies(res, req);
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
      // Última operação de cookies da resposta (inclui limpar o path legado "/").
      setRefreshToken(nextRes, req, value, maxAge);
    }
  }

  return nextRes;
}
