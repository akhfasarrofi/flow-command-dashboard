import { RefreshCw } from 'lucide-react';
import { memo, Suspense, useMemo } from 'react';
import { useRevalidator } from 'react-router';
import { DataTable } from '~/components/data-table/data-table';
import { DataTableSkeleton } from '~/components/data-table/data-table-skeleton';
import { DataTableToolbar } from '~/components/data-table/data-table-toolbar';
import { Button } from '~/components/ui/button';
import { useDataTable } from '~/hooks/use-data-table';
import type { PrePumpResponse } from '~/services/market';
import { columnConfig } from '../columns-config';

function AllAssets({ data }: { data: PrePumpResponse['results'] }) {
  const columns = useMemo(() => columnConfig(), []);
  const revalidator = useRevalidator();

  const { table } = useDataTable({
    clearOnDefault: true,
    columns,
    data,
    getRowId: (originalRow) => originalRow.symbol,
    pageCount: 10,
    shallow: true,
  });

  function onRefetch() {
    revalidator.revalidate();
  }

  return (
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
        <DataTableToolbar table={table}>
          <Button onClick={onRefetch} size="icon" variant="outline">
            <RefreshCw />
          </Button>
        </DataTableToolbar>
      </DataTable>
    </Suspense>
  );
}

export default memo(AllAssets);
