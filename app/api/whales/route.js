// Real-time-ish whale feed for Ethereum mainnet via Alchemy.
// Polls recent asset transfers server-side so ALCHEMY_API_KEY is never exposed
// to the browser. Falls back to a simulated batch when no key is configured.
//
// Env var (Vercel \u2192 Settings \u2192 Environment Variables):
//   ALCHEMY_API_KEY=...

import { makeWhaleEvent } from '@/lib/whaleSim';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function rpc(url, method, params) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ id: 1, jsonrpc: '2.0', method, params })
  });
  if (!res.ok) throw new Error(`rpc ${res.status}`);
  const json = await res.json();
  if (json.error) throw new Error(json.error.message || 'rpc error');
  return json.result;
}

function classify(from, to) {
  // Without label data we mark exchange-known addresses heuristically.
  // Default to a neutral transfer type.
  return 'Transfer';
}

async function fromAlchemy(key) {
  const url = `https://eth-mainnet.g.alchemy.com/v2/${key}`;

  // Latest block number, then look back a small window.
  const latestHex = await rpc(url, 'eth_blockNumber', []);
  const latest = parseInt(latestHex, 16);
  const fromBlock = '0x' + Math.max(0, latest - 8).toString(16);

  const result = await rpc(url, 'alchemy_getAssetTransfers', [
    {
      fromBlock,
      toBlock: 'latest',
      category: ['external', 'erc20'],
      withMetadata: true,
      excludeZeroValue: true,
      maxCount: '0x32',
      order: 'desc'
    }
  ]);

  const transfers = result?.transfers || [];
  return transfers
    .filter((t) => t.value && Number(t.value) > 0)
    .map((t) => {
      const token = (t.asset || 'ETH').toUpperCase();
      const amount = Number(t.value);
      const ts = t.metadata?.blockTimestamp
        ? new Date(t.metadata.blockTimestamp).getTime()
        : Date.now();
      return {
        id: `${t.hash}-${t.uniqueId || ''}`,
        type: classify(t.from, t.to),
        token,
        amount: +amount.toFixed(4),
        usdValue: null, // priced client-side via market data when available
        from: t.from ? `${t.from.slice(0, 8)}\u2026${t.from.slice(-4)}` : 'Unknown',
        to: t.to ? `${t.to.slice(0, 8)}\u2026${t.to.slice(-4)}` : 'Unknown',
        time: ts
      };
    });
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const debug = searchParams.get('debug') === '1';
  const key = process.env.ALCHEMY_API_KEY;

  if (key) {
    try {
      const events = await fromAlchemy(key);
      return Response.json({ source: 'alchemy', events });
    } catch (e) {
      if (debug) {
        return Response.json({ source: 'demo', error: String(e.message || e), events: simBatch() });
      }
    }
  }

  return Response.json({
    source: 'demo',
    events: simBatch(),
    ...(debug ? { reason: key ? 'alchemy error' : 'ALCHEMY_API_KEY not set' } : {})
  });
}

function simBatch(n = 8) {
  return Array.from({ length: n }).map(() => makeWhaleEvent());
}
