import type { ColumnDef } from '@tanstack/react-table';
import { Text } from 'lucide-react';
import { DataTableColumnHeader } from '~/components/data-table/data-table-column-header';
import type { MarketItem, MarketLS } from '~/services/market/types';

type LSKey = keyof Pick<MarketLS, 'lsGlobalAccount' | 'lsTopAccount' | 'lsTopPosition'>;

function createLsColumns(lsKey: LSKey, label: string): ColumnDef<MarketItem> {
  return {
    columns: [
      {
        accessorFn: (row) => Number(row.pairInformation.ls[lsKey].raw.longAccount),
        header: 'Long',
        id: `${lsKey}-long`,
      },
      {
        accessorFn: (row) => Number(row.pairInformation.ls[lsKey].raw.shortAccount),
        header: 'Short',
        id: `${lsKey}-short`,
      },
      {
        accessorFn: (row) => Number(row.pairInformation.ls[lsKey].raw.longShortRatio),
        cell: ({ getValue }) => {
          const v = getValue<number>();
          return <span className={v < 1 ? 'text-red-500' : 'text-green-500'}>{v.toFixed(2)}</span>;
        },
        header: 'LS Ratio',
        id: `${lsKey}-ratio`,
      },
      {
        accessorFn: (row) => row.pairInformation.ls[lsKey].normalized,
        header: 'Norm',
        id: `${lsKey}-normalized`,
      },
    ],
    header: label,
  };
}

export function informationColumns(): ColumnDef<MarketItem>[] {
  return [
    {
      accessorFn: (row) => row.pairInformation.symbol,
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
    createLsColumns('lsGlobalAccount', 'Global Account'),
    createLsColumns('lsTopAccount', 'Top Account'),
    createLsColumns('lsTopPosition', 'Top Position'),
  ];
}
