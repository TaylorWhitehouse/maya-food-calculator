// Small inline SVG icons. Line icons use currentColor, so they take the text colour of their parent.
const line = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

export function ScaleIcon() {
  return (
    <svg {...line}>
      <rect x="3" y="4" width="18" height="16" rx="4" />
      <path d="M8.5 10.5a3.5 3.5 0 0 1 7 0" />
      <path d="M12 10.5l1.6-2.2" />
    </svg>
  );
}

export function TargetIcon() {
  return (
    <svg {...line}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="0.8" fill="currentColor" />
    </svg>
  );
}

export function BoneIcon() {
  return (
    <svg {...line}>
      <path d="M8 16l8-8" />
      <circle cx="6.5" cy="15" r="2.2" />
      <circle cx="9" cy="17.5" r="2.2" />
      <circle cx="15" cy="6.5" r="2.2" />
      <circle cx="17.5" cy="9" r="2.2" />
    </svg>
  );
}

export function BowlIcon() {
  return (
    <svg {...line}>
      <path d="M3 11h18a9 9 0 0 1-18 0z" />
      <path d="M8 7.5h.01M12 6h.01M16 7.5h.01" />
    </svg>
  );
}

export function ReceiptIcon() {
  return (
    <svg {...line}>
      <path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" />
      <path d="M9 8h6M9 12h6" />
    </svg>
  );
}

export function ChevronDown() {
  return (
    <svg {...line} strokeWidth={2.6}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function CheckIcon() {
  return (
    <svg {...line} strokeWidth={4}>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

// Decorations around Maya's photo (colours come from App.css)
export function Heart({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M12 20.5s-7.8-4.7-9.4-9.6C1.5 7.6 3.6 4.5 7 4.5c2.1 0 3.7 1.1 5 2.9 1.3-1.8 2.9-2.9 5-2.9 3.4 0 5.5 3.1 4.4 6.4-1.6 4.9-9.4 9.6-9.4 9.6z" />
    </svg>
  );
}

export function Sparkle({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z" />
    </svg>
  );
}
