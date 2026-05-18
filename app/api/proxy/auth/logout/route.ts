import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.BACKEND_API_BASE_URL ?? "";
const COOKIE_NAME = "refresh_token";
const COOKIE_PATH = "/api/proxy/auth";

export async function POST(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;

  const headers: Record<string, string> = {};
  if (token) headers["Cookie"] = `${COOKIE_NAME}=${token}`;
  const auth = req.headers.get("authorization");
  if (auth) headers["Authorization"] = auth;

  // Fire and forget — backend revokes the token; we clear the cookie regardless
  await fetch(`${BACKEND}/auth/logout`, { method: "POST", headers }).catch(() => {});

  const nextRes = NextResponse.json({}, { status: 200 });

  // Clear the refresh_token cookie on the frontend
  nextRes.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: COOKIE_PATH,
    maxAge: 0,
  });

  // Clear session indicator
  nextRes.cookies.set("wundu_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });

  return nextRes;
}
