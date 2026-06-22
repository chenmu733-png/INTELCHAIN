const CG = 'https://api.coingecko.com/api/v3';

export const revalidate = 60;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id') || 'bitcoin';
  const days = searchParams.get('days') || '30';
  try {
    const res = await fetch(
      `${CG}/coins/${id}/market_chart?vs_currency=usd&days=${days}`,
      { headers: { accept: 'application/json' }, next: { revalidate: 60 } }
    );
    if (!res.ok) throw new Error(`CoinGecko ${res.status}`);
    const data = await res.json();
    const prices = (data.prices || []).map(([t, price]) => ({ t, price }));
    return Response.json(prices);
  } catch (e) {
    return Response.json({ error: String(e.message || e) }, { status: 502 });
  }
}
