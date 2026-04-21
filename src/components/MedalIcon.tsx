import type { AchievementTier } from '../data/content';

interface MedalProps {
  achievementId: string;
  size?: number;
  earned?: boolean;
}

// ── Per-achievement SVG medals ────────────────────────────────────────────────

function RadiantStarterMedal({ s }: { s: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <defs>
        <linearGradient id="rs-c" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF5555"/>
          <stop offset="100%" stopColor="#991111"/>
        </linearGradient>
        <linearGradient id="rs-p" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E03030"/>
          <stop offset="100%" stopColor="#5A0A0A"/>
        </linearGradient>
        <radialGradient id="rs-glow" cx="50%" cy="30%">
          <stop offset="0%" stopColor="rgba(255,120,120,0.5)"/>
          <stop offset="100%" stopColor="transparent"/>
        </radialGradient>
      </defs>
      {/* Background glow */}
      <circle cx="32" cy="32" r="30" fill="url(#rs-glow)"/>
      {/* Sparkle rays */}
      <line x1="32" y1="2"  x2="32" y2="8"  stroke="#FF7777" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="58" y1="12" x2="54" y2="16" stroke="#FF6666" strokeWidth="2"   strokeLinecap="round"/>
      <line x1="6"  y1="12" x2="10" y2="16" stroke="#FF6666" strokeWidth="2"   strokeLinecap="round"/>
      {/* Crown (trapezoid) */}
      <path d="M20 14 L44 14 L52 28 L12 28 Z" fill="url(#rs-c)"/>
      {/* Table highlight */}
      <path d="M24 14 L40 14 L44 22 L20 22 Z" fill="rgba(255,255,255,0.18)"/>
      {/* Pavilion */}
      <path d="M12 28 L52 28 L32 58 Z" fill="url(#rs-p)"/>
      {/* Crown facet lines */}
      <line x1="24" y1="14" x2="12" y2="28" stroke="rgba(255,255,255,0.5)"  strokeWidth="0.8"/>
      <line x1="40" y1="14" x2="52" y2="28" stroke="rgba(255,255,255,0.5)"  strokeWidth="0.8"/>
      <line x1="32" y1="14" x2="32" y2="28" stroke="rgba(255,255,255,0.2)"  strokeWidth="0.7"/>
      {/* Pavilion facet lines */}
      <line x1="32" y1="28" x2="32" y2="58"  stroke="rgba(255,255,255,0.12)" strokeWidth="0.7"/>
      <line x1="12" y1="28" x2="32" y2="46"  stroke="rgba(255,255,255,0.12)" strokeWidth="0.7"/>
      <line x1="52" y1="28" x2="32" y2="46"  stroke="rgba(255,255,255,0.12)" strokeWidth="0.7"/>
    </svg>
  );
}

function BronzeCircleMedal({ s, symbol }: { s: number; symbol: React.ReactNode }) {
  return (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <defs>
        <radialGradient id="br-bg" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#E8955A"/>
          <stop offset="60%" stopColor="#B5621E"/>
          <stop offset="100%" stopColor="#7A3E0A"/>
        </radialGradient>
        <radialGradient id="br-shine" cx="35%" cy="30%">
          <stop offset="0%" stopColor="rgba(255,200,140,0.55)"/>
          <stop offset="100%" stopColor="transparent"/>
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="29" fill="url(#br-bg)"/>
      <circle cx="32" cy="32" r="29" fill="url(#br-shine)"/>
      <circle cx="32" cy="32" r="29" stroke="#7A3E0A" strokeWidth="1.5" fill="none"/>
      <circle cx="32" cy="32" r="23" stroke="rgba(255,200,140,0.25)" strokeWidth="1" fill="none"/>
      {symbol}
    </svg>
  );
}

function SilverHexMedal({ s, symbol }: { s: number; symbol: React.ReactNode }) {
  return (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <defs>
        <radialGradient id="sv-bg" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#DCDCDC"/>
          <stop offset="60%" stopColor="#A8A8A8"/>
          <stop offset="100%" stopColor="#686868"/>
        </radialGradient>
        <radialGradient id="sv-shine" cx="35%" cy="30%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.55)"/>
          <stop offset="100%" stopColor="transparent"/>
        </radialGradient>
      </defs>
      {/* Hexagon */}
      <polygon points="32,4 56,18 56,46 32,60 8,46 8,18" fill="url(#sv-bg)"/>
      <polygon points="32,4 56,18 56,46 32,60 8,46 8,18" fill="url(#sv-shine)"/>
      <polygon points="32,4 56,18 56,46 32,60 8,46 8,18" stroke="#686868" strokeWidth="1.5" fill="none"/>
      <polygon points="32,12 48,21 48,43 32,52 16,43 16,21" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none"/>
      {symbol}
    </svg>
  );
}

