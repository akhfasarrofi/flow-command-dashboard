export interface ErrorResponse {
  error: {
    status: number;
    message: string;
    code?: string;
  };
}

export interface FetchResponse<T = any> {
  ok: boolean;
  status: number;
  data: T;
  error?: ErrorResponse;
}

export type HttpMethod = 'GET' | 'DELETE' | 'POST' | 'PUT';
export type ApiSource = 'internal' | 'external';
