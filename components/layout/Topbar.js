'use client';

import { Search, Command } from 'lucide-react';
import Logo from '@/components/Logo';
import { useUIStore } from '@/lib/store';

export default function Topbar() {
  const setPaletteOpen = useUIStore((s) => s.setPaletteOpen);
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-white/5 bg-ink-900/70 px-4 backdrop-blur-md lg:px-6">
      <div className="lg:hidden">
        <Logo collapsed />
      </div>
      <button
        onClick={() => setPaletteOpen(true)}
        className="glass flex h-10 flex-1 items-center gap-2 rounded-xl px-3 text-sm text-gray-400 transition hover:border-neon/30"
      >
        <Search size={16} />
        <span className="flex-1 text-left">Search wallet, token, entity, ENS…</span>
        <kbd className="hidden items-center gap-1 rounded border border-white/10 px-1.5 py-0.5 text-[10px] text-gray-400 sm:flex">
          <Command size={10} /> K
        </kbd>
      </button>
    </header>
  );
}
