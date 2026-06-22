// Whale feed: polls the server-side /api/whales route which uses Alchemy when
// ALCHEMY_API_KEY is configured (Ethereum mainnet), otherwise returns simulated
// events. The public API (subscribe -> unsubscribe) is unchanged so the UI does
// not need to change.

export { makeWhaleEvent } from '@/lib/whaleSim';

async function poll(onEvent, seen) {
  try {
    const res = await fetch('/api/whales', { headers: { accept: 'application/json' } });
    if (!res.ok) return;
    const data = await res.json();
    const events = data?.events || [];
    // Emit newest first, skipping ones already shown.
    for (const e of events) {
      if (seen.has(e.id)) continue;
      seen.add(e.id);
      onEvent(e);
    }
    // Cap memory of seen ids.
    if (seen.size > 500) {
      const arr = Array.from(seen).slice(-300);
      seen.clear();
      arr.forEach((id) => seen.add(id));
    }
  } catch {
    // ignore transient network errors; next tick retries
  }
}

export function subscribeWhales(onEvent, intervalMs = 5000) {
  const seen = new Set();
  poll(onEvent, seen);
  const id = setInterval(() => poll(onEvent, seen), intervalMs);
  return () => clearInterval(id);
}
