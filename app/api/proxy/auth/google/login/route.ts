import { NextRequest } from "next/server";
import { proxyAuthWithCookie } from "@/server/auth-proxy";

export async function POST(req: NextRequest) {
  return proxyAuthWithCookie(req, "/auth/google/login");
}
