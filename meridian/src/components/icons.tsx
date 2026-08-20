// Minimal line icons drawn to a shared 24px grid. Stroke-based to stay quiet
// against the restrained palette. Icons are decorative by default; surrounding
// controls provide the accessible name.

type P = { className?: string; size?: number };

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  'aria-hidden': true,
  focusable: false,
});

export const ArrowUp = ({ className, size = 18 }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M12 19V5M5 12l7-7 7 7" />
  </svg>
);

export const Clock = ({ className, size = 16 }: P) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

export const Check = ({ className, size = 16 }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M4 12l5 5L20 6" />
  </svg>
);

export const CheckDouble = ({ className, size = 16 }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M2 12l5 5 9-11" />
    <path d="M11 17l1 1L22 6" />
  </svg>
);

export const Back = ({ className, size = 20 }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

export const Dot = ({ className, size = 8 }: P) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 8 8"
    className={className}
    aria-hidden="true"
    focusable="false"
  >
    <circle cx="4" cy="4" r="4" fill="currentColor" />
  </svg>
);

export const Feather = ({ className, size = 20 }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M20 4c-6 0-10 4-13 9l-3 7 7-3c5-3 9-7 9-13Z" />
    <path d="M16 8 8 16M14 12H8" />
  </svg>
);
