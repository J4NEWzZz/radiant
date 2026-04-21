import { useEffect } from 'react';
import { useStore } from './store/useStore';
import { Landing } from './pages/Landing';
import { Auth } from './pages/Auth';
import { Onboarding } from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { Lesson } from './pages/Lesson';
import { Profile } from './pages/Profile';
import { Navigation } from './components/Navigation';

export default function App() {
  const { screen, initAuth, theme } = useStore();

  // Bootstrap auth + apply stored theme on mount
  useEffect(() => {
    // Apply theme immediately from persisted store
    document.documentElement.setAttribute('data-theme', theme);
    initAuth();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {screen === 'landing'    && <Landing />}
      {screen === 'auth'       && <Auth />}
      {screen === 'onboarding' && <Onboarding />}
      {screen === 'dashboard'  && <Dashboard />}
      {screen === 'lesson'     && <Lesson />}
      {screen === 'profile'    && <Profile />}
      <Navigation />
    </>
  );
}
