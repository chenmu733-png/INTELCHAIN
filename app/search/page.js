'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Search, Wallet, Building2, Coins } from 'lucide-react';
import { fetchMarkets } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';

const isAddress = (q) => /^0x[a-fA-F0-9]{6,}$/.test(q) || q.toLowerCase().endsWith('.eth');

export default function SearchPage() {
  const [q, setQ] = useState('');
  const router = useRouter();
  const markets = useQuery({ queryKey: ['markets', 100], queryFn: () => fetchMarkets(100) });

  const tokenHits = useMemo(() => {
    if (!q) return [];
    const s = q.toLowerCase();
    return (markets.data || [])
      .filter((c) => c.name.toLowerCase().includes(s) || c.symbol.toLowerCase().includes(s))
      .slice(0, 8);
  }, [q, markets.data]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Global Search</h1>
        <p className="mt-1 text-sm text-gray-400">
          Wallets, ENS, tokens, entities, exchanges, NFT collections, smart contracts.
        </p>
      </div>

      <div className="glass flex items-center gap-2 rounded-xl px-4">
        <Search size={18} className="text-neon" />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search anything\u2026"
          className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-gray-600"
        />
      </div>

      {q && isAddress(q) && (
        <Card>
          <p className="mb-2 text-xs uppercase tracking-wide text-gray-500">Address / ENS</p>
          <button
            onClick={() => router.push(`/wallet?address=${q}`)}
            className="flex w-full items-center gap-2 rounded-lg px-2 py-2.5 text-left hover:bg-white/5"
          >
            <Wallet size={16} className="text-neon" />
            <span className="truncate text-sm">{q}</span>
          </button>
        </Card>
      )}

      {q && (
        <Card>
          <p className="mb-2 text-xs uppercase tracking-wide text-gray-500">Tokens</p>
          {markets.isLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : tokenHits.length === 0 ? (
            <p className="py-4 text-center text-sm text-gray-500">No token matches</p>
          ) : (
            <ul className="space-y-1">
              {tokenHits.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => router.push(`/token?id=${c.id}`)}
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left hover:bg-white/5"
                  >
                    <img src={c.image} alt="" className="h-5 w-5" />
                    <span className="text-sm font-medium">{c.symbol?.toUpperCase()}</span>
                    <span className="text-sm text-gray-500">{c.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}

      {q && (
        <Card>
          <p className="mb-2 text-xs uppercase tracking-wide text-gray-500">Entity</p>
          <button
            onClick={() => router.push(`/entity?name=${encodeURIComponent(q)}`)}
            className="flex w-full items-center gap-2 rounded-lg px-2 py-2.5 text-left hover:bg-white/5"
          >
            <Building2 size={16} className="text-blue-400" />
            <span className="text-sm">Search entity \u201c{q}\u201d</span>
          </button>
        </Card>
      )}

      {!q && (
        <Card>
          <div className="flex flex-col items-center gap-2 py-10 text-center text-sm text-gray-500">
            <Coins size={28} className="text-gray-700" />
            Start typing to search tokens, wallets, and entities.
          </div>
        </Card>
      )}
    </div>
  );
}
