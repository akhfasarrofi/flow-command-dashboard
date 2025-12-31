import { memo, useEffect, useRef } from 'react';

function CandlestickAdvanceChart({ symbol }: { symbol: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<HTMLDivElement | null>(null);
  const resizeTimeout = useRef<number | null>(null);

  const createWidget = (width: number, height: number, symbol: string) => {
    if (!containerRef.current) return;

    // Cleanup widget lama
    containerRef.current.innerHTML = `
      <div class="tradingview-widget-container__widget"></div>
    `;
    widgetRef.current = containerRef.current.querySelector('.tradingview-widget-container__widget');

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      allow_symbol_change: true,
      backgroundColor: 'rgba(15, 15, 15, 1)',
      calendar: false,
      details: false,
      gridColor: 'rgba(242, 242, 242, 0.06)',
      height,
      hide_legend: false,
      hide_side_toolbar: true,
      hide_top_toolbar: false,
      hide_volume: true,
      hotlist: false,
      interval: 'D',
      locale: 'en',
      save_image: true,
      style: '1',
      symbol: `BINANCE:${symbol}`,
      theme: 'dark',
      timezone: 'Etc/UTC',
      width,
    });

    widgetRef.current?.appendChild(script);
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      if (!entries.length || !entries[0]) return;

      const { width, height } = entries[0].contentRect;

      // debounce → hindari recreate berlebihan
      if (resizeTimeout.current) {
        window.clearTimeout(resizeTimeout.current);
      }

      resizeTimeout.current = window.setTimeout(() => {
        createWidget(Math.floor(width), Math.floor(height), symbol);
      }, 150);
    });

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      if (resizeTimeout.current) {
        window.clearTimeout(resizeTimeout.current);
      }
    };
  }, [symbol]);

  return (
    // <CardContent>
    <div className="w-full h-130 tradingview-widget-container" ref={containerRef} />
    // </CardContent>
  );
}

export default memo(CandlestickAdvanceChart);
