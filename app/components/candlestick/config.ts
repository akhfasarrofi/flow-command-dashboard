import { type ChartOptions, ColorType, type DeepPartial } from 'lightweight-charts';
import type { Period } from './types';

export const getChartConfig = (
  height: number,
  timeVisible: boolean = true,
): DeepPartial<ChartOptions> => ({
  crosshair: {
    horzLine: {
      color: CHART_COLORS.crosshairHorizontal,
      style: 0,
      visible: true,
      width: 1,
    },
    mode: 1,
    vertLine: {
      color: CHART_COLORS.crosshairVertical,
      style: 0,
      visible: true,
      width: 1,
    },
  },
  grid: {
    horzLines: {
      color: CHART_COLORS.grid,
      style: 2,
      visible: true,
    },
    vertLines: { visible: false },
  },
  handleScale: true,
  handleScroll: true,
  height,
  layout: {
    background: { color: CHART_COLORS.background, type: ColorType.Solid },
    fontFamily: 'Inter, Roboto, "Helvetica Neue", Arial',
    fontSize: 12,
    textColor: CHART_COLORS.text,
  },
  localization: {
    priceFormatter: (price: number) => {
      return new Intl.NumberFormat('en-US').format(price);
    },
  },
  rightPriceScale: {
    borderColor: CHART_COLORS.border,
  },
  timeScale: {
    borderColor: CHART_COLORS.border,
    secondsVisible: false,
    timeVisible,
  },
  width: 0,
});

export const LIVE_INTERVAL_BUTTONS: { value: '1s' | '1m'; label: string }[] = [
  { label: '1s', value: '1s' },
  { label: '1m', value: '1m' },
];

export const CHART_COLORS = {
  background: '#0b1116',
  border: '#1a2332',
  candleDown: '#EB1C36',
  candleUp: '#158A6E',
  crosshairHorizontal: '#ffffff20',
  crosshairVertical: '#ffffff40',
  grid: '#1a2332',
  text: '#8f9fb1',
} as const;

export const PERIOD_BUTTONS: { value: Period; label: string }[] = [
  { label: '15M', value: '15m' },
  { label: '1H', value: '1h' },
  { label: '4H', value: '4h' },
  { label: '1D', value: 'daily' },
  { label: '1W', value: 'weekly' },
  { label: '1M', value: 'monthly' },
  { label: '3M', value: '3months' },
  { label: '6M', value: '6months' },
  { label: '1Y', value: 'yearly' },
];

export const PERIOD_TO_BINANCE_MAP: Record<Period, { interval: string; limit: number }> = {
  '1h': { interval: '1h', limit: 500 },
  '3months': { interval: '1d', limit: 90 },
  '4h': { interval: '4h', limit: 500 },
  '6months': { interval: '1d', limit: 180 },
  '15m': { interval: '15m', limit: 500 },
  daily: { interval: '1d', limit: 500 },
  max: { interval: '1M', limit: 1000 },
  monthly: { interval: '1M', limit: 500 },
  weekly: { interval: '1w', limit: 500 },
  yearly: { interval: '1w', limit: 52 },
};
