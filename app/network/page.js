'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { ZoomIn, MousePointer2, Move } from 'lucide-react';
import { usd } from '@/lib/format';
import { Card, CardTitle } from '@/components/ui/Card';
import AddressSearch from '@/components/wallet/AddressSearch';

const NetworkGraph = dynamic(() => import('@/components/network/NetworkGraph'), {
  ssr: false,
  loading: () => <div className="skeleton h-full w-full rounded-2xl" />
});

export default function NetworkPage() {
  const [seed, setSeed] = useState('0x742d35Cc6634C0532925a3b844Bc454e4438f44e');
  const [selected, setSelected] = useState(null);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Network Visualizer</h1>
          <p className="mt-1 text-sm text-gray-400">
            Interactive money-flow graph. Drag nodes, scroll to zoom, pan the canvas.
          </p>
        </div>
        <div className="flex gap-3 text-xs text-gray-500">
          <span className="inline-flex items-center gap-1"><MousePointer2 size={13} /> Drag node</span>
          <span className="inline-flex items-center gap-1"><Move size={13} /> Pan</span>
          <span className="inline-flex items-center gap-1"><ZoomIn size={13} /> Scroll zoom</span>
        </div>
      </div>

      <AddressSearch
        value={seed}
        placeholder="Enter address or entity to map flows\u2026"
        onSubmit={(v) => { setSeed(v); setSelected(null); }}
      />

      <div className="grid gap-4 lg:grid-cols-4">
        <div className="glass relative h-[60vh] overflow-hidden rounded-2xl lg:col-span-3">
          <NetworkGraph seed={seed} onSelect={setSelected} />
          <div className="pointer-events-none absolute bottom-3 left-3 flex flex-wrap gap-2 text-[10px]">
            {[
              ['Target', '#22e584'],
              ['Exchange', '#3b82f6'],
              ['Whale', '#a855f7'],
              ['Unknown', '#64748b']
            ].map(([l, c]) => (
              <span key={l} className="flex items-center gap-1 rounded-full bg-black/40 px-2 py-0.5 text-gray-300">
                <span className="h-2 w-2 rounded-full" style={{ background: c }} /> {l}
              </span>
            ))}
          </div>
        </div>

        <Card>
          <CardTitle>Node Details</CardTitle>
          {selected ? (
            <div className="space-y-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">Label</p>
                <p className="text-base font-bold text-white">{selected.label}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">Type</p>
                <p className="text-sm capitalize text-gray-300">{selected.kind}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">Value</p>
                <p className="text-sm font-medium text-neon">{usd(selected.value)}</p>
              </div>
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-gray-500">
              Click a node to inspect it.
            </p>
          )}
        </Card>
      </div>

      <p className="text-center text-xs text-gray-600">
        Graph generated from the address seed. Wire real transfer data into lib/graph.js for production flows.
      </p>
    </div>
  );
}
