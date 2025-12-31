import type { ColumnDef } from '@tanstack/react-table';
import { Text } from 'lucide-react';
import { DataTableColumnHeader } from '~/components/data-table/data-table-column-header';
import { Checkbox } from '~/components/ui/checkbox';
import type { InformationItem, MarketLS } from '~/services/market/types';

export type MarketDataMap = Record<string, InformationItem>;

type LSKey = keyof Pick<MarketLS, 'lsGlobalAccount' | 'lsTopAccount' | 'lsTopPosition'>;

function createLsColumns(lsKey: LSKey, label: string): ColumnDef<InformationItem>[] {
  return [
    {
      accessorFn: (row) => Number(row.pairInformation.ls[lsKey].raw.longAccount),
      cell: ({ getValue }) => getValue<number>().toFixed(2),
      header: `${label} Long`,
      id: `${lsKey}-long`,
      meta: {
        label: `${label} Long`,
      },
    },
    {
      accessorFn: (row) => Number(row.pairInformation.ls[lsKey].raw.shortAccount),
      cell: ({ getValue }) => getValue<number>().toFixed(2),
      header: `${label} Short`,
      id: `${lsKey}-short`,
      meta: {
        label: `${label} Short`,
      },
    },
    {
      accessorFn: (row) => Number(row.pairInformation.ls[lsKey].raw.longShortRatio),
      cell: ({ getValue }) => getValue<number>().toFixed(2),
      enableHiding: false,
      header: `${label} LS Ratio`,
      id: `${lsKey}-ratio`,
    },
  ];
}

export function informationColumns(): ColumnDef<InformationItem>[] {
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
      accessorFn: (row) => row.pairInformation.symbol,
      enableHiding: false,
      enableSorting: false,
      header: ({ column }) => <DataTableColumnHeader column={column} label="Assets" />,
      id: 'symbol',
      meta: {
        icon: Text,
        label: 'Asset',
        placeholder: 'Search assets...',
        variant: 'text',
      },
    },
    ...createLsColumns('lsGlobalAccount', 'GA'),
    ...createLsColumns('lsTopAccount', 'TA'),
    ...createLsColumns('lsTopPosition', 'TP'),
  ];
}
