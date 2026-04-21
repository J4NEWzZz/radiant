import { ACHIEVEMENTS, getLevel, LEARNING_AREAS } from '../data/content';
import { useStore } from '../store/useStore';
import { FlameIcon } from '../components/FlameIcon';

const STREAK_HISTORY = [true, true, false, true, true, true, true];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function UserIcon({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke="var(--accent)" strokeWidth="1.6"/>
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}

export function Profile() {
  const { xp, streak, completedLessons, selectedAreas, achievements, signOut, user } = useStore();

  const { level, name: levelName, nextLevelXp, currentLevelXp } = getLevel(xp);
  const xpInLevel = xp - currentLevelXp;
  const xpNeeded = nextLevelXp - currentLevelXp;
  const progress = Math.min((xpInLevel / xpNeeded) * 100, 100);

  const allAchievements = ACHIEVEMENTS.map(a => ({
    ...a,
    earned: achievements.includes(a.id),
  }));

  const totalLessons = LEARNING_AREAS.flatMap(a => a.lessons).length;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: '100px' }}>
      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '0 20px', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{
          padding: '26px 0 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: '800', letterSpacing: '-0.5px' }}>
            Profile
          </h1>
          <button
            className="btn-ghost"
            onClick={signOut}
            style={{ padding: '7px 14px', fontSize: '12px' }}
          >
            Sign out
          </button>
        </div>

        {/* Profile card */}
        <div className="card anim-slide-up" style={{
          padding: '20px', marginBottom: '12px',
          borderLeft: '3px solid var(--accent)',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Decorative glow */}
          <div style={{
            position: 'absolute', top: '-30px', right: '-30px',
            width: '130px', height: '130px',
            background: 'radial-gradient(ellipse, var(--accent-glow) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px', position: 'relative' }}>
            {/* Avatar */}
            <div style={{
              width: '56px', height: '56px', borderRadius: '14px', flexShrink: 0,
              background: 'var(--accent-dim)', border: '1px solid rgba(229,62,62,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 18px var(--accent-glow)',
            }}>
              <UserIcon size={28} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)',
                marginBottom: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {user?.email ?? 'Explorer'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center',
                  background: 'var(--accent-dim)', border: '1px solid rgba(229,62,62,0.25)',
                  borderRadius: '7px', padding: '2px 9px',
                  fontSize: '11px', color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontWeight: '500',
                }}>
                  LVL {level}
                </div>
                <span style={{ fontSize: '14px', fontFamily: 'var(--font-display)', fontWeight: '700' }}>{levelName}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>XP PROGRESS</span>
            <span className="text-gradient" style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '20px' }}>{xp}</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '5px', textAlign: 'right' }}>
            {xpNeeded - xpInLevel} XP to Level {level + 1}
          </div>
        </div>

        {/* Stats row */}
        <div className="anim-slide-up delay-1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '12px' }}>
          {/* Streak */}
          <div className="card" style={{ padding: '14px', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginBottom: '2px' }}>
              <FlameIcon size={18} animated={streak > 0} />
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '20px' }}>{streak}</span>
            </div>
            <div style={{ fontSize: '9px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>STREAK</div>
          </div>
          {/* Lessons */}
          <div className="card" style={{ padding: '14px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '20px', marginBottom: '2px' }}>
              {completedLessons.length}<span style={{ fontSize: '14px' }}>/{totalLessons}</span>
            </div>
            <div style={{ fontSize: '9px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>LESSONS</div>
          </div>
          {/* Areas */}
          <div className="card" style={{ padding: '14px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '20px', marginBottom: '2px' }}>
              {selectedAreas.length}<span style={{ fontSize: '14px' }}> active</span>
            </div>
            <div style={{ fontSize: '9px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>AREAS</div>
          </div>
        </div>

        {/* Streak this week */}
        <div className="card anim-slide-up delay-2" style={{ padding: '18px', marginBottom: '12px' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em', marginBottom: '14px' }}>
            THIS WEEK
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px' }}>
            {STREAK_HISTORY.map((done, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  width: '100%', aspectRatio: '1', borderRadius: '9px',
                  background: done ? 'var(--accent-dim)' : 'var(--surface)',
                  border: `1px solid ${done ? 'rgba(229,62,62,0.25)' : 'var(--border)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '4px',
                }}>
                  {done
                    ? <FlameIcon size={14} />
                    : <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--border)' }} />
                  }
                </div>
                <div style={{ fontSize: '8px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {DAYS[i]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="anim-slide-up delay-3">
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em', marginBottom: '10px' }}>
            ACHIEVEMENTS ({allAchievements.filter(a => a.earned).length}/{allAchievements.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            {allAchievements.map(ach => (
              <div key={ach.id} className={`achievement-card ${ach.earned ? 'earned' : 'locked'}`}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
                  background: ach.earned ? 'var(--accent-dim)' : 'var(--surface)',
                  border: `1px solid ${ach.earned ? 'rgba(229,62,62,0.25)' : 'var(--border)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '20px', filter: ach.earned ? 'none' : 'grayscale(100%)',
                }}>
                  {ach.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontWeight: '600', fontSize: '13px', marginBottom: '2px',
                    color: ach.earned ? 'var(--text)' : 'var(--text-muted)',
                  }}>
                    {ach.name}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                    {ach.description}
                  </div>
                </div>
                {ach.earned && (
                  <div style={{
                    width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
                    background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                      <path d="M1 4.5L3.5 7L10 1" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Pro CTA */}
        <div style={{
          marginTop: '20px', padding: '20px',
          background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
            background: 'linear-gradient(90deg, var(--accent), transparent)',
          }} />
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '16px', marginBottom: '6px' }}>
            Upgrade to Pro
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '16px' }}>
            All areas, unlimited lessons, streak freeze, offline mode & detailed stats.
          </div>
          <button className="btn-primary" style={{ width: '100%' }}>
            See Pro plans →
          </button>
        </div>
      </div>
    </div>
  );
}
