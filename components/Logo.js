import CoinIcon from '@/components/CoinIcon';

export default function Logo({ collapsed = false }) {
  return (
    <div className="flex items-center gap-2 select-none">
      <div className="relative h-8 w-8 shrink-0">
        <div className="absolute inset-0 rounded-full bg-neon/25 blur-[7px]" />
        <CoinIcon size={32} className="relative" />
      </div>
      {!collapsed && (
        <span className="text-base font-extrabold tracking-tight">
          INTEL<span className="neon-text">CHAIN</span>
        </span>
      )}
    </div>
  );
}
