'use client';

import { useMemo } from 'react';
import { buildPortfolio } from '@/lib/demo';
import { usd } from '@/lib/format';
import { Card, CardTitle } from '@/components/ui/Card';
import DataTable from '@/components/ui/DataTable';

const COLLECTIONS = ['Apex Apes', 'Neon Punks', 'Chain Cats', 'Void Birds', 'Pixel Lords', 'Cyber Koi'];

export default function NFTPage() {
  const rows = useMemo(
    () =>
      COLLECTIONS.map((name, i) => {
        const p = buildPortfolio('nft-' + name);
        return {
          id: i,
          name,
          floor: +(p.riskScore / 10 + 0.2).toFixed(2),
          volume: p.totalValue,
          holders: 1000 + (p.riskScore * 37),
          change: p.holdings[0]?.change24h || 0
        };
      }),
    []
  );

  const cols = [
    { key: 'name', header: 'Collection', render: (r) => <span className="font-medium">{r.name}</span> },
    { key: 'floor', header: 'Floor', align: 'right', render: (r) => `${r.floor} ETH` },
    { key: 'volume', header: 'Volume', align: 'right', render: (r) => usd(r.volume) },
    { key: 'holders', header: 'Holders', align: 'right', hideMobile: true, render: (r) => r.holders.toLocaleString() },
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
        <h1 className="text-2xl font-extrabold tracking-tight">NFT Analytics</h1>
        <p className="mt-1 text-sm text-gray-400">Collections, floor price, volume, and holders.</p>
      </div>
      <Card>
        <CardTitle>Top Collections</CardTitle>
        <DataTable columns={cols} rows={rows} searchKeys={['name']} initialSort={{ key: 'volume', dir: 'desc' }} />
      </Card>
      <p className="text-center text-xs text-gray-600">Representative data. Connect an NFT API for live floor and volume.</p>
    </div>
  );
}
