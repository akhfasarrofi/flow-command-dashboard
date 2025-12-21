import { ArrowDown, ArrowUp, Bot, Info } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';
import { useMarketData } from '~/hooks/use-market-data';

export function AssetTable() {
  const { data: assets, isLoading } = useMarketData();

  if (isLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-xl border bg-card shadow-sm">
        <p className="text-muted-foreground animate-pulse text-sm">Loading assets...</p>
      </div>
    );
  }

  return (
    <div className="bg-card w-full overflow-hidden rounded-xl border shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50 uppercase tracking-wider">
              <TableHead className="w-56 font-semibold">Asset</TableHead>
              <TableHead className="text-right font-semibold">Price</TableHead>
              <TableHead className="text-right font-semibold">24h Change</TableHead>
              <TableHead className="w-32 text-center font-semibold">7d Trend</TableHead>
              <TableHead className="w-60 font-semibold">
                <div className="flex items-center gap-1">
                  Sentiment Score
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="size-4 opacity-50" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Based on social volume and order book depth.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableHead>
              <TableHead className="w-36 text-right font-semibold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((asset) => (
              <TableRow className="group hover:bg-muted/50" key={asset.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8">
                      <AvatarImage alt={asset.name} src={asset.logo} />
                      <AvatarFallback>{asset.symbol[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-bold leading-tight">{asset.name}</span>
                      <span className="text-muted-foreground text-xs font-medium">
                        {asset.symbol}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="font-medium text-foreground/80 dark:text-muted-foreground">
                    {asset.price}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Badge
                    className={`font-bold ${
                      asset.isPositive
                        ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
                    }`}
                    variant="secondary"
                  >
                    {asset.isPositive ? (
                      <ArrowUp className="mr-0.5 size-3.5" />
                    ) : (
                      <ArrowDown className="mr-0.5 size-3.5" />
                    )}
                    {asset.change24h}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="h-8 w-24 mx-auto flex items-center justify-center opacity-70 grayscale transition-all group-hover:grayscale-0">
                    <svg
                      fill="none"
                      height="30"
                      viewBox="0 0 90 30"
                      width="90"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d={asset.trendSvg}
                        stroke={asset.isPositive ? '#22c55e' : '#ef4444'}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1.5 w-full">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-medium">{asset.sentiment.label}</span>
                      <span
                        className={`font-bold ${asset.sentiment.score > 70 ? 'text-primary' : 'text-muted-foreground'}`}
                      >
                        {asset.sentiment.score}/100
                      </span>
                    </div>
                    <div className="bg-secondary h-1.5 w-full overflow-hidden rounded-full">
                      <div
                        className={`h-full rounded-full ${asset.sentiment.colorClass} ${asset.sentiment.score > 80 ? 'shadow-[0_0_10px_rgba(37,244,157,0.5)]' : ''}`}
                        style={{ width: `${asset.sentiment.score}%` }}
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {asset.action === 'bot' ? (
                    <Button
                      className="w-full font-bold uppercase tracking-wide shadow-lg shadow-primary/20 hover:shadow-primary/40"
                      size="sm"
                    >
                      <Bot className="mr-1 size-4" /> Set Bot
                    </Button>
                  ) : (
                    <Button
                      className="w-full font-bold uppercase tracking-wide"
                      size="sm"
                      variant="outline"
                    >
                      Trade
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
