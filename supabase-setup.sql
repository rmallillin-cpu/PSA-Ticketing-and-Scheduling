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

-- Optional cleanup: remove legacy auto-generated announcements that can duplicate
-- ticket/schedule/accomplishment/attendance posts already built from their tables.
update public.portal_state
set data = jsonb_set(
  data,
  '{psa_announcements}',
  coalesce(
    (
      select jsonb_agg(elem)
      from jsonb_array_elements(coalesce(data->'psa_announcements', '[]'::jsonb)) elem
      where coalesce(lower(elem->>'sourceType'), 'announcement') <> 'system'
        and not (
          coalesce(elem->>'message', '') ~* '^(ticket (submitted|updated|deleted)|schedule (added|updated|deleted)|accomplishment report submitted|attendance \||time-in:|time-out:)'
        )
    ),
    '[]'::jsonb
  ),
  true
)
where id = 1;

-- Email Dashboard Tables
-- Force recreate to ensure correct schema and policies

-- Contacts Table
drop table if exists public.contacts cascade;
create table public.contacts (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  phone text,
  company text,
  tags text[] default '{}',
  notes text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Senders Table
drop table if exists public.senders cascade;
create table public.senders (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  display_name text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Email Templates Table
drop table if exists public.email_templates cascade;
create table public.email_templates (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  subject text not null,
  body text not null,
  description text,
  variables text[] default '{}',
  is_active boolean default true,
  created_by uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Email Logs Table
drop table if exists public.email_logs cascade;
create table public.email_logs (
  id uuid default gen_random_uuid() primary key,
  recipient_email text not null,
  recipient_name text,
  subject text not null,
  message_body text,
  sender_email text not null,
  sender_name text,
  status text default 'pending',
  error_message text,
  sent_at timestamptz,
  template_id uuid references public.email_templates(id),
  retry_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Email Campaigns Table
drop table if exists public.email_campaigns cascade;
create table public.email_campaigns (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  template_id uuid references public.email_templates(id),
  sender_id uuid references public.senders(id),
  total_recipients integer default 0,
  status text default 'draft',
  created_by uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS on all tables
alter table public.contacts enable row level security;
alter table public.senders enable row level security;
alter table public.email_templates enable row level security;
alter table public.email_logs enable row level security;
alter table public.email_campaigns enable row level security;

-- Create ultra-permissive policies for development
-- These allow anyone with the API key to perform any action
create policy "dev_contacts_policy" on public.contacts for all to anon, authenticated using (true) with check (true);
create policy "dev_senders_policy" on public.senders for all to anon, authenticated using (true) with check (true);
create policy "dev_templates_policy" on public.email_templates for all to anon, authenticated using (true) with check (true);
create policy "dev_logs_policy" on public.email_logs for all to anon, authenticated using (true) with check (true);
create policy "dev_campaigns_policy" on public.email_campaigns for all to anon, authenticated using (true) with check (true);

-- Explicitly grant permissions to anon and authenticated roles
grant all on table public.contacts to anon, authenticated;
grant all on table public.senders to anon, authenticated;
grant all on table public.email_templates to anon, authenticated;
grant all on table public.email_logs to anon, authenticated;
grant all on table public.email_campaigns to anon, authenticated;
grant usage on schema public to anon, authenticated;

-- Seed initial sender
insert into public.senders (name, email, display_name)
values ('PSA Administration', 'admin@psa-portal.com', 'PSA Admin')
on conflict do nothing;
