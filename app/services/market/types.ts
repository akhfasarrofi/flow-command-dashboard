export type Tier = 'A' | 'B' | 'C' | 'D';
export type MarketState = 'PRE_PUMP' | 'DISTRIBUTION' | 'NEUTRAL';

export interface PrePumpResult {
  symbol: string;
  market_state: MarketState;
  metrics: {
    notional_oi_change_pct: number;
    price_efficiency: number;
    atr_compression: boolean;
    funding_rate: number;
  };
  ranking: {
    score: number;
    raw_score: number;
    tier: Tier;
    relative_score: number;
  };
}

export interface PrePumpResponse {
  timeframe: string;
  window: number;
  total_scanned: number;
  total_results: number;
  results: PrePumpResult[];
}
