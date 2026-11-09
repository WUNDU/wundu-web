import type { NextRequest, NextResponse } from "next/server";

/**
 * Cookies de sessão emitidos pelas rotas de auth do proxy Next.
 *
 * `refresh_token` — segredo (rotativo, uso único), HttpOnly para o JS não o
 * poder ler. `wundu_session` — flag sem segredo, só para o `proxy.ts`
 * redirecionar; nunca dá acesso a nada por si só.
 *
 * O accessToken NUNCA passa por aqui: vem no corpo JSON do login/refresh e
 * vive apenas em memória no store (ver `user-store.ts`).
 */

const REFRESH_COOKIE_NAME = "refresh_token";
const SESSION_COOKIE_NAME = "wundu_session";

/**
 * Path mínimo onde o browser precisa de enviar o refresh token — todas as
 * rotas que o consomem estão neste prefixo (`/auth`, `/auth/refresh`,
 * `/auth/logout`, `/auth/google/*`).
 *
 * Com `Path=/` o token era anexado a TODO pedido same-origin (página,
 * imagens, proxy `/ingest` do PostHog), ampliando onde podia aparecer em
 * logs ou num endpoint comprometido que os registe.
 */
const REFRESH_COOKIE_PATH = "/api/proxy/auth";

/** O proxy lê `wundu_session` em `/home/*`, `/login`, `/register`, … */
const SESSION_COOKIE_PATH = "/";

/** 30 dias — usado quando o backend não envia `Max-Age`. */
const DEFAULT_MAX_AGE = 30 * 24 * 60 * 60;

/**
 * Path antigo do `refresh_token` (versões anteriores usavam `/`). Tem de ser
 * apagado, senão ficam dois cookies com o mesmo nome e o mais antigo pode
 * ganhar a desempate no envio.
 */
const LEGACY_REFRESH_COOKIE_PATH = "/";

/**
 * `Secure` sempre em produção e sempre que o pedido chega por HTTPS
 * (directamente ou via `X-Forwarded-Proto` de um proxy TLS). Só acrescenta,
 * nunca remove: se o NODE_ENV estiver mal configurado num deploy HTTPS, o
 * cookie continua a ser marcado como seguro.
 */
function isSecure(req: NextRequest): boolean {
  if (process.env.NODE_ENV === "production") return true;
  const forwarded = req.headers.get("x-forwarded-proto");
  if (forwarded) return forwarded.split(",")[0].trim() === "https";
  return req.nextUrl.protocol === "https:";
}

function commonAttrs(req: NextRequest) {
  return {
    httpOnly: true,
    secure: isSecure(req),
    sameSite: "lax" as const,
  };
}

/**
 * Grava `refresh_token` (com o valor e o Max-Age que o backend indicar) e
 * `wundu_session` depois de um login/refresh/Google bem-sucedido, e limpa a
 * entrada legada em `Path=/`.
 *
 * A ordem interna não é opcional: `ResponseCookies` do Next indexa por **nome**
 * e de cada vez que é chamado reescreve todos os headers `set-cookie`. Por isso
 * a limpeza legada é um header cru emitido POR ÚLTIMO — chamá-la antes de
 * qualquer `cookies.set()` faz-a desaparecer.
 */
export function setRefreshToken(
  res: NextResponse,
  req: NextRequest,
  value: string,
  maxAge?: number | null,
): void {
  res.cookies.set(REFRESH_COOKIE_NAME, value, {
    ...commonAttrs(req),
    path: REFRESH_COOKIE_PATH,
    maxAge: maxAge ?? DEFAULT_MAX_AGE,
  });
  res.cookies.set(SESSION_COOKIE_NAME, "1", {
    ...commonAttrs(req),
    path: SESSION_COOKIE_PATH,
    maxAge: maxAge ?? DEFAULT_MAX_AGE,
  });
  clearLegacyRefreshCookie(res, req);
}

/** Apaga os dois cookies de sessão (logout ou refresh recusado). */
export function clearSessionCookies(res: NextResponse, req: NextRequest): void {
  res.cookies.set(SESSION_COOKIE_NAME, "", {
    ...commonAttrs(req),
    path: SESSION_COOKIE_PATH,
    maxAge: 0,
  });
  res.cookies.set(REFRESH_COOKIE_NAME, "", {
    ...commonAttrs(req),
    path: REFRESH_COOKIE_PATH,
    maxAge: 0,
  });
  clearLegacyRefreshCookie(res, req);
}

/**
 * Emite a limpeza do path legado como header **cru**, por último.
 *
 * Não dá para usar `cookies.set()` duas vezes com paths diferentes (o mapa é
 * indexado só pelo nome, a segunda chamada substituiria a primeira), e tem de
 * ser a última operação de cookies: cada `cookies.set()` reescreve todos os
 * headers `set-cookie` da resposta.
 */
function clearLegacyRefreshCookie(res: NextResponse, req: NextRequest): void {
  const secure = isSecure(req) ? "; Secure" : "";
  res.headers.append(
    "set-cookie",
    `${REFRESH_COOKIE_NAME}=; Path=${LEGACY_REFRESH_COOKIE_PATH}; Max-Age=0; HttpOnly; SameSite=Lax${secure}`,
  );
}
