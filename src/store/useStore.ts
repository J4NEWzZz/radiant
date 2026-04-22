import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  supabase, isSupabaseConfigured,
  fetchProfile, createProfile, updateProfile,
} from '../lib/supabase';
import type { UserProfile } from '../lib/supabase';
import {
  ACHIEVEMENTS, MEDAL_TIERS,
  buildStatsSnapshot, computeEarnedTier, getCurrentTier,
  migrateAchievements, type MedalTier,
} from '../data/content';

export type Screen =
  | 'landing' | 'auth' | 'onboarding' | 'dashboard'
  | 'lesson'  | 'profile' | 'achievements';
export type Theme = 'dark' | 'light';

interface AuthUser { id: string; email: string }

interface AppState {
  screen: Screen;
  pendingLessonId: string | null;
  user: AuthUser | null;
  authLoading: boolean;
  xp: number;
  streak: number;
  selectedAreas: string[];
  completedLessons: string[];
  achievements: string[];
  lessonDates: string[];
  currentLessonId: string | null;
  theme: Theme;
  pendingAchievements: string[];
  pinnedAchievements: string[];

  setScreen: (s: Screen) => void;
  clearPendingAchievement: () => void;
  togglePinAchievement: (id: string) => void;
  signUp: (email: string, password: string) => Promise<string | null>;
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  initAuth: () => Promise<void>;
  toggleArea: (areaId: string) => Promise<void>;
  startLesson: (lessonId: string) => void;
  completeLesson: (lessonId: string, xpReward: number) => Promise<void>;
  finishOnboarding: () => Promise<void>;
  toggleTheme: () => void;
}

// ── Date helpers ──────────────────────────────────────────────────────────────

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}
function getYesterday(): string {
  const d = new Date(); d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}
function resolveStreak(streak: number, lastLessonDate: string | null): number {
  if (!lastLessonDate || streak === 0) return 0;
  return (lastLessonDate === getToday() || lastLessonDate === getYesterday()) ? streak : 0;
}
function nextStreak(streak: number, lastLessonDate: string | null): number {
  const t = getToday();
  if (lastLessonDate === t)              return streak;
  if (lastLessonDate === getYesterday()) return streak + 1;
  return 1;
}

// ── Achievement helpers ───────────────────────────────────────────────────────

function computeNewAchievements(
  current: string[],
  snap: ReturnType<typeof buildStatsSnapshot>,
): { updated: string[]; newlyEarned: string[] } {
  let updated = [...current];
  const newlyEarned: string[] = [];
  const metaIds = new Set(['achievement-hunter', 'overachiever', 'grand-master']);

  for (const pass of [
    ACHIEVEMENTS.filter(a => !metaIds.has(a.id)),
    ACHIEVEMENTS.filter(a =>  metaIds.has(a.id)),
  ]) {
    const s = pass.some(a => metaIds.has(a.id)) ? { ...snap, achievementsRaw: updated } : snap;
    for (const ach of pass) {
      const earned = computeEarnedTier(ach, s);
      if (!earned) continue;
      const curTier = getCurrentTier(ach.id, updated);
      const curIdx  = curTier ? MEDAL_TIERS.indexOf(curTier) : -1;
      const newIdx  = MEDAL_TIERS.indexOf(earned);
      if (newIdx > curIdx) {
        updated = updated.filter(a => !a.startsWith(`${ach.id}:`));
        updated.push(`${ach.id}:${earned}`);
        for (let t = curIdx + 1; t <= newIdx; t++) {
          const tier = MEDAL_TIERS[t] as MedalTier;
          if (ach.tiers.includes(tier)) newlyEarned.push(`${ach.id}:${tier}`);
        }
      }
    }
  }
  return { updated, newlyEarned };
}

// ── Profile mapping ───────────────────────────────────────────────────────────

