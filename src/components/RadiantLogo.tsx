interface LogoProps {
  size?: number;   // icon size in px
  showText?: boolean;
  textSize?: number;
}

export function RadiantLogo({ size = 28, showText = true, textSize = 16 }: LogoProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
      {/* Diamond icon */}
      <div style={{
        width: size, height: size,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
        filter: 'drop-shadow(0 0 6px rgba(229,62,62,0.5))',
      }}>
        <svg
          viewBox="0 0 32 32"
          width={size}
          height={size}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="logo-crown" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FF5555"/>
              <stop offset="100%" stopColor="#C41C1C"/>
            </linearGradient>
            <linearGradient id="logo-pav" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E03030"/>
              <stop offset="100%" stopColor="#7F1D1D"/>
            </linearGradient>
          </defs>

          {/* Sparkle rays */}
          <line x1="16" y1="0.5"  x2="16" y2="3.2"   stroke="#FF5555" strokeWidth="1.6" strokeLinecap="round"/>
          <line x1="29.5" y1="6"  x2="27.8" y2="7.6"  stroke="#FF4444" strokeWidth="1.3" strokeLinecap="round"/>
          <line x1="2.5"  y1="6"  x2="4.2"  y2="7.6"  stroke="#FF4444" strokeWidth="1.3" strokeLinecap="round"/>

          {/* Crown */}
          <path d="M9.5 5.5 L22.5 5.5 L27.5 14 L4.5 14 Z" fill="url(#logo-crown)"/>

          {/* Table highlight */}
          <path d="M11.5 5.5 L20.5 5.5 L23 10.5 L9 10.5 Z" fill="rgba(255,255,255,0.18)"/>

          {/* Pavilion */}
          <path d="M4.5 14 L27.5 14 L16 30.5 Z" fill="url(#logo-pav)"/>

          {/* Left pavilion highlight */}
          <path d="M4.5 14 L16 14 L16 30.5 Z" fill="rgba(255,255,255,0.05)"/>

          {/* Crown facet lines */}
          <line x1="11.5" y1="5.5"  x2="4.5"  y2="14"   stroke="rgba(255,255,255,0.5)"  strokeWidth="0.6"/>
          <line x1="20.5" y1="5.5"  x2="27.5" y2="14"   stroke="rgba(255,255,255,0.5)"  strokeWidth="0.6"/>
          <line x1="9"    y1="10.5" x2="4.5"  y2="14"   stroke="rgba(255,255,255,0.28)" strokeWidth="0.5"/>
          <line x1="23"   y1="10.5" x2="27.5" y2="14"   stroke="rgba(255,255,255,0.28)" strokeWidth="0.5"/>
          <line x1="16"   y1="5.5"  x2="16"   y2="14"   stroke="rgba(255,255,255,0.2)"  strokeWidth="0.5"/>

          {/* Pavilion facet lines */}
          <line x1="16"   y1="14"  x2="16"  y2="30.5" stroke="rgba(255,255,255,0.13)" strokeWidth="0.5"/>
          <line x1="4.5"  y1="14"  x2="16"  y2="23"   stroke="rgba(255,255,255,0.13)" strokeWidth="0.5"/>
          <line x1="27.5" y1="14"  x2="16"  y2="23"   stroke="rgba(255,255,255,0.13)" strokeWidth="0.5"/>
        </svg>
      </div>

      {showText && (
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: `${textSize}px`,
          fontWeight: '700',
          letterSpacing: '-0.2px',
          color: 'var(--text)',
        }}>
          radiant
        </span>
      )}
    </div>
  );
}
