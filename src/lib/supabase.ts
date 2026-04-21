import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Create client only when env vars are present — avoids crash on missing .env
export const supabase: SupabaseClient = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : createClient('https://placeholder.supabase.co', 'placeholder');

// ── Types ──────────────────────────────────────────────────────────────────

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
  created_at: string;
}

// ── Profile helpers ────────────────────────────────────────────────────────

export async function fetchProfile(userId: string): Promise<UserProfile | null> {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) { console.error('fetchProfile:', error); return null; }
  return data as UserProfile;
}

export async function createProfile(userId: string, email: string): Promise<UserProfile | null> {
  if (!isSupabaseConfigured) return null;
  const newProfile = {
    id: userId,
    email,
    username: null,
    xp: 0,
    streak: 0,
    selected_areas: [],
    completed_lessons: [],
    achievements: ['radiant-starter'],
    last_lesson_date: null,
  };
  const { data, error } = await supabase
    .from('profiles')
    .insert(newProfile)
    .select()
    .single();
  if (error) { console.error('createProfile:', error); return null; }
  return data as UserProfile;
}

export async function updateProfile(
  userId: string,
  patch: Partial<Omit<UserProfile, 'id' | 'created_at'>>
): Promise<void> {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase
    .from('profiles')
    .update(patch)
    .eq('id', userId);
  if (error) console.error('updateProfile:', error);
}

/*
 * ── Required Supabase setup ──────────────────────────────────────────────
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
 *     created_at timestamp with time zone default now()
 *   );
 *
 *   alter table public.profiles enable row level security;
 *
 *   alter table public.profiles enable row level security;
 *
 *   create policy "Users can read own profile"
 *     on public.profiles for select using (auth.uid() = id);
 *
 *   create policy "Users can update own profile"
 *     on public.profiles for update using (auth.uid() = id);
 *
 *   -- Trigger: auto-create a profile row whenever a user signs up.
 *   -- This fires server-side so it works even when email confirmation is
 *   -- required (no client session yet at signup time).
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
 *   -- Optional: disable email confirmation for local dev
 *   -- Supabase dashboard → Authentication → Settings → "Confirm email" → off
 */
