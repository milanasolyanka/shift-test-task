import { ApiError } from './apiError';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
};

async function request<TResponse>(path: string, options: RequestOptions = {}) {
  const { body, headers, ...restOptions } = options;
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      ...restOptions,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError('Не удалось выполнить запрос. Проверьте доступность сервера.');
  }

  if (!response.ok) {
    throw new ApiError(await getErrorText(response), response.status);
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  return response.json() as Promise<TResponse>;
}

async function getErrorText(response: Response) {
  try {
    const data = (await response.json()) as { message?: string; error?: string; reason?: string };

    return data.message ?? data.error ?? data.reason ?? 'Ошибка запроса';
  } catch {
    return 'Ошибка запроса';
  }
}

export const apiClient = {
  get<TResponse>(path: string, options?: Omit<RequestOptions, 'body' | 'method'>) {
    return request<TResponse>(path, {
      ...options,
      method: 'GET',
    });
  },

  post<TResponse>(path: string, body?: unknown) {
    return request<TResponse>(path, {
      method: 'POST',
      body,
    });
  },
};
