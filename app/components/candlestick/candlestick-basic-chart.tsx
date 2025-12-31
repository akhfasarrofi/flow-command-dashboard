import {
  CandlestickSeries,
  createChart,
  type IChartApi,
  type ISeriesApi,
  type UTCTimestamp,
} from 'lightweight-charts';
import { useEffect, useRef, useState } from 'react';
import { CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { KLINES } from '~/lib/endpoint';
import { CHART_COLORS, getChartConfig, PERIOD_BUTTONS, PERIOD_TO_BINANCE_MAP } from './config';
import type { BinanceWsMessage, OHLCData, Period } from './types';

interface CandlestickBasicChartProps {
  coinId: string;
  height?: number;
  initialPeriod?: Period;
}

const CandlestickBasicChart = ({
  coinId,
  height = 410,
  initialPeriod = 'daily',
}: CandlestickBasicChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

  const [period, setPeriod] = useState<Period>(initialPeriod);

  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container) return;

    // cleanup previous chart if exists
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }

    const showTime = ['daily', 'weekly', 'monthly'].includes(period);

    const chart = createChart(container, {
      ...getChartConfig(height, showTime),
      width: container.clientWidth,
    });

    const series = chart.addSeries(CandlestickSeries, {
      borderVisible: false,
      downColor: CHART_COLORS.candleDown,
      upColor: CHART_COLORS.candleUp,
      wickDownColor: CHART_COLORS.candleDown,
      wickUpColor: CHART_COLORS.candleUp,
      wickVisible: true,
      // priceFormat: {
      //   type: 'price',
      //   precision: 4,
      //   minMove: 0.05,
      // },
    });

    chartRef.current = chart;
    candleSeriesRef.current = series;

    const { interval, limit } = PERIOD_TO_BINANCE_MAP[period];

    const symbol = coinId.toUpperCase();
    let ws: WebSocket | null = null;

    const fetchDataAndSubscribe = async () => {
      try {
        // 1. Fetch Historical Data
        const res = await fetch(
          `${import.meta.env.VITE_BINANCE_FUTURES_URL}/${KLINES}?symbol=${symbol}&interval=${interval}&limit=${limit}`,
        );
        const rawData = await res.json();

        if (!Array.isArray(rawData)) {
          console.error('Invalid data from Binance', rawData);
          return;
        }

        const formattedData: OHLCData[] = rawData.map((d: any) => ({
          close: parseFloat(d[4]),
          high: parseFloat(d[2]),
          low: parseFloat(d[3]),
          open: parseFloat(d[1]),
          time: (d[0] / 1000) as UTCTimestamp,
        }));

        // Check if component is still mounted
        if (!chartRef.current) return;

        series.setData(formattedData);
        chart.timeScale().fitContent();

        // 2. Subscribe to WebSocket
        ws = new WebSocket(
          `${import.meta.env.VITE_BINANCE_WS_URL}/${symbol.toLowerCase()}@kline_${interval}`,
        );

        ws.onmessage = (event) => {
          const msg: BinanceWsMessage = JSON.parse(event.data);
          const k = msg.k;

          const update: OHLCData = {
            close: parseFloat(k.c),
            high: parseFloat(k.h),
            low: parseFloat(k.l),
            open: parseFloat(k.o),
            time: (k.t / 1000) as UTCTimestamp,
          };

          if (chartRef.current && candleSeriesRef.current) {
            candleSeriesRef.current.update(update);
          }
        };
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchDataAndSubscribe();

    // Resize Observer
    const observer = new ResizeObserver((entries) => {
      if (!entries.length || !chartRef.current || !entries[0]) return;

      chartRef.current.applyOptions({
        height: entries[0].contentRect.height,
        width: entries[0].contentRect.width,
      });
    });
    observer.observe(container);

    return () => {
      observer.disconnect();
      if (ws) ws.close();
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [coinId, height, period]);

  return (
    <div id="candlestick-chart">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div className="font-semibold text-xl">{coinId}</div>
          <Select onValueChange={(value) => setPeriod(value as Period)} value={period}>
            <SelectTrigger className="w-25 h-8 text-xs">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent className="border-none">
              {PERIOD_BUTTONS.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full" ref={chartContainerRef} style={{ height }} />
      </CardContent>
    </div>
  );
};

export default CandlestickBasicChart;
