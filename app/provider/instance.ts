import { BASE_URL } from '~/constants/env';
import createHttp from './create-http';
import http from './http';

export const client = createHttp({ ...BASE_URL });
export const server = http.create({ ...BASE_URL });
