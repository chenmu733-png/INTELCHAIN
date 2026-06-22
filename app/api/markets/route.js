// Server-side proxy for CoinGecko market data.
// Avoids browser CORS/rate-limit issues and keeps a short server cache.
const CG = 'https://api.coingecko.com/api/v3';

export const revalidate = 30;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const perPage = searchParams.get('per_page') || '100';
  const url = `${CG}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=1&price_change_percentage=1h,24h,7d&sparkline=false`;

  try {
    const res = await fetch(url, {
      headers: { accept: 'application/json' },
      next: { revalidate: 30 }
    });
    if (!res.ok) throw new Error(`CoinGecko ${res.status}`);
    const data = await res.json();
    return Response.json(data);
  } catch (e) {
    return Response.json({ error: String(e.message || e) }, { status: 502 });
  }
}
