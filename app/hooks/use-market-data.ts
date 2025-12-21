import { useEffect, useState } from 'react';

export interface Asset {
  id: string;
  name: string;
  symbol: string;
  logo: string;
  price: string;
  change24h: string;
  isPositive: boolean;
  trendSvg: string;
  sentiment: {
    label: string;
    score: number;
    colorClass: string;
  };
  action: 'bot' | 'trade';
}

const MOCK_ASSETS: Asset[] = [
  {
    action: 'bot',
    change24h: '1.2%',
    id: 'btc',
    isPositive: false,
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCC6LT3kcWC6kHerLC9KQ8VWF1Mzmc2DD1C70WG-7K2ZGMBKythLcmJxX1YZF4v0QYOtxhso9NCWrpdQNuMJsEX_i1Au-EvKW8t-SBPM8ELvp-9Ef7DibKbLNm0G-ysV9IJPauXH0wfIrhl5cA2d9-AtI90Ikp1qJvHkA26W-xrHHTQFsFwnKHjNOSl9J8Rs7nng0ORgjWK0oDXtw3wcvNNO5Ik9N4Abd5sHY_Xverc2g9yljTfepN8KFy4wxsISpyqQEVCblsA_iM',
    name: 'Bitcoin',
    price: '$42,305.00',
    sentiment: { colorClass: 'bg-primary', label: 'Very High', score: 85 },
    symbol: 'BTC',
    trendSvg: 'M1 15L15 25L30 10L45 20L60 5L75 15L89 8',
  },
  {
    action: 'trade',
    change24h: '4.5%',
    id: 'eth',
    isPositive: true,
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBiGQYNs4U9Sh9YUB6jaf2ksQuThJVA_W3CmUpK7p9y3P93WXy2IPHZNBenV4ew4H_k8jkclLW8Ch1wnrgsTT5emROfjmKxFbUe6xc17JoqE_Y2CY62P0KFbL2gODUOxlT-LZYoGyZRlp7Byv9wg9Ml4WVGBuaUY5s-FnhbHHAsApYwu-7dRAvTZbjrTaViP_Eytv38mRmvGmFcWzGkv2KQQMJ0SDihWIlLqbz8oHk3olDRhQQ3hNlYSiCZOUM-S9ki7qFYVVzpnRk',
    name: 'Ethereum',
    price: '$2,210.50',
    sentiment: { colorClass: 'bg-slate-400 dark:bg-slate-500', label: 'Neutral', score: 60 },
    symbol: 'ETH',
    trendSvg: 'M1 25L15 20L30 25L45 10L60 15L75 5L89 1',
  },
  {
    action: 'bot',
    change24h: '3.1%',
    id: 'sol',
    isPositive: false,
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLLN4a39dpD0iINfwh7-59KGbcn7kYxvwf6KMDV4h9VBpMLx59A3vzdUiKfFG7wBJ551JKYzZ3wyCTFfuTgbVVB1KnmeFBll9aiOBSQZxOuyApnHwzaCAix_x-6rwJZTs_eIlGpiY0xdipVfjJ5mnHWRZxsibLxTEWyuPjY_tl6Dxqzjur8Tti0_cRydpvuKlAevFLXGV1TjFR0t208J6SquEnIsDdF2trDNlsFG5hZS3Kortj--WbI20KQKroZapQ6syBkij8ZXA',
    name: 'Solana',
    price: '$98.45',
    sentiment: { colorClass: 'bg-primary', label: 'Extreme', score: 92 },
    symbol: 'SOL',
    trendSvg: 'M1 10L15 20L30 5L45 15L60 10L75 25L89 18',
  },
  {
    action: 'trade',
    change24h: '1.2%',
    id: 'ada',
    isPositive: true,
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPV8zOjGeV8TuuR31_BiB8D_HBSnT855OnUYQ7QJ1c_L9UJFmtl7amq43f9_OSJKaT9VY6hoJMbjvGYheVl6-pQACKmGpBLd-2Tvv4FfNFDyFSwx7UUJbd-uY9_QNGnxASK8CDybqq73wIZ809nIT52J-sYSrNLfWeEJmM14LJzDWItK_fdoIzMPtFCUlGfVVdmz_7MbqLiN7i_rdIJkuN4IJ0CpvKJQ8FEyKXn75AYaFhlC4r0AUJb6sRls1aok_iS48LMXCLX30',
    name: 'Cardano',
    price: '$0.55',
    sentiment: { colorClass: 'bg-slate-400 dark:bg-slate-500', label: 'Low', score: 45 },
    symbol: 'ADA',
    trendSvg: 'M1 20L15 25L30 15L45 20L60 10L75 15L89 5',
  },
  {
    action: 'bot',
    change24h: '0.5%',
    id: 'dot',
    isPositive: false,
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATJMb5zMTLQohH3lKrHXUr004TsAs0A4xJIOzWONxszvPut4FPDLBU4JItP5skIlq9kKUl6hWfF_D5xggt9_9KTZlXWPxBoRlj6lklyFcuRf6WG3_lnTk0PnZar27dBZMbjzi0P_OpnSVqoxTxdh161_PdpQMJ_yNCKja6ZvO4YK7I0r8UZY2I_U-8oHPCzsF_UASalS41KrXyvsoyT79R3oQNfGOLGAvPlSW4-xomE2aQF1hflhscR9Gk7zu9aYyNDXWygLiJjes',
    name: 'Polkadot',
    price: '$7.20',
    sentiment: { colorClass: 'bg-primary', label: 'High', score: 78 },
    symbol: 'DOT',
    trendSvg: 'M1 15L15 20L30 10L45 15L60 5L75 10L89 8',
  },
];

export function useMarketData() {
  const [data, setData] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      setData(MOCK_ASSETS);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return { data, isLoading };
}
