// DEX analytics via free DefiLlama (TVL) + DexScreener (pairs). No API key.
export const revalidate = 60;

async function getJSON(url) {
  const res = await fetch(url, { headers: { accept: 'application/json' }, next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  return res.json();
}

export async function GET() {
  try {
    // Top DEX protocols by TVL
    const protocols = await getJSON('https://api.llama.fi/protocols');
    const dexes = (protocols || [])
      .filter((p) => p.category === 'Dexes')
      .sort((a, b) => (b.tvl || 0) - (a.tvl || 0))
      .slice(0, 12)
      .map((p) => ({
        id: p.slug || p.name,
        name: p.name,
        chain: p.chain || (p.chains && p.chains[0]) || '\u2014',
        tvl: p.tvl || 0,
        change1d: p.change_1d ?? null,
        change7d: p.change_7d ?? null
      }));
    return Response.json({ dexes });
  } catch (e) {
    return Response.json({ error: String(e.message || e), dexes: [] }, { status: 502 });
  }
}
