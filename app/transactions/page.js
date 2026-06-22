'use client';

import { useMemo, useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, Download } from 'lucide-react';
import { buildPortfolio } from '@/lib/demo';
import { usd } from '@/lib/format';
import { Card, CardTitle } from '@/components/ui/Card';
import DataTable from '@/components/ui/DataTable';

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

export default function TransactionsPage() {
  const [dir, setDir] = useState('all');
  const all = useMemo(() => {
    // aggregate a richer set from several seeds
    return ['alpha', 'beta', 'gamma', 'delta', 'omega']
      .flatMap((s) => buildPortfolio(s).txs)
      .sort((a, b) => b.time - a.time);
  }, []);

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
    { key: 'token', header: 'Token' },
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
        <p className="mt-1 text-sm text-gray-400">Incoming and outgoing transfers with filter, search, and export.</p>
      </div>

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
        <DataTable
          columns={cols}
          rows={rows}
          searchKeys={['token', 'counterparty']}
          initialSort={{ key: 'time', dir: 'desc' }}
          pageSize={15}
        />
      </Card>
    </div>
  );
}
