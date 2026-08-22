const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

export type ApiResponse<T> = {
  success: boolean;
  statusCode?: number;
  message: string;
  data: T;
};

export type BackendErrorPayload = {
  success?: boolean;
  message?: string;
  errors?: unknown[];
};

export class ApiError extends Error {
  status: number;
  payload: BackendErrorPayload | null;

  constructor(status: number, message: string, payload: BackendErrorPayload | null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  retryOnUnauthorized?: boolean;
};

async function parseJson<T>(response: Response): Promise<T | null> {
  const text = await response.text();

  if (!text) {
    return null;
  }

  return JSON.parse(text) as T;
}

async function refreshAccessToken(): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.ok;
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { retryOnUnauthorized = true, ...fetchOptions } = options;
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    },
    body:
      options.body !== undefined
        ? JSON.stringify(options.body)
        : undefined,
  });

  if (response.status === 401 && retryOnUnauthorized) {
    const refreshed = await refreshAccessToken();

    if (refreshed) {
      return request<T>(endpoint, {
        ...options,
        retryOnUnauthorized: false,
      });
    }
  }

  const payload = await parseJson<ApiResponse<T> | BackendErrorPayload>(response);

  if (!response.ok) {
    const errorPayload = payload as BackendErrorPayload | null;
    throw new ApiError(
      response.status,
      errorPayload?.message ?? `API request failed: ${response.status}`,
      errorPayload
    );
  }

  if (payload && "success" in payload && "data" in payload) {
    return payload.data;
  }

  return payload as T;
}

export const apiClient = {
  get<T>(endpoint: string, options?: RequestOptions) {
    return request<T>(endpoint, {
      ...options,
      method: "GET",
    });
  },

  post<T>(endpoint: string, body?: unknown, options?: RequestOptions) {
    return request<T>(endpoint, {
      ...options,
      method: "POST",
      body,
    });
  },

  patch<T>(endpoint: string, body?: unknown, options?: RequestOptions) {
    return request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body,
    });
  },

  delete<T>(endpoint: string, options?: RequestOptions) {
    return request<T>(endpoint, {
      ...options,
      method: "DELETE",
    });
  },
};
