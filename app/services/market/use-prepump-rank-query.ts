import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { http } from '~/http/fetch';
import { fetcher } from '~/lib/api-client';
import { PRE_PUMP_RANK } from '~/lib/endpoint';
import type { PrePumpResponse } from '~/services/market/types';

export function usePrepumpRankQuery() {
  return useQuery<PrePumpResponse>({
    placeholderData: keepPreviousData,
    queryFn: ({ signal }) => fetcher(http.get(PRE_PUMP_RANK, {}, 'internal', signal)),
    queryKey: [PRE_PUMP_RANK],
  });
}
