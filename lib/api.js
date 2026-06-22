// Free market data via CoinGecko with graceful fallback.
const CG = 'https://api.coingecko.com/api/v3';

async function safeFetch(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

export async function fetchMarkets(perPage = 100) {
  return safeFetch(
    `${CG}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=1&price_change_percentage=1h,24h,7d&sparkline=false`
  );
}

export async function fetchGlobal() {
  const data = await safeFetch(`${CG}/global`);
  return data.data;
}

// Historical market chart for a single coin.
// days: number of days (1, 7, 30, 90, 365). Returns array of { t, price }.
export async function fetchCoinMarketChart(id, days = 30) {
  const data = await safeFetch(
    `${CG}/coins/${id}/market_chart?vs_currency=usd&days=${days}`
  );
  return (data.prices || []).map(([t, price]) => ({ t, price }));
}

export async function fetchCoin(id) {
  return safeFetch(
    `${CG}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
  );
}
