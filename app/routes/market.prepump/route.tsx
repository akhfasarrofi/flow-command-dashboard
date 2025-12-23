import { Await, useLoaderData, type MetaFunction } from 'react-router';
import { TabsContent } from '~/components/ui/tabs';
import PrepumpTable from './prepump-table';
import { fetchPrePump } from '~/services/market';
import { Suspense } from 'react';
import { DataTableSkeleton } from '~/components/data-table/data-table-skeleton';

export const meta: MetaFunction = () => [{ title: 'Market - Pre pump' }];

export function loader() {
  return {
    prePumpData: fetchPrePump(),
  };
}

export default function MarketPage() {
  const { prePumpData } = useLoaderData<typeof loader>();

  return (
    <TabsContent value="prepump">
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
        <Await resolve={prePumpData}>{(resolved) => <PrepumpTable data={resolved} />}</Await>
      </Suspense>
    </TabsContent>
  );
}
