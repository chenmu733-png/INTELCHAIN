'use client';

import { useState } from 'react';
import { Bell, Plus, Trash2 } from 'lucide-react';
import { Card, CardTitle } from '@/components/ui/Card';

const TYPES = ['Wallet activity', 'Whale transfer', 'Price movement', 'Transaction'];

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'Whale transfer', target: '> $5M ETH', active: true },
    { id: 2, type: 'Price movement', target: 'BTC +5% / 24h', active: true }
  ]);
  const [type, setType] = useState(TYPES[0]);
  const [target, setTarget] = useState('');

  const add = () => {
    if (!target.trim()) return;
    setAlerts((a) => [{ id: Date.now(), type, target: target.trim(), active: true }, ...a]);
    setTarget('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Alert Center</h1>
        <p className="mt-1 text-sm text-gray-400">Wallet activity, whale transfers, and price alerts.</p>
      </div>

      <Card>
        <CardTitle>New Alert</CardTitle>
        <div className="flex flex-col gap-2 sm:flex-row">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="rounded-lg border border-white/10 bg-ink-700 px-3 py-2 text-sm outline-none"
          >
            {TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <input
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="Condition, e.g. > $1M USDC\u2026"
            className="flex-1 rounded-lg border border-white/10 bg-ink-700 px-3 py-2 text-sm outline-none placeholder:text-gray-600"
          />
          <button
            onClick={add}
            className="inline-flex items-center justify-center gap-1 rounded-lg bg-neon/15 px-4 py-2 text-sm font-medium text-neon hover:bg-neon/25"
          >
            <Plus size={14} /> Add
          </button>
        </div>
      </Card>

      <Card>
        <CardTitle>Active Alerts</CardTitle>
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-center text-sm text-gray-500">
            <Bell size={28} className="text-gray-700" />
            No alerts configured.
          </div>
        ) : (
          <ul className="space-y-1">
            {alerts.map((a) => (
              <li key={a.id} className="flex items-center justify-between rounded-lg px-2 py-2.5 hover:bg-white/5">
                <div className="flex items-center gap-2">
                  <Bell size={15} className="text-neon" />
                  <div>
                    <p className="text-sm">{a.type}</p>
                    <p className="text-xs text-gray-500">{a.target}</p>
                  </div>
                </div>
                <button
                  onClick={() => setAlerts((list) => list.filter((x) => x.id !== a.id))}
                  className="text-gray-600 hover:text-red-400"
                >
                  <Trash2 size={15} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <p className="text-center text-xs text-gray-600">
        Alerts are stored in session. Wire browser/email notifications and a backend for delivery.
      </p>
    </div>
  );
}
