export type Tier = 'A' | 'B' | 'C' | 'D';
export type MarketState = 'PRE_PUMP' | 'DISTRIBUTION' | 'NEUTRAL';

export interface Ranking {
  score: number;
  raw_score: number;
  tier: Tier;
  relative_score: number;
}

export interface Metrics {
  notional_oi_change_pct: number;
  price_efficiency: number;
  atr_compression: boolean;
  funding_rate: number;
}

export interface PrePumpItem {
  symbol: string;
  market_state: MarketState;
  metrics: Metrics;
  ranking: Ranking;
}

export interface PrePumpResponse {
  timeframe: string;
  window: number;
  total_scanned: number;
  total_results: number;
  results: PrePumpResults;
}

export type PrePumpResults = PrePumpItem[];

export interface MarketLSRaw {
  longAccount: string;
  shortAccount: string;
  longShortRatio: string;
  timestamp: number;
}

export interface MarketLSMetric {
  enabled: boolean;
  raw: MarketLSRaw;
  normalized: number;
}

export interface MarketLS {
  lsGlobalAccount: MarketLSMetric;
  lsTopAccount: MarketLSMetric;
  lsTopPosition: MarketLSMetric;
  score: number;
  state: 'SHORT_DOMINANT' | 'LONG_DOMINANT' | 'NEUTRAL';
  bias: 'SHORT' | 'LONG' | 'NEUTRAL';
}

export interface PairInformation {
  symbol: string;
  ls: MarketLS;
}

export interface Rank {
  position: number;
  total: number;
}

export interface MarketItem {
  pairInformation: PairInformation;
  rank: Rank;
}

export type MarketResponse = MarketItem[];
