import { BASE_URL } from '~/constants/env';
import createApiClient from './create-api-client';
import http from './http';

export const fetchClient = createApiClient({ ...BASE_URL });
export const fetchServer = http.create({ ...BASE_URL });
