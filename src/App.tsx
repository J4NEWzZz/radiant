import { useEffect } from 'react';
import { useStore } from './store/useStore';
import { Landing } from './pages/Landing';
import { Auth } from './pages/Auth';
import { Onboarding } from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { Lesson } from './pages/Lesson';
import { Profile } from './pages/Profile';
import { Navigation } from './components/Navigation';
import { AchievementPopup } from './components/AchievementPopup';
import { RadiantLogo } from './components/RadiantLogo';
import { SpinnerIcon } from './components/AreaIcon';

function LoadingScreen() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '28px',
    }}>
      <RadiantLogo size={32} textSize={18} />
      <SpinnerIcon size={36} />
    </div>
  );
}

export default function App() {
  const { screen, initAuth, theme, pendingAchievements, authLoading } = useStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    initAuth();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Block rendering until auth state is resolved — prevents flash of wrong screen
  if (authLoading) return <LoadingScreen />;

  return (
    <>
      {screen === 'landing'    && <Landing />}
      {screen === 'auth'       && <Auth />}
      {screen === 'onboarding' && <Onboarding />}
      {screen === 'dashboard'  && <Dashboard />}
      {screen === 'lesson'     && <Lesson />}
      {screen === 'profile'    && <Profile />}
      <Navigation />
      {pendingAchievements[0] && (
        <AchievementPopup key={pendingAchievements[0]} id={pendingAchievements[0]} />
      )}
    </>
  );
}