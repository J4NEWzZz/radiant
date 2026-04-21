import React from 'react';
import { useStore } from '../store/useStore';
import type { Screen } from '../store/useStore';

interface NavItem {
  screen: Screen;
  label: string;
  icon: (active: boolean) => React.ReactElement;
}

const NAV_ITEMS: NavItem[] = [
  {
    screen: 'dashboard',
    label: 'Learn',
    icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M2.5 8L10 2.5L17.5 8V17C17.5 17.6 17.05 18 16.5 18H13V13H7V18H3.5C2.95 18 2.5 17.6 2.5 17V8Z"
          stroke={active ? 'var(--accent)' : 'var(--text-muted)'}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={active ? 'var(--accent-dim)' : 'none'}
        />
      </svg>
    ),
  },
  {
    screen: 'profile',
    label: 'Profile',
    icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle
          cx="10" cy="7" r="3.5"
          stroke={active ? 'var(--accent)' : 'var(--text-muted)'}
          strokeWidth="1.6"
          fill={active ? 'var(--accent-dim)' : 'none'}
        />
        <path
          d="M3.5 17.5c0-3.3 2.9-6 6.5-6s6.5 2.7 6.5 6"
          stroke={active ? 'var(--accent)' : 'var(--text-muted)'}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export function Navigation() {
  const screen = useStore(s => s.screen);
  const setScreen = useStore(s => s.setScreen);
  const toggleTheme = useStore(s => s.toggleTheme);
  const theme = useStore(s => s.theme);

  if (!['dashboard', 'profile'].includes(screen)) return null;

  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50 }}>
      <div style={{
        background: theme === 'dark'
          ? 'rgba(8,8,8,0.95)'
          : 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--border)',
        padding: '8px 0 24px',
      }}>
        <div style={{
          maxWidth: '480px', margin: '0 auto',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          gap: '4px', padding: '0 20px',
        }}>
          {NAV_ITEMS.map(item => {
            const active = screen === item.screen;
            return (
              <button
                key={item.screen}
                className={`nav-item ${active ? 'active' : ''}`}
                onClick={() => setScreen(item.screen)}
                style={{ flex: 1 }}
              >
                {item.icon(active)}
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Theme toggle in nav */}
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            title="Toggle light/dark mode"
            style={{ marginLeft: '8px' }}
          >
            {theme === 'dark'
              ? <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1v1M8 14v1M1 8H2M14 8h1M3.1 3.1l.7.7M12.2 12.2l.7.7M3.1 12.9l.7-.7M12.2 3.8l.7-.7M8 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              : <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                  <path d="M13.5 9A5.5 5.5 0 0 1 7 2.5c0-.5.06-1 .18-1.47A6.5 6.5 0 1 0 14.97 9.82 5.5 5.5 0 0 1 13.5 9z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            }
          </button>
        </div>
      </div>
    </div>
  );
}
