import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs';
// import StatsDisplay from './test-market/stats-display';
import { useMemo } from 'react';
import clsx from 'clsx';
import useIsMobile from '~/hooks/use-mobile';
import { NavLink, Outlet, useLocation } from 'react-router';

export default function MarketLayout() {
  const isMobile = useIsMobile();
  const { pathname } = useLocation();

  const tabs = useMemo(() => {
    return [
      {
        name: 'Pre Pump',
        path: '/market/prepump',
        value: 'prepump',
      },
      {
        name: 'Information',
        path: '/market/information',
        value: 'information',
      },
      {
        name: 'High Sentiment',
        path: '/market/high-sentiment',
        value: 'high-sentiment',
      },
      {
        name: 'Watchlist',
        path: '/market/watchlist',
        value: 'watchlist',
      },
    ];
  }, []);

  const activeTab = useMemo(() => {
    return (
      tabs.find((tab) => pathname === tab.path || pathname.startsWith(`${tab.path}/`))?.value ??
      'prepump'
    );
  }, [pathname, tabs]);

  return (
    <div className="flex justify-center px-4 py-8 md:px-6 lg:px-40">
      <div className="flex w-full flex-col gap-6">
        {/* <StatsDisplay /> */}
        <Tabs value={activeTab}>
          <div className={clsx(isMobile && 'max-w-87.5e overflow-auto', !isMobile && 'w-full')}>
            <TabsList>
              {tabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  <NavLink to={tab.path}>{tab.name}</NavLink>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          <Outlet />
          {/* {triggers.map((trigger) => (
            <TabsContent key={trigger.value} value={trigger.value}>
              {trigger.content}
            </TabsContent>
          ))} */}
        </Tabs>
      </div>
    </div>
  );
}
