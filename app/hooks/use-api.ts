import { useMutation, useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { type FetchResponse, httpDelete, httpGet, httpPost, httpPut } from '~/http/fetch';

function handleResponse(res: FetchResponse): Promise<any> {
  if (!res.ok) {
    const { message, code, status } = res?.data?.error || {};

    return Promise.reject(Object.assign(new Error(message), { code, status }));
  }
  return Promise.resolve(res.data);
}

export function useApi() {
  return {
    del: useCallback(
      async (url: string, params: object = {}) => {
        return await httpDelete(url, params).then(handleResponse);
      },
      [httpDelete],
    ),
    get: useCallback(
      async (url: string, params: object = {}) => {
        return await httpGet(url, params).then(handleResponse);
      },
      [httpGet],
    ),

    post: useCallback(
      async (url: string, params: object = {}) => {
        return await httpPost(url, params).then(handleResponse);
      },
      [httpPost],
    ),

    put: useCallback(
      async (url: string, params: object = {}) => {
        return await httpPut(url, params).then(handleResponse);
      },
      [httpPut],
    ),
    useMutation,
    useQuery,
  };
}
