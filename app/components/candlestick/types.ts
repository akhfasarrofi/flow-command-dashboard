import type { UTCTimestamp } from 'lightweight-charts';

export interface OHLCData {
  time: UTCTimestamp;
  open: number;
  high: number;
  low: number;
  close: number;
}

export type Period =
  | '15m'
  | '1h'
  | '4h'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | '3months'
  | '6months'
  | 'yearly'
  | 'max';

export interface BinanceWsMessage {
  e: string; // Event type
  k: {
    t: number; // Kline start time (ms)
    o: string; // Open price
    h: string; // High price
    l: string; // Low price
    c: string; // Close price
    x: boolean; // Is this kline closed?
  };
}
