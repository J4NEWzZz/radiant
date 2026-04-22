import {
  ACHIEVEMENTS, type MedalTier,
  buildStatsSnapshot, getCurrentTier,
  getLevel, LEARNING_AREAS,
} from '../data/content';
import { useStore } from '../store/useStore';
import { FlameIcon } from '../components/FlameIcon';
import { MedalIcon, TIER_COLOR, TIER_LABEL, ANIMATED_TIERS } from '../components/MedalIcon';
import { AreaIcon } from '../components/AreaIcon';

const DAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

/** Returns ISO date strings for Mon–Sun of the current calendar week. */
function getThisWeekDates(): string[] {
  const today = new Date();
  const dow   = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dow + 6) % 7));
  monday.setHours(0, 0, 0, 0);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().split('T')[0];
  });
}

/** Compute longest streak from an array of ISO date strings. */
function computeLongestStreak(lessonDates: string[]): number {
  if (lessonDates.length === 0) return 0;
  const sorted = [...new Set(lessonDates)].sort();
  let longest = 1, current = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diff = Math.round((curr.getTime() - prev.getTime()) / 86_400_000);
    if (diff === 1) { current++; if (current > longest) longest = current; }
    else if (diff > 1) current = 1;
  }
  return longest;
}

// ── Local icon components ─────────────────────────────────────────────────────

function UserIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke="var(--accent)" strokeWidth="1.6"/>
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}

function PinIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
      <circle cx="6" cy="5" r="4" fill={filled ? 'var(--accent)' : 'currentColor'} />
      <line x1="6" y1="9" x2="6" y2="13.5" stroke={filled ? 'var(--accent)' : 'currentColor'} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

// ── Tier pip row ──────────────────────────────────────────────────────────────

function TierPips({ tiers, currentTierIdx }: { tiers: MedalTier[]; currentTierIdx: number }) {
  return (
    <div style={{ display: 'flex', gap: '3px', justifyContent: 'center', alignItems: 'center' }}>
      {tiers.map((t, i) => {
        const isEarned  = i <= currentTierIdx;
        const isCurrent = i === currentTierIdx;
        return (
          <div key={t} style={{
            width:        isCurrent ? '14px' : '6px',
            height:       '5px',
            borderRadius: '3px',
            background:   isEarned ? TIER_COLOR[t] : 'var(--border)',
            transition:   'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
            boxShadow:    isCurrent ? `0 0 5px ${TIER_COLOR[t]}` : 'none',
            flexShrink:   0,
          }} />
        );
      })}
    </div>
  );
}

// ── Profile page ──────────────────────────────────────────────────────────────

