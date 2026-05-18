-- Exécuter dans l'éditeur SQL Supabase pour activer le Realtime frontend.
-- Les écritures sont poussées par Laravel via SupabaseSyncService (service role).

create table if not exists public.orders (
    id uuid primary key,
    student_id uuid not null,
    restaurant_id uuid not null,
    restaurant_name text,
    delivery_person_id uuid,
    items jsonb not null default '[]'::jsonb,
    total_amount numeric(10, 2) not null default 0,
    delivery_fee numeric(8, 2) default 0,
    subtotal numeric(10, 2) default 0,
    platform_commission numeric(10, 2) default 0,
    vendor_amount numeric(10, 2) default 0,
    delivery_fee_student numeric(10, 2) default 0,
    delivery_fee_platform numeric(10, 2) default 0,
    payment_status text default 'pending',
    payment_method text,
    payment_reference text,
    paid_at timestamptz,
    status text not null default 'pending',
    delivery_address text,
    refused_reason text,
    cancelled_reason text,
    cancelled_by text,
    expires_at timestamptz,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table if not exists public.notifications (
    id uuid primary key,
    user_id uuid not null,
    title text not null,
    body text not null,
    type text default 'order',
    order_id uuid,
    is_read boolean default false,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

alter publication supabase_realtime add table public.orders;
alter publication supabase_realtime add table public.notifications;

alter table public.orders enable row level security;
alter table public.notifications enable row level security;

create policy "orders_read_all" on public.orders
    for select to authenticated, anon using (true);

create policy "notifications_read_all" on public.notifications
    for select to authenticated, anon using (true);

create policy "notifications_update_all" on public.notifications
    for update to authenticated, anon using (true);
