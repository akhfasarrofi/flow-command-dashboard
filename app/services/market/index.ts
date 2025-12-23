import { ANALYZE_INFORMATION, ANALYZE_PRE_PUMP } from '~/constants/endpoint';
import { fetchServer } from '~/provider/instance';
import type { MarketResponse, PrePumpResponse } from './types';

export function fetchPrePump() {
  return fetchServer.get<PrePumpResponse>(ANALYZE_PRE_PUMP).then((res) => res.data);
}

export function fetchInformation() {
  return fetchServer.get<MarketResponse>(ANALYZE_INFORMATION).then((res) => res.data);
}