function mapProfile(p: UserProfile) {
  const achievements   = migrateAchievements(p.achievements ?? []);
  const streak         = resolveStreak(p.streak, p.last_lesson_date);
  return {
    xp:                 p.xp               ?? 0,
    streak,
    selectedAreas:      p.selected_areas   ?? [],
    completedLessons:   p.completed_lessons ?? [],
    achievements,
    lessonDates:        p.lesson_dates      ?? [],
    streakExpired:      streak !== p.streak,
    achievementsFixed:  achievements.join(',') !== (p.achievements ?? []).join(','),
    rawAchievements:    achievements,
  };
}

function applyTheme(t: Theme) {
  document.documentElement.setAttribute('data-theme', t);
}

// ── Shared: load a user profile into the store ────────────────────────────────

async function loadProfileIntoStore(
  userId: string,
  email: string,
  set: (partial: Partial<AppState>) => void,
  pendingLessonId: string | null,
) {
  let profile = await fetchProfile(userId);
  if (!profile) profile = await createProfile(userId, email);

  const m = profile ? mapProfile(profile) : null;
  const hasAreas = (m?.selectedAreas.length ?? 0) > 0;

  set({
    user:             { id: userId, email },
    xp:               m?.xp               ?? 0,
    streak:           m?.streak            ?? 0,
    selectedAreas:    m?.selectedAreas     ?? [],
    completedLessons: m?.completedLessons  ?? [],
    achievements:     m?.achievements      ?? [],
    lessonDates:      m?.lessonDates       ?? [],
    screen:           pendingLessonId ? 'lesson'
                    : hasAreas       ? 'dashboard'
                    :                  'onboarding',
    currentLessonId:  pendingLessonId ?? null,
    pendingLessonId:  null,
    authLoading:      false,
  });

  // Write-back corrections (fire-and-forget)
  if (m?.streakExpired)    updateProfile(userId, { streak: m.streak });
  if (m?.achievementsFixed) updateProfile(userId, { achievements: m.rawAchievements });
}

