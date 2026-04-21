import { useStore } from '../store/useStore';
import { RadiantLogo } from '../components/RadiantLogo';

const FEATURES = [
  { icon: '⚡', title: '2 minutes a day', desc: 'Short, focused lessons that fit into any schedule — no excuses.' },
  { icon: '🎯', title: 'Visual learning', desc: 'Every concept explained through interactive, animated SVG diagrams.' },
  { icon: '🔥', title: 'Streak system', desc: 'Daily habits compound into real technical depth over time.' },
];

const TOPIC_PILLS = ['HTTP', 'Neural Networks', 'Binary Search', 'Docker', 'REST APIs', 'TLS/HTTPS', 'Big O', 'Transformers', 'DOM', 'CSS Cascade'];

export function Landing() {
  const { setScreen, toggleTheme, theme } = useStore();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
      {/* Grid background */}
      <div className="grid-bg" style={{
        position: 'absolute', inset: 0,
        maskImage: 'radial-gradient(ellipse 90% 60% at 50% 0%, black 30%, transparent 100%)',
        opacity: 0.6,
      }} />
      {/* Glow blob */}
      <div style={{
        position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)',
        width: '500px', height: '360px',
        background: 'radial-gradient(ellipse, var(--accent-glow) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '480px', margin: '0 auto', padding: '0 22px' }}>
        {/* Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 0 0' }}>
          <RadiantLogo size={28} textSize={17} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
              {theme === 'dark'
                ? <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1v1M8 14v1M1 8H2M14 8h1M3.1 3.1l.7.7M12.2 12.2l.7.7M3.1 12.9l.7-.7M12.2 3.8l.7-.7M8 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                : <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13.5 9A5.5 5.5 0 0 1 7 2.5c0-.5.06-1 .18-1.47A6.5 6.5 0 1 0 14.97 9.82 5.5 5.5 0 0 1 13.5 9z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              }
            </button>
            <button className="btn-ghost" style={{ padding: '8px 16px', fontSize: '13px' }} onClick={() => setScreen('auth')}>
              Sign in
            </button>
          </div>
        </nav>

        {/* Hero */}
        <div style={{ paddingTop: '68px', paddingBottom: '44px', textAlign: 'center' }}>
          {/* Pill */}
          <div className="anim-slide-up" style={{
            display: 'inline-flex', alignItems: 'center', gap: '7px',
            background: 'var(--accent-dim)', border: '1px solid rgba(229,62,62,0.2)',
            borderRadius: '20px', padding: '5px 14px', marginBottom: '26px',
          }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--accent)', display: 'block', animation: 'pulse-dot 2s ease-in-out infinite' }} />
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>
              LEARN TECH. 2 MINUTES A DAY.
            </span>
          </div>

          <h1 className="anim-slide-up delay-1" style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(36px, 10vw, 52px)',
            fontWeight: '800',
            lineHeight: '1.07',
            letterSpacing: '-2px',
            marginBottom: '18px',
          }}>
            Technical knowledge,<br />
            <span className="text-gradient">beautifully</span> explained.
          </h1>

          <p className="anim-slide-up delay-2" style={{
            fontSize: '15px', lineHeight: '1.7',
            color: 'var(--text-secondary)',
            maxWidth: '340px', margin: '0 auto 32px',
          }}>
            Radiant turns complex technical concepts into short, visual lessons you'll actually retain. Like Duolingo — but for the tech behind everything.
          </p>

          <div className="anim-slide-up delay-3" style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button className="btn-primary" onClick={() => setScreen('auth')} style={{ padding: '14px 28px', fontSize: '15px' }}>
              Start learning free
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M7 3l4 4-4 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <p className="anim-slide-up delay-4" style={{ marginTop: '14px', fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            Free account required · No credit card
          </p>
        </div>

        {/* Scrolling topic pills */}
        <div className="anim-slide-up delay-3" style={{
          display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center',
          marginBottom: '56px',
        }}>
          {TOPIC_PILLS.map(t => (
            <div key={t} style={{
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: '20px', padding: '5px 13px',
              fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)',
            }}>
              {t}
            </div>
          ))}
        </div>

        {/* Features */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '64px' }}>
          {FEATURES.map((f, i) => (
            <div key={f.title} className={`card anim-slide-up delay-${i + 3}`} style={{
              padding: '18px', display: 'flex', alignItems: 'flex-start', gap: '14px',
            }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
                background: 'var(--accent-dim)', border: '1px solid rgba(229,62,62,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
              }}>
                {f.icon}
              </div>
              <div>
                <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '3px', fontFamily: 'var(--font-display)' }}>
                  {f.title}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  {f.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: 'center', paddingBottom: '60px' }}>
          <button className="btn-primary" onClick={() => setScreen('auth')} style={{ width: '100%', padding: '15px', fontSize: '15px' }}>
            Create free account →
          </button>
        </div>
      </div>
    </div>
  );
}
