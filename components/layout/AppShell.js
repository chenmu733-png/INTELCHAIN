'use client';

import Sidebar from './Sidebar';
import Topbar from './Topbar';
import BottomNav from './BottomNav';
import CommandPalette from './CommandPalette';
import { useUIStore } from '@/lib/store';

export default function AppShell({ children }) {
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  return (
    <div className="min-h-screen bg-ink-900">
      <Sidebar />
      <div
        className={`transition-[padding] duration-300 ${
          collapsed ? 'lg:pl-[76px]' : 'lg:pl-[248px]'
        }`}
      >
        <Topbar />
        <main className="px-4 pb-24 pt-4 lg:px-6 lg:pb-10">{children}</main>
      </div>
      <BottomNav />
      <CommandPalette />
    </div>
  );
}
