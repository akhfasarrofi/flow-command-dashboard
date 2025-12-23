import { TrendingUp } from 'lucide-react';
import { type MetaFunction, useLoaderData } from 'react-router';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { PRE_PUMP } from '~/constants/endpoint';
import { fetchServer } from '~/provider/instance';
import type { PrePumpResponse } from '~/services/market';
import StatsDisplay from './stats-display';
import AllAssets from './tabs-content/all-assets';

export const meta: MetaFunction = () => [{ title: 'Markets - Coin List' }];

export async function loader() {
  const allAssets = await fetchServer.get<PrePumpResponse>(PRE_PUMP);

  return { allAssets };
}

export default function MarketsPage() {
  const { allAssets } = useLoaderData<typeof loader>();

  return (
    <div className="flex justify-center px-4 py-8 md:px-6 lg:px-40">
      <div className="flex w-full max-w-[1200px] flex-col gap-6">
        <StatsDisplay />
        <Tabs defaultValue="all-assets">
          <TabsList>
            <TabsTrigger value="all-assets">All Assets</TabsTrigger>
            <TabsTrigger value="top-gainers">Top Gainers</TabsTrigger>
            <TabsTrigger value="high-sentiment">
              <TrendingUp className="mr-1.5 size-4" />
              High Sentiment
            </TabsTrigger>
            <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
          </TabsList>
          <TabsContent value="all-assets">
            <AllAssets data={allAssets.data.results} />
          </TabsContent>
          <TabsContent value="top-gainers">
            <div>Top Gainers</div>
          </TabsContent>
          <TabsContent value="high-sentiment">
            <div>High Sentiment</div>
          </TabsContent>
          <TabsContent value="watchlist">
            <div>Watchlist</div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
