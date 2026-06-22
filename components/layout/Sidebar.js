'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { PanelLeftClose, PanelLeftOpen, X } from 'lucide-react';
import Logo from '@/components/Logo';
import { NAV } from '@/lib/nav';
import { useUIStore } from '@/lib/store';

function NavList({ pathname, collapsed, onNavigate }) {
  return (
    <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
      {NAV.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
              active
                ? 'bg-neon/10 text-neon'
                : 'text-gray-400 hover:bg-ink-600 hover:text-white'
            }`}
          >
            {active && (
              <motion.span
                layoutId="sidebar-active"
                className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r bg-neon"
              />
            )}
            <Icon size={18} className="shrink-0" />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  const toggle = useUIStore((s) => s.toggleSidebar);
  const mobileNavOpen = useUIStore((s) => s.mobileNavOpen);
  const setMobileNavOpen = useUIStore((s) => s.setMobileNavOpen);

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-white/5 bg-ink-800/80 backdrop-blur-md lg:flex transition-[width] duration-300 ${
          collapsed ? 'w-[76px]' : 'w-[248px]'
        }`}
      >
        <div className="flex h-16 items-center justify-between px-4">
          <Logo collapsed={collapsed} />
          <button
            onClick={toggle}
            className="rounded-md p-1.5 text-gray-400 hover:bg-ink-600 hover:text-neon"
            aria-label="Toggle sidebar"
          >
            {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </div>
        <NavList pathname={pathname} collapsed={collapsed} />
        {!collapsed && (
          <div className="border-t border-white/5 p-4 text-xs text-gray-500">
            Follow Money.
            <br />
            <span className="neon-text">Understand Everything.</span>
          </div>
        )}
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileNavOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileNavOpen(false)}
          >
            <motion.aside
              initial={{ x: -288 }}
              animate={{ x: 0 }}
              exit={{ x: -288 }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              className="flex h-full w-[272px] flex-col border-r border-white/5 bg-ink-800"
            >
              <div className="flex h-16 items-center justify-between px-4">
                <Logo />
                <button
                  onClick={() => setMobileNavOpen(false)}
                  className="rounded-md p-1.5 text-gray-400 hover:bg-ink-600 hover:text-neon"
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>
              <NavList
                pathname={pathname}
                collapsed={false}
                onNavigate={() => setMobileNavOpen(false)}
              />
              <div className="border-t border-white/5 p-4 text-xs text-gray-500">
                Follow Money.
                <br />
                <span className="neon-text">Understand Everything.</span>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
