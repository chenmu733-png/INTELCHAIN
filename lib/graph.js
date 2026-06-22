// Deterministic money-flow graph generator for the Network Visualizer.
// Replace buildGraph() with real entity/transfer data when an on-chain
// graph source is wired in.

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

const LABELS = [
  'Binance', 'Coinbase', 'Kraken', 'Smart Money', 'Whale', 'Jump',
  'Wintermute', 'OKX', 'Unknown', 'Bridge', 'Mixer', 'DEX Pool'
];
const KINDS = ['exchange', 'whale', 'smart', 'unknown'];

export function buildGraph(seedStr, count = 18) {
  const rand = rng(hashSeed(seedStr || 'intelchain'));
  const nodes = Array.from({ length: count }).map((_, i) => ({
    id: i,
    label: i === 0 ? 'Target' : LABELS[Math.floor(rand() * LABELS.length)],
    kind: i === 0 ? 'target' : KINDS[Math.floor(rand() * KINDS.length)],
    value: Math.round(50_000 + rand() * 5_000_000),
    // initial position spread around the center
    x: (rand() - 0.5) * 700,
    y: (rand() - 0.5) * 500,
    vx: 0,
    vy: 0
  }));

  const edges = [];
  for (let i = 1; i < count; i++) {
    // connect each node to the target or to a previous node
    const target = rand() > 0.45 ? 0 : Math.floor(rand() * i);
    edges.push({
      source: i,
      target,
      value: Math.round(10_000 + rand() * 2_000_000),
      dir: rand() > 0.5 ? 1 : -1
    });
  }
  // a few extra cross-links
  for (let k = 0; k < Math.floor(count / 4); k++) {
    const a = Math.floor(rand() * count);
    const b = Math.floor(rand() * count);
    if (a !== b) edges.push({ source: a, target: b, value: Math.round(rand() * 500_000), dir: 1 });
  }

  return { nodes, edges };
}

export const NODE_COLORS = {
  target: '#22e584',
  exchange: '#3b82f6',
  whale: '#a855f7',
  smart: '#22e584',
  unknown: '#64748b'
};
