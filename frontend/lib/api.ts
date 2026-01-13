export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

export type SuccessResponse<T = unknown> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
};

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getJSON<T = unknown>(
  path: string,
  query?: Record<string, string | undefined>,
): Promise<SuccessResponse<T>> {
  const params = new URLSearchParams();
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined) params.append(key, value);
    });
  }
  const url = `${API_BASE_URL}${path}${params.toString() ? `?${params.toString()}` : ''}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const contentType = res.headers.get('content-type') || '';
  const isJSON = contentType.includes('application/json');
  const payload = isJSON ? await res.json() : null;

  if (!res.ok) {
    const message = payload?.message || 'Request failed';
    throw new Error(message);
  }

  return payload as SuccessResponse<T>;
}

export async function postJSON<T = unknown, B = Record<string, unknown>>(
  path: string,
  body: B,
): Promise<SuccessResponse<T>> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });

  const contentType = res.headers.get("content-type") || "";
  const isJSON = contentType.includes("application/json");
  const payload = isJSON ? await res.json() : null;

  if (!res.ok) {
    const message = payload?.message || "Request failed";
    throw new Error(message);
  }

  return payload as SuccessResponse<T>;
}

export async function putJSON<T = unknown, B = Record<string, unknown>>(
  path: string,
  body: B,
): Promise<SuccessResponse<T>> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });

  const contentType = res.headers.get('content-type') || '';
  const isJSON = contentType.includes('application/json');
  const payload = isJSON ? await res.json() : null;

  if (!res.ok) {
    const message = payload?.message || 'Request failed';
    throw new Error(message);
  }

  return payload as SuccessResponse<T>;
}

export async function deleteJSON<T = unknown>(
  path: string,
): Promise<SuccessResponse<T>> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  const contentType = res.headers.get('content-type') || '';
  const isJSON = contentType.includes('application/json');
  const payload = isJSON ? await res.json() : null;

  if (!res.ok) {
    const message = payload?.message || 'Request failed';
    throw new Error(message);
  }

  return payload as SuccessResponse<T>;
}
