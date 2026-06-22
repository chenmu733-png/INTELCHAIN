// Live NFT collections via Reservoir (free public API for basic access).
// Optional key for higher limits: RESERVOIR_API_KEY.
export const revalidate = 120;

async function getJSON(url, headers = {}) {
  const res = await fetch(url, {
    headers: { accept: 'application/json', ...headers },
    next: { revalidate: 120 }
  });
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json();
}

export async function GET() {
  const key = process.env.RESERVOIR_API_KEY;
  const headers = key ? { 'x-api-key': key } : {};
  try {
    const data = await getJSON(
      'https://api.reservoir.tools/collections/v7?sortBy=1DayVolume&limit=20',
      headers
    );
    const collections = (data?.collections || []).map((c, i) => ({
      id: c.id || i,
      name: c.name || 'Unknown',
      image: c.image || null,
      floor: c.floorAsk?.price?.amount?.decimal ?? null,
      volume1d: c.volume?.['1day'] ?? null,
      volumeAll: c.volume?.allTime ?? null,
      holders: c.ownerCount ?? null,
      change1d: c.volumeChange?.['1day'] ?? null
    }));
    return Response.json({ collections });
  } catch (e) {
    return Response.json({ error: String(e.message || e), collections: [] }, { status: 502 });
  }
}
