-- Run this in Supabase SQL Editor
-- Project: https://ofidtdjoqkcfprwtolms.supabase.co

create table if not exists public.portal_state (
  id integer primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint portal_state_single_row check (id = 1)
);

create or replace function public.touch_portal_state_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_touch_portal_state on public.portal_state;
create trigger trg_touch_portal_state
before update on public.portal_state
for each row execute function public.touch_portal_state_updated_at();

alter table public.portal_state enable row level security;

-- Functional public access for this frontend app.
-- You can tighten these policies later after adding full Supabase Auth + user roles.
drop policy if exists "portal_state_select" on public.portal_state;
create policy "portal_state_select"
on public.portal_state
for select
to anon, authenticated
using (true);

drop policy if exists "portal_state_insert" on public.portal_state;
create policy "portal_state_insert"
on public.portal_state
for insert
to anon, authenticated
with check (id = 1);

drop policy if exists "portal_state_update" on public.portal_state;
create policy "portal_state_update"
on public.portal_state
for update
to anon, authenticated
using (id = 1)
with check (id = 1);

insert into public.portal_state (id, data)
values (1, '{}'::jsonb)
on conflict (id) do nothing;
