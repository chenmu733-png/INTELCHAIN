'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { fetchMarkets, fetchGlobal, fetchCoinMarketChart } from '@/lib/api';
import { usd, pct } from '@/lib/format';
import { Card, CardTitle } from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';
import DataTable from '@/components/ui/DataTable';
import Heatmap from '@/components/markets/Heatmap';
import LineChart from '@/components/charts/LineChart';

const RANGES = [
  { label: '7D', days: 7 },
  { label: '30D', days: 30 },
  { label: '90D', days: 90 },
  { label: '1Y', days: 365 }
];

export default function MarketsPage() {
  const [selected, setSelected] = useState('bitcoin');
  const [days, setDays] = useState(30);

  const markets = useQuery({
    queryKey: ['markets', 100],
    queryFn: () => fetchMarkets(100)
  });
  const global = useQuery({ queryKey: ['global'], queryFn: fetchGlobal });
  const chart = useQuery({
    queryKey: ['chart', selected, days],
    queryFn: () => fetchCoinMarketChart(selected, days)
  });

  const coins = markets.data || [];
  const g = global.data;

  const gainers = [...coins]
    .sort((a, b) => (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0))
    .slice(0, 5);
  const losers = [...coins]
    .sort((a, b) => (a.price_change_percentage_24h || 0) - (b.price_change_percentage_24h || 0))
    .slice(0, 5);

  const columns = [
    {
      key: 'name',
      header: 'Asset',
      render: (c) => (
        <button
          onClick={() => setSelected(c.id)}
          className="flex items-center gap-2 text-left hover:text-neon"
        >
          <img src={c.image} alt="" className="h-5 w-5" />
          <span className="font-medium">{c.symbol?.toUpperCase()}</span>
          <span className="hidden text-gray-500 sm:inline">{c.name}</span>
        </button>
      ),
      sortValue: (c) => c.name
    },
    {
      key: 'current_price',
      header: 'Price',
      align: 'right',
      render: (c) => usd(c.current_price, { compact: false })
    },
    {
      key: 'price_change_percentage_24h',
      header: '24h',
      align: 'right',
      render: (c) => (
        <span className={(c.price_change_percentage_24h || 0) >= 0 ? 'text-neon' : 'text-red-400'}>
          {pct(c.price_change_percentage_24h)}
        </span>
      )
    },
    {
      key: 'price_change_percentage_7d_in_currency',
      header: '7d',
      align: 'right',
      hideMobile: true,
      render: (c) => (
        <span className={(c.price_change_percentage_7d_in_currency || 0) >= 0 ? 'text-neon' : 'text-red-400'}>
          {pct(c.price_change_percentage_7d_in_currency)}
        </span>
      )
    },
    {
      key: 'total_volume',
      header: 'Volume',
      align: 'right',
      hideMobile: true,
      render: (c) => usd(c.total_volume)
    },
    {
      key: 'market_cap',
      header: 'Market Cap',
      align: 'right',
      render: (c) => usd(c.market_cap)
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Markets</h1>
        <p className="mt-1 text-sm text-gray-400">
          Live crypto market overview, dominance, heatmap, and historical charts.
        </p>
      </div>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: 'Total Market Cap', value: usd(g?.total_market_cap?.usd) },
          { label: '24h Volume', value: usd(g?.total_volume?.usd) },
          { label: 'BTC Dominance', value: g ? `${g.market_cap_percentage?.btc?.toFixed(1)}%` : '\u2014' },
          { label: 'ETH Dominance', value: g ? `${g.market_cap_percentage?.eth?.toFixed(1)}%` : '\u2014' }
        ].map((s) => (
          <Card key={s.label}>
            <p className="text-xs uppercase tracking-wide text-gray-500">{s.label}</p>
            {global.isLoading ? (
              <Skeleton className="mt-2 h-6 w-24" />
            ) : (
              <p className="mt-1 text-lg font-bold text-white">{s.value}</p>
            )}
          </Card>
        ))}
      </section>

      <Card>
        <CardTitle
          action={
            <div className="flex gap-1">
              {RANGES.map((r) => (
                <button
                  key={r.days}
                  onClick={() => setDays(r.days)}
                  className={`rounded-md px-2 py-1 text-xs ${
                    days === r.days ? 'bg-neon/15 text-neon' : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          }
        >
          {selected.charAt(0).toUpperCase() + selected.slice(1)} price
        </CardTitle>
        {chart.isLoading ? (
          <Skeleton className="h-[260px] w-full" />
        ) : chart.isError || !chart.data?.length ? (
          <p className="py-16 text-center text-sm text-gray-500">Chart data unavailable.</p>
        ) : (
          <LineChart data={chart.data} />
        )}
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardTitle>Top Gainers (24h)</CardTitle>
          {markets.isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-full" />
              ))}
            </div>
          ) : (
            <ul className="space-y-1">
              {gainers.map((c) => (
                <li key={c.id} className="flex items-center justify-between rounded-lg px-2 py-2 hover:bg-white/5">
                  <div className="flex items-center gap-2">
                    <img src={c.image} alt="" className="h-5 w-5" />
                    <span className="text-sm font-medium">{c.symbol?.toUpperCase()}</span>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-neon">
                    <TrendingUp size={12} /> {pct(c.price_change_percentage_24h)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card>
          <CardTitle>Top Losers (24h)</CardTitle>
          {markets.isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-full" />
              ))}
            </div>
          ) : (
            <ul className="space-y-1">
              {losers.map((c) => (
                <li key={c.id} className="flex items-center justify-between rounded-lg px-2 py-2 hover:bg-white/5">
                  <div className="flex items-center gap-2">
                    <img src={c.image} alt="" className="h-5 w-5" />
                    <span className="text-sm font-medium">{c.symbol?.toUpperCase()}</span>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-red-400">
                    <TrendingDown size={12} /> {pct(c.price_change_percentage_24h)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card>
        <CardTitle>Heatmap</CardTitle>
        {markets.isLoading ? (
          <Skeleton className="h-40 w-full" />
        ) : (
          <Heatmap coins={coins.slice(0, 24)} />
        )}
      </Card>

      <Card>
        <CardTitle>All Assets</CardTitle>
        {markets.isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : markets.isError ? (
          <p className="py-8 text-center text-sm text-gray-500">Live data unavailable.</p>
        ) : (
          <DataTable
            columns={columns}
            rows={coins}
            searchKeys={['name', 'symbol']}
            initialSort={{ key: 'market_cap', dir: 'desc' }}
            pageSize={25}
          />
        )}
      </Card>
    </div>
  );
}
