import { RefreshCw } from 'lucide-react';
import { memo, useMemo } from 'react';
import { DataTable } from '~/components/data-table/data-table';
import { DataTableSkeleton } from '~/components/data-table/data-table-skeleton';
import { DataTableToolbar } from '~/components/data-table/data-table-toolbar';
import { Button } from '~/components/ui/button';
import { useDataTable } from '~/hooks/use-data-table';
import { usePairInformationQuery } from '~/services/market/use-pair-information-query';
import { informationColumns } from '../columns/information-columns';

function Information() {
  const { data, isLoading } = usePairInformationQuery();

  const columns = useMemo(() => informationColumns(), []);

  const { table } = useDataTable({
    clearOnDefault: true,
    columns,
    data: data ?? [],
    getRowId: (row) => row.pairInformation.symbol,
    pageCount: 10,
    shallow: false,
  });

  if (isLoading) {
    return (
      <DataTableSkeleton
        cellWidths={['10rem', '30rem', '10rem', '10rem', '6rem', '6rem', '6rem']}
        columnCount={7}
        filterCount={2}
        shrinkZero
      />
    );
  }

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table}>
        <Button size="icon" variant="outline">
          <RefreshCw />
        </Button>
      </DataTableToolbar>
    </DataTable>
  );
}

export default memo(Information);