function GoldShieldMedal({ s, symbol }: { s: number; symbol: React.ReactNode }) {
  return (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <defs>
        <linearGradient id="gd-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFE066"/>
          <stop offset="50%" stopColor="#FFB800"/>
          <stop offset="100%" stopColor="#A06800"/>
        </linearGradient>
        <radialGradient id="gd-shine" cx="40%" cy="30%">
          <stop offset="0%" stopColor="rgba(255,255,200,0.6)"/>
          <stop offset="100%" stopColor="transparent"/>
        </radialGradient>
      </defs>
      {/* Shield shape */}
      <path d="M32 4 L56 14 L56 38 Q56 54 32 62 Q8 54 8 38 L8 14 Z" fill="url(#gd-bg)"/>
      <path d="M32 4 L56 14 L56 38 Q56 54 32 62 Q8 54 8 38 L8 14 Z" fill="url(#gd-shine)"/>
      <path d="M32 4 L56 14 L56 38 Q56 54 32 62 Q8 54 8 38 L8 14 Z" stroke="#A06800" strokeWidth="1.5" fill="none"/>
      <path d="M32 11 L50 19 L50 38 Q50 50 32 57 Q14 50 14 38 L14 19 Z" stroke="rgba(255,255,200,0.25)" strokeWidth="1" fill="none"/>
      {symbol}
    </svg>
  );
}

function PlatinumMedal({ s, symbol }: { s: number; symbol: React.ReactNode }) {
  return (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <defs>
        <radialGradient id="pt-bg" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#EEF2FF"/>
          <stop offset="50%" stopColor="#B8C8FF"/>
          <stop offset="100%" stopColor="#6070B0"/>
        </radialGradient>
        <radialGradient id="pt-shine" cx="35%" cy="28%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.7)"/>
          <stop offset="100%" stopColor="transparent"/>
        </radialGradient>
        {/* Star ring */}
      </defs>
      <circle cx="32" cy="32" r="30" fill="url(#pt-bg)"/>
      <circle cx="32" cy="32" r="30" fill="url(#pt-shine)"/>
      <circle cx="32" cy="32" r="30" stroke="#6070B0" strokeWidth="1.5" fill="none"/>
      {/* Outer decorative ring of dots */}
      {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const cx = 32 + 26 * Math.sin(rad);
        const cy = 32 - 26 * Math.cos(rad);
        return <circle key={i} cx={cx} cy={cy} r="1.5" fill="rgba(255,255,255,0.6)"/>;
      })}
      <circle cx="32" cy="32" r="20" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none"/>
      {symbol}
    </svg>
  );
}

// ── Symbol helpers ────────────────────────────────────────────────────────────

const StarSymbol = () => (
  <path d="M32 20l2.9 8.9h9.4l-7.6 5.5 2.9 8.9L32 38l-7.6 5.3 2.9-8.9-7.6-5.5h9.4z"
    fill="rgba(255,255,255,0.9)"/>
);

const BookSymbol = () => (
  <g>
    <rect x="24" y="22" width="8" height="20" rx="1" fill="rgba(255,255,255,0.85)"/>
    <rect x="32" y="22" width="8" height="20" rx="1" fill="rgba(255,255,255,0.65)"/>
    <line x1="32" y1="22" x2="32" y2="42" stroke="rgba(0,0,0,0.15)" strokeWidth="1"/>
  </g>
);

const DoubleCheckSymbol = () => (
  <g>
    <path d="M22 32l5 5 11-11" stroke="rgba(255,255,255,0.9)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M27 32l5 5 11-11" stroke="rgba(255,255,255,0.45)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </g>
);

const CrownSymbol = () => (
  <g>
    <path d="M20 40 L20 28 L26 34 L32 22 L38 34 L44 28 L44 40 Z" fill="rgba(255,255,255,0.9)"/>
    <rect x="20" y="40" width="24" height="3" rx="1" fill="rgba(255,255,255,0.7)"/>
  </g>
);

const FlameSymbol = () => (
  <path d="M32 20c0 0-8 7-8 13a8 8 0 0 0 16 0c0-6-8-13-8-13z M32 27c0 0-4 3.5-4 6a4 4 0 0 0 8 0c0-2.5-4-6-4-6z"
    fill="rgba(255,255,255,0.9)"/>
);

