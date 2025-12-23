import { RefreshCw } from 'lucide-react';
import { memo, useMemo, useState } from 'react';
import { useRevalidator } from 'react-router';
import { DataTable } from '~/components/data-table/data-table';
import { DataTableToolbar } from '~/components/data-table/data-table-toolbar';
import { Button } from '~/components/ui/button';
import { useDataTable } from '~/hooks/use-data-table';
import { informationColumns, type MarketDataMap } from './information-columns';
import type { MarketResponse } from '~/services/market/types';

function Information({ data }: { data: MarketResponse }) {
  const [dataState, setDataState] = useState<{
    current: MarketResponse;
    previous: MarketResponse | null;
  }>({
    current: data,
    previous: null,
  });

  if (data !== dataState.current) {
    setDataState({
      current: data,
      previous: dataState.current,
    });
  }

  const prevDataMap = useMemo(() => {
    const map: MarketDataMap = {};
    if (dataState.previous) {
      for (const item of dataState.previous) {
        map[item.pairInformation.symbol] = item;
      }
    }
    return map;
  }, [dataState.previous]);

  const columns = useMemo(() => informationColumns(prevDataMap), [prevDataMap]);
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
