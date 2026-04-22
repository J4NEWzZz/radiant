import { useState } from 'react';
import { useStore } from '../store/useStore';
import { isSupabaseConfigured } from '../lib/supabase';
import { RadiantLogo } from '../components/RadiantLogo';
import { WarningIcon } from '../components/AreaIcon';

type Tab = 'signup' | 'login';

// ── Password strength ────────────────────────────────────────────────────────

const COMMON_PASSWORDS = new Set([
  'password', 'password1', 'password123', '123456', '12345678', '123456789',
  'qwerty', 'qwerty123', 'abc123', 'letmein', 'welcome', 'monkey', 'dragon',
  'master', 'admin', 'login', 'iloveyou', 'sunshine', 'princess', 'football',
  '111111', '000000', '123123', 'shadow', 'pass', 'test', 'user',
]);

interface StrengthResult {
  score: number;       // 0–4
  label: string;
  color: string;
  hint: string;
  criteria: { label: string; met: boolean }[];
}

function getStrength(pw: string): StrengthResult {
  const criteria = [
    { label: '8+ characters',    met: pw.length >= 8 },
    { label: 'Uppercase letter', met: /[A-Z]/.test(pw) },
    { label: 'Number',           met: /[0-9]/.test(pw) },
    { label: 'Special character',met: /[^A-Za-z0-9]/.test(pw) },
  ];

  if (!pw) return { score: 0, label: '', color: '', hint: '', criteria };

  let pts = 0;
  if (pw.length >= 6)  pts += 1;
  if (pw.length >= 8)  pts += 1;
  if (pw.length >= 10) pts += 1;
  if (pw.length >= 12) pts += 1;
  if (pw.length >= 16) pts += 1;
  if (/[a-z]/.test(pw)) pts += 0.5;
  if (/[A-Z]/.test(pw)) pts += 1;
  if (/[0-9]/.test(pw)) pts += 1;
  if (/[^A-Za-z0-9]/.test(pw)) pts += 1.5;

  let penaltyHint = '';
  if (COMMON_PASSWORDS.has(pw.toLowerCase())) {
    pts = Math.min(pts, 2);
    penaltyHint = 'Too common';
  } else if (/^(.)\1+$/.test(pw)) {
    pts = Math.min(pts, 2);
    penaltyHint = 'Avoid repeating the same character';
  } else if (/(.)\1{2,}/.test(pw)) {
    pts -= 2;
    if (!penaltyHint) penaltyHint = 'Avoid too many repeated characters';
  } else if (/(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i.test(pw)) {
    pts -= 1.5;
    if (!penaltyHint) penaltyHint = 'Avoid sequential patterns';
  }

  pts = Math.max(0, pts);

  let score: 0 | 1 | 2 | 3 | 4 = 0;
  if (pts >= 7) score = 4;
  else if (pts >= 5) score = 3;
  else if (pts >= 3) score = 2;
  else if (pts >= 1) score = 1;

  const map: Record<number, { label: string; color: string }> = {
    1: { label: 'Weak',   color: '#E53E3E' },
    2: { label: 'Fair',   color: '#F97316' },
    3: { label: 'Good',   color: '#EAB308' },
    4: { label: 'Strong', color: '#22C55E' },
  };

  const { label, color } = map[score] ?? { label: 'Weak', color: '#E53E3E' };

  let hint = '';
  if (penaltyHint) {
    hint = penaltyHint;
  } else if (pw.length < 8) {
    hint = `${8 - pw.length} more character${8 - pw.length > 1 ? 's' : ''} needed`;
  } else if (pw.length < 12) {
    hint = 'Longer = stronger';
  } else if (score === 4) {
    hint = 'Excellent!';
  } else {
    if (!/[A-Z]/.test(pw)) hint = 'Add an uppercase letter';
    else if (!/[0-9]/.test(pw)) hint = 'Add a number';
    else if (!/[^A-Za-z0-9]/.test(pw)) hint = 'Add a special character (!@#$...)';
    else hint = 'Keep going!';
  }

  return { score, label, color, hint, criteria };
}

// ── Eye icon ─────────────────────────────────────────────────────────────────

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

// ── Password field with toggle + strength ────────────────────────────────────

function PasswordField({
  value, onChange, placeholder, autoComplete, showStrength = false, label = 'PASSWORD',
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  autoComplete: string;
  showStrength?: boolean;
  label?: string;
}) {
  const [visible, setVisible] = useState(false);
  const strength = showStrength ? getStrength(value) : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{
        fontSize: '11px', color: 'var(--text-muted)',
        fontFamily: 'var(--font-mono)', letterSpacing: '0.05em',
      }}>
        {label}
      </label>

      <div style={{ position: 'relative' }}>
        <input
          type={visible ? 'text' : 'password'}
          className="input-field"
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          autoComplete={autoComplete}
          required
          style={{ paddingRight: '48px' }}
        />
        <button
          type="button"
          onClick={() => setVisible(v => !v)}
          style={{
            position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', cursor: 'pointer',
            color: visible ? 'var(--accent)' : 'var(--text-muted)',
            display: 'flex', alignItems: 'center', padding: '4px',
            transition: 'color 0.2s', minWidth: '28px', minHeight: '28px',
            justifyContent: 'center',
          }}
          title={visible ? 'Hide password' : 'Show password'}
        >
          <EyeIcon open={visible} />
        </button>
      </div>

      {showStrength && value.length > 0 && strength && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{
                flex: 1, height: '3px', borderRadius: '2px',
                background: i <= strength.score ? strength.color : 'var(--border-light)',
                transition: 'background 0.3s ease',
                boxShadow: i <= strength.score && strength.score >= 4
                  ? `0 0 6px ${strength.color}60`
                  : 'none',
              }} />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{
              fontSize: '11px', fontWeight: '600', fontFamily: 'var(--font-mono)',
              color: strength.color, transition: 'color 0.3s',
            }}>
              {strength.label}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              {strength.hint}
            </span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px' }}>
            {strength.criteria.map(c => (
              <span key={c.label} style={{
                fontSize: '10px', fontFamily: 'var(--font-mono)',
                color: c.met ? '#22C55E' : 'var(--text-muted)',
                transition: 'color 0.25s',
                display: 'flex', alignItems: 'center', gap: '3px',
              }}>
                <span style={{
                  display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%',
                  background: c.met ? '#22C55E' : 'var(--border-light)',
                  transition: 'background 0.25s', flexShrink: 0,
                }} />
                {c.label}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Auth component ───────────────────────────────────────────────────────

export function Auth() {
  const [tab, setTab] = useState<Tab>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const { signUp, signIn, setScreen, pendingLessonId } = useStore();

  function switchTab(t: Tab) {
    setTab(t);
    setError('');
    setSuccess('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    if (tab === 'signup') {
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }

    setLoading(true);
    const err = tab === 'signup'
      ? await signUp(email, password)
      : await signIn(email, password);
    setLoading(false);

    if (err) {
      setError(err);
    } else if (tab === 'signup') {
      setSuccess('Account created! Check your email to confirm, then sign in.');
      switchTab('login');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Grid */}
      <div className="grid-bg" style={{
        position: 'absolute', inset: 0,
        maskImage: 'radial-gradient(ellipse 70% 50% at 50% 0%, black 30%, transparent 100%)',
        opacity: 0.5,
      }} />
      {/* Glow */}
      <div style={{
        position: 'absolute', top: '-80px', left: '50%', transform: 'translateX(-50%)',
        width: '400px', height: '300px',
        background: 'radial-gradient(ellipse, var(--accent-glow) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Single centered column — logo + form share the same max-width */}
      <div style={{
        position: 'relative', zIndex: 1,
        width: '100%', maxWidth: '400px',
        padding: '0 20px',
        display: 'flex', flexDirection: 'column',
        flex: 1,
      }}>

        {/* Logo row — now inside the same column as the form */}
        <div style={{ paddingTop: '28px', paddingBottom: '0' }}>
          <button onClick={() => setScreen('landing')} style={{ all: 'unset', cursor: 'pointer' }}>
            <RadiantLogo size={28} textSize={16} />
          </button>
        </div>

        {/* Vertically centered content */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          justifyContent: 'center', paddingTop: '20px', paddingBottom: '48px',
        }}>

          {/* Supabase not configured warning */}
          {!isSupabaseConfigured && (
            <div style={{
              marginBottom: '20px', padding: '13px 15px',
              background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.22)',
              borderRadius: '10px',
            }}>
              <div style={{ fontWeight: '600', fontSize: '12px', color: 'var(--amber)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <WarningIcon size={14} color="var(--amber)" strokeWidth={1.6} />
                Supabase not connected
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.5', fontFamily: 'var(--font-mono)' }}>
                Copy <strong style={{ color: 'var(--text-secondary)' }}>.env.example</strong> → <strong style={{ color: 'var(--text-secondary)' }}>.env</strong>, add credentials, restart dev server.
              </div>
            </div>
          )}

          {/* Heading — centered, same column width as form */}
          <div className="anim-slide-up" style={{ textAlign: 'center', marginBottom: '28px' }}>
            {pendingLessonId && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                background: 'var(--accent-dim)', border: '1px solid rgba(229,62,62,0.25)',
                borderRadius: '20px', padding: '4px 12px', marginBottom: '14px',
                fontSize: '11px', color: 'var(--accent)', fontFamily: 'var(--font-mono)',
              }}>
                Sign in to start the lesson
              </div>
            )}
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(24px, 7vw, 30px)',
              fontWeight: '800',
              letterSpacing: '-0.5px', lineHeight: '1.1', marginBottom: '8px',
            }}>
              {tab === 'signup' ? 'Create your account' : 'Welcome back'}
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              {tab === 'signup'
                ? 'Every account starts fresh. Your progress is yours.'
                : 'Your streak and XP are waiting for you.'}
            </p>
          </div>

          {/* Card */}
          <div className="card anim-slide-up delay-1" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
              {(['signup', 'login'] as Tab[]).map(t => (
                <button
                  key={t}
                  className={`auth-tab ${tab === t ? 'active' : ''}`}
                  onClick={() => switchTab(t)}
                >
                  {t === 'signup' ? 'Sign Up' : 'Sign In'}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

              {success && (
                <div style={{
                  padding: '11px 13px', borderRadius: '8px',
                  background: 'var(--green-dim)', border: '1px solid rgba(34,197,94,0.2)',
                  fontSize: '13px', color: 'var(--green)', lineHeight: '1.5',
                }}>
                  ✓ {success}
                </div>
              )}

              {error && (
                <div style={{
                  padding: '11px 13px', borderRadius: '8px',
                  background: 'var(--accent-dim)', border: '1px solid rgba(229,62,62,0.2)',
                  fontSize: '13px', color: 'var(--accent)', lineHeight: '1.5',
                }}>
                  {error}
                </div>
              )}

              {/* Email */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{
                  fontSize: '11px', color: 'var(--text-muted)',
                  fontFamily: 'var(--font-mono)', letterSpacing: '0.05em',
                }}>
                  EMAIL
                </label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>

              <PasswordField
                label="PASSWORD"
                value={password}
                onChange={setPassword}
                placeholder={tab === 'signup' ? 'Create a strong password' : '••••••••'}
                autoComplete={tab === 'signup' ? 'new-password' : 'current-password'}
                showStrength={tab === 'signup'}
              />

              {tab === 'signup' && (
                <PasswordField
                  label="CONFIRM PASSWORD"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                />
              )}

              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
                style={{ width: '100%', padding: '14px', marginTop: '2px', fontSize: '14px' }}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="15" height="15" viewBox="0 0 16 16" style={{ animation: 'spin-ring 0.75s linear infinite' }}>
                      <circle cx="8" cy="8" r="6" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2"/>
                      <path d="M8 2a6 6 0 0 1 6 6" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
                    </svg>
                    {tab === 'signup' ? 'Creating account...' : 'Signing in...'}
                  </span>
                ) : (
                  tab === 'signup' ? 'Create account →' : 'Sign in →'
                )}
              </button>

              <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
                {tab === 'signup' ? 'Already have an account? ' : "Don't have an account? "}
                <button
                  type="button"
                  className="btn-text"
                  onClick={() => switchTab(tab === 'signup' ? 'login' : 'signup')}
                  style={{ fontSize: '12px', minHeight: 'auto' }}
                >
                  {tab === 'signup' ? 'Sign in' : 'Sign up free'}
                </button>
              </div>
            </form>
          </div>

          {/* Starter achievement teaser */}
          {tab === 'signup' && (
            <div className="anim-slide-up delay-2" style={{
              marginTop: '14px',
              display: 'flex', alignItems: 'center', gap: '11px',
              padding: '12px 14px',
              background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '10px',
            }}>
              <svg width="22" height="22" viewBox="0 0 32 32" fill="none" style={{ flexShrink: 0 }}>
                <defs>
                  <linearGradient id="ach-c" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FF5555"/>
                    <stop offset="100%" stopColor="#C41C1C"/>
                  </linearGradient>
                  <linearGradient id="ach-p" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E03030"/>
                    <stop offset="100%" stopColor="#7F1D1D"/>
                  </linearGradient>
                </defs>
                <path d="M9.5 5.5 L22.5 5.5 L27.5 14 L4.5 14 Z" fill="url(#ach-c)"/>
                <path d="M4.5 14 L27.5 14 L16 30.5 Z" fill="url(#ach-p)"/>
                <line x1="11.5" y1="5.5" x2="4.5" y2="14"  stroke="rgba(255,255,255,0.5)" strokeWidth="0.8"/>
                <line x1="20.5" y1="5.5" x2="27.5" y2="14" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8"/>
              </svg>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '1px' }}>Radiant Starter</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Your first achievement — earned automatically on signup.</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}