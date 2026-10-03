export function LogoMark({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" aria-hidden="true">
      <circle cx="11" cy="11" r="9.5" fill="none" stroke="#EDEEF0" strokeWidth="1.5" />
      <line x1="11" y1="1.5" x2="11" y2="20.5" stroke="#C6F432" strokeWidth="1.5" />
    </svg>
  );
}
