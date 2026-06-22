'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMarkets } from '@/lib/api';
import { usd, pct } from '@/lib/format';
import { Card, CardTitle } from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';

function Picker({ coins, value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-white/10 bg-ink-700 px-3 py-2 text-sm outline-none"
    >
      {coins.map((c) => (
        <option key={c.id} value={c.id}>
          {c.name} ({c.symbol?.toUpperCase()})
        </option>
      ))}
    </select>
  );
}

function Metric({ label, a, b }) {
  return (
    <tr className="border-t border-white/5">
      <td className="py-2.5 text-gray-500">{label}</td>
      <td className="py-2.5 text-right">{a}</td>
      <td className="py-2.5 text-right">{b}</td>
    </tr>
  );
}

export default function ComparePage() {
  const markets = useQuery({ queryKey: ['markets', 100], queryFn: () => fetchMarkets(100) });
  const coins = markets.data || [];
  const [a, setA] = useState('bitcoin');
  const [b, setB] = useState('ethereum');

  const ca = coins.find((c) => c.id === a);
  const cb = coins.find((c) => c.id === b);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Compare</h1>
        <p className="mt-1 text-sm text-gray-400">Side-by-side comparison of tokens.</p>
      </div>

      {markets.isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <Card>
          <div className="mb-4 grid grid-cols-2 gap-3">
            <Picker coins={coins} value={a} onChange={setA} />
            <Picker coins={coins} value={b} onChange={setB} />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs uppercase text-gray-500">
                  <th className="py-2 text-left">Metric</th>
                  <th className="py-2 text-right">{ca?.symbol?.toUpperCase()}</th>
                  <th className="py-2 text-right">{cb?.symbol?.toUpperCase()}</th>
                </tr>
              </thead>
              <tbody>
                <Metric label="Price" a={usd(ca?.current_price, { compact: false })} b={usd(cb?.current_price, { compact: false })} />
                <Metric label="Market Cap" a={usd(ca?.market_cap)} b={usd(cb?.market_cap)} />
                <Metric label="24h Volume" a={usd(ca?.total_volume)} b={usd(cb?.total_volume)} />
                <Metric label="24h Change" a={pct(ca?.price_change_percentage_24h)} b={pct(cb?.price_change_percentage_24h)} />
                <Metric label="ATH" a={usd(ca?.ath, { compact: false })} b={usd(cb?.ath, { compact: false })} />
                <Metric label="Rank" a={`#${ca?.market_cap_rank ?? '\u2014'}`} b={`#${cb?.market_cap_rank ?? '\u2014'}`} />
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
