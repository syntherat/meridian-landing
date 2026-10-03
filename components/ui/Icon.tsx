const PATHS = {
  up: ["M12 19V5", "M6 11l6-6 6 6"],
  swap: ["M4 8h14l-3-3", "M20 16H6l3 3"],
  check: ["M5 12l4 4 10-10"],
};

export type IconName = keyof typeof PATHS;

export function Icon({ name, color = "#EDEEF0", size = 16 }: { name: IconName; color?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
