import { buildPath } from '~/lib/url';

export interface ErrorResponse {
  error: {
    status: number;
    message: string;
    code?: string;
  };
}

export interface FetchResponse {
  ok: boolean;
  status: number;
  data?: any;
  error?: ErrorResponse;
}

export async function request(
  method: 'GET' | 'DELETE' | 'POST' | 'PUT',
  url: string,
  body?: string,
  headers: object = {},
): Promise<FetchResponse> {
  return await fetch(`${import.meta.env.VITE_BASE_URL_API}/${url}`, {
    body,
    cache: 'no-cache',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...headers,
    },
    method,
  }).then(async (res) => {
    const data = await res.json();

    return {
      data,
      ok: res.ok,
      status: res.status,
    };
  });
}

export async function httpGet(path: string, params: object = {}, headers: object = {}) {
  return await request('GET', buildPath(path, params), undefined, headers);
}

export async function httpDelete(path: string, params: object = {}, headers: object = {}) {
  return await request('DELETE', buildPath(path, params), undefined, headers);
}

export async function httpPost(path: string, params: object = {}, headers: object = {}) {
  return await request('POST', path, JSON.stringify(params), headers);
}

export async function httpPut(path: string, params: object = {}, headers: object = {}) {
  return await request('PUT', path, JSON.stringify(params), headers);
}
