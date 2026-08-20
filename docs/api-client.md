# API Client — WEB

> [← Voltar ao índice](README.md) | [README principal](../README.md)

## 1. Base URL
```ts
// next.config.ts
const URL = process.env.BACKEND_API_BASE_URL; // ex: http://localhost:8080/api/v1 ou https://backend.wundu.tech/... (prod) / https://backend.test.wundu.tech/... (test)
rewrites: [{ source: "/api/proxy/:path*", destination: `${URL}/:path*` }]
```
Cliente usa `baseURL: "/api/proxy"` (proxy Next.js evita CORS e mantém cookie `refreshToken` httpOnly). Mobile/Backoffice usam directo.

## 2. Configuração do API Client
`src/api/api.ts`:
```ts
export const api = axios.create({
  baseURL: "/api/proxy",
  headers: { "Content-Type": "application/json", Accept: "application/json" },
  timeout: 30000,
  withCredentials: true,
});
export const apiClient = {
  get: <T>(p,c)=> api.get<T>(p,c),
  post: <T>(p,b,c)=> api.post<T>(p,b,c),
  put: <T>(p,b,c)=> api.put<T>(p,b,c),
  patch: <T>(p,b,c)=> api.patch<T>(p,b,c),
  delete: <T>(p,c)=> api.delete<T>(p,c),
};
```

## 3. Endpoints Utilizados
Base `/api/v1` (via proxy):

| Método | Endpoint | Uso |
|--------|----------|-----|
| `POST` | `/auth` | Login `{email,password}` |
| `POST` | `/auth/refresh` | Refresh via cookie |
| `POST` | `/auth/logout` | Logout |
| `POST` | `/auth/google/login` | Login Google `{idToken}` |
| `POST` | `/auth/google/register` | Registo Google |
| `GET` | `/users/me` | Perfil |
| `PUT` | `/users/me` | Update perfil básico |
| `PATCH` | `/users/me/profile` | Demografia (província, etc.) |
| `POST` | `/users/me/avatar` | Upload avatar `multipart` |
| `DELETE` | `/users/me/avatar` | Remover avatar |
| `GET` | `/transactions` | Listar paginado |
| `POST` | `/transactions` | Criar |
| `PUT` | `/transactions/:id` | Atualizar |
| `DELETE` | `/transactions/:id` | Apagar |
| `GET` | `/transactions/summary` | Resumo |
| `POST` | `/documents` | OCR upload `multipart` |
| `GET` | `/documents` | Listar docs |
| `GET` | `/documents/:id/result` | Resultado OCR |
| `GET` | `/categories` | Listar |
| `GET` | `/categories/active` | Ativas |
| `POST` | `/categories` | Criar |
| `GET` | `/goals` | Listar |
| `POST` | `/goals` | Criar |
| `PUT` | `/goals/:id` | Atualizar |
| `DELETE` | `/goals/:id` | Apagar |
| `POST` | `/goals/:id/progress` | Progresso |
| `GET` | `/user_category_limits` | Limites |
| `POST` | `/user_category_limits` | Criar limite |
| `POST` | `/chat/conversations` | SSE `start/token/done/error` |
| `GET` | `/chat/conversations` | Histórico |
| `GET` | `/chat/conversations/:id/messages` | Mensagens |
| `POST` | `/ai/query` | IA `{question}` → `{filter,transactions}` |
| `GET` | `/notifications` | Listar |
| `POST` | `/notifications/read` | Marcar lida |
| `GET` | `https://angolaprovinciasapi.ggwp.com.br/api/v1/provincias` | Províncias (externo, cache) |

## 4. Métodos HTTP
- `GET` lista/busca (idempotente), `POST` criação/ações (ex: `/ai/query`), `PUT` replace, `PATCH` parcial, `DELETE` remoção.

## 5. Headers
```http
Content-Type: application/json
Accept: application/json
Authorization: Bearer <accessToken>  # injetado via interceptor se window + token
Cookie: refreshToken=<httpOnly>       # enviado automático withCredentials
```

## 6. Authentication
Login → `{accessToken, expiresIn}` + `Set-Cookie: refreshToken` (rotativo, uso único, httpOnly). Google: valida `idToken` audience `GOOGLE_CLIENT_ID`. Refresh deduplicado (`refreshPromise` em `user-store.ts` + `isRefreshing`+`failedQueue` em `api.ts`). Logout: `POST /auth/logout` + `clearUserStores()` + `removeQueries`.

## 7. Request
```ts
// JSON
await apiClient.post("/transactions", { amount: 1000, category:{name:"Alimentação"}, source:"MANUAL" });
// multipart
const fd = new FormData(); fd.append("file", file); await apiClient.post("/documents", fd, { headers:{"Content-Type":"multipart/form-data"}});
// params
await apiClient.get("/transactions", { params:{page:0,size:20,type:"EXPENSE"}});
```

## 8. Response
```ts
// Sucesso paginado
{ content: TransactionResponse[], totalElements, totalPages, number, size, first, last }
// Sucesso simples
TransactionResponse | CategoryResponse | User
// SSE Chat
event: start  data: {"conversationId":"..."}
event: token  data: {"content":"..."}
event: done   data: {"conversationId":"..."}
event: error  data: {"message":"..."}
```

## 9. HTTP Status Codes
| Código | Significado | Ação WEB |
|--------|-------------|----------|
| `200` | OK | Usar `data` |
| `201` | Created | Invalidar query |
| `400` | Bad Request | Mostrar `message` |
| `401` | Unauthorized | Tentar refresh; se falha → logout ou `EMAIL_NOT_VERIFIED` |
| `403` | Forbidden | Toast “sem permissão” |
| `404` | Not Found | EmptyState |
| `422` | Validation | `errorCode` por campo |
| `429` | Rate limit | Usar `retryAfterSeconds` |
| `500` | Server | Fallback PT “Não foi possível conectar...” |

## 10. Tratamento de Erros
```ts
type ApiError = Error & { errorCode?: string; status?: number; retryAfterSeconds?: number };
const fallback = "Não foi possível conectar ao serviço agora. Tente novamente em instantes.";
const raw = error.response?.data?.message || error.message;
const msg = raw && raw!=="Internal Server Error" ? raw : fallback;
const err = new Error(msg) as ApiError; err.errorCode=...; err.status=...;
if (axios.isCancel(e) || e.name==="AbortError") return Promise.reject(e); // bypass
if (err.errorCode==="EMAIL_NOT_VERIFIED") {/* só card no perfil, sem redirect */ }
```

## 11. Loading States
- Query: `const { data, isLoading, isFetching, isError, error } = useQuery(...)` → `<Skeleton />` se `isLoading`, `EmptyState` se vazio.
- Mutation: `const { mutate, isPending } = useMutation(...)` → `<Button isLoading={isPending}>`
- Chat SSE: `isStreaming`, `streamingContent`, `isSending` → spinner + `Message` streaming.
- Global: `loading-context` para overlay.

## Próximos
[Arquitectura](arquitectura.md) | [Tratamento de Erros](../../docs/api-communication.md)
