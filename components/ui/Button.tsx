type ButtonProps = {
  href: string;
  variant?: "primary" | "secondary" | "light";
  size?: "md" | "sm";
  arrow?: boolean;
  className?: string;
  children: React.ReactNode;
};

const VARIANTS = {
  primary: "bg-signal text-void font-medium hover:bg-[#d4ff4a]",
  secondary: "border border-white/16 text-bone hover:border-white/40",
  light: "bg-bone text-void font-medium hover:bg-white",
};

export function Button({ href, variant = "primary", size = "md", arrow, className = "", children }: ButtonProps) {
  const height = size === "md" ? "h-[52px] px-[26px] text-[15px]" : "h-11 px-5 text-sm";
  return (
    <a
      href={href}
      className={`inline-flex items-center gap-2.5 rounded-full transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal ${height} ${VARIANTS[variant]} ${className}`}
    >
      {children}
      {arrow && (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 12h14" />
          <path d="M13 6l6 6-6 6" />
        </svg>
      )}
    </a>
  );
}
