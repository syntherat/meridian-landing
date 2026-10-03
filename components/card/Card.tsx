type CardProps = {
  ref?: React.Ref<HTMLDivElement>;
  className?: string;
  style?: React.CSSProperties;
};

// The titanium card. 420x265 at 1x; scale it with transforms, never by resizing.
export function Card({ ref, className = "", style }: CardProps) {
  return (
    <div
      ref={ref}
      style={style}
      className={`relative h-[265px] w-[420px] overflow-hidden rounded-[20px] text-bone shadow-[inset_0_1px_0_rgba(255,255,255,0.16),inset_0_0_0_1px_rgba(255,255,255,0.07)] ${className}`}
    >
      <div className="absolute inset-0 bg-[linear-gradient(140deg,#2D3036_0%,#16181C_38%,#22252B_62%,#0B0C0F_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_28%,rgba(255,255,255,0.07)_44%,transparent_58%)]" />
      <div className="absolute inset-y-0 left-[64%] w-[1.5px] bg-signal shadow-[0_0_18px_var(--color-signal)]" />

      <div className="absolute inset-x-7 top-[26px] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 22 22" aria-hidden="true">
            <circle cx="11" cy="11" r="9.5" fill="none" stroke="#EDEEF0" strokeWidth="1.6" />
            <line x1="11" y1="1.5" x2="11" y2="20.5" stroke="#EDEEF0" strokeWidth="1.6" />
          </svg>
          <span className="text-base font-medium tracking-[-0.02em]">meridian</span>
        </div>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(237,238,240,0.7)"
          strokeWidth="1.6"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M8 8.5a5 5 0 0 1 0 7" />
          <path d="M11.5 6a8.5 8.5 0 0 1 0 12" />
          <path d="M15 3.5a12 12 0 0 1 0 17" />
        </svg>
      </div>

      <div className="absolute left-7 top-[92px] h-9 w-[46px] rounded-[7px] bg-[linear-gradient(135deg,#C9CCD1_0%,#8D9198_50%,#B7BAC0_100%)] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.25)]">
        <div className="absolute inset-x-0 top-3 h-px bg-black/25" />
        <div className="absolute inset-x-0 top-[23px] h-px bg-black/25" />
        <div className="absolute inset-y-0 left-[18px] w-px bg-black/25" />
      </div>

      <div className="absolute inset-x-7 bottom-6 flex items-end justify-between font-mono">
        <div className="flex flex-col gap-1.5">
          <span className="text-[15px] tracking-[0.08em] text-bone/90">•••• 4417</span>
          <span className="text-[11px] tracking-[0.14em] text-bone/60">A. MORGAN</span>
        </div>
        <span className="text-[10px] tracking-[0.2em] text-bone/55">TITANIUM</span>
      </div>
    </div>
  );
}
