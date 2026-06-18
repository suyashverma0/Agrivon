-- SUPABASE DATABASE SCHEMA FOR AGRIVON
-- RUN THIS IN THE SUPABASE SQL EDITOR TO SETUP YOUR TABLES, RLS, AND BUCKETS

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. USERS TABLE (custom profile synced with supbase auth or registered custom)
create table if not exists public.users (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    email text unique not null,
    role text not null check (role in ('Farmer', 'ShopOwner', 'Worker', 'SuperAdmin', 'None')),
    avatar_url text,
    mobile_number text,
    village text,
    state_name text, -- avoided 'state' SQL reserved keywords just in case
    farm_size numeric,
    crops_grown text,
    experience integer,
    
    -- ShopOwner fields
    shop_name text,
    shop_address text,
    shop_delivery boolean default true,
    
    -- Worker fields
    skills text,
    daily_wage_expectation numeric,
    availability_status text default 'Available',
    
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. PRODUCTS TABLE
create table if not exists public.products (
    id uuid primary key default gen_random_uuid(),
    shopkeeper_id uuid references public.users(id) on delete cascade not null,
    title text not null,
    description text,
    category text not null check (category in ('Seed', 'Pesticide', 'Fertilizer', 'Tool', 'Other')),
    price numeric not null,
    image_url text,
    stock integer not null default 0,
    
    -- Real agrarian product parameters
    brand_name text,
    composition text,
    crop_compatibility text,
    dosage_instructions text,
    mfg_date text,
    expiry_date text,
    govt_license text,
    expected_yield_boost text,
    safety_precautions text,
    soil_compatibility text,
    is_promo boolean default false,
    original_price numeric,
    
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. COMMUNITY MESSAGES TABLE (Real community forum/chat)
create table if not exists public.community_messages (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references public.users(id) on delete cascade not null,
    message text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. DIRECT MESSAGES TABLE
create table if not exists public.direct_messages (
    id uuid primary key default gen_random_uuid(),
    sender_id uuid references public.users(id) on delete cascade not null,
    receiver_id uuid references public.users(id) on delete cascade not null,
    message text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. LABOUR POSTS TABLE
create table if not exists public.labour_posts (
    id uuid primary key default gen_random_uuid(),
    labour_id uuid references public.users(id) on delete cascade unique not null,
    skills text not null,
    experience integer not null,
    expected_wage numeric not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. ORDERS TABLE
create table if not exists public.orders (
    id uuid primary key default gen_random_uuid(),
    farmer_id uuid references public.users(id) on delete cascade not null,
    product_id uuid references public.products(id) on delete cascade not null,
    quantity integer not null default 1,
    status text not null default 'Pending' check (status in ('Pending', 'Approved', 'Shipped', 'Delivered')),
    farmer_address text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS) on all tables for maximum security
alter table public.users enable row level security;
alter table public.products enable row level security;
alter table public.community_messages enable row level security;
alter table public.direct_messages enable row level security;
alter table public.labour_posts enable row level security;
alter table public.orders enable row level security;

-- Create public read/write access policies to facilitate rapid startup
create policy "Enable all actions for anyone on users" on public.users for all using (true) with check (true);
create policy "Enable all actions for anyone on products" on public.products for all using (true) with check (true);
create policy "Enable all actions for anyone on community_messages" on public.community_messages for all using (true) with check (true);
create policy "Enable all actions for anyone on direct_messages" on public.direct_messages for all using (true) with check (true);
create policy "Enable all actions for anyone on labour_posts" on public.labour_posts for all using (true) with check (true);
create policy "Enable all actions for anyone on orders" on public.orders for all using (true) with check (true);

-- STORAGE BUCKETS SETUP GUIDE
-- Add a storage bucket called "agrivon-images" and make it public so image links work.
-- Add custom policy enabling all writes and reads.
