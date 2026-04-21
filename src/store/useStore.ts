import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase, isSupabaseConfigured, fetchProfile, createProfile, updateProfile } from '../lib/supabase';
import type { UserProfile } from '../lib/supabase';

export type Screen = 'landing' | 'auth' | 'onboarding' | 'dashboard' | 'lesson' | 'profile' | 'achievements';
export type Theme = 'dark' | 'light';

interface AuthUser {
  id: string;
  email: string;
}

interface AppState {
  // Navigation
  screen: Screen;
  pendingLessonId: string | null; // lesson to open after auth

  // Auth
  user: AuthUser | null;
  authLoading: boolean;

  // Profile data (mirrors DB)
  xp: number;
  streak: number;
  selectedAreas: string[];
  completedLessons: string[];
  achievements: string[];
  currentLessonId: string | null;

  // UI
  theme: Theme;
  pendingAchievements: string[]; // earned achievements waiting to be shown as popup

  // Actions — navigation
  setScreen: (screen: Screen) => void;
  clearPendingAchievement: () => void;

  // Actions — auth
  signUp: (email: string, password: string) => Promise<string | null>;
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  initAuth: () => Promise<void>;

  // Actions — data
  toggleArea: (areaId: string) => Promise<void>;
  startLesson: (lessonId: string) => void;
  completeLesson: (lessonId: string, xpReward: number) => Promise<void>;
  finishOnboarding: () => Promise<void>;

  // Actions — UI
  toggleTheme: () => void;
}

// ── Helper: load profile into store ────────────────────────────────────────
function applyProfile(profile: UserProfile) {
  return {
    xp: profile.xp,
    streak: profile.streak,
    selectedAreas: profile.selected_areas,
    completedLessons: profile.completed_lessons,
    achievements: profile.achievements,
  };
}

// ── Apply theme to <html> ───────────────────────────────────────────────────
function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

