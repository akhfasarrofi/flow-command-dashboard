import type { FetchResponse } from '~/http/types';

/**
 * Helper wrapper to simplify HTTP request handling
 * when used with TanStack Query (React Query).
 *
 * This function:
 * - Accepts a Promise that resolves to `FetchResponse<T>`
 * - Awaits the request internally
 * - Throws an error when the response is not successful (`ok === false`)
 * - Returns the response `data` directly for consumption in query/mutation functions
 *
 * Designed to keep query functions clean and to centralize
 * error handling through TanStack Query's global error handlers.
 *
 * @template T - Expected response payload type
 *
 * @param requestPromise - Promise returned from an HTTP request
 *
 * @returns Promise that resolves with the response data
 *
 * @throws Error - Throws the response error when the request fails
 *
 * @example
 * ```ts
 * useQuery({
 *   queryKey: ['users'],
 *   queryFn: () => fetcher(request<User[]>('GET', '/users')),
 * });
 * ```
 */
export async function fetcher<T>(requestPromise: Promise<FetchResponse<T>>): Promise<T> {
  const res = await requestPromise;

  if (!res.ok) {
    throw res.error;
  }

  return res.data;
}
