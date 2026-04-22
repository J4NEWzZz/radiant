import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl    = import.meta.env.VITE_SUPABASE_URL     as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession:   true,   // keep session in localStorage across reloads
        autoRefreshToken: true,   // silently refresh token before it expires
        detectSessionInUrl: true, // handle magic-link / OAuth redirects
      },
    })
  : createClient('https://placeholder.supabase.co', 'placeholder');

// ── Types ─────────────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  email: string;
  username: string | null;
  xp: number;
  streak: number;
  selected_areas: string[];
  completed_lessons: string[];
  achievements: string[];
  last_lesson_date: string | null;
  lesson_dates: string[] | null; // null when column not yet added via migration
  created_at: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export async function fetchProfile(userId: string): Promise<UserProfile | null> {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) {
    // PGRST116 = row not found — not an error we need to log loudly
    if (error.code !== 'PGRST116') console.error('fetchProfile:', error.message);
    return null;
  }
  return data as UserProfile;
}

export async function createProfile(userId: string, email: string): Promise<UserProfile | null> {
  if (!isSupabaseConfigured) return null;

  // Try a fresh insert first
  const { data: inserted, error: insertErr } = await supabase
    .from('profiles')
    .insert({ id: userId, email, achievements: ['radiant-starter'] })
    .select()
    .single();

  if (!insertErr) return inserted as UserProfile;

  // Row already exists (e.g. created by DB trigger) — fetch it
  const { data: existing, error: fetchErr } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (fetchErr) { console.error('createProfile (fetch fallback):', fetchErr.message); return null; }
  return existing as UserProfile;
}

/**
 * Save arbitrary profile fields. Uses UPSERT so a missing profile row is
 * created automatically (handles cases where the DB trigger didn't fire).
 * Columns not present in `patch` are untouched (or get their DB default on
 * first insert).
 *
 * Returns true on success, false on error (error is logged to console).
 */
export async function updateProfile(
  userId: string,
  patch: Partial<Omit<UserProfile, 'id' | 'created_at'>>,
): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  const { error } = await supabase
    .from('profiles')
    .upsert({ id: userId, ...patch }, { onConflict: 'id' });
  if (error) { console.error('updateProfile:', error.message); return false; }
  return true;
}

/*
 * ── Required Supabase setup ───────────────────────────────────────────────────
 *
 * 1. Create a Supabase project at https://supabase.com
 * 2. Copy .env.example to .env and fill in:
 *      VITE_SUPABASE_URL=https://xxxx.supabase.co
 *      VITE_SUPABASE_ANON_KEY=your-anon-key
 *
 * 3. Run this SQL in the Supabase SQL editor:
 *
 *   create table public.profiles (
 *     id uuid references auth.users on delete cascade primary key,
 *     email text,
 *     username text,
 *     xp integer default 0,
 *     streak integer default 0,
 *     selected_areas text[] default '{}',
 *     completed_lessons text[] default '{}',
 *     achievements text[] default '{"radiant-starter"}',
 *     last_lesson_date date,
 *     lesson_dates text[] default '{}',
 *     created_at timestamp with time zone default now()
 *   );
 *
 *   alter table public.profiles enable row level security;
 *
 *   create policy "Users can read own profile"
 *     on public.profiles for select using (auth.uid() = id);
 *
 *   create policy "Users can update own profile"
 *     on public.profiles for update using (auth.uid() = id);
 *
 *   create policy "Users can insert own profile"
 *     on public.profiles for insert with check (auth.uid() = id);
 *
 *   -- Trigger: auto-create a profile row whenever a user signs up
 *   create or replace function public.handle_new_user()
 *   returns trigger as $$
 *   begin
 *     insert into public.profiles (id, email, achievements)
 *     values (new.id, new.email, array['radiant-starter'])
 *     on conflict (id) do nothing;
 *     return new;
 *   end;
 *   $$ language plpgsql security definer;
 *
 *   create trigger on_auth_user_created
 *     after insert on auth.users
 *     for each row execute procedure public.handle_new_user();
 *
 * 4. If your table already exists, add the lesson_dates column:
 *
 *   alter table public.profiles
 *     add column if not exists lesson_dates text[] default '{}';
 *
 * 5. Disable email confirmation for local dev (optional):
 *    Supabase dashboard → Authentication → Settings → "Confirm email" → off
 */