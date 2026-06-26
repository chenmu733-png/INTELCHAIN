'use client';

import { useState } from 'react';
import { getAssetImage, getAssetColor } from '@/lib/cryptoAssets';

export default function CryptoIcon({ symbol, size = 32, className = '', showBg = false }) {
  const [failed, setFailed] = useState(false);
  const url = getAssetImage(symbol);
  const color = getAssetColor(symbol);
  const displaySymbol = String(symbol || '?').slice(0, 1).toUpperCase();

  if (!url || failed) {
    return (
      <span
        className={`inline-flex items-center justify-center rounded-full font-semibold transition-all duration-300 ${
          showBg ? 'border border-white/10 bg-ink-600' : 'bg-gradient-to-br'
        } ${className}`}
        style={{
          width: size,
          height: size,
          fontSize: size * 0.42,
          color: color,
          ...(showBg && {
            backgroundColor: color + '15',
            borderColor: color + '30'
          })
        }}
      >
        {displaySymbol}
      </span>
    );
  }

  return (
    <img
      src={url}
      alt={symbol}
      width={size}
      height={size}
      onError={() => setFailed(true)}
      className={`rounded-full transition-transform duration-300 ${className}`}
      style={{ width: size, height: size }}
      loading="lazy"
    />
  );
}