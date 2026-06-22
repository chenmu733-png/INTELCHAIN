const CG = 'https://api.coingecko.com/api/v3';

export const revalidate = 60;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id') || 'bitcoin';
  try {
    const res = await fetch(
      `${CG}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`,
      { headers: { accept: 'application/json' }, next: { revalidate: 60 } }
    );
    if (!res.ok) throw new Error(`CoinGecko ${res.status}`);
    return Response.json(await res.json());
  } catch (e) {
    return Response.json({ error: String(e.message || e) }, { status: 502 });
  }
}
