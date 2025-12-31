import type { LoaderFunction } from 'react-router';

declare global {
  export type Primitive = string | number | boolean;

  export type LoaderData<TLoaderFn extends LoaderFunction> = Awaited<ReturnType<TLoaderFn>> extends
    | Response
    | infer D
    ? D
    : never;

  export interface DataTableColumn<T> {
    header: React.ReactNode;
    cell: (row: T, index: number) => React.ReactNode;
    headClassName?: string;
    cellClassName?: string;
  }

  export interface DataTableProps<T> {
    columns: DataTableColumn<T>[];
    data: T[];
    rowKey: (row: T, index: number) => React.Key;
    tableClassName?: string;
    headerClassName?: string;
    headerRowClassName?: string;
    headerCellClassName?: string;
    bodyRowClassName?: string;
    bodyCellClassName?: string;
  }
}