const SevenSymbol = () => (
  <text x="32" y="38" textAnchor="middle" fill="rgba(255,255,255,0.9)"
    fontSize="18" fontWeight="800" fontFamily="system-ui">7</text>
);

const ThirtySymbol = () => (
  <text x="32" y="37" textAnchor="middle" fill="rgba(255,255,255,0.9)"
    fontSize="14" fontWeight="800" fontFamily="system-ui">30</text>
);

const LightningSymbol = () => (
  <path d="M35 20 L26 33 L32 33 L29 44 L38 31 L32 31 Z" fill="rgba(255,255,255,0.9)"/>
);

const CompassSymbol = () => (
  <g>
    <circle cx="32" cy="32" r="8" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" fill="none"/>
    <path d="M32 24 L34 30 L32 32 L30 30 Z" fill="rgba(255,255,255,0.9)"/>
    <path d="M32 40 L30 34 L32 32 L34 34 Z" fill="rgba(255,255,255,0.4)"/>
    <path d="M24 32 L30 30 L32 32 L30 34 Z" fill="rgba(255,255,255,0.4)"/>
    <path d="M40 32 L34 34 L32 32 L34 30 Z" fill="rgba(255,255,255,0.9)"/>
    <circle cx="32" cy="32" r="2" fill="rgba(255,255,255,0.9)"/>
  </g>
);

const GemClusterSymbol = () => (
  <g>
    <path d="M32 22 L37 28 L32 34 L27 28 Z" fill="rgba(255,255,255,0.95)"/>
    <path d="M24 30 L28 35 L24 40 L20 35 Z" fill="rgba(180,220,255,0.8)"/>
    <path d="M40 30 L44 35 L40 40 L36 35 Z" fill="rgba(255,200,200,0.8)"/>
  </g>
);

// ── Medal registry ────────────────────────────────────────────────────────────

const MEDAL_MAP: Record<string, (s: number) => React.ReactElement> = {
  'radiant-starter': (s) => <RadiantStarterMedal s={s} />,
  'first-lesson':    (s) => <BronzeCircleMedal s={s} symbol={<StarSymbol />} />,
  'five-lessons':    (s) => <BronzeCircleMedal s={s} symbol={<BookSymbol />} />,
  'ten-lessons':     (s) => <SilverHexMedal   s={s} symbol={<DoubleCheckSymbol />} />,
  'all-lessons':     (s) => <GoldShieldMedal  s={s} symbol={<CrownSymbol />} />,
  'streak-3':        (s) => <BronzeCircleMedal s={s} symbol={<FlameSymbol />} />,
  'streak-7':        (s) => <SilverHexMedal   s={s} symbol={<SevenSymbol />} />,
  'streak-30':       (s) => <PlatinumMedal    s={s} symbol={<ThirtySymbol />} />,
  'xp-300':          (s) => <BronzeCircleMedal s={s} symbol={<LightningSymbol />} />,
  'xp-1000':         (s) => <GoldShieldMedal  s={s} symbol={<LightningSymbol />} />,
  'explorer':        (s) => <BronzeCircleMedal s={s} symbol={<CompassSymbol />} />,
  'polymath':        (s) => <GoldShieldMedal  s={s} symbol={<GemClusterSymbol />} />,
};

const TIER_GLOW: Record<AchievementTier, string> = {
  bronze:   'rgba(181,98,30,0.45)',
  silver:   'rgba(160,160,160,0.45)',
  gold:     'rgba(255,184,0,0.5)',
  platinum: 'rgba(96,112,176,0.5)',
  special:  'rgba(229,62,62,0.5)',
};

// ── Export ─────────────────────────────────────────────────────────────────────

export function MedalIcon({ achievementId, size = 48, earned = true }: MedalProps) {
  const render = MEDAL_MAP[achievementId];
  if (!render) return null;

  return (
    <div style={{
      filter: earned ? 'none' : 'grayscale(1) brightness(0.5)',
      transition: 'filter 0.3s',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {render(size)}
    </div>
  );
}

export function MedalGlow({ achievementId, tier, size = 48 }: { achievementId: string; tier: AchievementTier; size?: number }) {
  return (
    <div style={{ position: 'relative', display: 'inline-flex' }}>
      {/* Glow behind medal */}
      <div style={{
        position: 'absolute', inset: '-12px',
        borderRadius: '50%',
        background: `radial-gradient(ellipse, ${TIER_GLOW[tier]} 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />
      <MedalIcon achievementId={achievementId} size={size} earned />
    </div>
  );
}
