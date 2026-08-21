const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

type RequestOptions = RequestInit & {
  body?: unknown;
};

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    body:
      options.body !== undefined
        ? JSON.stringify(options.body)
        : undefined,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
}

export const apiClient = {
  get<T>(endpoint: string) {
    return request<T>(endpoint, {
      method: "GET",
    });
  },

  post<T>(endpoint: string, body?: unknown) {
    return request<T>(endpoint, {
      method: "POST",
      body,
    });
  },

  patch<T>(endpoint: string, body?: unknown) {
    return request<T>(endpoint, {
      method: "PATCH",
      body,
    });
  },

  delete<T>(endpoint: string) {
    return request<T>(endpoint, {
      method: "DELETE",
    });
  },
};