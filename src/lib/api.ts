const API_BASE_URL = "/api/proxy";

type RequestOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  skipAuth?: boolean;
};

const isFormData = (body: unknown): body is FormData => {
  return typeof FormData !== "undefined" && body instanceof FormData;
};

async function request<T = any>(
  path: string,
  options: RequestOptions = {}
): Promise<{ data: T }> {
  const url = `${API_BASE_URL}${path}`;
  const isMultipartBody = isFormData(options.body);

  const headers: Record<string, string> = {
    ...(isMultipartBody ? {} : { "Content-Type": "application/json" }),
    ...(options.headers || {}),
  };

  if (typeof window !== "undefined" && !options.skipAuth) {
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
    body: isMultipartBody
      ? options.body
      : options.body !== undefined
        ? JSON.stringify(options.body)
        : undefined,
  });

  const text = await response.text();
  let data: any;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    const fallbackMessage =
      "Não foi possível conectar ao serviço agora. Tente novamente em instantes.";
    const rawMessage = (data && (data as any).message) || response.statusText;
    const message =
      rawMessage && rawMessage !== "Internal Server Error"
        ? rawMessage
        : fallbackMessage;
    throw new Error(message);
  }

  return { data };
}

const api = {
  get<T = any>(
    path: string,
    config?: {
      headers?: Record<string, string>;
      skipAuth?: boolean;
    }
  ) {
    return request<T>(path, {
      method: "GET",
      headers: config?.headers,
      skipAuth: config?.skipAuth,
    });
  },
  post<T = any>(
    path: string,
    body?: any,
    config?: {
      headers?: Record<string, string>;
      skipAuth?: boolean;
    }
  ) {
    return request<T>(path, {
      method: "POST",
      body,
      headers: config?.headers,
      skipAuth: config?.skipAuth,
    });
  },
  put<T = any>(
    path: string,
    body?: any,
    config?: {
      headers?: Record<string, string>;
      skipAuth?: boolean;
    }
  ) {
    return request<T>(path, {
      method: "PUT",
      body,
      headers: config?.headers,
      skipAuth: config?.skipAuth,
    });
  },
  patch<T = any>(
    path: string,
    body?: any,
    config?: {
      headers?: Record<string, string>;
      skipAuth?: boolean;
    }
  ) {
    return request<T>(path, {
      method: "PATCH",
      body,
      headers: config?.headers,
      skipAuth: config?.skipAuth,
    });
  },
};

export default api;
