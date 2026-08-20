-- ==============================================================================
-- 1. Profiles Table (linked to Supabase Auth)
-- ==============================================================================
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  first_name text,
  last_name text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS for Profiles
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Automatically create profile on signup trigger
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, first_name, last_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ==============================================================================
-- 2. Favorites Table
-- ==============================================================================
create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  movie_id text not null,
  title text not null,
  description text,
  date_released text,
  rating numeric,
  image text,
  created_at timestamptz default now(),
  unique(user_id, movie_id)
);

alter table public.favorites enable row level security;

create policy "Users can view their own favorites"
  on public.favorites for select
  using (auth.uid() = user_id);

create policy "Users can insert their own favorites"
  on public.favorites for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own favorites"
  on public.favorites for delete
  using (auth.uid() = user_id);

-- ==============================================================================
-- 3. Home Page Content Table (Updated via Cron)
-- ==============================================================================
create table if not exists public.home_page_content (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  updated_by text default 'cron',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.home_page_content enable row level security;

create policy "Home page content is viewable by everyone"
  on public.home_page_content for select
  using (true);

-- Insert initial sample row if empty
insert into public.home_page_content (title, description, updated_by)
select 
  'Welcome to CinePulse',
  'Discover trending movies, popular anime, top mangas, and hit TV shows all in one modern entertainment hub.',
  'initial'
where not exists (select 1 from public.home_page_content);

-- ==============================================================================
-- 4. Storage Bucket Setup (Avatars & Media)
-- ==============================================================================
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "Avatar images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Users can upload their own avatar"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
