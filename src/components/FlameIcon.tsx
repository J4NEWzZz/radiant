interface FlameIconProps {
  size?: number;
  animated?: boolean;
}

export function FlameIcon({ size = 20, animated = false }: FlameIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={animated ? { animation: 'flame 1.8s ease-in-out infinite' } : undefined}
    >
      <defs>
        <linearGradient id="flame-outer" x1="10" y1="0" x2="10" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#FBBF24" />
          <stop offset="45%"  stopColor="#F97316" />
          <stop offset="100%" stopColor="#DC2626" />
        </linearGradient>
        <linearGradient id="flame-inner" x1="10" y1="8" x2="10" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#FEF08A" />
          <stop offset="100%" stopColor="#F97316" />
        </linearGradient>
      </defs>

      {/* Outer flame */}
      <path
        d="M10 1C10 1 3.5 8 3.5 14C3.5 17.6 6.4 21 10 21C13.6 21 16.5 17.6 16.5 14C16.5 8 10 1 10 1Z"
        fill="url(#flame-outer)"
      />
      {/* Side flare */}
      <path
        d="M6.5 10C6.5 10 4 13 5.5 16C4 14.5 3.5 14 3.5 14C3.5 11 6.5 10 6.5 10Z"
        fill="#F97316"
        opacity="0.6"
      />
      {/* Inner core */}
      <path
        d="M10 9C10 9 7 12 7 15C7 16.7 8.3 18 10 18C11.7 18 13 16.7 13 15C13 12 10 9 10 9Z"
        fill="url(#flame-inner)"
        opacity="0.85"
      />
    </svg>
  );
}

// Compact streak badge: flame + count
export function StreakBadge({ count }: { count: number }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      background: 'rgba(249,115,22,0.08)',
      border: '1px solid rgba(249,115,22,0.22)',
      borderRadius: '20px', padding: '5px 11px 5px 7px',
    }}>
      <FlameIcon size={16} animated={count > 0} />
      <span style={{
        fontFamily: 'var(--font-mono)', fontWeight: '700',
        fontSize: '13px', color: '#F97316',
        letterSpacing: '-0.3px',
      }}>
        {count}
      </span>
    </div>
  );
}
