import type {
  ApiConfig,
  ApiInterceptor,
  ApiResponse,
  CacheEntry,
  HttpApiInstance,
  HttpConfig,
  HttpInstanceOptions,
  ProgressCallback,
} from './types';

export const buildURL = (url: string, params?: HttpConfig['params']) => {
  if (!params) return url;

  const queryString = Object.entries(params)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        const joined = value.map((v) => encodeURIComponent(v)).join(',');
        return `${encodeURIComponent(key)}=${joined}`;
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    })
    .join('&');

  return url.includes('?') ? `${url}&${queryString}` : `${url}?${queryString}`;
};

export class ApiMeta extends Error {
  code: number;
  status: string;

  constructor(code: number, message: string, status: string) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

export class ApiInstance implements HttpApiInstance {
  private baseURL: string;
  private defaultHeaders: globalThis.RequestInit['headers'];
  private interceptors: ApiInterceptor = {};
  private source: string;
  private cache: Map<string, CacheEntry<unknown>>;
  private maxCacheSize: number;
  private cacheAccessOrder: string[];

  constructor(options: HttpInstanceOptions = {}) {
    this.baseURL = options.baseURL || '';
    this.defaultHeaders = options.headers || {};
    this.source = `trade-${options.source || 'default'}`;
    this.cache = new Map();
    this.maxCacheSize = options.maxCacheSize || 100;
    this.cacheAccessOrder = [];
  }

  setInterceptors(interceptors: ApiInterceptor) {
    this.interceptors = interceptors;
  }

