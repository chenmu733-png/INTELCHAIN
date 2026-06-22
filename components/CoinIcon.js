export default function CoinIcon({ size = 32, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="icCoin" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#22e584" />
          <stop offset="1" stopColor="#16c474" />
        </linearGradient>
      </defs>
      {/* coin rim */}
      <circle cx="24" cy="24" r="21" fill="#0a0d12" stroke="url(#icCoin)" strokeWidth="3" />
      <circle cx="24" cy="24" r="15" stroke="url(#icCoin)" strokeWidth="1.5" strokeOpacity="0.4" />
      {/* chain link motif */}
      <g stroke="url(#icCoin)" strokeWidth="3" strokeLinecap="round" fill="none">
        <rect x="14" y="19" width="12" height="10" rx="5" transform="rotate(-30 14 19)" />
        <rect x="22" y="19" width="12" height="10" rx="5" transform="rotate(-30 22 19)" />
      </g>
    </svg>
  );
}