// ── Store ─────────────────────────────────────────────────────────────────────

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      screen:              'landing',
      pendingLessonId:     null,
      user:                null,
      authLoading:         true,
      xp:                  0,
      streak:              0,
      selectedAreas:       [],
      completedLessons:    [],
      achievements:        [],
      lessonDates:         [],
      currentLessonId:     null,
      theme:               'dark',
      pendingAchievements: [],
      pinnedAchievements:  [],

      setScreen: (screen) => set({ screen }),

      clearPendingAchievement: () =>
        set(s => ({ pendingAchievements: s.pendingAchievements.slice(1) })),

      togglePinAchievement: (id) => {
        const { pinnedAchievements, achievements } = get();
        if (!achievements.some(a => a.startsWith(`${id}:`))) return;
        set({
          pinnedAchievements: pinnedAchievements.includes(id)
            ? pinnedAchievements.filter(p => p !== id)
            : pinnedAchievements.length < 3
              ? [...pinnedAchievements, id]
              : pinnedAchievements,
        });
      },

      // ── Auth ───────────────────────────────────────────────────────────────

      signUp: async (email, password) => {
        if (!isSupabaseConfigured) return 'Supabase is not configured.';
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) return error.message;
        if (!data.user) return 'Sign-up failed — please try again.';
        // data.session is null when email confirmation is required
        if (!data.session) return null;

        await loadProfileIntoStore(data.user.id, email, set, null);
        set({ screen: 'onboarding', pendingAchievements: ['radiant-one:iron'] });
        return null;
      },

      signIn: async (email, password) => {
        if (!isSupabaseConfigured) return 'Supabase is not configured.';
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return error.message;
        if (!data.user) return 'Sign-in failed — please try again.';

        const pending = get().pendingLessonId;
        await loadProfileIntoStore(data.user.id, email, set, pending);
        return null;
      },

      signOut: async () => {
        await supabase.auth.signOut();
        set({
          user: null, screen: 'landing', authLoading: false,
          xp: 0, streak: 0, selectedAreas: [], completedLessons: [],
          achievements: [], lessonDates: [], currentLessonId: null,
          pendingLessonId: null, pendingAchievements: [],
        });
      },

      // initAuth: called once on app mount — restores session from localStorage
      initAuth: async () => {
        applyTheme(get().theme);

        if (!isSupabaseConfigured) {
          set({ authLoading: false });
          return;
        }

        // getSession() reads the stored session from localStorage synchronously
        // (no network request unless the token needs refreshing).
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('getSession:', error.message);
          set({ authLoading: false });
          return;
        }

        if (session?.user) {
          const pending = get().pendingLessonId;
          await loadProfileIntoStore(
            session.user.id,
            session.user.email ?? '',
            set,
            pending,
          );
        } else {
          set({ authLoading: false });
        }

        // Keep listening for sign-out and token refresh
        supabase.auth.onAuthStateChange(async (event, session) => {
          if (event === 'SIGNED_OUT') {
            set({
              user: null, screen: 'landing', authLoading: false,
              xp: 0, streak: 0, selectedAreas: [], completedLessons: [],
              achievements: [], lessonDates: [], currentLessonId: null,
              pendingLessonId: null, pendingAchievements: [],
            });
          }
          // Reload profile when a new sign-in or token refresh brings a
          // different user (e.g. after email confirmation redirect)
          if (
            (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') &&
            session?.user &&
            get().user?.id !== session.user.id
          ) {
            await loadProfileIntoStore(
              session.user.id,
              session.user.email ?? '',
              set,
              get().pendingLessonId,
            );
          }
        });
      },

      // ── Data ───────────────────────────────────────────────────────────────

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
        if (!user) { set({ pendingLessonId: lessonId, screen: 'auth' }); return; }
        set({ currentLessonId: lessonId, screen: 'lesson' });
      },

      completeLesson: async (lessonId, xpReward) => {
        const state = get();
        if (state.completedLessons.includes(lessonId)) {
          set({ screen: 'dashboard', currentLessonId: null });
          return;
        }

        const today          = getToday();
        const newCompleted   = [...state.completedLessons, lessonId];
        const newXp          = state.xp + xpReward;
        const lastDate       = state.lessonDates.at(-1) ?? null;
        const newStreak      = nextStreak(resolveStreak(state.streak, lastDate), lastDate);
        const dateSet        = new Set(state.lessonDates);
        dateSet.add(today);
        const newLessonDates = Array.from(dateSet).slice(-365);

        const snap = buildStatsSnapshot({
          xp:               newXp,
          streak:           newStreak,
          completedLessons: newCompleted,
          selectedAreas:    state.selectedAreas,
          achievements:     state.achievements,
        });
        const { updated: newAchievements, newlyEarned } =
          computeNewAchievements(state.achievements, snap);

        // Update local state immediately so UI feels instant
        set({
          completedLessons:    newCompleted,
          xp:                  newXp,
          streak:              newStreak,
          lessonDates:         newLessonDates,
          achievements:        newAchievements,
          pendingAchievements: newlyEarned,
          screen:              'dashboard',
          currentLessonId:     null,
        });

        if (state.user) {
          // Save core data — these columns always exist in the schema
          await updateProfile(state.user.id, {
            completed_lessons: newCompleted,
            xp:                newXp,
            streak:            newStreak,
            last_lesson_date:  today,
            achievements:      newAchievements,
            selected_areas:    state.selectedAreas, // keep in sync
          });

          // lesson_dates is optional (needs migration SQL) — fire-and-forget
          updateProfile(state.user.id, { lesson_dates: newLessonDates });
        }
      },

      finishOnboarding: async () => {
        const state = get();
        set({ screen: 'dashboard' });
        if (state.user) {
          // Save the complete profile state so everything is in Supabase
          await updateProfile(state.user.id, {
            selected_areas:    state.selectedAreas,
            xp:                state.xp,
            streak:            state.streak,
            completed_lessons: state.completedLessons,
            achievements:      state.achievements,
          });
        }
      },

      toggleTheme: () => {
        const t: Theme = get().theme === 'dark' ? 'light' : 'dark';
        applyTheme(t);
        set({ theme: t });
      },
    }),
    {
      name: 'radiant-ui',
      // Only persist UI preferences locally — all profile data lives in Supabase
      partialize: (s) => ({ theme: s.theme, pinnedAchievements: s.pinnedAchievements }),
    }
  )
);