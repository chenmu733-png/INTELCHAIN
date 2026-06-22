// Deterministic demo on-chain data generator.
// Produces stable values from an address/name seed so the UI is populated
// before real API integrations (Etherscan, Covalent, Alchemy) are wired in.

function hashSeed(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const TOKENS = ['ETH', 'BTC', 'USDC', 'USDT', 'SOL', 'ARB', 'OP', 'LINK'];
const CHAINS = ['Ethereum', 'Arbitrum', 'Base', 'Optimism', 'Polygon'];

export function buildPortfolio(seedStr) {
  const rand = rng(hashSeed(seedStr || 'intelchain'));
  const totalValue = Math.round(50_000 + rand() * 8_000_000);
  const pnl = Math.round((rand() - 0.4) * totalValue * 0.6);
  const riskScore = Math.round(rand() * 100);

  const holdings = TOKENS.slice(0, 4 + Math.floor(rand() * 4)).map((sym) => {
    const value = Math.round(rand() * totalValue * 0.4);
    return {
      symbol: sym,
      amount: +(rand() * 1000).toFixed(3),
      price: +(rand() * 4000).toFixed(2),
      value,
      change24h: +((rand() - 0.5) * 20).toFixed(2)
    };
  });
  const sum = holdings.reduce((a, h) => a + h.value, 0) || 1;
  const allocation = holdings.map((h) => ({
    name: h.symbol,
    value: Math.round((h.value / sum) * 100)
  }));

  const chains = CHAINS.slice(0, 2 + Math.floor(rand() * 3)).map((name) => ({
    name,
    value: Math.round(rand() * 100)
  }));
  const chainSum = chains.reduce((a, c) => a + c.value, 0) || 1;
  chains.forEach((c) => (c.value = Math.round((c.value / chainSum) * 100)));

  const history = Array.from({ length: 30 }).map((_, i) => {
    const t = Date.now() - (29 - i) * 86400000;
    const drift = (rand() - 0.45) * totalValue * 0.08;
    return { t, price: Math.max(0, Math.round(totalValue + drift * (i - 15))) };
  });

  const txs = Array.from({ length: 12 }).map((_, i) => {
    const incoming = rand() > 0.5;
    return {
      id: `${seedStr}-${i}`,
      direction: incoming ? 'in' : 'out',
      token: TOKENS[Math.floor(rand() * TOKENS.length)],
      amount: +(rand() * 500).toFixed(3),
      value: Math.round(rand() * 200000),
      counterparty: '0x' + (hashSeed(seedStr + i).toString(16)).padStart(8, '0') + '\u2026',
      time: Date.now() - Math.floor(rand() * 7 * 86400000)
    };
  });

  return { totalValue, pnl, riskScore, holdings, allocation, chains, history, txs };
}

export function riskLabel(score) {
  if (score >= 75) return { label: 'High', color: 'text-red-400' };
  if (score >= 40) return { label: 'Medium', color: 'text-amber-400' };
  return { label: 'Low', color: 'text-neon' };
}
