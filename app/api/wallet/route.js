// Server-side on-chain wallet data.
// Uses Covalent/GoldRush or Alchemy when an API key is configured via env vars;
// otherwise falls back to deterministic demo data so the app always works.
//
// Configure in Vercel \u2192 Settings \u2192 Environment Variables:
//   COVALENT_API_KEY=...   (recommended, multi-chain holdings)
//   ALCHEMY_API_KEY=...    (alternative)
//
// Keys are read on the server only and never exposed to the browser.

import { buildPortfolio } from '@/lib/demo';

export const revalidate = 30;

async function getJSON(url, headers = {}) {
  const res = await fetch(url, { headers: { accept: 'application/json', ...headers } });
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json();
}

// Covalent / GoldRush: token balances on Ethereum mainnet (chain 1).
async function fromCovalent(address, key) {
  const url = `https://api.covalenthq.com/v1/eth-mainnet/address/${address}/balances_v2/?key=${key}`;
  const data = await getJSON(url);
  const items = data?.data?.items || [];

  const holdings = items
    .filter((i) => Number(i.quote) > 0)
    .map((i) => {
      const amount = Number(i.balance) / Math.pow(10, i.contract_decimals || 0);
      return {
        symbol: (i.contract_ticker_symbol || '?').toUpperCase(),
        amount: +amount.toFixed(4),
        price: i.quote_rate || 0,
        value: Math.round(i.quote || 0),
        change24h: 0
      };
    })
    .sort((a, b) => b.value - a.value)
    .slice(0, 25);

  const totalValue = Math.round(holdings.reduce((a, h) => a + h.value, 0));
  const sum = totalValue || 1;
  const allocation = holdings
    .slice(0, 6)
    .map((h) => ({ name: h.symbol, value: Math.round((h.value / sum) * 100) }));

  return {
    source: 'covalent',
    address,
    totalValue,
    pnl: 0,
    riskScore: 0,
    holdings,
    allocation,
    chains: [{ name: 'Ethereum', value: 100 }],
    history: [],
    txs: []
  };
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address') || '';

  const covalentKey = process.env.COVALENT_API_KEY;
  const isEvm = /^0x[a-fA-F0-9]{40}$/.test(address);

  if (covalentKey && isEvm) {
    try {
      const data = await fromCovalent(address, covalentKey);
      return Response.json(data);
    } catch (e) {
      // fall through to demo on provider error
    }
  }

  // Demo fallback (deterministic per address seed).
  const demo = buildPortfolio(address || 'intelchain');
  return Response.json({ source: 'demo', address, ...demo });
}
