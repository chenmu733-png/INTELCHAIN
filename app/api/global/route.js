const CG = 'https://api.coingecko.com/api/v3';

export const revalidate = 30;

export async function GET() {
  try {
    const res = await fetch(`${CG}/global`, {
      headers: { accept: 'application/json' },
      next: { revalidate: 30 }
    });
    if (!res.ok) throw new Error(`CoinGecko ${res.status}`);
    const data = await res.json();
    return Response.json(data.data);
  } catch (e) {
    return Response.json({ error: String(e.message || e) }, { status: 502 });
  }
}
