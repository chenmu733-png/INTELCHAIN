'use client';

import { useUIStore } from '@/lib/store';
import { Card, CardTitle } from '@/components/ui/Card';

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 rounded-full transition ${checked ? 'bg-neon/70' : 'bg-ink-500'}`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${checked ? 'left-[22px]' : 'left-0.5'}`}
      />
    </button>
  );
}

export default function SettingsPage() {
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  const toggle = useUIStore((s) => s.toggleSidebar);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-gray-400">Profile, preferences, and data sources.</p>
      </div>

      <Card>
        <CardTitle>Appearance</CardTitle>
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm">Collapse sidebar</p>
            <p className="text-xs text-gray-500">Maximize content width on desktop.</p>
          </div>
          <Toggle checked={collapsed} onChange={toggle} />
        </div>
      </Card>

      <Card>
        <CardTitle>Data Sources</CardTitle>
        <ul className="space-y-2 text-sm">
          {[
            ['CoinGecko', 'Connected'],
            ['DefiLlama', 'Not configured'],
            ['Etherscan', 'Not configured'],
            ['Covalent', 'Not configured'],
            ['Alchemy', 'Not configured']
          ].map(([name, status]) => (
            <li key={name} className="flex items-center justify-between border-t border-white/5 py-2 first:border-0">
              <span>{name}</span>
              <span className={`text-xs ${status === 'Connected' ? 'text-neon' : 'text-gray-500'}`}>{status}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <CardTitle>About</CardTitle>
        <p className="text-sm text-gray-400">
          INTELCHAIN \u2014 Follow Money. Understand Everything. Enterprise-grade blockchain intelligence.
        </p>
      </Card>
    </div>
  );
}