export function Profile() {
  const {
    xp, streak, completedLessons, selectedAreas, achievements, lessonDates,
    pinnedAchievements, togglePinAchievement, signOut, user,
  } = useStore();

  const today           = new Date().toISOString().split('T')[0];
  const weekDates       = getThisWeekDates();
  const lessonDateSet   = new Set(lessonDates);
  const activeThisWeek  = weekDates.filter(d => lessonDateSet.has(d)).length;
  const longestStreak   = computeLongestStreak(lessonDates);
  const hasLessonToday  = lessonDateSet.has(today);

  const { level, name: levelName, nextLevelXp, currentLevelXp } = getLevel(xp);
  const xpInLevel = xp - currentLevelXp;
  const xpNeeded  = nextLevelXp - currentLevelXp;
  const progress  = Math.min((xpInLevel / xpNeeded) * 100, 100);

  const statsSnap = buildStatsSnapshot({ xp, streak, completedLessons, selectedAreas, achievements });

  const processed = ACHIEVEMENTS.map(a => {
    const currentTier  = getCurrentTier(a.id, achievements);
    const tierIdx      = currentTier !== null ? a.tiers.indexOf(currentTier) : -1;
    const nextTierIdx  = tierIdx < a.tiers.length - 1 ? tierIdx + 1 : -1;
    const nextTier     = nextTierIdx >= 0 ? a.tiers[nextTierIdx] : null;
    const currentValue = a.getValue(statsSnap);
    const fromValue    = tierIdx >= 0 ? a.thresholds[tierIdx] : 0;
    const toValue      = nextTierIdx >= 0 ? a.thresholds[nextTierIdx] : null;
    const progressPct  = toValue != null
      ? Math.min(Math.max(((currentValue - fromValue) / (toValue - fromValue)) * 100, 0), 100)
      : 100;
    return { ...a, currentTier, tierIdx, nextTier, currentValue, fromValue, toValue, progressPct, isPinned: pinnedAchievements.includes(a.id) };
  });

  const earnedCount  = processed.filter(a => a.currentTier !== null).length;
  const totalLessons = LEARNING_AREAS.flatMap(a => a.lessons).length;
  const selectedAreaData = LEARNING_AREAS.filter(a => selectedAreas.includes(a.id));

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: '100px' }}>
      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '0 16px', position: 'relative', zIndex: 1 }}>

        {/* ── Header ───────────────────────────────────────────────────────── */}
        <div style={{ padding: '26px 0 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: '800', letterSpacing: '-0.5px' }}>
            Profile
          </h1>
          <button className="btn-ghost" onClick={signOut} style={{ padding: '7px 14px', fontSize: '12px' }}>
            Sign out
          </button>
        </div>

        {/* ── Profile card ─────────────────────────────────────────────────── */}
        <div className="card anim-slide-up" style={{
          padding: '20px', marginBottom: '10px',
          borderLeft: '3px solid var(--accent)', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: '-30px', right: '-30px',
            width: '130px', height: '130px',
            background: 'radial-gradient(ellipse, var(--accent-glow) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px', position: 'relative' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '14px', flexShrink: 0,
              background: 'var(--accent-dim)', border: '1px solid rgba(229,62,62,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 18px var(--accent-glow)',
            }}>
              <UserIcon />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)',
                marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
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
                <span style={{ fontSize: '14px', fontFamily: 'var(--font-display)', fontWeight: '700' }}>
                  {levelName}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>
              XP PROGRESS
            </span>
            <span className="text-gradient" style={{ fontFamily: 'var(--font-body)', fontWeight: '700', fontSize: '20px' }}>
              {xp.toLocaleString()}
            </span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '5px', textAlign: 'right' }}>
            {(xpNeeded - xpInLevel).toLocaleString()} XP to Level {level + 1}
          </div>
        </div>

        {/* ── Quick stats (2-col) ──────────────────────────────────────────── */}
        <div className="anim-slide-up delay-1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
          <div className="card" style={{ padding: '16px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-body)', fontWeight: '700', fontSize: '24px', marginBottom: '2px' }}>
              {completedLessons.length}
              <span style={{ fontSize: '15px', color: 'var(--text-muted)', fontWeight: '600' }}>/{totalLessons}</span>
            </div>
            <div style={{ fontSize: '9px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>
              LESSONS DONE
            </div>
          </div>
          <div className="card" style={{ padding: '16px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-body)', fontWeight: '700', fontSize: '24px', marginBottom: '2px' }}>
              {earnedCount}
              <span style={{ fontSize: '15px', color: 'var(--text-muted)', fontWeight: '600' }}>/{ACHIEVEMENTS.length}</span>
            </div>
            <div style={{ fontSize: '9px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>
              MEDALS EARNED
            </div>
          </div>
        </div>

        {/* ── Streak card ──────────────────────────────────────────────────── */}
        <div className="card anim-slide-up delay-2" style={{ padding: '22px 20px 20px', marginBottom: '10px', position: 'relative', overflow: 'hidden' }}>
          {/* Subtle ambient glow behind flame */}
          {streak > 0 && (
            <div style={{
              position: 'absolute', top: '-20px', left: '10px',
              width: '120px', height: '120px',
              background: 'radial-gradient(ellipse, rgba(249,115,22,0.14) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
          )}

          {/* Top row: flame + count | best + weekly */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '22px', position: 'relative' }}>
            {/* Left: flame + streak number */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
              <FlameIcon size={56} animated={hasLessonToday} dim={!hasLessonToday} />
              <div>
                <div style={{
                  fontFamily: 'var(--font-body)', fontSize: '52px', fontWeight: '700',
                  lineHeight: 1,
                  ...(streak > 0 ? {
                    background: 'linear-gradient(135deg, #FBBF24 0%, #F97316 50%, #E53E3E 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  } : { color: 'var(--text-muted)' }),
                }}>
                  {streak}
                </div>
                <div style={{
                  fontSize: '10px', color: 'var(--text-muted)',
                  fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', marginTop: '1px',
                }}>
                  DAY STREAK
                </div>
              </div>
            </div>

            {/* Divider */}
            <div style={{ width: '1px', height: '54px', background: 'var(--border)', margin: '0 20px', flexShrink: 0 }} />

            {/* Right: best + this week */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'right' }}>
              <div>
                <div style={{ fontSize: '9px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', marginBottom: '2px' }}>
                  BEST
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontWeight: '700', fontSize: '22px', lineHeight: 1 }}>
                  {longestStreak}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '9px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', marginBottom: '2px' }}>
                  THIS WEEK
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontWeight: '700', fontSize: '22px', lineHeight: 1 }}>
                  {activeThisWeek}
                  <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: '600' }}>/7</span>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: 'var(--border)', marginBottom: '18px' }} />

          {/* This Week calendar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
            {weekDates.map((date, i) => {
              const done     = lessonDateSet.has(date);
              const isToday  = date === today;
              const isFuture = date > today;
              const dayNum   = parseInt(date.split('-')[2], 10);

              return (
                <div key={date} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px',
                  opacity: isFuture ? 0.35 : 1,
                  transition: 'opacity 0.2s',
                }}>
                  {/* Day letter */}
                  <div style={{
                    fontSize: '9px', fontFamily: 'var(--font-mono)',
                    color: isToday ? 'var(--accent)' : 'var(--text-muted)',
                    fontWeight: isToday ? '600' : '400',
                    letterSpacing: '0.02em',
                  }}>
                    {DAY_LETTERS[i]}
                  </div>

                  {/* Activity circle */}
                  <div style={{
                    width: '38px', height: '38px', borderRadius: '50%',
                    background: done ? 'rgba(249,115,22,0.12)' : isToday ? 'var(--accent-dim)' : 'var(--surface)',
                    border: `1.5px solid ${
                      done    ? 'rgba(249,115,22,0.35)' :
                      isToday ? 'var(--accent)' :
                                'var(--border)'
                    }`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: done ? '0 0 14px rgba(249,115,22,0.2)' : isToday ? '0 0 8px var(--accent-glow)' : 'none',
                    transition: 'all 0.25s',
                    flexShrink: 0,
                  }}>
                    {done ? (
                      <FlameIcon size={22} animated={isToday} />
                    ) : (
                      <div style={{
                        width: isToday ? '7px' : '5px',
                        height: isToday ? '7px' : '5px',
                        borderRadius: '50%',
                        background: isToday ? 'var(--accent)' : 'var(--border-light)',
                      }} />
                    )}
                  </div>

                  {/* Day number */}
                  <div style={{
                    fontSize: '10px', fontFamily: 'var(--font-mono)',
                    color: isToday ? 'var(--text)' : 'var(--text-muted)',
                    fontWeight: isToday ? '600' : '400',
                  }}>
                    {dayNum}
                  </div>
                </div>
              );
            })}
          </div>

          {/* No streak message */}
          {streak === 0 && (
            <div style={{
              marginTop: '14px', padding: '10px 14px',
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: '10px', textAlign: 'center',
              fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.5',
            }}>
              Complete a lesson today to start your streak
            </div>
          )}
        </div>

        {/* ── Area Progress (new section) ──────────────────────────────────── */}
        {selectedAreaData.length > 0 && (
          <div className="anim-slide-up delay-3" style={{ marginBottom: '10px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: '10px',
            }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>
                AREA PROGRESS
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {selectedAreaData.length} area{selectedAreaData.length !== 1 ? 's' : ''}
              </div>
            </div>
            <div className="card" style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {selectedAreaData.map(area => {
                const earnedXp   = area.lessons.filter(l => completedLessons.includes(l.id)).reduce((sum, l) => sum + l.xp, 0);
                const totalXp    = area.lessons.reduce((sum, l) => sum + l.xp, 0);
                const pct        = totalXp === 0 ? 0 : Math.round((earnedXp / totalXp) * 100);
                const isComplete = earnedXp === totalXp && totalXp > 0;

                return (
                  <div key={area.id}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                        <div style={{
                          width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
                          background: isComplete ? 'rgba(34,197,94,0.1)' : 'var(--accent-dim)',
                          border: `1px solid ${isComplete ? 'rgba(34,197,94,0.25)' : 'rgba(229,62,62,0.2)'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <AreaIcon
                            name={area.icon} size={16}
                            color={isComplete ? 'var(--green)' : 'var(--accent)'}
                            strokeWidth={1.6}
                          />
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: '600', fontFamily: 'var(--font-display)' }}>
                          {area.name}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {isComplete && (
                          <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
                            <path d="M1 5.5L5 9.5L13 1.5" stroke="var(--green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                        <span style={{
                          fontSize: '11px', fontFamily: 'var(--font-mono)',
                          color: isComplete ? 'var(--green)' : 'var(--text-muted)',
                        }}>
                          {earnedXp}/{totalXp} XP
                        </span>
                      </div>
                    </div>
                    <div style={{ position: 'relative', height: '5px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{
                        position: 'absolute', top: 0, left: 0, bottom: 0,
                        width: `${pct}%`,
                        background: isComplete
                          ? 'linear-gradient(90deg, var(--green), #4ADE80)'
                          : 'linear-gradient(90deg, var(--accent), #FF6B6B)',
                        borderRadius: '3px',
                        transition: 'width 1s cubic-bezier(0.34,1.56,0.64,1)',
                      }} />
                    </div>
                    {pct > 0 && pct < 100 && (
                      <div style={{ fontSize: '9px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '4px', textAlign: 'right' }}>
                        {pct}%
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Pinned Medals ────────────────────────────────────────────────── */}
        <div className="anim-slide-up delay-4" style={{ marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>
              PINNED MEDALS
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              {pinnedAchievements.length}/3
            </div>
          </div>
          <div className="card" style={{ padding: '16px 12px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[0, 1, 2].map(slot => {
                const pid = pinnedAchievements[slot];
                const ach = pid ? processed.find(a => a.id === pid) : null;
                const tier = ach?.currentTier ?? null;
                const tierColor = tier ? TIER_COLOR[tier] : undefined;
                const isAnimated = tier ? ANIMATED_TIERS.has(tier) : false;
                return (
                  <div
                    key={slot}
                    onClick={() => pid && togglePinAchievement(pid)}
                    style={{
                      flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                      justifyContent: 'center', gap: '6px', padding: '14px 8px', borderRadius: '12px',
                      border: (ach && tier) ? `1px solid ${tierColor}40` : '1px dashed var(--border)',
                      background: (ach && tier) ? `${tierColor}0D` : 'var(--surface)',
                      cursor: (ach && tier) ? 'pointer' : 'default', minHeight: '128px',
                      transition: 'all 0.2s',
                    }}
                  >
                    {ach && tier ? (
                      <>
                        <MedalIcon tier={tier} icon={ach.icon} size={58} earned animated={isAnimated} />
                        <div style={{
                          fontSize: '10px', fontWeight: '700', textAlign: 'center',
                          color: 'var(--text)', lineHeight: '1.3', fontFamily: 'var(--font-display)',
                        }}>
                          {ach.name}
                        </div>
                        <div style={{
                          fontSize: '8px', color: tierColor, fontFamily: 'var(--font-mono)',
                          letterSpacing: '0.06em', fontWeight: '600',
                        }}>
                          {TIER_LABEL[tier]}
                        </div>
                      </>
                    ) : (
                      <div style={{ fontSize: '24px', color: 'var(--border-light)', fontWeight: '300', lineHeight: 1 }}>+</div>
                    )}
                  </div>
                );
              })}
            </div>
            {pinnedAchievements.length === 0 && (
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '12px', lineHeight: '1.5' }}>
                Pin up to 3 earned medals to showcase them here
              </div>
            )}
          </div>
        </div>

        {/* ── All Medals ───────────────────────────────────────────────────── */}
        <div className="anim-slide-up delay-5">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>
              ALL MEDALS
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              {earnedCount}/{ACHIEVEMENTS.length}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '8px' }}>
            {processed.map(ach => {
              const tier       = ach.currentTier ?? ach.tiers[0];
              const tierColor  = TIER_COLOR[tier];
              const isAnimated = ach.currentTier ? ANIMATED_TIERS.has(ach.currentTier) : false;
              const canPin     = !ach.isPinned && pinnedAchievements.length < 3;
              const isMaxTier  = ach.tierIdx >= ach.tiers.length - 1 && ach.currentTier !== null;

              return (
                <div
                  key={ach.id}
                  style={{
                    background: 'var(--card)',
                    border: `1px solid ${ach.currentTier ? tierColor + '30' : 'var(--border)'}`,
                    borderRadius: '14px', padding: '14px 10px 12px',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                    opacity: ach.currentTier ? 1 : 0.42,
                    position: 'relative',
                    transition: 'border-color 0.2s',
                    boxShadow: isAnimated ? `0 0 20px ${tierColor}18` : 'none',
                  }}
                >
                  {ach.currentTier && (
                    <button
                      onClick={() => togglePinAchievement(ach.id)}
                      title={ach.isPinned ? 'Unpin' : canPin ? 'Pin to showcase' : 'Unpin another to add this'}
                      disabled={!ach.isPinned && !canPin}
                      style={{
                        position: 'absolute', top: '10px', right: '10px',
                        background: 'none', border: 'none',
                        cursor: ach.isPinned || canPin ? 'pointer' : 'not-allowed',
                        color: ach.isPinned ? 'var(--accent)' : 'var(--text-muted)',
                        padding: '4px', borderRadius: '6px',
                        opacity: !ach.isPinned && !canPin ? 0.3 : 1,
                        transition: 'color 0.2s, opacity 0.2s',
                        lineHeight: 0,
                      }}
                    >
                      <PinIcon filled={ach.isPinned} />
                    </button>
                  )}

                  <MedalIcon tier={tier} icon={ach.icon} size={52} earned={ach.currentTier !== null} animated={isAnimated} />

                  <div style={{
                    fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '12px',
                    textAlign: 'center', color: ach.currentTier ? 'var(--text)' : 'var(--text-muted)',
                    lineHeight: '1.3',
                  }}>
                    {ach.name}
                  </div>

                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', textAlign: 'center', lineHeight: '1.45' }}>
                    {ach.description}
                  </div>

                  <TierPips tiers={ach.tiers} currentTierIdx={ach.tierIdx} />

                  {!isMaxTier && (
                    <div style={{ width: '100%' }}>
                      <div style={{ height: '3px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%', width: `${ach.progressPct}%`,
                          background: ach.nextTier
                            ? `linear-gradient(90deg, ${TIER_COLOR[tier]}, ${TIER_COLOR[ach.nextTier]})`
                            : TIER_COLOR[tier],
                          borderRadius: '2px',
                          transition: 'width 0.9s cubic-bezier(0.34,1.56,0.64,1)',
                        }} />
                      </div>
                      <div style={{ fontSize: '8px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '3px', textAlign: 'center' }}>
                        {ach.currentValue.toLocaleString()} / {ach.toValue?.toLocaleString()}
                      </div>
                    </div>
                  )}

                  <div style={{
                    fontSize: '8px', fontFamily: 'var(--font-mono)', fontWeight: '600', letterSpacing: '0.08em',
                    color: ach.currentTier ? tierColor : 'var(--text-muted)',
                    border: `1px solid ${ach.currentTier ? tierColor + '40' : 'var(--border)'}`,
                    borderRadius: '20px', padding: '2px 8px',
                    background: ach.currentTier ? `${tierColor}0D` : 'transparent',
                  }}>
                    {ach.currentTier
                      ? (isMaxTier ? `★ ${TIER_LABEL[tier]}` : TIER_LABEL[tier])
                      : TIER_LABEL[ach.tiers[0]]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Pro CTA ──────────────────────────────────────────────────────── */}
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