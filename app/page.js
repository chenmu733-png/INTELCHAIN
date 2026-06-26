'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, AlertTriangle, Zap } from 'lucide-react';
import { fetchMarkets, fetchGlobal } from '@/lib/api';
import { usd, pct } from '@/lib/format';
import { Card, CardTitle } from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';
import StatCard from '@/components/dashboard/StatCard';
import CryptoIcon from '@/components/CryptoIcon';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' }
  }
};

export default function HomePage() {
  const markets = useQuery({
    queryKey: ['markets', 100],
    queryFn: () => fetchMarkets(100),
    retry: 2,
    staleTime: 60000
  });

  const global = useQuery({
    queryKey: ['global'],
    queryFn: fetchGlobal,
    retry: 2,
    staleTime: 60000
  });

  const g = global.data;
  const coins = markets.data || [];

  const gainers = [...coins]
    .sort((a, b) => (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0))
    .slice(0, 6);

  const losers = [...coins]
    .sort((a, b) => (a.price_change_percentage_24h || 0) - (b.price_change_percentage_24h || 0))
    .slice(0, 6);

  return (
    <motion.div className="space-y-6" variants={container} initial="hidden" animate="show">
      {/* Hero Section */}
      <motion.section variants={item} className="glass-hover glass relative overflow-hidden rounded-3xl p-8 md:p-12">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-neon/10 blur-3xl" />
        <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-crypto-eth/10 blur-3xl" />

        <div className="relative z-10 space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-extrabold tracking-tight md:text-5xl"
          >
            Follow Money. <span className="neon-text">Understand Everything.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl text-base text-gray-300 md:text-lg"
          >
            Enterprise-grade blockchain intelligence. Track wallets, entities, whales, and money flows across chains in real time.
          </motion.p>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex gap-3 pt-4">
            <button className="btn-primary flex items-center gap-2">
              <Zap size={16} />
              Start Tracking
            </button>
            <button className="btn-secondary">Learn More</button>
          </motion.div>
        </div>
      </motion.section>

      {/* Error Alert */}
      {(markets.isError || global.isError) && (
        <motion.div
          variants={item}
          className="flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-4 text-sm text-amber-300 backdrop-blur-sm"
        >
          <AlertTriangle size={20} className="shrink-0" />
          <span className="flex-1">Live data is rate-limited. Retrying automatically...</span>
          <button
            onClick={() => {
              markets.refetch();
              global.refetch();
            }}
            className="rounded-md border border-amber-400/40 px-3 py-1 text-xs font-semibold hover:bg-amber-400/10 transition-colors"
          >
            Retry
          </button>
        </motion.div>
      )}

      {/* Stats Grid */}
      <motion.section variants={item} className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Total Market Cap" value={usd(g?.total_market_cap?.usd)} loading={global.isLoading} />
        <StatCard label="24h Volume" value={usd(g?.total_volume?.usd)} loading={global.isLoading} />
        <StatCard label="BTC Dominance" value={g ? `${g.market_cap_percentage?.btc?.toFixed(1)}%` : '—'} loading={global.isLoading} />
        <StatCard label="Active Coins" value={g ? g.active_cryptocurrencies?.toLocaleString() : '—'} loading={global.isLoading} />
      </motion.section>

      {/* Main Content Grid */}
      <motion.div variants={item} className="grid gap-6 lg:grid-cols-3">
        {/* Market Overview Table */}
        <Card className="lg:col-span-2">
          <CardTitle>Market Overview</CardTitle>

          {markets.isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : markets.isError ? (
            <p className="py-8 text-center text-sm text-gray-500">Live data unavailable. Please retry.</p>
          ) : coins.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500">No data available.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs uppercase text-gray-500">
                    <th className="px-2 py-3">#</th>
                    <th className="px-2 py-3">Asset</th>
                    <th className="px-2 py-3 text-right">Price</th>
                    <th className="px-2 py-3 text-right">24h</th>
                    <th className="hidden px-2 py-3 text-right md:table-cell">Market Cap</th>
                    <th className="hidden px-2 py-3 text-right lg:table-cell">Volume</th>
                  </tr>
                </thead>
                <tbody>
                  {coins.slice(0, 12).map((c, idx) => {
                    const up = (c.price_change_percentage_24h || 0) >= 0;
                    return (
                      <tr
                        key={c.id}
                        className="border-t border-white/5 transition-colors hover:bg-white/5"
                      >
                        <td className="px-2 py-3 text-xs font-semibold text-gray-400">{idx + 1}</td>
                        <td className="px-2 py-3">
                          <div className="flex items-center gap-2">
                            <CryptoIcon symbol={c.symbol} size={24} />
                            <div>
                              <p className="text-xs font-semibold uppercase">{c.symbol}</p>
                              <p className="text-xs text-gray-500">{c.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-2 py-3 text-right text-sm font-semibold">{usd(c.current_price, { compact: false })}</td>
                        <td className={`px-2 py-3 text-right text-sm font-semibold ${up ? 'text-emerald-400' : 'text-rose-400'}`}>
                          <div className="flex items-center justify-end gap-1">
                            {up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                            {pct(c.price_change_percentage_24h)}
                          </div>
                        </td>
                        <td className="hidden px-2 py-3 text-right text-xs text-gray-400 md:table-cell">{usd(c.market_cap, { compact: true })}</td>
                        <td className="hidden px-2 py-3 text-right text-xs text-gray-400 lg:table-cell">{usd(c.total_volume, { compact: true })}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Trending Section */}
        <Card>
          <CardTitle>Trending 🔥</CardTitle>

          {markets.isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <ul className="space-y-2">
              {gainers.map((c) => {
                const up = (c.price_change_percentage_24h || 0) >= 0;
                return (
                  <motion.li
                    key={c.id}
                    whileHover={{ x: 4 }}
                    className="flex items-center justify-between rounded-lg px-3 py-2 transition-all duration-300 hover:bg-white/5"
                  >
                    <div className="flex items-center gap-2">
                      <CryptoIcon symbol={c.symbol} size={20} />
                      <span className="text-xs font-semibold uppercase">{c.symbol}</span>
                    </div>
                    <span className={`flex items-center gap-1 text-xs font-semibold ${up ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {pct(c.price_change_percentage_24h)}
                    </span>
                  </motion.li>
                );
              })}
            </ul>
          )}
        </Card>
      </motion.div>

      {/* Losers Section */}
      <motion.div variants={item} className="lg:col-span-2">
        <Card>
          <CardTitle>Top Losers 📉</CardTitle>

          {markets.isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <ul className="grid gap-2 sm:grid-cols-2">
              {losers.slice(0, 4).map((c) => (
                <motion.li
                  key={c.id}
                  whileHover={{ y: -2 }}
                  className="flex items-center justify-between rounded-lg bg-rose-500/5 px-4 py-3 border border-rose-500/10"
                >
                  <div className="flex items-center gap-2">
                    <CryptoIcon symbol={c.symbol} size={20} />
                    <div>
                      <p className="text-xs font-semibold uppercase">{c.symbol}</p>
                      <p className="text-xs text-rose-400/60">{c.name}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-rose-400">{pct(c.price_change_percentage_24h)}</span>
                </motion.li>
              ))}
            </ul>
          )}
        </Card>
      </motion.div>
    </motion.div>
  );
}
