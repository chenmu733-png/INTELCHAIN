export default function Logo({ collapsed = false }) {
  return (
    <div className="flex items-center gap-2 select-none">
      <div className="relative h-8 w-8 shrink-0">
        <div className="absolute inset-0 rounded-lg bg-neon/20 blur-[6px]" />
        <div className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-neon/40 bg-ink-700">
          <span className="neon-text text-sm font-extrabold">IC</span>
        </div>
      </div>
      {!collapsed && (
        <span className="text-base font-extrabold tracking-tight">
          INTEL<span className="neon-text">CHAIN</span>
        </span>
      )}
    </div>
  );
}
