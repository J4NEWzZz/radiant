import { useState } from 'react';
import { LEARNING_AREAS, getLevel } from '../data/content';
import { useStore } from '../store/useStore';
import { StreakBadge } from '../components/FlameIcon';

// ── Path layout constants ────────────────────────────────────────────────────
// SVG viewBox is 100 units wide (= 100% of container)
// Node positions alternate at 24% and 76% from left
const LEFT_X  = 24;
const RIGHT_X = 76;
const NODE_PX = 58;    // circle diameter in px
const V_GAP   = 160;   // px between node centers
const TOP_PAD = 80;
const BOT_PAD = 60;

function buildSvgPath(positions: { x: number; y: number }[]): string {
  if (positions.length < 2) return '';
  let d = `M ${positions[0].x} ${positions[0].y}`;
  for (let i = 1; i < positions.length; i++) {
    const a = positions[i - 1];
    const b = positions[i];
    const cy = (a.y + b.y) / 2;
    d += ` C ${a.x} ${cy} ${b.x} ${cy} ${b.x} ${b.y}`;
  }
  return d;
}

// ── Icons ────────────────────────────────────────────────────────────────────

function LockIcon() {
  return (
    <svg width="15" height="17" viewBox="0 0 15 17" fill="none">
      <rect x="1" y="7" width="13" height="10" rx="2.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M4 7V5.5a3.5 3.5 0 0 1 7 0V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M5 3.5l5 3.5-5 3.5V3.5Z" fill="var(--accent)" stroke="var(--accent)" strokeWidth="1" strokeLinejoin="round"/>
    </svg>
  );
}

