import clsx from 'clsx';
import { useMemo, useState } from 'react';
import CandlestickAdvanceChart from '~/components/candlestick/candlestick-advance-chart';
// import CandlestickBasicChart from '~/components/candlestick/candlestick-basic-chart';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import useIsMobile from '~/hooks/use-mobile';
import InformationTable from './table/information-table';
import PrepumpTable from './table/prepump-table';

export default function MarketLayout() {
  const isMobile = useIsMobile();
  const [selectedPrepumpItem, setSelectedPrepumpItem] = useState<string | null>(null);

  const tabs = useMemo(() => {
    return [
      {
        content: <InformationTable />,
        name: 'Information',
        value: 'information',
      },
      {
        content: <div>Watchlist</div>,
        name: 'Watchlist',
        value: 'watchlist',
      },
    ];
  }, []);

  return (
    <div className="flex justify-center">
      <div className="flex w-full flex-col gap-6">
        <div className="flex w-full flex-col gap-6 md:flex-row">
          <Card className="min-w-0 flex-1 border-none">
            <CandlestickAdvanceChart symbol={selectedPrepumpItem || 'BTCUSDT'} />
            {/* <CandlestickBasicChart coinId={selectedPrepumpItem || 'BTCUSDT'} /> */}
          </Card>
          <Card className="border-none h-full w-full md:w-[20rem] lg:w-100">
            <CardHeader>
              <CardTitle>Pre Pump</CardTitle>
            </CardHeader>
            <CardContent>
              <PrepumpTable onSelectionChange={setSelectedPrepumpItem} />
            </CardContent>
          </Card>
        </div>
        <Tabs defaultValue="information">
          <div className={clsx(isMobile && 'max-w-87.5e overflow-auto', !isMobile && 'w-full')}>
            <TabsList>
              {tabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.name}
                </TabsTrigger>
              ))}
            </TabsList>
            {tabs.map((tab) => (
              <TabsContent key={tab.value} value={tab.value}>
                {tab.content}
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </div>
  );
}
