// Server-side on-chain transaction history via Covalent/GoldRush.
// Falls back to deterministic demo transfers when no API key is configured.
//
// Env var (Vercel \u2192 Settings \u2192 Environment Variables):
//   COVALENT_API_KEY=...

import { buildPortfolio } from '@/lib/demo';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getJSON(url) {
  const res = await fetch(url, { headers: { accept: 'application/json' } });
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json();
}

async function fromCovalent(address, key) {
  // Covalent transactions endpoint (most recent page).
  const url = `https://api.covalenthq.com/v1/eth-mainnet/address/${address}/transactions_v3/?key=${key}&page-size=25`;
  const data = await getJSON(url);
  const items = data?.data?.items || [];

  return items.map((tx, i) => {
    const incoming = String(tx.to_address || '').toLowerCase() === address.toLowerCase();
    return {
      id: tx.tx_hash || `${address}-${i}`,
      direction: incoming ? 'in' : 'out',
      token: 'ETH',
      amount: +(Number(tx.value || 0) / 1e18).toFixed(5),
      value: Math.round(tx.value_quote || 0),
      counterparty:
        (incoming ? tx.from_address : tx.to_address || '').slice(0, 10) + '\u2026',
      time: tx.block_signed_at ? new Date(tx.block_signed_at).getTime() : Date.now()
    };
  });
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address') || '';
  const key = process.env.COVALENT_API_KEY;
  const isEvm = /^0x[a-fA-F0-9]{40}$/.test(address);

  if (key && isEvm) {
    try {
      const txs = await fromCovalent(address, key);
      if (txs.length) return Response.json({ source: 'covalent', txs });
    } catch (e) {
      // fall through to demo
    }
  }

  const demo = buildPortfolio(address || 'intelchain');
  return Response.json({ source: 'demo', txs: demo.txs });
}
