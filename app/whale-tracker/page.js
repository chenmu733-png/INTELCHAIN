'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDownLeft, ArrowUpRight, Repeat, Zap, Radio } from 'lucide-react';
import { subscribeWhales } from '@/lib/whaleFeed';
import { usd } from '@/lib/format';
import { Card, CardTitle } from '@/components/ui/Card';

const FILTERS = ['All', 'Transfer', 'Exchange Inflow', 'Exchange Outflow', 'Large Trade'];

function typeIcon(type) {
  if (type === 'Exchange Inflow') return <ArrowDownLeft size={14} className="text-amber-400" />;
  if (type === 'Exchange Outflow') return <ArrowUpRight size={14} className="text-neon" />;
  if (type === 'Large Trade') return <Zap size={14} className="text-purple-400" />;
  return <Repeat size={14} className="text-blue-400" />;
}

function ago(t) {
  const s = Math.floor((Date.now() - t) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
}

export default function WhaleTrackerPage() {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const unsub = subscribeWhales((e) => {
      setEvents((prev) => [e, ...prev].slice(0, 60));
    });
    return unsub;
  }, []);

  const filtered = useMemo(
    () => (filter === 'All' ? events : events.filter((e) => e.type === filter)),
    [events, filter]
  );

  const stats = useMemo(() => {
    const total = events.reduce((a, e) => a + e.usdValue, 0);
    const inflow = events.filter((e) => e.type === 'Exchange Inflow').reduce((a, e) => a + e.usdValue, 0);
    const outflow = events.filter((e) => e.type === 'Exchange Outflow').reduce((a, e) => a + e.usdValue, 0);
    return { total, inflow, outflow, count: events.length };
  }, [events]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Whale Tracker</h1>
          <p className="mt-1 text-sm text-gray-400">
            Live large transfers, smart money, and exchange flows.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-neon/30 bg-neon/10 px-3 py-1 text-xs text-neon">
          <Radio size={12} className="animate-pulse" /> Live
        </span>
      </div>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card>
          <p className="text-xs uppercase tracking-wide text-gray-500">Tracked Volume</p>
          <p className="mt-1 text-lg font-bold text-white">{usd(stats.total)}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wide text-gray-500">Exchange Inflow</p>
          <p className="mt-1 text-lg font-bold text-amber-400">{usd(stats.inflow)}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wide text-gray-500">Exchange Outflow</p>
          <p className="mt-1 text-lg font-bold text-neon">{usd(stats.outflow)}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wide text-gray-500">Events</p>
          <p className="mt-1 text-lg font-bold text-white">{stats.count}</p>
        </Card>
      </section>

      <Card>
        <CardTitle
          action={
            <div className="flex flex-wrap gap-1">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-md px-2 py-1 text-xs ${
                    filter === f ? 'bg-neon/15 text-neon' : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          }
        >
          Live Feed
        </CardTitle>

        <div className="space-y-1">
          <AnimatePresence initial={false}>
            {filtered.map((e) => (
              <motion.div
                key={e.id}
                layout
                initial={{ opacity: 0, y: -8, backgroundColor: 'rgba(34,229,132,0.12)' }}
                animate={{ opacity: 1, y: 0, backgroundColor: 'rgba(0,0,0,0)' }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-between gap-3 rounded-lg px-2 py-2.5 hover:bg-white/5"
              >
                <div className="flex min-w-0 items-center gap-2">
                  {typeIcon(e.type)}
                  <div className="min-w-0">
                    <p className="truncate text-sm">
                      <span className="font-semibold">{e.amount.toLocaleString()} {e.token}</span>{' '}
                      <span className="text-gray-500">{e.type}</span>
                    </p>
                    <p className="truncate text-xs text-gray-600">
                      {e.from} \u2192 {e.to}
                    </p>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-medium text-white">{usd(e.usdValue)}</p>
                  <p className="text-xs text-gray-600">{ago(e.time)}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {filtered.length === 0 && (
            <p className="py-10 text-center text-sm text-gray-500">Waiting for events\u2026</p>
          )}
        </div>
      </Card>

      <p className="text-center text-xs text-gray-600">
        Streaming simulated events. Swap subscribeWhales() in lib/whaleFeed.js for a WebSocket source for production.
      </p>
    </div>
  );
}
