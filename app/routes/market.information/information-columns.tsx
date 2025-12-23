import type { ColumnDef } from '@tanstack/react-table';
import { Text } from 'lucide-react';
import type { MarketItem, MarketLS } from '~/services/market/types';

export type MarketDataMap = Record<string, MarketItem>;

type LSKey = keyof Pick<MarketLS, 'lsGlobalAccount' | 'lsTopAccount' | 'lsTopPosition'>;

function getChangeColor(current: number, previous?: number, defaultColorClass?: string) {
  if (previous === undefined) return defaultColorClass;
  if (current > previous) return 'text-green-500';
  if (current < previous) return 'text-red-500';
  return defaultColorClass;
}

function createLsColumns(
  lsKey: LSKey,
  label: string,
  prevDataMap: MarketDataMap,
): ColumnDef<MarketItem>[] {
  return [
    {
      accessorFn: (row) => Number(row.pairInformation.ls[lsKey].raw.longAccount),
      cell: ({ row, getValue }) => {
        const val = getValue<number>();
        const prevRow = prevDataMap[row.original.pairInformation.symbol];
        const prevVal = prevRow
          ? Number(prevRow.pairInformation.ls[lsKey].raw.longShortRatio)
          : undefined;
        const defaultColor = val < 1 ? 'text-red-500' : 'text-green-500';
        return <span className={getChangeColor(val, prevVal, defaultColor)}>{val.toFixed(2)}</span>;
      },
      header: `${label} Long`,
      id: `${lsKey}-long`,
      meta: {
        label: `${label} Long`,
      },
    },
    {
      accessorFn: (row) => Number(row.pairInformation.ls[lsKey].raw.shortAccount),
      cell: ({ row, getValue }) => {
        const val = getValue<number>();
        const prevRow = prevDataMap[row.original.pairInformation.symbol];
        const prevVal = prevRow
          ? Number(prevRow.pairInformation.ls[lsKey].raw.longShortRatio)
          : undefined;
        const defaultColor = val < 1 ? 'text-red-500' : 'text-green-500';
        return <span className={getChangeColor(val, prevVal, defaultColor)}>{val.toFixed(2)}</span>;
      },
      header: `${label} Short`,
      id: `${lsKey}-short`,
      meta: {
        label: `${label} Short`,
      },
    },
    {
      accessorFn: (row) => Number(row.pairInformation.ls[lsKey].raw.longShortRatio),
      cell: ({ row, getValue }) => {
        const val = getValue<number>();
        const prevRow = prevDataMap[row.original.pairInformation.symbol];
        const prevVal = prevRow
          ? Number(prevRow.pairInformation.ls[lsKey].raw.longShortRatio)
          : undefined;
        const defaultColor = val < 1 ? 'text-red-500' : 'text-green-500';
        return <span className={getChangeColor(val, prevVal, defaultColor)}>{val.toFixed(2)}</span>;
      },
      enableHiding: false,
      header: `${label} LS Ratio`,
      id: `${lsKey}-ratio`,
    },
  ];
}

export function informationColumns(prevDataMap: MarketDataMap = {}): ColumnDef<MarketItem>[] {
  return [
    {
      accessorFn: (row) => row.pairInformation.symbol,
      enableHiding: false,
      enableSorting: false,
      id: 'symbol',
      meta: {
        icon: Text,
        label: 'Asset',
        placeholder: 'Search assets...',
        variant: 'text',
      },
    },
    ...createLsColumns('lsGlobalAccount', 'GA', prevDataMap),
    ...createLsColumns('lsTopAccount', 'TA', prevDataMap),
    ...createLsColumns('lsTopPosition', 'TP', prevDataMap),
  ];
}
