import { NextRequest, NextResponse } from "next/server";
import { clearSessionCookies } from "@/server/auth-cookie";

const BACKEND = process.env.BACKEND_API_BASE_URL ?? "";
const COOKIE_NAME = "refresh_token";

export async function POST(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;

  const headers: Record<string, string> = {};
  if (token) headers["Cookie"] = `${COOKIE_NAME}=${token}`;
  const auth = req.headers.get("authorization");
  if (auth) headers["Authorization"] = auth;

  // Fire and forget — backend revokes the token; we clear the cookie regardless
  await fetch(`${BACKEND}/auth/logout`, { method: "POST", headers }).catch(() => {});

  const nextRes = NextResponse.json({}, { status: 200 });

  // Clear refresh_token (path actual + legado) and the session indicator —
  // última operação de cookies da resposta.
  clearSessionCookies(nextRes, req);

  return nextRes;
}
