import { Suspense, useMemo } from 'react';
import { type MetaFunction, useLoaderData } from 'react-router';
import { DataTable } from '~/components/data-table/data-table';
import { DataTableSkeleton } from '~/components/data-table/data-table-skeleton';
import { DataTableToolbar } from '~/components/data-table/data-table-toolbar';
import { StatsDisplay } from '~/components/markets/stats-display';
import { PRE_PUMP } from '~/constants/endpoint';
import { useDataTable } from '~/hooks/use-data-table';
import { server } from '~/provider/instance';
import type { PrePumpResponse } from '~/services/market';
import { marketColumns } from './column';

export const meta: MetaFunction = () => [{ title: 'Markets - Coin List' }];

export async function loader() {
  return await server.get<PrePumpResponse>(PRE_PUMP);
}

export default function MarketsPage() {
  const { data } = useLoaderData<typeof loader>();

  const columns = useMemo(() => marketColumns(), []);

  const { table } = useDataTable({
    clearOnDefault: true,
    columns,
    data: data.result,
    getRowId: (originalRow) => originalRow.symbol,
    pageCount: 10,
    shallow: true,
  });

  return (
    <div className="flex justify-center px-4 py-8 md:px-6 lg:px-40">
      <div className="flex w-full max-w-[1200px] flex-col gap-6">
        <StatsDisplay />
        <Suspense
          fallback={
            <DataTableSkeleton
              cellWidths={['10rem', '30rem', '10rem', '10rem', '6rem', '6rem', '6rem']}
              columnCount={7}
              filterCount={2}
              shrinkZero
            />
          }
        >
          <DataTable table={table}>
            <DataTableToolbar table={table} />
          </DataTable>
        </Suspense>
      </div>
    </div>
  );
}
