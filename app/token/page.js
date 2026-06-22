'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { fetchCoin, fetchCoinMarketChart, fetchMarkets } from '@/lib/api';
import { usd, pct, num } from '@/lib/format';
import { Card, CardTitle } from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';
import LineChart from '@/components/charts/LineChart';

const RANGES = [
  { label: '24H', days: 1 },
  { label: '7D', days: 7 },
  { label: '30D', days: 30 },
  { label: '90D', days: 90 },
  { label: '1Y', days: 365 }
];

function Stat({ label, value, loading, accent }) {
  return (
    <Card>
      <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
      {loading ? (
        <Skeleton className="mt-2 h-6 w-24" />
      ) : (
        <p className={`mt-1 text-lg font-bold ${accent || 'text-white'}`}>{value}</p>
      )}
    </Card>
  );
}

function TokenView() {
  const params = useSearchParams();
  const router = useRouter();
  const id = params.get('id') || 'bitcoin';
  const [days, setDays] = useState(30);

  const coin = useQuery({ queryKey: ['coin', id], queryFn: () => fetchCoin(id) });
  const chart = useQuery({
    queryKey: ['coin-chart', id, days],
    queryFn: () => fetchCoinMarketChart(id, days)
  });
  const markets = useQuery({ queryKey: ['markets', 100], queryFn: () => fetchMarkets(100) });

  const c = coin.data;
  const md = c?.market_data;
  const change24 = md?.price_change_percentage_24h;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        {coin.isLoading ? (
          <Skeleton className="h-10 w-48" />
        ) : c ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <img src={c.image?.large} alt="" className="h-10 w-10" />
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">
                {c.name}{' '}
                <span className="text-gray-500">{c.symbol?.toUpperCase()}</span>
              </h1>
              <p className="text-sm text-gray-400">
                Rank #{c.market_cap_rank ?? '\u2014'}
              </p>
            </div>
          </motion.div>
        ) : (
          <h1 className="text-2xl font-extrabold">Token not found</h1>
        )}
      </div>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Price" value={usd(md?.current_price?.usd, { compact: false })} loading={coin.isLoading} />
        <Stat
          label="24h Change"
          value={pct(change24)}
          accent={(change24 || 0) >= 0 ? 'text-neon' : 'text-red-400'}
          loading={coin.isLoading}
        />
        <Stat label="Market Cap" value={usd(md?.market_cap?.usd)} loading={coin.isLoading} />
        <Stat label="24h Volume" value={usd(md?.total_volume?.usd)} loading={coin.isLoading} />
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
          Price chart
        </CardTitle>
        {chart.isLoading ? (
          <Skeleton className="h-[260px] w-full" />
        ) : chart.isError || !chart.data?.length ? (
          <p className="py-16 text-center text-sm text-gray-500">Chart data unavailable.</p>
        ) : (
          <LineChart
            data={chart.data}
            color={(change24 || 0) >= 0 ? '#22e584' : '#f87171'}
          />
        )}
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardTitle>Supply</CardTitle>
          {coin.isLoading ? (
            <Skeleton className="h-24 w-full" />
          ) : (
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span className="text-gray-500">Circulating</span>
                <span>{num(md?.circulating_supply)}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-500">Total</span>
                <span>{num(md?.total_supply)}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-500">Max</span>
                <span>{md?.max_supply ? num(md.max_supply) : '\u2014'}</span>
              </li>
            </ul>
          )}
        </Card>
        <Card>
          <CardTitle>Range</CardTitle>
          {coin.isLoading ? (
            <Skeleton className="h-24 w-full" />
          ) : (
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span className="text-gray-500">24h High</span>
                <span>{usd(md?.high_24h?.usd, { compact: false })}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-500">24h Low</span>
                <span>{usd(md?.low_24h?.usd, { compact: false })}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-500">ATH</span>
                <span>{usd(md?.ath?.usd, { compact: false })}</span>
              </li>
            </ul>
          )}
        </Card>
        <Card>
          <CardTitle>Performance</CardTitle>
          {coin.isLoading ? (
            <Skeleton className="h-24 w-full" />
          ) : (
            <ul className="space-y-2 text-sm">
              {[
                ['7d', md?.price_change_percentage_7d],
                ['30d', md?.price_change_percentage_30d],
                ['1y', md?.price_change_percentage_1y]
              ].map(([k, v]) => (
                <li key={k} className="flex justify-between">
                  <span className="text-gray-500">{k}</span>
                  <span className={(v || 0) >= 0 ? 'text-neon' : 'text-red-400'}>{pct(v)}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card>
        <CardTitle>Explore other tokens</CardTitle>
        {markets.isLoading ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <div className="flex flex-wrap gap-2">
            {(markets.data || []).slice(0, 16).map((m) => (
              <button
                key={m.id}
                onClick={() => router.push(`/token?id=${m.id}`)}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition ${
                  m.id === id
                    ? 'border-neon/40 bg-neon/10 text-neon'
                    : 'border-white/10 text-gray-300 hover:border-neon/30'
                }`}
              >
                <img src={m.image} alt="" className="h-4 w-4" />
                {m.symbol?.toUpperCase()}
              </button>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

export default function TokenPage() {
  return (
    <Suspense fallback={<Skeleton className="h-64 w-full" />}>
      <TokenView />
    </Suspense>
  );
}