  private hash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash &= hash;
    }
    return hash.toString(36);
  }

  private buildcacheKey(config: ApiConfig): string {
    const keyObj = {
      params: config.params,
      url: config.url,
    };

    const keyString = JSON.stringify(keyObj);
    if (keyString.length > 200) {
      return `${this.source}:${this.hash(keyString)}`;
    }

    return `${this.source}:${keyString}`;
  }

  private fetchWithXHR(
    input: string,
    init: globalThis.RequestInit,
    onUpload?: ProgressCallback,
    onDownload?: ProgressCallback,
  ): Promise<Response> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const method = (init.method || 'GET').toUpperCase();

      xhr.open(method, input);

      if (init.headers) {
        const headers = new Headers(init.headers);
        headers.forEach((value, key) => {
          xhr.setRequestHeader(key, value);
        });
      }

      if (onUpload && xhr.upload) {
        xhr.upload.addEventListener('progress', (e) => {
          const total = e.lengthComputable ? e.total : 0;
          const percentage = e.lengthComputable ? Math.round((e.loaded / e.total) * 100) : 0;
          onUpload({
            loaded: e.loaded,
            percentage,
            total,
          });
        });
      }

      if (onDownload) {
        xhr.responseType = 'blob';
        xhr.addEventListener('progress', (e) => {
          const total = e.lengthComputable ? e.total : 0;
          const percentage = e.lengthComputable ? Math.round((e.loaded / e.total) * 100) : 0;
          onDownload({
            loaded: e.loaded,
            percentage,
            total,
          });
        });
      }

      if (init.signal) {
        init.signal.addEventListener('abort', () => {
          xhr.abort();
          reject(new DOMException('The operation was aborted.', 'AbortError'));
        });
      }

      xhr.onload = () => {
        const headers = new Headers();
        xhr
          .getAllResponseHeaders()
          .split('\r\n')
          .forEach((line) => {
            const parts = line.split(': ');
            if (parts.length === 2) {
              headers.append(parts[0] as string, parts[1] as string);
            }
          });

        const response = new Response(xhr.response, {
          headers,
          status: xhr.status,
          statusText: xhr.statusText,
        });

        resolve(response);
      };

      xhr.onerror = () => reject(new TypeError('Network request failed'));
      xhr.ontimeout = () => reject(new TypeError('Network request timeout'));

      xhr.send(
        init.body as
          | Document
          | Blob
          | ArrayBuffer
          | ArrayBufferView<ArrayBuffer>
          | FormData
          | URLSearchParams
          | string
          | null,
      );
    });
  }

  private async fetchWithRetry(
    input: globalThis.RequestInfo,
    init: globalThis.RequestInit,
    retry: number,
    signal?: AbortSignal,
    onUpload?: ProgressCallback,
    onDownload?: ProgressCallback,
  ) {
    let attempt = 0;
    let lastErr: unknown;

    while (attempt <= retry) {
      try {
        let res: Response;
        if (onUpload || onDownload) {
          res = await this.fetchWithXHR(input as string, { ...init, signal }, onUpload, onDownload);
        } else {
          res = await fetch(input, { ...init, signal });
        }

        if (!res.ok) {
          const clonedRes = res.clone();
          const error = await clonedRes.json();
          if (error.meta || error.status) {
            const code = error.code || error.meta.code || res.status;
            const message = error.message || error.meta.message || JSON.stringify(error);
            const status = error.status || error.meta.status || res.statusText;
            throw new ApiMeta(code, message, status);
          }
          throw error;
        }
        return res;
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          throw err;
        }

        lastErr = err;
        if (attempt === retry) throw lastErr;

        const delay = 2 ** attempt * 200;
        await new Promise((r) => setTimeout(r, delay));
        attempt++;
      }
    }
    throw lastErr;
  }

  private async handleInterceptors(config: ApiConfig) {
    if (this.interceptors.request) {
      return await this.interceptors.request(config);
    }
    return config;
  }

  private async handleResponse(response: Response) {
    if (this.interceptors.response) {
      return await this.interceptors.response(response);
    }
    return response;
  }

  private async handleError(error: unknown) {
    if (this.interceptors.error) {
      return await this.interceptors.error(error);
    }
    throw error;
  }

  private getCacheEntry<T>(key: string): CacheEntry<T> | undefined {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    if (entry) {
      const index = this.cacheAccessOrder.indexOf(key);
      if (index > -1) {
        this.cacheAccessOrder.splice(index, 1);
      }
      this.cacheAccessOrder.push(key);
    }

    return entry;
  }

  private setCacheEntry<T>(key: string, entry: CacheEntry<T>): void {
    if (this.cache.size >= this.maxCacheSize && !this.cache.has(key)) {
      const oldestKey = this.cacheAccessOrder.shift();
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, entry);
    const index = this.cacheAccessOrder.indexOf(key);
    if (index > -1) {
      this.cacheAccessOrder.splice(index, 1);
    }
    this.cacheAccessOrder.push(key);
  }

  private removeCacheEntry(key: string): void {
    this.cache.delete(key);
    const index = this.cacheAccessOrder.indexOf(key);
    if (index > -1) {
      this.cacheAccessOrder.splice(index, 1);
    }
  }

  async request<T>(config: ApiConfig): Promise<ApiResponse<T>> {
    try {
      const finalConfig = await this.handleInterceptors(config);
      const cacheKey = this.buildcacheKey(finalConfig);

      if (finalConfig.cache?.enabled && finalConfig.method === 'GET') {
        const cached = this.getCacheEntry<T>(cacheKey);
        if (cached) {
          const expired = cached.ttl && Date.now() - cached.timestamp > cached.ttl;
          if (!expired) {
            return { cacheKey, data: cached.data as T, fromCache: true };
          }
          this.removeCacheEntry(cacheKey);
        }
      }

      const url = this.baseURL ? `${this.baseURL}${finalConfig.url}` : finalConfig.url;
      const finalURL = buildURL(url, finalConfig.params);
      const isFormData = finalConfig.body instanceof FormData;

      const response = await this.fetchWithRetry(
        finalURL,
        {
          body: isFormData
            ? finalConfig.body
            : finalConfig.body
              ? JSON.stringify(finalConfig.body)
              : undefined,
          headers: {
            ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
            ...this.defaultHeaders,
            ...finalConfig.headers,
          },
          method: finalConfig.method || 'GET',
        },
        finalConfig.retry ?? 0,
        finalConfig.signal,
        finalConfig.onUpload,
        finalConfig.onDownload,
      );

      const finalResponse = await this.handleResponse(response);
      if (!finalResponse.ok) {
        try {
          const error = await finalResponse.clone().json();
          if (error.meta || error.status) {
            const code = error.code || error.meta.code || finalResponse.status;
            const message = error.message || error.meta.message || JSON.stringify(error);
            const status = error.status || error.meta.status || finalResponse.statusText;
            throw new ApiMeta(code, message, status);
          }
          throw error;
        } catch {
          const errorText = await finalResponse.text();
          throw new Error(errorText || finalResponse.statusText);
        }
      }

      const contentType = finalResponse.headers.get('content-type') || '';
      let data: T;
      if (contentType.includes('application/json')) {
        data = (await finalResponse.json()) as T;
      } else if (contentType.includes('text/')) {
        data = (await finalResponse.text()) as T;
      } else {
        data = (await finalResponse.blob()) as T;
      }

      if (finalConfig.cache?.enabled && finalConfig.method === 'GET') {
        this.setCacheEntry(cacheKey, {
          data,
          timestamp: Date.now(),
          ttl: finalConfig.cache?.revalidate,
        });
      }

      return { cacheKey, data, fromCache: false };
    } catch (error) {
      return this.handleError(error) as Promise<ApiResponse<T>>;
    }
  }

  get<T>(url: string, config: HttpConfig = {}) {
    return this.request<T>({ ...config, method: 'GET', url });
  }

  post<T, U = unknown>(url: string, body?: U, config: HttpConfig = {}) {
    return this.request<T>({ ...config, body: body as globalThis.BodyInit, method: 'POST', url });
  }

  put<T, U = unknown>(url: string, body?: U, config: HttpConfig = {}) {
    return this.request<T>({ ...config, body: body as globalThis.BodyInit, method: 'PUT', url });
  }

  patch<T, U = unknown>(url: string, body?: U, config: HttpConfig = {}) {
    return this.request<T>({ ...config, body: body as globalThis.BodyInit, method: 'PATCH', url });
  }

  delete<T, U = unknown>(url: string, body?: U, config: HttpConfig = {}) {
    return this.request<T>({ ...config, body: body as globalThis.BodyInit, method: 'DELETE', url });
  }

  getCache<T>(key: string): T | undefined {
    const entry = this.getCacheEntry<T>(key);
    return entry?.data as T | undefined;
  }

  setCache<T>(key: string, data: T, ttl?: number): void {
    this.setCacheEntry(key, { data, timestamp: Date.now(), ttl });
  }

  removeCache(key: string): void {
    this.removeCacheEntry(key);
  }

  clearCache(): void {
    this.cache.clear();
    this.cacheAccessOrder = [];
  }
}

const instance = new ApiInstance();

const http = {
  clearCache: () => instance.clearCache(),
  create: (options: HttpInstanceOptions = {}): ApiInstance => new ApiInstance(options),
  delete: <T, U = unknown>(url: string, body?: U, config?: HttpConfig) =>
    instance.delete<T, U>(url, body, config),
  get: <T>(url: string, config?: HttpConfig) => instance.get<T>(url, config),
  getCache: <T>(key: string) => instance.getCache<T>(key),
  patch: <T, U = unknown>(url: string, body?: U, config?: HttpConfig) =>
    instance.patch<T, U>(url, body, config),
  post: <T, U = unknown>(url: string, body?: U, config?: HttpConfig) =>
    instance.post<T, U>(url, body, config),
  put: <T, U = unknown>(url: string, body?: U, config?: HttpConfig) =>
    instance.put<T, U>(url, body, config),
  removeCache: (key: string) => instance.removeCache(key),
  request: (config: ApiConfig) => instance.request(config),
  setCache: <T>(key: string, data: T, ttl?: number) => instance.setCache<T>(key, data, ttl),
};

export default http;