function CheckIcon({ color = '#22C55E' }: { color?: string }) {
  return (
    <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
      <path d="M2 7l5 5L16 2" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

export function Dashboard() {
  const { xp, streak, completedLessons, selectedAreas, startLesson, user } = useStore();

  const { level, name: levelName, nextLevelXp, currentLevelXp } = getLevel(xp);
  const xpInLevel  = xp - currentLevelXp;
  const xpNeeded   = nextLevelXp - currentLevelXp;
  const progress   = Math.min((xpInLevel / xpNeeded) * 100, 100);

  const activeAreaIds = selectedAreas.length > 0 ? selectedAreas : LEARNING_AREAS.map(a => a.id);
  const areas         = LEARNING_AREAS.filter(a => activeAreaIds.includes(a.id));

  const [activeAreaId, setActiveAreaId] = useState(areas[0]?.id ?? '');
  const activeArea = areas.find(a => a.id === activeAreaId) ?? areas[0];
  const lessons    = activeArea?.lessons ?? [];

  // Node positions: alternating left / right in viewBox-% units + DOM-px y
  const positions = lessons.map((_, i) => ({
    x: i % 2 === 0 ? LEFT_X : RIGHT_X,
    y: TOP_PAD + i * V_GAP,
  }));

  const totalHeight = TOP_PAD + Math.max(0, lessons.length - 1) * V_GAP + BOT_PAD;

  const fullPath      = buildSvgPath(positions);
  const lastDoneIdx   = lessons.reduce((last, l, i) => completedLessons.includes(l.id) ? i : last, -1);
  const donePath      = lastDoneIdx >= 0 ? buildSvgPath(positions.slice(0, lastDoneIdx + 1)) : '';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: '100px' }}>
      <div style={{ maxWidth: '480px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div style={{ padding: '22px 20px 14px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '3px' }}>
                {user?.email ?? 'Explorer'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  fontSize: '11px', color: 'var(--accent)', fontFamily: 'var(--font-mono)',
                  background: 'var(--accent-dim)', border: '1px solid rgba(229,62,62,0.2)',
                  borderRadius: '6px', padding: '1px 7px',
                }}>
                  LVL {level}
                </span>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '15px' }}>
                  {levelName}
                </span>
              </div>
            </div>
            <StreakBadge count={streak} />
          </div>

          <div className="progress-track" style={{ marginBottom: '5px' }}>
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{xp} XP</span>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{xpNeeded - xpInLevel} to Level {level + 1}</span>
          </div>
        </div>

        {/* ── Topic tabs ──────────────────────────────────────────────────── */}
        {areas.length > 0 && (
          <div style={{
            display: 'flex', gap: '8px', overflowX: 'auto', padding: '12px 20px',
            borderBottom: '1px solid var(--border)', scrollbarWidth: 'none',
          }}>
            {areas.map(area => {
              const isActive = area.id === activeAreaId;
              const done = area.lessons.filter(l => completedLessons.includes(l.id)).length;
              return (
                <button
                  key={area.id}
                  onClick={() => setActiveAreaId(area.id)}
                  style={{
                    all: 'unset', cursor: 'pointer', flexShrink: 0,
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '6px 12px', borderRadius: '20px',
                    background: isActive ? 'var(--accent-dim)' : 'var(--card)',
                    border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border)'}`,
                    transition: 'all 0.2s',
                  }}
                >
                  <span style={{ fontSize: '14px' }}>{area.icon}</span>
                  <span style={{
                    fontSize: '12px', fontWeight: isActive ? '600' : '400',
                    color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                    fontFamily: 'var(--font-display)', whiteSpace: 'nowrap',
                  }}>
                    {area.name}
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {done}/{area.lessons.length}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* ── Empty state ──────────────────────────────────────��───────────── */}
        {areas.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            <div style={{ marginBottom: '16px', fontSize: '14px' }}>No areas selected yet.</div>
            <button className="btn-ghost" onClick={() => useStore.getState().setScreen('onboarding')}>
              Choose topics →
            </button>
          </div>
        )}

        {/* ── Lesson path ─────────────────────────────────────────────────── */}
        {activeArea && lessons.length > 0 && (
          <div style={{ padding: '0 20px', position: 'relative' }}>
            <div style={{ position: 'relative', height: `${totalHeight}px` }}>

              {/* SVG path line */}
              <svg
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', pointerEvents: 'none' }}
                height={totalHeight}
                viewBox={`0 0 100 ${totalHeight}`}
                preserveAspectRatio="none"
              >
                {/* Full (gray) track */}
                {fullPath && (
                  <path d={fullPath} stroke="var(--border)" strokeWidth="3" fill="none"
                    strokeLinecap="round" strokeLinejoin="round" />
                )}
                {/* Completed (red) portion */}
                {donePath && (
                  <path d={donePath} stroke="var(--accent)" strokeWidth="3" fill="none"
                    strokeLinecap="round" strokeLinejoin="round" opacity="0.45" />
                )}
              </svg>

              {/* Lesson nodes */}
              {lessons.map((lesson, i) => {
                const pos        = positions[i];
                const isLeft     = i % 2 === 0;
                const isCompleted = completedLessons.includes(lesson.id);
                const isLocked   = i > 0 && !completedLessons.includes(lessons[i - 1].id);
                const isAvailable = !isCompleted && !isLocked;

                return (
                  <div key={lesson.id} style={{
                    position: 'absolute',
                    top: `${pos.y}px`,
                    left: `${pos.x}%`,
                    transform: 'translate(-50%, -50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '120px',
                    zIndex: 2,
                  }}>
                    {/* Circle node */}
                    <button
                      onClick={() => isAvailable && startLesson(lesson.id)}
                      disabled={!isAvailable}
                      className={isAvailable ? 'lesson-node-active' : ''}
                      style={{
                        all: 'unset',
                        cursor: isAvailable ? 'pointer' : 'default',
                        width: `${NODE_PX}px`, height: `${NODE_PX}px`,
                        borderRadius: '50%', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: isCompleted
                          ? 'rgba(34,197,94,0.1)'
                          : isAvailable
                          ? 'var(--accent-dim)'
                          : 'var(--surface)',
                        border: `3px solid ${
                          isCompleted ? '#22C55E' : isAvailable ? 'var(--accent)' : 'var(--border)'
                        }`,
                        transition: 'transform 0.15s',
                        color: isLocked ? 'var(--text-muted)' : 'inherit',
                      }}
                    >
                      {isCompleted ? <CheckIcon /> : isLocked ? <LockIcon /> : <PlayIcon />}
                    </button>

                    {/* Label below node */}
                    <div style={{
                      marginTop: '8px',
                      textAlign: 'center',
                      opacity: isLocked ? 0.45 : 1,
                    }}>
                      <div style={{
                        fontSize: '11px', fontWeight: '600',
                        fontFamily: 'var(--font-display)',
                        color: isCompleted ? '#22C55E' : isLocked ? 'var(--text-muted)' : 'var(--text)',
                        lineHeight: '1.3',
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}>
                        {lesson.title}
                      </div>
                      <div style={{ marginTop: '4px' }}>
                        {isCompleted ? (
                          <span style={{ fontSize: '10px', color: '#22C55E', fontFamily: 'var(--font-mono)' }}>
                            done
                          </span>
                        ) : (
                          <span className="badge-xp" style={{ fontSize: '10px', padding: '1px 6px' }}>
                            +{lesson.xp}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
