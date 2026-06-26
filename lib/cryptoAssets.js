/**
 * Cryptocurrency asset database with official logos and metadata
 * Sourced from CoinGecko official API
 */

export const CRYPTO_ASSETS = {
  BTC: {
    name: 'Bitcoin',
    symbol: 'BTC',
    image: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
    color: '#f7931a',
    chainId: 'ethereum'
  },
  ETH: {
    name: 'Ethereum',
    symbol: 'ETH',
    image: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    color: '#627eea',
    chainId: 'ethereum'
  },
  USDT: {
    name: 'Tether',
    symbol: 'USDT',
    image: 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
    color: '#26a17b',
    chainId: 'ethereum'
  },
  USDC: {
    name: 'USD Coin',
    symbol: 'USDC',
    image: 'https://assets.coingecko.com/coins/images/6319/small/usdc.png',
    color: '#2775ca',
    chainId: 'ethereum'
  },
  SOL: {
    name: 'Solana',
    symbol: 'SOL',
    image: 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
    color: '#9945ff',
    chainId: 'solana'
  },
  XRP: {
    name: 'XRP',
    symbol: 'XRP',
    image: 'https://assets.coingecko.com/coins/images/44/small/xrp-new.png',
    color: '#23292f',
    chainId: 'ripple'
  },
  BNB: {
    name: 'Binance Coin',
    symbol: 'BNB',
    image: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
    color: '#f3ba2f',
    chainId: 'binance'
  },
  ADA: {
    name: 'Cardano',
    symbol: 'ADA',
    image: 'https://assets.coingecko.com/coins/images/975/small/cardano.png',
    color: '#0033ad',
    chainId: 'cardano'
  },
  DOGE: {
    name: 'Dogecoin',
    symbol: 'DOGE',
    image: 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png',
    color: '#ba9f33',
    chainId: 'dogecoin'
  },
  LINK: {
    name: 'Chainlink',
    symbol: 'LINK',
    image: 'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png',
    color: '#2a5eff',
    chainId: 'ethereum'
  },
  MATIC: {
    name: 'Polygon',
    symbol: 'MATIC',
    image: 'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png',
    color: '#8247e5',
    chainId: 'ethereum'
  },
  ARB: {
    name: 'Arbitrum',
    symbol: 'ARB',
    image: 'https://assets.coingecko.com/coins/images/16547/small/arb.jpg',
    color: '#28a0f0',
    chainId: 'ethereum'
  },
  OP: {
    name: 'Optimism',
    symbol: 'OP',
    image: 'https://assets.coingecko.com/coins/images/25244/small/Optimism.png',
    color: '#ff0420',
    chainId: 'ethereum'
  },
  WBTC: {
    name: 'Wrapped Bitcoin',
    symbol: 'WBTC',
    image: 'https://assets.coingecko.com/coins/images/7598/small/wrapped_bitcoin_wbtc.png',
    color: '#f7931a',
    chainId: 'ethereum'
  },
  STETH: {
    name: 'Lido Staked Ether',
    symbol: 'stETH',
    image: 'https://assets.coingecko.com/coins/images/13442/small/steth_32.png',
    color: '#627eea',
    chainId: 'ethereum'
  },
  AAVE: {
    name: 'Aave',
    symbol: 'AAVE',
    image: 'https://assets.coingecko.com/coins/images/12645/small/aave-token-square.png',
    color: '#b1e5fc',
    chainId: 'ethereum'
  },
  UNI: {
    name: 'Uniswap',
    symbol: 'UNI',
    image: 'https://assets.coingecko.com/coins/images/12504/small/uniswap-uni.png',
    color: '#ff007a',
    chainId: 'ethereum'
  },
  SUSHI: {
    name: 'SushiSwap',
    symbol: 'SUSHI',
    image: 'https://assets.coingecko.com/coins/images/12271/small/512x512_reversed_2.png',
    color: '#fa52a6',
    chainId: 'ethereum'
  },
  CURVE: {
    name: 'Curve DAO',
    symbol: 'CRV',
    image: 'https://assets.coingecko.com/coins/images/12124/small/Curve.png',
    color: '#4e3eba',
    chainId: 'ethereum'
  },
  LDO: {
    name: 'Lido DAO',
    symbol: 'LDO',
    image: 'https://assets.coingecko.com/coins/images/13573/small/Lido_DAO.png',
    color: '#00a3e0',
    chainId: 'ethereum'
  }
};

export const getAssetInfo = (symbol) => {
  const key = String(symbol || '').toUpperCase();
  return CRYPTO_ASSETS[key] || null;
};

export const getAssetImage = (symbol) => {
  const asset = getAssetInfo(symbol);
  return asset?.image || null;
};

export const getAssetColor = (symbol) => {
  const asset = getAssetInfo(symbol);
  return asset?.color || '#00f7a6';
};

export const getAssetName = (symbol) => {
  const asset = getAssetInfo(symbol);
  return asset?.name || symbol;
};