import type { ColumnDef } from '@tanstack/react-table';
import clsx from 'clsx';
import { TrendingDown, TrendingUp } from 'lucide-react';
import type { ReactNode } from 'react';
import { DataTableColumnHeader } from '~/components/data-table/data-table-column-header';
import { Button } from '~/components/ui/button';
import { Checkbox } from '~/components/ui/checkbox';
import type { MarketState, PrePumpItem } from '~/services/market/types';

export function prepumpColumns(): ColumnDef<PrePumpItem>[] {
  return [
    {
      cell: ({ row }) => (
        <Checkbox
          aria-label="Select row"
          checked={row.getIsSelected()}
          className="translate-y-0.5"
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
      id: 'select',
    },
    {
      accessorFn: (row) => row.symbol,
      enableColumnFilter: true,
      enableHiding: false,
      enableSorting: false,
      header: ({ column }) => <DataTableColumnHeader column={column} label="Asset" />,
      id: 'symbol',
    },
    {
      accessorFn: (row) => row.market_state,
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
      header: ({ column }) => <DataTableColumnHeader column={column} label="State" />,
      id: 'market_state',
    },
    // {
    //   accessorFn: (row) => row.ranking.tier,
    //   enableHiding: false,
    //   enableSorting: false,
    //   header: ({ column }) => <DataTableColumnHeader column={column} label="Tier" />,
    //   id: 'tier',
    //   maxSize: 60,
    // },
    {
      accessorFn: (row) => row.metrics.notional_oi_change_pct,
      cell({ cell }) {
        const value = cell.getValue<number>();
        return (
          <div className={clsx(value < 0 && 'text-red-500', value > 0 && 'text-green-500')}>
            {cell.getValue<MarketState>()}
          </div>
        );
      },
      enableSorting: false,
      header: ({ column }) => <DataTableColumnHeader column={column} label="OI" />,
      id: 'notional_oi_change_pct',
      meta: {
        label: 'OI Change',
      },
    },
    {
      accessorFn: (row) => row.metrics.price_efficiency,
      cell: ({ cell }) => cell.getValue<number>().toFixed(3),
      enableSorting: false,
      header: ({ column }) => <DataTableColumnHeader column={column} label="Price" />,
      id: 'price_efficiency',
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
      accessorFn: (row) => row.metrics.funding_rate,
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
      accessorFn: (row) => row.ranking.score,
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
