'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchNft } from '@/lib/api';
import { usd } from '@/lib/format';
import { Card, CardTitle } from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';
import DataTable from '@/components/ui/DataTable';

export default function NFTPage() {
  const nft = useQuery({ queryKey: ['nft'], queryFn: fetchNft, retry: 2 });
  const rows = nft.data?.collections || [];

  const cols = [
    {
      key: 'name',
      header: 'Collection',
      render: (r) => (
        <span className="flex items-center gap-2 font-medium">
          {r.image ? (
            <img src={r.image} alt="" className="h-6 w-6 rounded-md" />
          ) : (
            <span className="h-6 w-6 rounded-md bg-ink-600" />
          )}
          <span className="truncate">{r.name}</span>
        </span>
      ),
      sortValue: (r) => r.name
    },
    {
      key: 'floor',
      header: 'Floor',
      align: 'right',
      render: (r) => (r.floor != null ? `${r.floor.toFixed(3)} ETH` : '\u2014')
    },
    {
      key: 'volume1d',
      header: '24h Vol',
      align: 'right',
      render: (r) => (r.volume1d != null ? `${r.volume1d.toFixed(1)} ETH` : '\u2014')
    },
    {
      key: 'holders',
      header: 'Holders',
      align: 'right',
      hideMobile: true,
      render: (r) => (r.holders != null ? r.holders.toLocaleString() : '\u2014')
    },
    {
      key: 'change1d',
      header: '24h',
      align: 'right',
      render: (r) =>
        r.change1d == null ? '\u2014' : (
          <span className={r.change1d >= 0 ? 'text-neon' : 'text-red-400'}>
            {(r.change1d * 100).toFixed(1)}%
          </span>
        )
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">NFT Analytics</h1>
        <p className="mt-1 text-sm text-gray-400">Top collections by 24h volume, live from Reservoir.</p>
      </div>
      <Card>
        <CardTitle>Top Collections</CardTitle>
        {nft.isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : nft.isError || rows.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500">NFT data unavailable. Please retry.</p>
        ) : (
          <DataTable
            columns={cols}
            rows={rows}
            searchKeys={['name']}
            initialSort={{ key: 'volume1d', dir: 'desc' }}
          />
        )}
      </Card>
      <p className="text-center text-xs text-gray-600">Live NFT data via Reservoir (free public API).</p>
    </div>
  );
}
