import type { HttpInstanceOptions } from '~/provider/types';

export const BASE_URL: HttpInstanceOptions = {
  baseURL: import.meta.env.VITE_BASE_URL_API,
};
