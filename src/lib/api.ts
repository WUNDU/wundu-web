const API_BASE_URL = "/api/v1";

type RequestOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
};

async function request<T = any>(
  path: string,
  options: RequestOptions = {}
): Promise<{ data: T }> {
  const url = `${API_BASE_URL}${path}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token && !headers["Authorization"]) {
      headers["Authorization"] = token.startsWith("Bearer ")
        ? token
        : `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const text = await response.text();
  let data: any;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    const message =
      (data && (data as any).message) || response.statusText || "API error";
    throw new Error(message);
  }

  return { data };
}

const api = {
  get<T = any>(
    path: string,
    config?: {
      headers?: Record<string, string>;
    }
  ) {
    return request<T>(path, { method: "GET", headers: config?.headers });
  },
  post<T = any>(
    path: string,
    body?: any,
    config?: {
      headers?: Record<string, string>;
    }
  ) {
    return request<T>(path, {
      method: "POST",
      body,
      headers: config?.headers,
    });
  },
};

export default api;
