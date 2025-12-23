import { RefreshCw } from 'lucide-react';
import { memo, useMemo } from 'react';
import { useRevalidator } from 'react-router';
import { DataTable } from '~/components/data-table/data-table';
import { DataTableToolbar } from '~/components/data-table/data-table-toolbar';
import { Button } from '~/components/ui/button';
import { useDataTable } from '~/hooks/use-data-table';
import { prepumpColumns } from './prepump-columns';
import type { PrePumpResponse } from '~/services/market/types';

function PrepumpTable({ data }: { data: PrePumpResponse }) {
  const { results } = data;
  const revalidater = useRevalidator();
  const columns = useMemo(() => prepumpColumns(), []);

  const { table } = useDataTable({
    clearOnDefault: true,
    columns,
    data: results,
    getRowId: (originalRow) => originalRow.symbol,
    pageCount: 10,
    shallow: true,
  });

  function onRefetch() {
    revalidater.revalidate();
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

export default memo(PrepumpTable);
