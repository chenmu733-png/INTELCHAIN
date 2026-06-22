'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { fetchMarkets, fetchGlobal } from '@/lib/api';
import { Card, CardTitle } from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';
import StatCard from '@/components/dashboard/StatCard';

function usd(n) {
  if (n == null) return '—';
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  return `$${Number(n).toLocaleString()}`;
}

export default function HomePage() {
  const markets = useQuery({ queryKey: ['markets'], queryFn: fetchMarkets });
  const global = useQuery({ queryKey: ['global'], queryFn: fetchGlobal });
  const g = global.data;
  const coins = markets.data || [];

  const gainers = [...coins]
    .sort(
      (a, b) =>
        (b.price_change_percentage_24h || 0) -
        (a.price_change_percentage_24h || 0)
    )
    .slice(0, 6);

  return (
    <div className="space-y-6">
      <section className="glass relative overflow-hidden rounded-3xl p-8">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-neon/10 blur-3xl" />
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-extrabold tracking-tight md:text-4xl"
        >
          Follow Money. <span className="neon-text">Understand Everything.</span>
        </motion.h1>
        <p className="mt-2 max-w-xl text-sm text-gray-400">
          Enterprise-grade blockchain intelligence. Track wallets, entities,
          whales, and money flows across chains in real time.
        </p>
      </section>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard
          label="Total Market Cap"
          value={usd(g?.total_market_cap?.usd)}
          loading={global.isLoading}
        />
        <StatCard
          label="24h Volume"
          value={usd(g?.total_volume?.usd)}
          loading={global.isLoading}
        />
        <StatCard
          label="BTC Dominance"
          value={g ? `${g.market_cap_percentage?.btc?.toFixed(1)}%` : '—'}
          loading={global.isLoading}
        />
        <StatCard
          label="Active Coins"
          value={g ? g.active_cryptocurrencies?.toLocaleString() : '—'}
          loading={global.isLoading}
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardTitle>Market Overview</CardTitle>
          {markets.isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : markets.isError ? (
            <p className="py-8 text-center text-sm text-gray-500">
              Live data unavailable. Showing cached experience.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase text-gray-500">
                    <th className="py-2">Asset</th>
                    <th className="py-2 text-right">Price</th>
                    <th className="py-2 text-right">24h</th>
                    <th className="hidden py-2 text-right md:table-cell">Mkt Cap</th>
                  </tr>
                </thead>
                <tbody>
                  {coins.slice(0, 10).map((c) => {
                    const up = (c.price_change_percentage_24h || 0) >= 0;
                    return (
                      <tr
                        key={c.id}
                        className="border-t border-white/5 hover:bg-white/5"
                      >
                        <td className="py-2.5">
                          <div className="flex items-center gap-2">
                            <img src={c.image} alt="" className="h-5 w-5" />
                            <span className="font-medium">{c.symbol?.toUpperCase()}</span>
                            <span className="hidden text-gray-500 sm:inline">{c.name}</span>
                          </div>
                        </td>
                        <td className="py-2.5 text-right">{usd(c.current_price)}</td>
                        <td className={`py-2.5 text-right ${up ? 'text-neon' : 'text-red-400'}`}>
                          {(c.price_change_percentage_24h || 0).toFixed(2)}%
                        </td>
                        <td className="hidden py-2.5 text-right text-gray-400 md:table-cell">
                          {usd(c.market_cap)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card>
          <CardTitle>Trending</CardTitle>
          {markets.isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-full" />
              ))}
            </div>
          ) : (
            <ul className="space-y-1">
              {gainers.map((c) => {
                const up = (c.price_change_percentage_24h || 0) >= 0;
                return (
                  <li
                    key={c.id}
                    className="flex items-center justify-between rounded-lg px-2 py-2 hover:bg-white/5"
                  >
                    <div className="flex items-center gap-2">
                      <img src={c.image} alt="" className="h-5 w-5" />
                      <span className="text-sm font-medium">{c.symbol?.toUpperCase()}</span>
                    </div>
                    <span className={`flex items-center gap-1 text-xs ${up ? 'text-neon' : 'text-red-400'}`}>
                      {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {(c.price_change_percentage_24h || 0).toFixed(1)}%
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
