export function usd(n, opts = {}) {
  if (n == null || Number.isNaN(n)) return '\u2014';
  const abs = Math.abs(n);
  if (opts.compact !== false) {
    if (abs >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
    if (abs >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
    if (abs >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  }
  if (abs < 1) return `$${Number(n).toLocaleString(undefined, { maximumFractionDigits: 6 })}`;
  return `$${Number(n).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

export function pct(n) {
  if (n == null || Number.isNaN(n)) return '\u2014';
  return `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`;
}

export function num(n) {
  if (n == null || Number.isNaN(n)) return '\u2014';
  return Number(n).toLocaleString();
}
