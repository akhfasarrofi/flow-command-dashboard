import { RefreshCw } from 'lucide-react';
import { memo, useEffect, useMemo } from 'react';
import { DataTable } from '~/components/data-table/data-table';
import { DataTableSkeleton } from '~/components/data-table/data-table-skeleton';
import { Button } from '~/components/ui/button';
import { useDataTable } from '~/hooks/use-data-table';
import { usePrepumpRankQuery } from '~/services/market/use-prepump-rank-query';
import { prepumpColumns } from '../columns/prepump-columns';

interface PrepumpTableProps {
  onSelectionChange?: (value: string | null) => void;
}

function PrepumpTable({ onSelectionChange }: PrepumpTableProps) {
  const { data, isLoading } = usePrepumpRankQuery();

  const columns = useMemo(() => prepumpColumns(), []);

  const { table } = useDataTable({
    clearOnDefault: true,
    columns,
    data: data?.results ?? [],
    enableMultiRowSelection: false,
    enableRowSelection: true,
    getRowId: (row) => row.symbol,
    pageCount: 10,
    shallow: false,
  });

  const selectedRow = table.getFilteredSelectedRowModel().rows[0]?.original;

  useEffect(() => {
    if (selectedRow) {
      onSelectionChange?.(selectedRow.symbol);
      return;
    }
    onSelectionChange?.(null);
  }, [selectedRow, onSelectionChange]);

  if (isLoading) {
    return (
      <DataTableSkeleton
        cellWidths={['10rem', '30rem', '10rem', '10rem', '6rem', '6rem', '6rem']}
        columnCount={7}
        filterCount={2}
        rowCount={7}
        shrinkZero
        withPagination={false}
      />
    );
  }

  return (
    <DataTable isPaginate={false} table={table} wrapperClassname={'h-93.75'}>
      <Button size="icon" variant="outline">
        <RefreshCw />
      </Button>
    </DataTable>
  );
}

export default memo(PrepumpTable);
