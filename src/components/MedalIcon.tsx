import type { MedalTier } from '../data/content';

// ── Per-tier glow colors ──────────────────────────────────────────────────────

export const TIER_COLOR: Record<MedalTier, string> = {
  iron:     '#9CA3AF',
  bronze:   '#CD7F32',
  silver:   '#94A3B8',
  gold:     '#EAB308',
  platinum: '#818CF8',
  diamond:  '#67E8F9',
  obsidian: '#A78BFA',
  radiant:  '#E53E3E',
};

export const TIER_LABEL: Record<MedalTier, string> = {
  iron:     'IRON',
  bronze:   'BRONZE',
  silver:   'SILVER',
  gold:     'GOLD',
  platinum: 'PLATINUM',
  diamond:  'DIAMOND',
  obsidian: 'OBSIDIAN',
  radiant:  'RADIANT',
};

export const ANIMATED_TIERS = new Set<MedalTier>(['diamond', 'obsidian', 'radiant']);

// ── Medal shapes by tier ──────────────────────────────────────────────────────

function IronMedal({ s, symbol }: { s: number; symbol: React.ReactNode }) {
  return (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <defs>
        <radialGradient id="ir-bg" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#C4C4C4"/>
          <stop offset="60%" stopColor="#8B8B8B"/>
          <stop offset="100%" stopColor="#555555"/>
        </radialGradient>
        <radialGradient id="ir-shine" cx="35%" cy="30%">
          <stop offset="0%" stopColor="rgba(220,220,220,0.4)"/>
          <stop offset="100%" stopColor="transparent"/>
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="29" fill="url(#ir-bg)"/>
      <circle cx="32" cy="32" r="29" fill="url(#ir-shine)"/>
      <circle cx="32" cy="32" r="29" stroke="#555555" strokeWidth="1.5" fill="none"/>
      <circle cx="32" cy="32" r="23" stroke="rgba(200,200,200,0.2)" strokeWidth="1" fill="none"/>
      {symbol}
    </svg>
  );
}

function BronzeMedal({ s, symbol }: { s: number; symbol: React.ReactNode }) {
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

function SilverMedal({ s, symbol }: { s: number; symbol: React.ReactNode }) {
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
      <polygon points="32,4 56,18 56,46 32,60 8,46 8,18" fill="url(#sv-bg)"/>
      <polygon points="32,4 56,18 56,46 32,60 8,46 8,18" fill="url(#sv-shine)"/>
      <polygon points="32,4 56,18 56,46 32,60 8,46 8,18" stroke="#686868" strokeWidth="1.5" fill="none"/>
      <polygon points="32,12 48,21 48,43 32,52 16,43 16,21" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none"/>
      {symbol}
    </svg>
  );
}

