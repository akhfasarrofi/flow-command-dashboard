import { RefreshCw } from 'lucide-react';
import { memo, Suspense, useMemo } from 'react';
import { useRevalidator } from 'react-router';
import { DataTable } from '~/components/data-table/data-table';
import { DataTableSkeleton } from '~/components/data-table/data-table-skeleton';
import { DataTableToolbar } from '~/components/data-table/data-table-toolbar';
import { Button } from '~/components/ui/button';
import { useDataTable } from '~/hooks/use-data-table';
import { informationColumns } from './information-columns';
import type { MarketResponse } from '~/services/market/types';

function Information({ data }: { data: MarketResponse }) {
  const columns = useMemo(() => informationColumns(), []);
  const revalidator = useRevalidator();

  const { table } = useDataTable({
    clearOnDefault: true,
    columns,
    data,
    getRowId: (originalRow) => originalRow.pairInformation.symbol,
    pageCount: 10,
    shallow: true,
  });

  function onRefetch() {
    revalidator.revalidate();
  }

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table}>
        <Button onClick={onRefetch} size="icon" variant="outline">
          <RefreshCw />
        </Button>
      </DataTableToolbar>
    </DataTable>
  );
}

export default memo(Information);
