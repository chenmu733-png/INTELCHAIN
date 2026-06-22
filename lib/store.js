import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUIStore = create((set) => ({
  sidebarCollapsed: false,
  paletteOpen: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setPaletteOpen: (v) => set({ paletteOpen: v })
}));

export const useWatchlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      add: (item) => {
        if (get().items.find((i) => i.id === item.id)) return;
        set({ items: [...get().items, item] });
      },
      remove: (id) => set({ items: get().items.filter((i) => i.id !== id) })
    }),
    { name: 'intelchain-watchlist' }
  )
);
