'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import AddressSearch from '@/components/wallet/AddressSearch';
import PortfolioView from '@/components/wallet/PortfolioView';
import Skeleton from '@/components/ui/Skeleton';

const TABS = ['Portfolio', 'Transactions', 'Counterparties', 'Analytics'];

const LABELS = ['Exchange', 'Smart Money', 'Institution', 'Market Maker'];

function EntityView() {
  const params = useSearchParams();
  const router = useRouter();
  const name = params.get('name') || 'Binance';
  const [tab, setTab] = useState('Portfolio');

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center gap-3"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-neon/30 bg-ink-700 text-lg font-extrabold neon-text">
          {name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">{name}</h1>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {LABELS.map((l) => (
              <span key={l} className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-gray-400">
                {l}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      <AddressSearch
        value={name}
        placeholder="Search entity, exchange, or institution\u2026"
        onSubmit={(n) => router.push(`/entity?name=${encodeURIComponent(n)}`)}
      />

      <div className="flex gap-1 overflow-x-auto border-b border-white/5">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`relative whitespace-nowrap px-4 py-2 text-sm font-medium ${
              tab === t ? 'text-neon' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {t}
            {tab === t && (
              <motion.span
                layoutId="entity-tab"
                className="absolute inset-x-2 -bottom-px h-0.5 rounded bg-neon"
              />
            )}
          </button>
        ))}
      </div>

      {tab === 'Portfolio' && <PortfolioView seed={name} live />}
      {tab !== 'Portfolio' && (
        <div className="glass rounded-2xl p-10 text-center text-sm text-gray-500">
          {tab} module \u2014 powered by the same data layer as Portfolio. Wire in
          live entity flows via lib/api.js.
        </div>
      )}
    </div>
  );
}

export default function EntityPage() {
  return (
    <Suspense fallback={<Skeleton className="h-64 w-full" />}>
      <EntityView />
    </Suspense>
  );
}
