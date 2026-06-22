'use client';

import { useMemo } from 'react';
import { buildPortfolio } from '@/lib/demo';
import { usd } from '@/lib/format';
import { Card, CardTitle } from '@/components/ui/Card';
import DataTable from '@/components/ui/DataTable';

const POOLS = ['ETH/USDC', 'WBTC/ETH', 'ARB/USDC', 'SOL/USDC', 'LINK/ETH', 'OP/USDC'];

export default function DEXPage() {
  const rows = useMemo(
    () =>
      POOLS.map((name, i) => {
        const p = buildPortfolio('dex-' + name);
        return {
          id: i,
          name,
          tvl: p.totalValue,
          volume: Math.round(p.totalValue * 0.3),
          fees: Math.round(p.totalValue * 0.001),
          change: p.holdings[0]?.change24h || 0
        };
      }),
    []
  );

  const cols = [
    { key: 'name', header: 'Pool', render: (r) => <span className="font-medium">{r.name}</span> },
    { key: 'tvl', header: 'TVL', align: 'right', render: (r) => usd(r.tvl) },
    { key: 'volume', header: '24h Volume', align: 'right', render: (r) => usd(r.volume) },
    { key: 'fees', header: '24h Fees', align: 'right', hideMobile: true, render: (r) => usd(r.fees) },
    {
      key: 'change',
      header: '24h',
      align: 'right',
      render: (r) => <span className={r.change >= 0 ? 'text-neon' : 'text-red-400'}>{r.change >= 0 ? '+' : ''}{r.change}%</span>
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">DEX Analytics</h1>
        <p className="mt-1 text-sm text-gray-400">Pools, TVL, liquidity, fees, and volume.</p>
      </div>
      <Card>
        <CardTitle>Top Pools</CardTitle>
        <DataTable columns={cols} rows={rows} searchKeys={['name']} initialSort={{ key: 'tvl', dir: 'desc' }} />
      </Card>
      <p className="text-center text-xs text-gray-600">Representative data. Connect DefiLlama / DexScreener for live pools.</p>
    </div>
  );
}
