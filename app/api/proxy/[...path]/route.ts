import type { NextRequest } from "next/server";

const BACKEND = (process.env.BACKEND_API_BASE_URL ?? "").replace(/\/$/, "");
const TIMEOUT_MS = 30000;
const METHODS_WITH_BODY = new Set(["POST", "PUT", "PATCH"]);

/**
 * Proxy same-origin para o backend.
 *
 * O browser chama `/api/proxy/*` (mesma origem, sem preflight/CORS) e esta
 * rota reencaminha para o backend **sem** os headers `Origin`/`Referer` —
 * é o `Origin` da app web que o backend rejeita com 403 "Invalid CORS
 * request". Sem `Origin`, o pedido é tratado como não-browser e passa.
 */
async function proxy(request: NextRequest, path: string[]) {
  if (!BACKEND) {
    return Response.json(
      { message: "API do servidor não configurada." },
      { status: 500 },
    );
  }

  const target = `${BACKEND}/${path.map(encodeURIComponent).join("/")}${request.nextUrl.search}`;

  const headers = new Headers();
  const authorization = request.headers.get("authorization");
  if (authorization) headers.set("authorization", authorization);
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);
  const accept = request.headers.get("accept");
  if (accept) headers.set("accept", accept);

  const init: RequestInit = {
    method: request.method,
    headers,
    signal: AbortSignal.timeout(TIMEOUT_MS),
    redirect: "manual",
  };
  if (METHODS_WITH_BODY.has(request.method)) {
    const body = await request.arrayBuffer();
    if (body.byteLength > 0) init.body = body;
  }

  let upstream: Response;
  try {
    upstream = await fetch(target, init);
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "AbortError";
    return Response.json(
      {
        message: timedOut
          ? "O servidor demorou demasiado a responder."
          : "Não foi possível contactar o servidor.",
      },
      { status: 504 },
    );
  }

  const buffer = await upstream.arrayBuffer();
  const responseHeaders = new Headers();
  const upstreamContentType = upstream.headers.get("content-type");
  if (upstreamContentType)
    responseHeaders.set("content-type", upstreamContentType);
  return new Response(buffer, {
    status: upstream.status,
    headers: responseHeaders,
  });
}

type Context = { params: Promise<{ path: string[] }> };

async function handle(request: NextRequest, context: Context) {
  return proxy(request, (await context.params).path);
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
