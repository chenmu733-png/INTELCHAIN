'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowDownLeft, ArrowUpRight, ShieldAlert } from 'lucide-react';
import { buildPortfolio, riskLabel } from '@/lib/demo';
import { fetchWallet, fetchWalletTransfers } from '@/lib/api';
import { usd, pct } from '@/lib/format';
import { Card, CardTitle } from '@/components/ui/Card';
import DataTable from '@/components/ui/DataTable';
import LineChart from '@/components/charts/LineChart';
import PieChart from '@/components/charts/PieChart';
import TokenIcon from '@/components/TokenIcon';

export default function PortfolioView({ seed, live = false }) {
  const fallback = useMemo(() => buildPortfolio(seed), [seed]);
  const query = useQuery({
    queryKey: ['wallet', seed],
    queryFn: () => fetchWallet(seed),
    enabled: live,
    retry: 1
  });
  const transfers = useQuery({
    queryKey: ['wallet-transfers', seed],
    queryFn: () => fetchWalletTransfers(seed),
    enabled: live,
    retry: 1
  });
  // Merge: live data fills what the provider returns; demo fills the rest.
  const data = live && query.data ? query.data : fallback;
  const liveTxs = live && transfers.data?.txs?.length ? transfers.data.txs : null;
  const p = {
    ...fallback,
    ...data,
    history: data.history?.length ? data.history : fallback.history,
    txs: liveTxs || (data.txs?.length ? data.txs : fallback.txs)
  };
  const risk = riskLabel(p.riskScore || fallback.riskScore);

  const holdingCols = [
    {
      key: 'symbol',
      header: 'Asset',
      render: (h) => (
        <span className="flex items-center gap-2 font-medium">
          <TokenIcon symbol={h.symbol} size={20} />
          {h.symbol}
        </span>
      )
    },
    { key: 'amount', header: 'Amount', align: 'right', render: (h) => h.amount.toLocaleString() },
    { key: 'price', header: 'Price', align: 'right', render: (h) => usd(h.price, { compact: false }) },
    {
      key: 'change24h',
      header: '24h',
      align: 'right',
      hideMobile: true,
      render: (h) => (
        <span className={h.change24h >= 0 ? 'text-neon' : 'text-red-400'}>{pct(h.change24h)}</span>
      )
    },
    { key: 'value', header: 'Value', align: 'right', render: (h) => usd(h.value) }
  ];

  const txCols = [
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
      render: (t) => new Date(t.time).toLocaleDateString()
    }
  ];

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card>
          <p className="text-xs uppercase tracking-wide text-gray-500">Portfolio Value</p>
          <p className="mt-1 text-lg font-bold text-white">{usd(p.totalValue)}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wide text-gray-500">Unrealized PNL</p>
          <p className={`mt-1 text-lg font-bold ${p.pnl >= 0 ? 'text-neon' : 'text-red-400'}`}>
            {p.pnl >= 0 ? '+' : ''}{usd(p.pnl)}
          </p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wide text-gray-500">Holdings</p>
          <p className="mt-1 text-lg font-bold text-white">{p.holdings.length} assets</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wide text-gray-500">Risk Score</p>
          <p className={`mt-1 flex items-center gap-1 text-lg font-bold ${risk.color}`}>
            <ShieldAlert size={16} /> {p.riskScore} \u00b7 {risk.label}
          </p>
        </Card>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardTitle>Historical Balance (30d)</CardTitle>
          <LineChart data={p.history} />
        </Card>
        <Card>
          <CardTitle>Asset Allocation</CardTitle>
          <PieChart data={p.allocation} />
          <div className="mt-2 flex flex-wrap gap-2">
            {p.allocation.map((a) => (
              <span key={a.name} className="rounded-full border border-white/10 px-2 py-0.5 text-xs text-gray-300">
                {a.name} {a.value}%
              </span>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardTitle>Holdings</CardTitle>
          <DataTable
            columns={holdingCols}
            rows={p.holdings}
            initialSort={{ key: 'value', dir: 'desc' }}
          />
        </Card>
        <Card>
          <CardTitle>Chain Distribution</CardTitle>
          <PieChart data={p.chains} />
          <div className="mt-2 flex flex-wrap gap-2">
            {p.chains.map((ch) => (
              <span key={ch.name} className="rounded-full border border-white/10 px-2 py-0.5 text-xs text-gray-300">
                {ch.name} {ch.value}%
              </span>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <CardTitle>Transaction History</CardTitle>
        <DataTable
          columns={txCols}
          rows={p.txs}
          initialSort={{ key: 'time', dir: 'desc' }}
          pageSize={8}
        />
      </Card>

      <p className="text-center text-xs text-gray-600">
        Showing representative on-chain data. Connect Etherscan / Covalent / Alchemy in lib/api.js for live values.
      </p>
    </div>
  );
}
