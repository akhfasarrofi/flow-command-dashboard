import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { http } from '~/http/fetch';
import { fetcher } from '~/lib/api-client';
import { PAIR_INFORMATION } from '~/lib/endpoint';
import type { InformationResponse } from './types';

export function usePairInformationQuery() {
  return useQuery<InformationResponse>({
    placeholderData: keepPreviousData,
    queryFn: ({ signal }) => fetcher(http.get(PAIR_INFORMATION, {}, 'internal', signal)),
    queryKey: [PAIR_INFORMATION],
  });
}
