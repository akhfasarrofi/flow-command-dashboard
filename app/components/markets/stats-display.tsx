export function StatsDisplay() {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black tracking-tight text-foreground md:text-4xl">Market</h1>
        <p className="text-muted-foreground font-medium">
          Global Market Cap: <span className="text-foreground">$2.4T</span>{' '}
          <span className="bg-primary/10 text-primary ml-2 inline-flex items-center rounded px-2 py-0.5 text-sm font-bold">
            +2.4%
          </span>
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden flex-col items-end lg:flex">
          <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
            24h Vol
          </span>
          <span className="text-foreground text-sm font-bold">$84.2B</span>
        </div>
        <div className="hidden flex-col items-end lg:flex">
          <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
            Dominance
          </span>
          <span className="text-foreground text-sm font-bold">BTC 49.8%</span>
        </div>
      </div>
    </div>
  );
}
