'use client';

import { useState } from 'react';

// Maps common token symbols to their official coin image (served by CoinGecko).
// Using the official hosted asset avoids reproducing trademarked logos.
const ICONS = {
  BTC: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
  WBTC: 'https://assets.coingecko.com/coins/images/7598/small/wrapped_bitcoin_wbtc.png',
  ETH: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
  USDC: 'https://assets.coingecko.com/coins/images/6319/small/usdc.png',
  USDT: 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
  SOL: 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
  ARB: 'https://assets.coingecko.com/coins/images/16547/small/arb.jpg',
  OP: 'https://assets.coingecko.com/coins/images/25244/small/Optimism.png',
  LINK: 'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png'
};

export default function TokenIcon({ symbol, size = 20, className = '' }) {
  const [failed, setFailed] = useState(false);
  const url = ICONS[String(symbol || '').toUpperCase()];

  if (!url || failed) {
    return (
      <span
        className={`inline-flex items-center justify-center rounded-full border border-white/10 bg-ink-600 font-semibold text-gray-300 ${className}`}
        style={{ width: size, height: size, fontSize: size * 0.42 }}
      >
        {String(symbol || '?').slice(0, 1).toUpperCase()}
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
      className={`rounded-full ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
