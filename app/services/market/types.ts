export interface PrePumpResult {
  symbol: string;
  market_state: 'PRE_PUMP' | 'DISTRIBUTION' | 'NEUTRAL';
  metrics: {
    notional_oi_change_pct: number;
    price_efficiency: number;
    atr_compression: boolean;
    funding_rate: number;
  };
}

export interface PrePumpResponse {
  timeframe: string;
  window: number;
  total_scanned: number;
  total_results: number;
  result: PrePumpResult[];
}
