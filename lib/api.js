// Market data via server-side proxy routes (avoids browser CORS / rate limits).
// Each call falls back gracefully and never throws an unhandled error.

async function getJSON(url) {
  const res = await fetch(url, { headers: { accept: 'application/json' } });
  if (!res.ok) {
    let detail = '';
    try {
      const body = await res.json();
      detail = body?.error || '';
    } catch {}
    throw new Error(detail || `Request failed: ${res.status}`);
  }
  return res.json();
}

export async function fetchMarkets(perPage = 100) {
  return getJSON(`/api/markets?per_page=${perPage}`);
}

export async function fetchGlobal() {
  return getJSON('/api/global');
}

export async function fetchCoinMarketChart(id, days = 30) {
  return getJSON(`/api/chart?id=${encodeURIComponent(id)}&days=${days}`);
}

export async function fetchCoin(id) {
  return getJSON(`/api/coin?id=${encodeURIComponent(id)}`);
}

export async function fetchDex() {
  return getJSON('/api/dex');
}