// ── Store ───────────────────────────────────────────────────────────────────
export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Defaults — all clean, no pre-seeded data
      screen: 'landing',
      pendingLessonId: null,
      user: null,
      authLoading: true,
      xp: 0,
      streak: 0,
      selectedAreas: [],
      completedLessons: [],
      achievements: [],
      currentLessonId: null,
      theme: 'dark',
      pendingAchievements: [],

      setScreen: (screen) => set({ screen }),
      clearPendingAchievement: () => set(s => ({ pendingAchievements: s.pendingAchievements.slice(1) })),

      // ── Auth ──────────────────────────────────────────────────────────────

      signUp: async (email, password) => {
        if (!isSupabaseConfigured) {
          return 'Supabase is not configured. Copy .env.example to .env and add your project credentials.';
        }
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) return error.message;
        if (!data.user) return 'Sign-up failed — please try again.';

        // Supabase may require email confirmation (default on new projects).
        // A DB trigger handles profile creation server-side so we never need
        // an active client session here.
        //
        // If email confirmation is DISABLED, data.session is present and we
        // can sign the user in immediately.
        if (data.session) {
          // Confirmed immediately — profile already created by trigger.
          // Give the trigger a moment to complete, then fetch.
          let profile = await fetchProfile(data.user.id);
          // Fallback: create manually in case trigger isn't set up yet.
          if (!profile) profile = await createProfile(data.user.id, email);
          set({
            user: { id: data.user.id, email },
            screen: 'onboarding',
            pendingLessonId: null,
            achievements: ['radiant-starter'],
            ...(profile ? applyProfile(profile) : {}),
          });
          return null; // success — App navigates to onboarding
        }

        // Email confirmation required — return null (success).
        // Auth.tsx will show the "check your email" message.
        return null;
      },

      signIn: async (email, password) => {
        if (!isSupabaseConfigured) {
          return 'Supabase is not configured. Copy .env.example to .env and add your project credentials.';
        }
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return error.message;
        const authUser = data.user;
        if (!authUser) return 'Sign-in failed — please try again.';

        // Fetch profile (created by DB trigger on signup).
        // Fall back to manual creation in case the trigger isn't set up.
        let profile = await fetchProfile(authUser.id);
        if (!profile) {
          profile = await createProfile(authUser.id, email);
        }

        const pending = get().pendingLessonId;
        const hasAreas = (profile?.selected_areas.length ?? 0) > 0;

        const base = {
          user: { id: authUser.id, email },
          achievements: ['radiant-starter'] as string[],
          ...(profile ? applyProfile(profile) : {}),
        };
        if (pending) {
          set({ ...base, currentLessonId: pending, screen: 'lesson', pendingLessonId: null });
        } else {
          set({ ...base, screen: hasAreas ? 'dashboard' : 'onboarding' });
        }
        return null;
      },

      signOut: async () => {
        await supabase.auth.signOut();
        set({
          user: null,
          screen: 'landing',
          xp: 0,
          streak: 0,
          selectedAreas: [],
          completedLessons: [],
          achievements: [],
          currentLessonId: null,
          pendingLessonId: null,
        });
      },

      initAuth: async () => {
        // Apply stored theme first
        applyTheme(get().theme);

        if (!isSupabaseConfigured) {
          set({ authLoading: false });
          return;
        }

        // Check existing session on app load
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const profile = await fetchProfile(session.user.id);
          const hasAreas = (profile?.selected_areas.length ?? 0) > 0;
          set({
            user: { id: session.user.id, email: session.user.email ?? '' },
            screen: hasAreas ? 'dashboard' : 'onboarding',
            authLoading: false,
            achievements: ['radiant-starter'],
            ...(profile ? applyProfile(profile) : {}),
          });
        } else {
          set({ authLoading: false });
        }

        // Listen for sign-out
        supabase.auth.onAuthStateChange((event) => {
          if (event === 'SIGNED_OUT') {
            set({ user: null, screen: 'landing' });
          }
        });
      },

      // ── Data actions ──────────────────────────────────────────────────────

      toggleArea: async (areaId) => {
        const state = get();
        const newAreas = state.selectedAreas.includes(areaId)
          ? state.selectedAreas.filter(id => id !== areaId)
          : [...state.selectedAreas, areaId];
        set({ selectedAreas: newAreas });
        if (state.user) {
          await updateProfile(state.user.id, { selected_areas: newAreas });
        }
      },

      startLesson: (lessonId) => {
        const { user } = get();
        if (!user) {
          // Not logged in — require auth first, then open lesson
          set({ pendingLessonId: lessonId, screen: 'auth' });
          return;
        }
        set({ currentLessonId: lessonId, screen: 'lesson' });
      },

      completeLesson: async (lessonId, xpReward) => {
        const state = get();
        if (state.completedLessons.includes(lessonId)) {
          set({ screen: 'dashboard', currentLessonId: null });
          return;
        }
        const newCompleted = [...state.completedLessons, lessonId];
        const newXp = state.xp + xpReward;
        const newAchievements = [...state.achievements];

        // Grant achievements based on new state
        const achievementConditions: Array<{ id: string; check: () => boolean }> = [
          { id: 'first-lesson', check: () => newCompleted.length >= 1 },
          { id: 'five-lessons',  check: () => newCompleted.length >= 5 },
          { id: 'ten-lessons',   check: () => newCompleted.length >= 10 },
          { id: 'all-lessons',   check: () => newCompleted.length >= 13 },
          { id: 'xp-300',        check: () => newXp >= 300 },
          { id: 'xp-1000',       check: () => newXp >= 1000 },
          { id: 'explorer',      check: () => state.selectedAreas.length >= 3 },
          { id: 'polymath',      check: () => state.selectedAreas.length >= 6 },
        ];
        const newlyEarned: string[] = [];
        for (const { id, check } of achievementConditions) {
          if (!newAchievements.includes(id) && check()) {
            newAchievements.push(id);
            newlyEarned.push(id);
          }
        }

        set({
          completedLessons: newCompleted,
          xp: newXp,
          achievements: newAchievements,
          pendingAchievements: newlyEarned,
          screen: 'dashboard',
          currentLessonId: null,
        });
        if (state.user) {
          await updateProfile(state.user.id, {
            completed_lessons: newCompleted,
            xp: newXp,
            achievements: newAchievements,
            last_lesson_date: new Date().toISOString().split('T')[0],
          });
        }
      },

      finishOnboarding: async () => {
        const state = get();
        set({ screen: 'dashboard' });
        if (state.user) {
          await updateProfile(state.user.id, { selected_areas: state.selectedAreas });
        }
      },

      // ── Theme ─────────────────────────────────────────────────────────────

      toggleTheme: () => {
        const newTheme: Theme = get().theme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
        set({ theme: newTheme });
      },
    }),
    {
      name: 'radiant-ui',
      // Only persist theme preference — auth/profile comes from Supabase
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);
