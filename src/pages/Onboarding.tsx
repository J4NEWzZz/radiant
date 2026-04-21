import { LEARNING_AREAS } from '../data/content';
import { useStore } from '../store/useStore';
import { RadiantLogo } from '../components/RadiantLogo';

export function Onboarding() {
  const { selectedAreas, toggleArea, finishOnboarding, user } = useStore();
  const canContinue = selectedAreas.length >= 1;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
      {/* Subtle glow */}
      <div style={{
        position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)',
        width: '400px', height: '260px',
        background: 'radial-gradient(ellipse, var(--accent-glow) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '32px 22px 130px', position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ marginBottom: '40px' }}>
          <RadiantLogo size={26} textSize={16} />
        </div>

        {/* Header */}
        <div className="anim-slide-up" style={{ marginBottom: '32px' }}>
          {user && (
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
              {user.email}
            </div>
          )}
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: '800',
            letterSpacing: '-0.5px', lineHeight: '1.15', marginBottom: '8px',
          }}>
            What do you want to learn?
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
            Pick one or more areas. Each contains visual, step-by-step lessons.
          </p>
        </div>

        {/* Area grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '24px' }}>
          {LEARNING_AREAS.map((area, i) => {
            const isSelected = selectedAreas.includes(area.id);
            return (
              <button
                key={area.id}
                onClick={() => toggleArea(area.id)}
                className={`anim-slide-up delay-${i + 1}`}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  display: 'flex', flexDirection: 'column',
                  padding: '16px 14px',
                  background: isSelected ? 'var(--accent-dim)' : 'var(--card)',
                  border: `1.5px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
                  borderRadius: '12px',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 0 16px var(--accent-glow)' : 'none',
                  transform: isSelected ? 'translateY(-1px)' : 'none',
                  position: 'relative',
                  textAlign: 'left',
                }}
              >
                {/* Checkmark */}
                {isSelected && (
                  <div style={{
                    position: 'absolute', top: '9px', right: '9px',
                    width: '16px', height: '16px', borderRadius: '50%',
                    background: 'var(--accent)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                      <path d="M1 3.5L3 5.5L8 1" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}

                {/* Icon */}
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px', marginBottom: '10px',
                  background: isSelected ? 'rgba(229,62,62,0.15)' : 'var(--surface)',
                  border: `1px solid ${isSelected ? 'rgba(229,62,62,0.3)' : 'var(--border)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '20px', transition: 'all 0.2s',
                }}>
                  {area.icon}
                </div>

                <div style={{
                  fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '13px',
                  color: 'var(--text)', marginBottom: '3px', lineHeight: '1.3',
                }}>
                  {area.name}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  {area.description}
                </div>
              </button>
            );
          })}
        </div>

        <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textAlign: 'center' }}>
          {selectedAreas.length === 0
            ? 'Select at least one area to continue'
            : `${selectedAreas.length} area${selectedAreas.length > 1 ? 's' : ''} selected`}
        </div>
      </div>

      {/* Sticky CTA */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        padding: '14px 22px 32px',
        background: 'linear-gradient(to top, var(--bg) 60%, transparent)',
        zIndex: 10,
      }}>
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
          <button
            className="btn-primary"
            onClick={finishOnboarding}
            disabled={!canContinue}
            style={{ width: '100%', padding: '15px', fontSize: '15px' }}
          >
            {canContinue
              ? `Start learning ${selectedAreas.length > 1 ? `${selectedAreas.length} topics` : (LEARNING_AREAS.find(a => a.id === selectedAreas[0])?.name ?? '')} →`
              : 'Select at least one area'}
          </button>
        </div>
      </div>
    </div>
  );
}
