-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 0. Create profiles table (Since it was missing)
create table if not exists public.profiles (
  id uuid not null references auth.users on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  credit_balance integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for profiles
alter table public.profiles enable row level security;

-- Policies for profiles
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$;

-- Trigger to call the function on signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 1. Create credit_requests table
create table if not exists credit_requests (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) not null,
  amount integer not null,
  depositor_name text not null,
  status text check (status in ('pending', 'approved', 'rejected')) default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create business_info table
create table if not exists business_info (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) not null,
  company_name text not null,
  registration_number text,
  representative_name text,
  address text,
  business_type text,
  business_item text,
  email text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Enable RLS
alter table credit_requests enable row level security;
alter table business_info enable row level security;

-- 4. Policies for credit_requests
create policy "Users can view own credit requests" 
  on credit_requests for select 
  using (auth.uid() = user_id);

create policy "Users can insert own credit requests" 
  on credit_requests for insert 
  with check (auth.uid() = user_id);

create policy "Admins can view all credit requests"
  on credit_requests for select
  using (auth.jwt() ->> 'email' = 'manyd950222@gmail.com');

create policy "Admins can update credit requests"
  on credit_requests for update
  using (auth.jwt() ->> 'email' = 'manyd950222@gmail.com');

-- 5. Policies for business_info
create policy "Users can view own business info" 
  on business_info for select 
  using (auth.uid() = user_id);

create policy "Users can insert own business info" 
  on business_info for insert 
  with check (auth.uid() = user_id);

create policy "Users can update own business info" 
  on business_info for update 
  using (auth.uid() = user_id);

create policy "Admins can view all business info"
  on business_info for select
  using (auth.jwt() ->> 'email' = 'manyd950222@gmail.com');
