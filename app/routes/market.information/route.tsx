import { Await, useLoaderData, type MetaFunction } from 'react-router';
import { TabsContent } from '~/components/ui/tabs';
import InformationTable from './information-table';
import { fetchInformation } from '~/services/market';
import { DataTableSkeleton } from '~/components/data-table/data-table-skeleton';
import { Suspense } from 'react';

export const meta: MetaFunction = () => [{ title: 'Market - Information' }];

export function loader() {
  return {
    marketData: fetchInformation(),
  };
}

export default function MarketInformationPage() {
  const { marketData } = useLoaderData<typeof loader>();

  return (
    <TabsContent value="information">
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
        <Await resolve={marketData}>{(resolved) => <InformationTable data={resolved} />}</Await>
      </Suspense>
    </TabsContent>
  );
}
