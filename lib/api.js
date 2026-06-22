// Free market data via CoinGecko with graceful fallback.
const CG = 'https://api.coingecko.com/api/v3';

async function safeFetch(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

export async function fetchMarkets() {
  return safeFetch(
    `${CG}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&price_change_percentage=24h`
  );
}

export async function fetchGlobal() {
  const data = await safeFetch(`${CG}/global`);
  return data.data;
}
