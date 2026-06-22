'use client';

import { Search, Command, Menu } from 'lucide-react';
import Logo from '@/components/Logo';
import { useUIStore } from '@/lib/store';

export default function Topbar() {
  const setPaletteOpen = useUIStore((s) => s.setPaletteOpen);
  const setMobileNavOpen = useUIStore((s) => s.setMobileNavOpen);
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-white/5 bg-ink-900/70 px-4 backdrop-blur-md lg:px-6">
      <button
        onClick={() => setMobileNavOpen(true)}
        className="rounded-md p-1.5 text-gray-300 hover:bg-ink-600 hover:text-neon lg:hidden"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>
      <div className="lg:hidden">
        <Logo collapsed />
      </div>
      <button
        onClick={() => setPaletteOpen(true)}
        className="glass flex h-10 flex-1 items-center gap-2 rounded-xl px-3 text-sm text-gray-400 transition hover:border-neon/30"
      >
        <Search size={16} />
        <span className="flex-1 text-left">Search wallet, token, entity, ENS\u2026</span>
        <kbd className="hidden items-center gap-1 rounded border border-white/10 px-1.5 py-0.5 text-[10px] text-gray-400 sm:flex">
          <Command size={10} /> K
        </kbd>
      </button>
    </header>
  );
}
