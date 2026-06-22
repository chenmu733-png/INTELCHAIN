'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchDex } from '@/lib/api';
import { usd, pct } from '@/lib/format';
import { Card, CardTitle } from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';
import DataTable from '@/components/ui/DataTable';

export default function DEXPage() {
  const dex = useQuery({ queryKey: ['dex'], queryFn: fetchDex, retry: 2 });
  const rows = dex.data?.dexes || [];

  const cols = [
    { key: 'name', header: 'DEX', render: (r) => <span className="font-medium">{r.name}</span> },
    { key: 'chain', header: 'Chain', hideMobile: true },
    { key: 'tvl', header: 'TVL', align: 'right', render: (r) => usd(r.tvl) },
    {
      key: 'change1d',
      header: '1d',
      align: 'right',
      render: (r) =>
        r.change1d == null ? '\u2014' : (
          <span className={r.change1d >= 0 ? 'text-neon' : 'text-red-400'}>{pct(r.change1d)}</span>
        )
    },
    {
      key: 'change7d',
      header: '7d',
      align: 'right',
      hideMobile: true,
      render: (r) =>
        r.change7d == null ? '\u2014' : (
          <span className={r.change7d >= 0 ? 'text-neon' : 'text-red-400'}>{pct(r.change7d)}</span>
        )
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">DEX Analytics</h1>
        <p className="mt-1 text-sm text-gray-400">Top DEX protocols by TVL, live from DefiLlama.</p>
      </div>
      <Card>
        <CardTitle>Top DEX Protocols</CardTitle>
        {dex.isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : dex.isError || rows.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500">DEX data unavailable. Please retry.</p>
        ) : (
          <DataTable
            columns={cols}
            rows={rows}
            searchKeys={['name', 'chain']}
            initialSort={{ key: 'tvl', dir: 'desc' }}
          />
        )}
      </Card>
      <p className="text-center text-xs text-gray-600">Live TVL via DefiLlama (free, no API key).</p>
    </div>
  );
}
