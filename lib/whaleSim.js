// Simulated whale events, used as a fallback when no provider key is set.
const TOKENS = ['ETH', 'BTC', 'USDC', 'USDT', 'SOL', 'WBTC', 'LINK', 'ARB'];
const ENTITIES = ['Binance', 'Coinbase', 'Kraken', 'Smart Money', 'Unknown Whale', 'Jump', 'Wintermute', 'OKX'];
const TYPES = ['Transfer', 'Exchange Inflow', 'Exchange Outflow', 'Large Trade'];

function shortAddr() {
  const hex = Math.floor(Math.random() * 0xffffffff).toString(16).padStart(8, '0');
  return `0x${hex}\u2026${Math.floor(Math.random() * 0xffff).toString(16).padStart(4, '0')}`;
}

export function makeWhaleEvent() {
  const token = TOKENS[Math.floor(Math.random() * TOKENS.length)];
  const type = TYPES[Math.floor(Math.random() * TYPES.length)];
  const usdValue = Math.round(250_000 + Math.random() * 40_000_000);
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    token,
    amount: +(usdValue / (Math.random() * 4000 + 1)).toFixed(2),
    usdValue,
    from: Math.random() > 0.5 ? ENTITIES[Math.floor(Math.random() * ENTITIES.length)] : shortAddr(),
    to: Math.random() > 0.5 ? ENTITIES[Math.floor(Math.random() * ENTITIES.length)] : shortAddr(),
    time: Date.now()
  };
}
