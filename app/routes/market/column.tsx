import type { ColumnDef } from '@tanstack/react-table';
import { Bot, Text } from 'lucide-react';
import { DataTableColumnHeader } from '~/components/data-table/data-table-column-header';
import { Button } from '~/components/ui/button';
import type { PrePumpResult } from '~/services/market';

export function marketColumns(): ColumnDef<PrePumpResult>[] {
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
        placeholder: 'Search symbol...',
        variant: 'text',
      },
    },
    {
      accessorKey: 'market_state',
      enableHiding: false,
      enableSorting: false,
      header: ({ column }) => <DataTableColumnHeader column={column} label="Market State" />,
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
      enableSorting: false,
      header: ({ column }) => <DataTableColumnHeader column={column} label="OI Change" />,
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
    {
      accessorKey: 'metrics.atr_compression',
      enableSorting: false,
      header: ({ column }) => <DataTableColumnHeader column={column} label="ATR" />,
      id: 'atr_compression',
      meta: {
        label: 'ATR',
      },
    },
    {
      accessorKey: 'metrics.funding_rate',
      cell: ({ cell }) => {
        return cell.getValue<number>().toFixed(6);
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
      cell: ({ cell }) => {
        return cell.getValue<number>().toFixed(4);
      },
      enableSorting: false,
      header: ({ column }) => <DataTableColumnHeader column={column} label="Score" />,
      id: 'score',
      meta: {
        label: 'Score',
      },
    },
    {
      cell: () => {
        return (
          <Button size="sm" variant="default">
            <Bot className="mr-2 h-4 w-4" />
            Set Bot
          </Button>
        );
      },
      id: 'actions',
    },
  ];
}
