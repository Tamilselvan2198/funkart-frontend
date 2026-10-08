const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api";

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }

  // Get JWT token
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers = new Headers(options.headers);

  // Add JSON Content-Type only for non-FormData requests
  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  // Add JWT
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const text = await response.text();

    throw new Error(`API Error ${response.status}: ${text}`);
  }

  return response.json();
}
