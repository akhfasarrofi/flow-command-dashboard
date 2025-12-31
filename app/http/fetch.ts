import type { ApiSource, ErrorResponse, FetchResponse, HttpMethod } from './types';

// --- Utilities ---
const getBaseUrl = (source: ApiSource) =>
  source === 'internal'
    ? import.meta.env.VITE_BASE_URL_API
    : import.meta.env.VITE_BINANCE_FUTURES_URL;

const buildUrl = (baseUrl: string, path: string, params: Record<string, any> = {}): string => {
  const url = new URL(`${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value));
    }
  });
  return url.toString();
};

// --- Core Core Request ---
async function baseRequest<T>(
  url: string,
  options: RequestInit,
  signal?: AbortSignal,
): Promise<FetchResponse<T>> {
  try {
    const response = await fetch(url, { ...options, signal });

    // Deterministic parsing: 204 No Content & 205 Reset Content no have body
    const isNoContent = response.status === 204 || response.status === 205;
    const data = isNoContent ? ({} as T) : await response.json().catch(() => ({}));

    return {
      data,
      ok: response.ok,
      status: response.status,
      ...(!response.ok && { error: data as ErrorResponse }),
    };
  } catch (error: any) {
    if (error.name === 'AbortError') {
      // Menangani pembatalan request secara eksplisit
      throw error;
    }
    return {
      data: {} as T,
      error: { error: { message: error.message || 'Network Error', status: 500 } },
      ok: false,
      status: 500,
    };
  }
}

// --- Unified Request Handler ---
export async function coreRequest<T>(
  method: HttpMethod,
  path: string,
  config: {
    params?: Record<string, any>;
    body?: any;
    headers?: Record<string, string>;
    source?: ApiSource;
    signal?: AbortSignal; // Solution Race Condition
  } = {},
): Promise<FetchResponse<T>> {
  const { params = {}, body, headers = {}, source = 'internal', signal } = config;

  const baseUrl = getBaseUrl(source);
  const url = buildUrl(baseUrl, path, params);

  const options: RequestInit = {
    headers: { Accept: 'application/json', ...headers },
    method,
  };

  if (body) {
    if (source === 'external') {
      // Logika khusus Binance: x-www-form-urlencoded
      const formData = new URLSearchParams();
      Object.entries(body).forEach(([k, v]) => {
        if (!(k in params) && v !== undefined) formData.append(k, String(v));
      });
      options.body = formData.toString();
      (options.headers as any)['Content-Type'] = 'application/x-www-form-urlencoded';
    } else {
      // Logika Internal: JSON
      options.body = JSON.stringify(body);
      (options.headers as any)['Content-Type'] = 'application/json';
    }
  }

  return baseRequest<T>(url, options, signal);
}

// --- Simplified Exported Functions ---
export const http = {
  delete: <T>(
    path: string,
    params?: object,
    source: ApiSource = 'internal',
    signal?: AbortSignal,
  ) => coreRequest<T>('DELETE', path, { params, signal, source }),
  get: <T>(path: string, params?: object, source: ApiSource = 'internal', signal?: AbortSignal) =>
    coreRequest<T>('GET', path, { params, signal, source }),

  post: <T>(
    path: string,
    body?: any,
    params?: object,
    source: ApiSource = 'internal',
    signal?: AbortSignal,
  ) => coreRequest<T>('POST', path, { body, params, signal, source }),

  put: <T>(
    path: string,
    body?: any,
    params?: object,
    source: ApiSource = 'internal',
    signal?: AbortSignal,
  ) => coreRequest<T>('PUT', path, { body, params, signal, source }),
};
