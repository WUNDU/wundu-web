import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BACKEND = process.env.BACKEND_API_BASE_URL ?? "";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const authHeader = req.headers.get("authorization") ?? "";

  let backendRes: Response;
  try {
    backendRes = await fetch(`${BACKEND}/chat/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
        Authorization: authHeader,
      },
      body,
    });
  } catch {
    return new Response(
      JSON.stringify({ message: "Não foi possível conectar ao assistente." }),
      { status: 502, headers: { "Content-Type": "application/json" } },
    );
  }

  if (!backendRes.ok || !backendRes.body) {
    const errorText = await backendRes.text().catch(() => "");
    return new Response(errorText || JSON.stringify({ message: "Erro do servidor." }), {
      status: backendRes.status,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(backendRes.body, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
