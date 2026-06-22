'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Star, Plus, X } from 'lucide-react';
import { fetchMarkets } from '@/lib/api';
import { usd, pct } from '@/lib/format';
import { useWatchlistStore } from '@/lib/store';
import { Card, CardTitle } from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';

export default function WatchlistPage() {
  const items = useWatchlistStore((s) => s.items);
  const add = useWatchlistStore((s) => s.add);
  const remove = useWatchlistStore((s) => s.remove);
  const markets = useQuery({ queryKey: ['markets', 100], queryFn: () => fetchMarkets(100) });

  const watched = (markets.data || []).filter((c) => items.find((i) => i.id === c.id));
  const suggestions = (markets.data || []).filter((c) => !items.find((i) => i.id === c.id)).slice(0, 10);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Watchlist</h1>
        <p className="mt-1 text-sm text-gray-400">Favorite tokens, saved locally on this device.</p>
      </div>

      <Card>
        <CardTitle>My Watchlist</CardTitle>
        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-center text-sm text-gray-500">
            <Star size={28} className="text-gray-700" />
            Nothing here yet. Add tokens from the suggestions below.
          </div>
        ) : markets.isLoading ? (
          <Skeleton className="h-24 w-full" />
        ) : (
          <ul className="space-y-1">
            {watched.map((c) => (
              <li key={c.id} className="flex items-center justify-between rounded-lg px-2 py-2 hover:bg-white/5">
                <Link href={`/token?id=${c.id}`} className="flex items-center gap-2">
                  <img src={c.image} alt="" className="h-5 w-5" />
                  <span className="text-sm font-medium">{c.symbol?.toUpperCase()}</span>
                  <span className="hidden text-sm text-gray-500 sm:inline">{c.name}</span>
                </Link>
                <div className="flex items-center gap-3">
                  <span className="text-sm">{usd(c.current_price, { compact: false })}</span>
                  <span className={`text-xs ${(c.price_change_percentage_24h || 0) >= 0 ? 'text-neon' : 'text-red-400'}`}>
                    {pct(c.price_change_percentage_24h)}
                  </span>
                  <button onClick={() => remove(c.id)} className="text-gray-600 hover:text-red-400">
                    <X size={14} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card>
        <CardTitle>Add Tokens</CardTitle>
        {markets.isLoading ? (
          <Skeleton className="h-24 w-full" />
        ) : (
          <div className="flex flex-wrap gap-2">
            {suggestions.map((c) => (
              <button
                key={c.id}
                onClick={() => add({ id: c.id, symbol: c.symbol })}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs text-gray-300 hover:border-neon/40 hover:text-neon"
              >
                <Plus size={12} />
                <img src={c.image} alt="" className="h-4 w-4" />
                {c.symbol?.toUpperCase()}
              </button>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
