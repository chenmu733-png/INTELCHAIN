// DEX analytics via free DefiLlama (TVL) + DexScreener (top pairs). No API key.
export const revalidate = 60;

async function getJSON(url) {
  const res = await fetch(url, { headers: { accept: 'application/json' }, next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  return res.json();
}

export async function GET() {
  try {
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

    // Top trending pairs from DexScreener (best-effort; non-fatal on failure).
    let pairs = [];
    try {
      const ds = await getJSON('https://api.dexscreener.com/latest/dex/search?q=ETH');
      pairs = (ds?.pairs || [])
        .filter((p) => p.liquidity?.usd)
        .sort((a, b) => (b.liquidity.usd || 0) - (a.liquidity.usd || 0))
        .slice(0, 12)
        .map((p) => ({
          id: p.pairAddress,
          name: `${p.baseToken?.symbol}/${p.quoteToken?.symbol}`,
          dex: p.dexId,
          chain: p.chainId,
          priceUsd: p.priceUsd ? Number(p.priceUsd) : null,
          liquidity: Math.round(p.liquidity.usd || 0),
          volume24h: Math.round(p.volume?.h24 || 0)
        }));
    } catch {}

    return Response.json({ dexes, pairs });
  } catch (e) {
    return Response.json({ error: String(e.message || e), dexes: [], pairs: [] }, { status: 502 });
  }
}
