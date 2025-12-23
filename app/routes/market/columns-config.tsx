import type { ColumnDef } from '@tanstack/react-table';
import clsx from 'clsx';
import { Text, TrendingDown, TrendingUp } from 'lucide-react';
import type { ReactNode } from 'react';
import { DataTableColumnHeader } from '~/components/data-table/data-table-column-header';
import { Button } from '~/components/ui/button';
import type { MarketState, PrePumpResult } from '~/services/market';

export function columnConfig(): ColumnDef<PrePumpResult>[] {
  return [
    {
      accessorKey: 'symbol',
      enableColumnFilter: true,
      enableHiding: false,
      enableSorting: false,
      header: ({ column }) => <DataTableColumnHeader column={column} label="Asset" />,
      id: 'symbol',
      meta: {
        icon: Text,
        label: 'Asset',
        placeholder: 'Search assets...',
        variant: 'text',
      },
    },
    {
      accessorKey: 'market_state',
      cell({ cell }) {
        const status: Record<MarketState, ReactNode> = {
          DISTRIBUTION: <TrendingDown className="mr-2 h-4 w-4 animate-pulse text-red-500" />,
          NEUTRAL: <TrendingUp className="mr-2 h-4 w-4 animate-pulse" />,
          PRE_PUMP: <TrendingUp className="mr-2 h-4 w-4 animate-pulse text-green-500" />,
        };

        return (
          <Button size="sm" variant="ghost">
            {status[cell.getValue<MarketState>()]}
          </Button>
        );
      },
      enableHiding: false,
      enableSorting: false,
      header: ({ column }) => <DataTableColumnHeader column={column} label="Prediction" />,
      id: 'market_state',
    },
    {
      accessorKey: 'ranking.tier',
      enableHiding: false,
      enableSorting: false,
      header: ({ column }) => <DataTableColumnHeader column={column} label="Tier" />,
      id: 'tier',
      maxSize: 60,
    },
    {
      accessorKey: 'metrics.notional_oi_change_pct',
      cell({ cell }) {
        const value = cell.getValue<number>();
        return (
          <div className={clsx(value < 0 && 'text-red-500', value > 0 && 'text-green-500')}>
            {cell.getValue<MarketState>()}
          </div>
        );
      },
      enableSorting: false,
      header: ({ column }) => <DataTableColumnHeader column={column} label="Oi Change" />,
      id: 'notional_oi_change_pct',
      meta: {
        label: 'OI Change',
      },
    },
    {
      accessorKey: 'metrics.price_efficiency',
      enableSorting: false,
      header: ({ column }) => <DataTableColumnHeader column={column} label="Efficiency Price" />,
      id: 'price_efficiency',
      meta: {
        label: 'Efficiency Price',
      },
    },
    // {
    //   accessorKey: 'metrics.atr_compression',
    //   enableSorting: false,
    //   header: ({ column }) => <DataTableColumnHeader column={column} label="ATR" />,
    //   id: 'atr_compression',
    //   meta: {
    //     label: 'ATR',
    //   },
    // },
    {
      accessorKey: 'metrics.funding_rate',
      cell({ cell }) {
        const value = cell.getValue<number>();
        return (
          <div className={clsx(value < 0 && 'text-red-500', value > 0 && 'text-green-500')}>
            {cell.getValue<MarketState>()}
          </div>
        );
      },
      enableSorting: false,
      header: ({ column }) => <DataTableColumnHeader column={column} label="Funding Rate" />,
      id: 'funding_rate',
      meta: {
        label: 'Funding Rate',
      },
    },
    {
      accessorKey: 'ranking.score',
      cell({ cell }) {
        return cell.getValue<number>().toFixed(4);
      },
      enableSorting: false,
      header: ({ column }) => <DataTableColumnHeader column={column} label="Score" />,
      id: 'score',
      meta: {
        label: 'Score',
      },
    },
    // {
    //   cell() {
    //     return (
    //       <Button size="sm" variant="default">
    //         <Bot className="mr-2 h-4 w-4" />
    //         Set Bot
    //       </Button>
    //     );
    //   },
    //   id: 'actions',
    // },
  ];
}
