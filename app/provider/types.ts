export type Progress = {
  loaded: number;
  total: number;
  percentage: number;
};

export type ProgressCallback = (progress: Progress) => void;

export type HttpConfig = {
  /** Optional request headers */
  headers?: Record<string, string>;
  /** Query parameters for the request */
  params?: Record<string, Primitive | Primitive[]>;
  /** Optional cache configuration */
  cache?: {
    /** Enable or disable caching for this request */
    enabled?: boolean;
    /** Cache revalidation time in milliseconds */
    revalidate?: number;
  };
  /** Abort signal to cancel the request */
  signal?: AbortSignal;
  /** Upload progress callback */
  onUpload?: ProgressCallback;
  /** Download progress callback */
  onDownload?: ProgressCallback;
};

export type CacheEntry<T> = {
  /** Cached data */
  data: T;
  /** Timestamp when the data was cached */
  timestamp: number;
  /** Optional time-to-live (TTL) in milliseconds */
  ttl?: number;
};

export type ApiConfig = {
  /** Base URL of the API */
  baseURL?: string;
  /** Endpoint URL (relative or absolute) */
  url: string;
  /** HTTP method for the request */
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  /** Request body content */
  body?: globalThis.BodyInit;
  /** Request mode (e.g., 'cors', 'same-origin') */
  mode?: globalThis.RequestMode;
  /** Number of retry attempts on failure */
  retry?: number;
} & HttpConfig;

export type HttpInstanceOptions = {
  /** Base URL applied to all requests from this instance */
  baseURL?: string;
  /** Default headers applied to all requests */
  headers?: Record<string, string>;
  /** Source identifier used for cache scoping */
  source?: string;
  /** Maximum number of cache entries to store */
  maxCacheSize?: number;
};

export type ApiResponse<T> = {
  /** Parsed JSON data from the response */
  data: T;
  /** Unique key identifying this request (for caching) */
  cacheKey?: string;
  /** Indicates whether the data was served from cache */
  fromCache: boolean;
};

export interface ApiInterceptor {
  /**
   * Intercept and modify the request configuration before sending.
   * @param config{@link ApiConfig}: The outgoing request configuration
   */
  request?: (config: ApiConfig) => ApiConfig | Promise<ApiConfig>;

  /**
   * Intercept and modify the response before returning.
   * @param response The received Response object
   */
  response?: (response: Response) => Response | Promise<Response>;

  /**
   * Handle errors thrown during the request lifecycle.
   * @param error The thrown error object
   */
  error?: (error: unknown) => Promise<unknown>;
}

export interface HttpApiInstance {
  /**
   * Registers custom interceptors for requests and responses.
   *
   * @param interceptors{@link IApiInterceptor}: Object containing optional `request`, `response`, and `error` interceptors.
   *
   * @example
   * ```ts
   * api.setInterceptors({
   *   request: config => ({ ...config, headers: { ...config.headers, Authorization: 'Bearer token' } }),
   *   response: response => response,
   *   error: error => Promise.reject(error),
   * })
   * ```
   */
  setInterceptors(interceptors: ApiInterceptor): void;

  /**
   * Sends a general API request with full configuration control.
   *
   * @template T - The expected response data type.
   * @param config{@link ApiConfig}: Full request configuration including URL, method, params, headers, etc.
   * @returns A promise that resolves to the API response.
   *
   * @example
   * ```ts
   * const res = await api.request<{ users: User[] }>({
   *   url: '/users',
   *   method: 'GET',
   *   cache: { enabled: true, revalidate: 5000 },
   * })
   * ```
   */
  request<T>(config: ApiConfig): Promise<ApiResponse<T>>;

  /**
   * Performs a GET request.
   *
   * @template T - The expected response data type.
   * @param url - The request URL.
   * @param config{@link ApiConfig}: Optional request configuration (headers, params, cache, etc).
   * @returns A promise resolving to the API response.
   *
   * @example
   * ```ts
   * const res = await api.get<User[]>('/users')
   * ```
   */
  get<T>(url: string, config?: HttpConfig): Promise<ApiResponse<T>>;

  /**
   * Performs a POST request.
   *
   * @template T - The expected response data type.
   * @param url - The request URL.
   * @param body - Optional request body.
   * @param config{@link ApiConfig}: Optional request configuration.
   * @returns A promise resolving to the API response.
   *
   * @example
   * ```ts
   * const res = await api.post<User>('/users', JSON.stringify({ name: 'John' }))
   * ```
   */
  post<T, U = unknown>(url: string, body?: U, config?: HttpConfig): Promise<ApiResponse<T>>;

  /**
   * Performs a PUT request.
   *
   * @template T - The expected response data type.
   * @param url - The request URL.
   * @param body - Optional request body.
   * @param config{@link ApiConfig}: Optional request configuration.
   * @returns A promise resolving to the API response.
   */
  put<T, U = unknown>(url: string, body?: U, config?: HttpConfig): Promise<ApiResponse<T>>;

  /**
   * Performs a PATCH request.
   *
   * @template T - The expected response data type.
   * @param url - The request URL.
   * @param body - Optional request body.
   * @param config{@link ApiConfig}: Optional request configuration.
   * @returns A promise resolving to the API response.
   */
  patch<T, U = unknown>(url: string, body?: U, config?: HttpConfig): Promise<ApiResponse<T>>;

  /**
   * Performs a DELETE request.
   *
   * @template T - The expected response data type.
   * @param url - The request URL.
   * @param body - Optional request body.
   * @param config{@link ApiConfig}: Optional request configuration.
   * @returns A promise resolving to the API response.
   */
  delete<T, U = unknown>(url: string, body?: U, config?: HttpConfig): Promise<ApiResponse<T>>;

  /**
   * Retrieves a cached response by key.
   *
   * @template T - Type of cached data.
   * @param key - Cache key used during the request.
   * @returns Cached data if available, otherwise `undefined`.
   *
   * @example
   * ```ts
   * const cached = api.getCache<User[]>('users:list')
   * ```
   */
  getCache<T>(key: string): T | undefined;

  /**
   * Manually stores data in cache.
   *
   * @template T - Type of data to cache.
   * @param key - Cache key.
   * @param data - Data to store.
   * @param ttl - Optional time-to-live (milliseconds).
   *
   * @example
   * ```ts
   * api.setCache('user:1', { id: 1, name: 'John' }, 5000)
   * ```
   */
  setCache<T>(key: string, data: T, ttl?: number): void;

  /**
   * Removes a specific cache entry by key.
   *
   * @param key - Cache key to remove.
   *
   * @example
   * ```ts
   * api.removeCache('user:1')
   * ```
   */
  removeCache(key: string): void;

  /**
   * Clears all cache entries from the instance.
   *
   * @example
   * ```ts
   * api.clearCache()
   * ```
   */
  clearCache(): void;
}
