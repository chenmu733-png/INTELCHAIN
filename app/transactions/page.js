'use client';

import { Suspense, useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ArrowDownLeft, ArrowUpRight, Download } from 'lucide-react';
import { fetchWalletTransfers } from '@/lib/api';
import { usd } from '@/lib/format';
import { Card, CardTitle } from '@/components/ui/Card';
import DataTable from '@/components/ui/DataTable';
import AddressSearch from '@/components/wallet/AddressSearch';
import TokenIcon from '@/components/TokenIcon';
import Skeleton from '@/components/ui/Skeleton';

function toCSV(rows) {
  const head = ['direction', 'token', 'amount', 'value', 'counterparty', 'time'];
  const body = rows.map((r) =>
    [r.direction, r.token, r.amount, r.value, r.counterparty, new Date(r.time).toISOString()].join(',')
  );
  return [head.join(','), ...body].join('\n');
}

function download(name, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

function TransactionsView() {
  const params = useSearchParams();
  const router = useRouter();
  const address = params.get('address') || '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
  const [dir, setDir] = useState('all');

  const tx = useQuery({
    queryKey: ['transfers', address],
    queryFn: () => fetchWalletTransfers(address),
    retry: 1
  });
  const all = useMemo(
    () => [...(tx.data?.txs || [])].sort((a, b) => b.time - a.time),
    [tx.data]
  );
  const rows = useMemo(
    () => (dir === 'all' ? all : all.filter((t) => t.direction === dir)),
    [all, dir]
  );

  const cols = [
    {
      key: 'direction',
      header: 'Type',
      render: (t) => (
        <span className={`inline-flex items-center gap-1 ${t.direction === 'in' ? 'text-neon' : 'text-red-400'}`}>
          {t.direction === 'in' ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
          {t.direction === 'in' ? 'In' : 'Out'}
        </span>
      )
    },
    {
      key: 'token',
      header: 'Token',
      render: (t) => (
        <span className="flex items-center gap-2">
          <TokenIcon symbol={t.token} size={18} />
          {t.token}
        </span>
      )
    },
    { key: 'amount', header: 'Amount', align: 'right', render: (t) => t.amount.toLocaleString() },
    { key: 'value', header: 'Value', align: 'right', render: (t) => usd(t.value) },
    { key: 'counterparty', header: 'Counterparty', hideMobile: true },
    {
      key: 'time',
      header: 'Time',
      align: 'right',
      hideMobile: true,
      render: (t) => new Date(t.time).toLocaleString()
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Transactions</h1>
        <p className="mt-1 break-all text-sm text-gray-400">{address}</p>
      </div>

      <AddressSearch
        value={address}
        placeholder="Enter wallet address to view transfers\u2026"
        onSubmit={(a) => router.push(`/transactions?address=${a}`)}
      />

      <Card>
        <CardTitle
          action={
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {['all', 'in', 'out'].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDir(d)}
                    className={`rounded-md px-2 py-1 text-xs capitalize ${
                      dir === d ? 'bg-neon/15 text-neon' : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
              <button
                onClick={() => download('transactions.csv', toCSV(rows), 'text/csv')}
                className="inline-flex items-center gap-1 rounded-md border border-white/10 px-2 py-1 text-xs text-gray-300 hover:border-neon/40 hover:text-neon"
              >
                <Download size={12} /> CSV
              </button>
              <button
                onClick={() => download('transactions.json', JSON.stringify(rows, null, 2), 'application/json')}
                className="inline-flex items-center gap-1 rounded-md border border-white/10 px-2 py-1 text-xs text-gray-300 hover:border-neon/40 hover:text-neon"
              >
                <Download size={12} /> JSON
              </button>
            </div>
          }
        >
          {rows.length} transfers
        </CardTitle>
        {tx.isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500">No transfers found.</p>
        ) : (
          <DataTable
            columns={cols}
            rows={rows}
            searchKeys={['token', 'counterparty']}
            initialSort={{ key: 'time', dir: 'desc' }}
            pageSize={15}
          />
        )}
      </Card>
      {tx.data?.source === 'demo' && (
        <p className="text-center text-xs text-gray-600">
          Showing representative transfers. Set COVALENT_API_KEY for live on-chain data.
        </p>
      )}
    </div>
  );
}

export default function TransactionsPage() {
  return (
    <Suspense fallback={<Skeleton className="h-64 w-full" />}>
      <TransactionsView />
    </Suspense>
  );
}