function GoldMedal({ s, symbol }: { s: number; symbol: React.ReactNode }) {
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
      </defs>
      <circle cx="32" cy="32" r="30" fill="url(#pt-bg)"/>
      <circle cx="32" cy="32" r="30" fill="url(#pt-shine)"/>
      <circle cx="32" cy="32" r="30" stroke="#6070B0" strokeWidth="1.5" fill="none"/>
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

function DiamondMedal({ s, symbol, animated }: { s: number; symbol: React.ReactNode; animated?: boolean }) {
  return (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <defs>
        <linearGradient id="dm-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#A8EDFC"/>
          <stop offset="50%" stopColor="#38BDF8"/>
          <stop offset="100%" stopColor="#0369A1"/>
        </linearGradient>
        <radialGradient id="dm-shine" cx="30%" cy="25%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.8)"/>
          <stop offset="100%" stopColor="transparent"/>
        </radialGradient>
      </defs>

      {/* Animated outer pulse ring */}
      {animated && (
        <circle cx="32" cy="32" r="30" fill="none" stroke="#67E8F9" strokeWidth="1.5">
          <animate attributeName="stroke-opacity" values="0;0.55;0" dur="2.4s" repeatCount="indefinite"/>
          <animate attributeName="r" values="29;33;29" dur="2.4s" repeatCount="indefinite"/>
        </circle>
      )}

      {/* 4-point diamond shape */}
      <path d="M32 4 L58 32 L32 60 L6 32 Z" fill="url(#dm-bg)"/>
      <path d="M32 4 L58 32 L32 60 L6 32 Z" fill="url(#dm-shine)"/>
      <path d="M32 4 L58 32 L32 60 L6 32 Z" stroke="#0369A1" strokeWidth="1.5" fill="none"/>

      {/* Gem facet lines */}
      <line x1="32" y1="4"  x2="32" y2="60" stroke="rgba(255,255,255,0.18)" strokeWidth="1"/>
      <line x1="6"  y1="32" x2="58" y2="32" stroke="rgba(255,255,255,0.18)" strokeWidth="1"/>
      <path d="M32 4 L58 32 L32 38 Z" fill="rgba(255,255,255,0.12)"/>
      <path d="M32 4 L6 32 L32 38 Z"  fill="rgba(0,0,0,0.08)"/>

      {/* Inner diamond */}
      <path d="M32 18 L46 32 L32 46 L18 32 Z" stroke="rgba(255,255,255,0.3)" strokeWidth="1" fill="none"/>

      {/* Rotating shimmer sweep */}
      {animated && (
        <g>
          <animateTransform attributeName="transform" type="rotate" from="0 32 32" to="360 32 32" dur="6s" repeatCount="indefinite"/>
          <ellipse cx="32" cy="22" rx="10" ry="4" fill="rgba(255,255,255,0.18)"/>
        </g>
      )}

      {/* Tip sparkles */}
      {animated && (
        <>
          <circle cx="32" cy="4" r="2" fill="#A8EDFC">
            <animate attributeName="opacity" values="0;1;0" dur="2s" begin="0s" repeatCount="indefinite"/>
            <animate attributeName="r" values="1;3;1" dur="2s" begin="0s" repeatCount="indefinite"/>
          </circle>
          <circle cx="58" cy="32" r="1.8" fill="#67E8F9">
            <animate attributeName="opacity" values="0;1;0" dur="2s" begin="0.5s" repeatCount="indefinite"/>
            <animate attributeName="r" values="1;2.5;1" dur="2s" begin="0.5s" repeatCount="indefinite"/>
          </circle>
          <circle cx="32" cy="60" r="2" fill="#A8EDFC">
            <animate attributeName="opacity" values="0;1;0" dur="2s" begin="1s" repeatCount="indefinite"/>
            <animate attributeName="r" values="1;3;1" dur="2s" begin="1s" repeatCount="indefinite"/>
          </circle>
          <circle cx="6" cy="32" r="1.8" fill="#67E8F9">
            <animate attributeName="opacity" values="0;1;0" dur="2s" begin="1.5s" repeatCount="indefinite"/>
            <animate attributeName="r" values="1;2.5;1" dur="2s" begin="1.5s" repeatCount="indefinite"/>
          </circle>
        </>
      )}

      {symbol}
    </svg>
  );
}

function ObsidianMedal({ s, symbol, animated }: { s: number; symbol: React.ReactNode; animated?: boolean }) {
  return (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <defs>
        <radialGradient id="ob-bg" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#4C1D95"/>
          <stop offset="50%" stopColor="#1E1B4B"/>
          <stop offset="100%" stopColor="#0A0A1A"/>
        </radialGradient>
        <radialGradient id="ob-shine" cx="35%" cy="28%">
          <stop offset="0%" stopColor="rgba(167,139,250,0.55)"/>
          <stop offset="100%" stopColor="transparent"/>
        </radialGradient>
      </defs>

      {/* Outer pulsing glow ring */}
      {animated && (
        <circle cx="32" cy="32" r="31" fill="none" stroke="#A78BFA" strokeWidth="1.5">
          <animate attributeName="stroke-opacity" values="0.1;0.5;0.1" dur="2.8s" repeatCount="indefinite"/>
          <animate attributeName="r" values="30;34;30" dur="2.8s" repeatCount="indefinite"/>
        </circle>
      )}

      {/* 8-pointed star shape */}
      <path d="M32 3 L36.5 21 L52 10 L41 26 L59 31.5 L41 37 L52 54 L36.5 43 L32 61 L27.5 43 L12 54 L23 37 L5 31.5 L23 26 L12 10 L27.5 21 Z"
        fill="url(#ob-bg)"/>
      <path d="M32 3 L36.5 21 L52 10 L41 26 L59 31.5 L41 37 L52 54 L36.5 43 L32 61 L27.5 43 L12 54 L23 37 L5 31.5 L23 26 L12 10 L27.5 21 Z"
        fill="url(#ob-shine)"/>
      <path d="M32 3 L36.5 21 L52 10 L41 26 L59 31.5 L41 37 L52 54 L36.5 43 L32 61 L27.5 43 L12 54 L23 37 L5 31.5 L23 26 L12 10 L27.5 21 Z"
        stroke="#7C3AED" strokeWidth="1.5" fill="none"/>

      {/* Rotating dashed energy ring */}
      {animated && (
        <g>
          <animateTransform attributeName="transform" type="rotate" from="0 32 32" to="360 32 32" dur="9s" repeatCount="indefinite"/>
          <circle cx="32" cy="32" r="19" fill="none" stroke="#A78BFA" strokeWidth="1" strokeDasharray="5 7">
            <animate attributeName="stroke-opacity" values="0.2;0.7;0.2" dur="2.8s" repeatCount="indefinite"/>
          </circle>
        </g>
      )}

      <circle cx="32" cy="32" r="14" stroke="rgba(167,139,250,0.3)" strokeWidth="1" fill="none"/>

      {/* Floating particles at star tips */}
      {animated && (
        <>
          {/* Top */}
          <circle cx="32" cy="4" r="1.5" fill="#C4B5FD">
            <animate attributeName="opacity" values="0;0.9;0" dur="3s" begin="0s" repeatCount="indefinite"/>
          </circle>
          {/* Top-right */}
          <circle cx="52" cy="11" r="1.2" fill="#A78BFA">
            <animate attributeName="opacity" values="0;0.9;0" dur="3s" begin="0.75s" repeatCount="indefinite"/>
          </circle>
          {/* Right */}
          <circle cx="59" cy="32" r="1.5" fill="#C4B5FD">
            <animate attributeName="opacity" values="0;0.9;0" dur="3s" begin="1.5s" repeatCount="indefinite"/>
          </circle>
          {/* Bottom */}
          <circle cx="32" cy="61" r="1.5" fill="#A78BFA">
            <animate attributeName="opacity" values="0;0.9;0" dur="3s" begin="2.25s" repeatCount="indefinite"/>
          </circle>
          {/* Left */}
          <circle cx="5" cy="32" r="1.2" fill="#C4B5FD">
            <animate attributeName="opacity" values="0;0.9;0" dur="3s" begin="3s" repeatCount="indefinite"/>
          </circle>
        </>
      )}

      {symbol}
    </svg>
  );
}

function RadiantMedal({ s, symbol, animated }: { s: number; symbol: React.ReactNode; animated?: boolean }) {
  return (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <defs>
        <linearGradient id="rd-c" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF5555"/>
          <stop offset="100%" stopColor="#991111"/>
        </linearGradient>
        <linearGradient id="rd-p" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E03030"/>
          <stop offset="100%" stopColor="#5A0A0A"/>
        </linearGradient>
        <radialGradient id="rd-glow" cx="50%" cy="30%">
          <stop offset="0%" stopColor="rgba(255,120,120,0.5)"/>
          <stop offset="100%" stopColor="transparent"/>
        </radialGradient>
      </defs>

      {/* Outermost pulsing aura ring */}
      {animated && (
        <>
          <circle cx="32" cy="32" r="32" fill="none" stroke="#E53E3E" strokeWidth="1.5">
            <animate attributeName="stroke-opacity" values="0;0.5;0" dur="1.8s" repeatCount="indefinite"/>
            <animate attributeName="r" values="30;36;30" dur="1.8s" repeatCount="indefinite"/>
          </circle>
          {/* Rotating outer particle ring */}
          <g>
            <animateTransform attributeName="transform" type="rotate" from="0 32 32" to="360 32 32" dur="10s" repeatCount="indefinite"/>
            {[0, 60, 120, 180, 240, 300].map((deg, i) => {
              const rad = (deg * Math.PI) / 180;
              const cx = 32 + 36 * Math.sin(rad);
              const cy = 32 - 36 * Math.cos(rad);
              return <circle key={i} cx={cx} cy={cy} r="1.4" fill="#FF8888" opacity="0.6"/>;
            })}
          </g>
        </>
      )}

      <circle cx="32" cy="32" r="30" fill="url(#rd-glow)"/>

      {/* Sparkle rays — animated when active */}
      {animated ? (
        <>
          <line x1="32" y1="2" x2="32" y2="9" stroke="#FF7777" strokeWidth="2.5" strokeLinecap="round">
            <animate attributeName="y1" values="3;0;3" dur="1.6s" repeatCount="indefinite"/>
            <animate attributeName="stroke-opacity" values="0.7;1;0.7" dur="1.6s" repeatCount="indefinite"/>
          </line>
          <line x1="58" y1="12" x2="53" y2="17" stroke="#FF6666" strokeWidth="2" strokeLinecap="round">
            <animate attributeName="x1" values="57;60;57" dur="1.6s" begin="0.27s" repeatCount="indefinite"/>
            <animate attributeName="y1" values="13;10;13" dur="1.6s" begin="0.27s" repeatCount="indefinite"/>
            <animate attributeName="stroke-opacity" values="0.6;1;0.6" dur="1.6s" begin="0.27s" repeatCount="indefinite"/>
          </line>
          <line x1="6" y1="12" x2="11" y2="17" stroke="#FF6666" strokeWidth="2" strokeLinecap="round">
            <animate attributeName="x1" values="7;4;7" dur="1.6s" begin="0.53s" repeatCount="indefinite"/>
            <animate attributeName="y1" values="13;10;13" dur="1.6s" begin="0.53s" repeatCount="indefinite"/>
            <animate attributeName="stroke-opacity" values="0.6;1;0.6" dur="1.6s" begin="0.53s" repeatCount="indefinite"/>
          </line>
          <line x1="62" y1="32" x2="55" y2="32" stroke="#FF6666" strokeWidth="2" strokeLinecap="round">
            <animate attributeName="x1" values="61;64;61" dur="1.6s" begin="0.8s" repeatCount="indefinite"/>
            <animate attributeName="stroke-opacity" values="0.6;1;0.6" dur="1.6s" begin="0.8s" repeatCount="indefinite"/>
          </line>
          <line x1="2" y1="32" x2="9" y2="32" stroke="#FF6666" strokeWidth="2" strokeLinecap="round">
            <animate attributeName="x1" values="3;0;3" dur="1.6s" begin="1.07s" repeatCount="indefinite"/>
            <animate attributeName="stroke-opacity" values="0.6;1;0.6" dur="1.6s" begin="1.07s" repeatCount="indefinite"/>
          </line>
        </>
      ) : (
        <>
          <line x1="32" y1="2"  x2="32" y2="9"  stroke="#FF7777" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="58" y1="12" x2="53" y2="17" stroke="#FF6666" strokeWidth="2"   strokeLinecap="round"/>
          <line x1="6"  y1="12" x2="11" y2="17" stroke="#FF6666" strokeWidth="2"   strokeLinecap="round"/>
          <line x1="62" y1="32" x2="55" y2="32" stroke="#FF6666" strokeWidth="2"   strokeLinecap="round"/>
          <line x1="2"  y1="32" x2="9"  y2="32" stroke="#FF6666" strokeWidth="2"   strokeLinecap="round"/>
        </>
      )}

      {/* Crown facet (top) */}
      <path d="M20 16 L44 16 L52 28 L12 28 Z" fill="url(#rd-c)"/>
      <path d="M24 16 L40 16 L44 22 L20 22 Z" fill="rgba(255,255,255,0.18)"/>
      {/* Pavilion (bottom) */}
      <path d="M12 28 L52 28 L32 56 Z" fill="url(#rd-p)"/>
      {/* Facet lines */}
      <line x1="24" y1="16" x2="12" y2="28" stroke="rgba(255,255,255,0.4)"  strokeWidth="0.8"/>
      <line x1="40" y1="16" x2="52" y2="28" stroke="rgba(255,255,255,0.4)"  strokeWidth="0.8"/>
      <line x1="32" y1="16" x2="32" y2="28" stroke="rgba(255,255,255,0.2)"  strokeWidth="0.7"/>
      <line x1="32" y1="28" x2="32" y2="56"  stroke="rgba(255,255,255,0.1)" strokeWidth="0.7"/>
      <line x1="12" y1="28" x2="32" y2="46"  stroke="rgba(255,255,255,0.1)" strokeWidth="0.7"/>
      <line x1="52" y1="28" x2="32" y2="46"  stroke="rgba(255,255,255,0.1)" strokeWidth="0.7"/>

      {/* Core gem pulse */}
      {animated && (
        <path d="M20 16 L44 16 L52 28 L12 28 Z" fill="rgba(255,100,100,0)">
          <animate attributeName="fill-opacity" values="0;0.25;0" dur="1.8s" repeatCount="indefinite"/>
        </path>
      )}

      {symbol}
    </svg>
  );
}

// ── Symbol library ────────────────────────────────────────────────────────────

const Symbols: Record<string, React.ReactNode> = {
  star: <path d="M32 20l2.9 8.9h9.4l-7.6 5.5 2.9 8.9L32 38l-7.6 5.3 2.9-8.9-7.6-5.5h9.4z" fill="rgba(255,255,255,0.9)"/>,
  bolt: <path d="M35 20 L26 33 L32 33 L29 44 L38 31 L32 31 Z" fill="rgba(255,255,255,0.9)"/>,
  flame: <path d="M32 20c0 0-8 7-8 13a8 8 0 0 0 16 0c0-6-8-13-8-13z M32 28c0 0-4 3-4 6a4 4 0 0 0 8 0c0-3-4-6-4-6z" fill="rgba(255,255,255,0.9)"/>,
  crown: (
    <g>
      <path d="M20 40 L20 28 L26 34 L32 22 L38 34 L44 28 L44 40 Z" fill="rgba(255,255,255,0.9)"/>
      <rect x="20" y="40" width="24" height="3" rx="1" fill="rgba(255,255,255,0.7)"/>
    </g>
  ),
  compass: (
    <g>
      <circle cx="32" cy="32" r="9" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" fill="none"/>
      <path d="M32 23 L34 29 L32 31 L30 29 Z" fill="rgba(255,255,255,0.9)"/>
      <path d="M32 41 L30 35 L32 33 L34 35 Z" fill="rgba(255,255,255,0.4)"/>
      <path d="M23 32 L29 30 L31 32 L29 34 Z" fill="rgba(255,255,255,0.4)"/>
      <path d="M41 32 L35 34 L33 32 L35 30 Z" fill="rgba(255,255,255,0.9)"/>
      <circle cx="32" cy="32" r="2" fill="rgba(255,255,255,0.9)"/>
    </g>
  ),
  gem: (
    <g>
      <path d="M32 22 L37 28 L32 34 L27 28 Z" fill="rgba(255,255,255,0.95)"/>
      <path d="M24 30 L28 35 L24 40 L20 35 Z" fill="rgba(180,220,255,0.8)"/>
      <path d="M40 30 L44 35 L40 40 L36 35 Z" fill="rgba(255,200,200,0.8)"/>
    </g>
  ),
  target: (
    <g>
      <circle cx="32" cy="32" r="10" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" fill="none"/>
      <circle cx="32" cy="32" r="6"  stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" fill="none"/>
      <circle cx="32" cy="32" r="2"  fill="rgba(255,255,255,0.9)"/>
    </g>
  ),
  book: (
    <g>
      <rect x="24" y="22" width="8" height="20" rx="1" fill="rgba(255,255,255,0.85)"/>
      <rect x="32" y="22" width="8" height="20" rx="1" fill="rgba(255,255,255,0.65)"/>
      <line x1="32" y1="22" x2="32" y2="42" stroke="rgba(0,0,0,0.15)" strokeWidth="1"/>
    </g>
  ),
  check: (
    <g>
      <path d="M22 32l5 5 11-11" stroke="rgba(255,255,255,0.9)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M27 32l5 5 11-11" stroke="rgba(255,255,255,0.45)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </g>
  ),
  trophy: (
    <g>
      <path d="M24 20 L40 20 L40 30 Q40 38 32 40 Q24 38 24 30 Z" fill="rgba(255,255,255,0.9)"/>
      <path d="M24 22 L20 22 L20 28 Q20 33 24 34" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M40 22 L44 22 L44 28 Q44 33 40 34" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M28 40 L28 44 M36 40 L36 44" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="24" y="44" width="16" height="2.5" rx="1" fill="rgba(255,255,255,0.7)"/>
    </g>
  ),
  chart: (
    <g>
      <rect x="22" y="34" width="5" height="10" rx="1" fill="rgba(255,255,255,0.6)"/>
      <rect x="29" y="28" width="5" height="16" rx="1" fill="rgba(255,255,255,0.8)"/>
      <rect x="36" y="22" width="5" height="22" rx="1" fill="rgba(255,255,255,0.95)"/>
    </g>
  ),
  diamond: (
    <path d="M32 20 L42 32 L32 44 L22 32 Z M32 20 L42 32 L32 29 Z M32 20 L22 32 L32 29 Z"
      fill="rgba(255,255,255,0.9)" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5"/>
  ),
  shield: (
    <path d="M32 21 L42 25 L42 33 Q42 40 32 44 Q22 40 22 33 L22 25 Z"
      fill="rgba(255,255,255,0.9)" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5"/>
  ),
  web: (
    <g>
      <circle cx="32" cy="32" r="10" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" fill="none"/>
      <ellipse cx="32" cy="32" rx="5" ry="10" stroke="rgba(255,255,255,0.7)" strokeWidth="1" fill="none"/>
      <line x1="22" y1="32" x2="42" y2="32" stroke="rgba(255,255,255,0.7)" strokeWidth="1"/>
      <line x1="32" y1="22" x2="32" y2="42" stroke="rgba(255,255,255,0.7)" strokeWidth="1"/>
      <path d="M23 27 Q32 25 41 27" stroke="rgba(255,255,255,0.5)" strokeWidth="1" fill="none"/>
      <path d="M23 37 Q32 39 41 37" stroke="rgba(255,255,255,0.5)" strokeWidth="1" fill="none"/>
    </g>
  ),
  ai: (
    <g>
      <circle cx="32" cy="32" r="6" fill="rgba(255,255,255,0.9)"/>
      <circle cx="22" cy="26" r="3" fill="rgba(255,255,255,0.7)"/>
      <circle cx="42" cy="26" r="3" fill="rgba(255,255,255,0.7)"/>
      <circle cx="22" cy="38" r="3" fill="rgba(255,255,255,0.7)"/>
      <circle cx="42" cy="38" r="3" fill="rgba(255,255,255,0.7)"/>
      <line x1="25" y1="28" x2="29" y2="30" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2"/>
      <line x1="39" y1="28" x2="35" y2="30" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2"/>
      <line x1="25" y1="36" x2="29" y2="34" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2"/>
      <line x1="39" y1="36" x2="35" y2="34" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2"/>
    </g>
  ),
  code: (
    <g>
      <path d="M26 24 L20 32 L26 40" stroke="rgba(255,255,255,0.9)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M38 24 L44 32 L38 40" stroke="rgba(255,255,255,0.9)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <line x1="30" y1="22" x2="34" y2="42" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round"/>
    </g>
  ),
  lock: (
    <g>
      <rect x="24" y="30" width="16" height="13" rx="2" fill="rgba(255,255,255,0.9)"/>
      <path d="M27 30 L27 25 Q27 20 32 20 Q37 20 37 25 L37 30" stroke="rgba(255,255,255,0.9)" strokeWidth="2" fill="none"/>
      <circle cx="32" cy="37" r="2.5" fill="rgba(0,0,0,0.25)"/>
    </g>
  ),
  cloud: (
    <g>
      <path d="M40 35 Q44 35 44 30 Q44 25 39 25 Q38 20 32 20 Q26 20 25 25 Q20 25 20 30 Q20 35 24 35 Z"
        fill="rgba(255,255,255,0.9)"/>
      <line x1="28" y1="38" x2="26" y2="43" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="32" y1="38" x2="32" y2="44" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="36" y1="38" x2="38" y2="43" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round"/>
    </g>
  ),
  phone: (
    <g>
      <rect x="25" y="19" width="14" height="26" rx="3" fill="rgba(255,255,255,0.9)"/>
      <rect x="27" y="21" width="10" height="18" rx="1" fill="rgba(0,0,0,0.15)"/>
      <circle cx="32" cy="42" r="1.5" fill="rgba(0,0,0,0.25)"/>
    </g>
  ),
  radiant: null, // handled separately — the whole medal is the symbol
};

// ── Shape map by tier ─────────────────────────────────────────────────────────

const SHAPE_MAP: Record<MedalTier, (s: number, sym: React.ReactNode, animated: boolean) => React.ReactElement> = {
  iron:     (s, sym)         => <IronMedal     s={s} symbol={sym} />,
  bronze:   (s, sym)         => <BronzeMedal   s={s} symbol={sym} />,
  silver:   (s, sym)         => <SilverMedal   s={s} symbol={sym} />,
  gold:     (s, sym)         => <GoldMedal     s={s} symbol={sym} />,
  platinum: (s, sym)         => <PlatinumMedal s={s} symbol={sym} />,
  diamond:  (s, sym, anim)   => <DiamondMedal  s={s} symbol={sym} animated={anim} />,
  obsidian: (s, sym, anim)   => <ObsidianMedal s={s} symbol={sym} animated={anim} />,
  radiant:  (s, sym, anim)   => <RadiantMedal  s={s} symbol={sym} animated={anim} />,
};

// ── Exports ───────────────────────────────────────────────────────────────────

interface MedalProps {
  tier: MedalTier;
  icon: string;
  size?: number;
  earned?: boolean;
  animated?: boolean;
}

export function MedalIcon({ tier, icon, size = 48, earned = true, animated = false }: MedalProps) {
  const isAnimated = animated && ANIMATED_TIERS.has(tier);

  // Special case: radiant-one uses the Radiant gem shape regardless of tier
  if (icon === 'radiant') {
    return (
      <div style={{ filter: earned ? 'none' : 'grayscale(1) brightness(0.4)', display: 'inline-flex' }}>
        <RadiantMedal s={size} symbol={null} animated={isAnimated} />
      </div>
    );
  }

  const symbol = Symbols[icon] ?? Symbols['star'];
  const renderShape = SHAPE_MAP[tier];

  return (
    <div style={{ filter: earned ? 'none' : 'grayscale(1) brightness(0.4)', display: 'inline-flex' }}>
      {renderShape(size, symbol, isAnimated)}
    </div>
  );
}

const TIER_GLOW: Record<MedalTier, string> = {
  iron:     'rgba(156,163,175,0.4)',
  bronze:   'rgba(181,98,30,0.45)',
  silver:   'rgba(160,160,160,0.45)',
  gold:     'rgba(255,184,0,0.5)',
  platinum: 'rgba(96,112,176,0.5)',
  diamond:  'rgba(56,189,248,0.5)',
  obsidian: 'rgba(124,58,237,0.5)',
  radiant:  'rgba(229,62,62,0.55)',
};

export function MedalGlow({ tier, icon, size = 48, animated = false }: { tier: MedalTier; icon: string; size?: number; animated?: boolean }) {
  return (
    <div style={{ position: 'relative', display: 'inline-flex', flexShrink: 0 }}>
      <div style={{
        position: 'absolute', inset: '-14px',
        borderRadius: '50%',
        background: `radial-gradient(ellipse, ${TIER_GLOW[tier]} 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />
      <MedalIcon tier={tier} icon={icon} size={size} earned animated={animated} />
    </div>
  );
}