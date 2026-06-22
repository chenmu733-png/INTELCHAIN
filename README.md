# INTELCHAIN

**Follow Money. Understand Everything.**

Enterprise-grade blockchain intelligence platform. Track wallets, entities, whales, tokens, and money flows across chains in real time.

## Tech stack

- **Next.js 14** (App Router, JavaScript)
- **TailwindCSS** — dark premium design system
- **Framer Motion** — animations
- **Zustand** — client state (UI + watchlist persistence)
- **React Query** — data fetching & caching
- **Recharts** — charts (ECharts / Mapbox planned)
- **PWA** — installable (`manifest.webmanifest`)

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Deploy

Ready for **Vercel**. Import the repo and deploy — no extra config required (`vercel.json` sets the framework).

## What is implemented

- Dark premium design system (Inter, glassmorphism, neon accents)
- App shell: collapsible sidebar, sticky topbar, mobile bottom nav
- Command palette (Ctrl/Cmd + K)
- Home dashboard with **live** market data (CoinGecko via React Query) + skeleton loaders
- Routing skeleton for all 15 pages
- PWA manifest + icon

## Roadmap (per page)

Search · Wallet · Entity · Token · Markets · Transactions · Whale Tracker · Network Visualizer · NFT Analytics · DEX Analytics · Alerts · Watchlist · Compare · Settings

Each currently ships as a structured stub describing its planned modules. Build these out incrementally:

1. Integrate additional free APIs (DefiLlama, DexScreener, Etherscan, Blockchair, Covalent) in `lib/api.js` with cache fallback.
2. Add WebSocket streaming for the Whale Tracker.
3. Add the interactive Network Visualizer graph.
4. Add IndexedDB cache + service worker for full offline PWA.

> Branding, design, and code are original. No third-party logos or source code are used.
