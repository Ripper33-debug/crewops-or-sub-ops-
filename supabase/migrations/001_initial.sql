-- CrewPilot initial schema

create extension if not exists "pgcrypto";

create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'My Company',
  service_area text default 'Southwest Florida',
  twilio_phone text,
  form_webhook_secret text not null default encode(gen_random_bytes(16), 'hex'),
  stripe_customer_id text,
  subscription_status text not null default 'trialing',
  created_at timestamptz not null default now()
);

create table profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade unique,
  org_id uuid not null references organizations(id) on delete cascade,
  role text not null default 'owner',
  created_at timestamptz not null default now()
);

create table leads (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  customer_name text not null default 'New lead',
  phone text,
  location text default 'Southwest Florida',
  channel text not null default 'website_form',
  label text not null default 'hot_lead',
  status text not null default 'new',
  raw_message text not null,
  summary jsonb,
  sms_consent_at timestamptz,
  do_not_contact boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table quotes (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  lead_id uuid references leads(id) on delete set null,
  customer_name text not null,
  job text not null,
  amount numeric not null default 0,
  status text not null default 'Sent just now',
  ai_action text not null default 'Wait 24 hrs',
  follow_up_draft text,
  sent_at timestamptz not null default now(),
  last_follow_up_at timestamptz
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  lead_id uuid references leads(id) on delete set null,
  quote_id uuid references quotes(id) on delete set null,
  direction text not null check (direction in ('inbound', 'outbound')),
  body text not null,
  twilio_sid text,
  created_at timestamptz not null default now()
);

create index leads_org_id_idx on leads(org_id);
create index quotes_org_id_idx on quotes(org_id);
create index messages_org_id_idx on messages(org_id);
create index organizations_webhook_secret_idx on organizations(form_webhook_secret);

-- RLS
alter table organizations enable row level security;
alter table profiles enable row level security;
alter table leads enable row level security;
alter table quotes enable row level security;
alter table messages enable row level security;

create or replace function public.user_org_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select org_id from profiles where user_id = auth.uid() limit 1;
$$;

create policy org_select on organizations for select
  using (id = public.user_org_id());

create policy org_update on organizations for update
  using (id = public.user_org_id());

create policy profiles_select on profiles for select
  using (user_id = auth.uid());

create policy leads_all on leads for all
  using (org_id = public.user_org_id())
  with check (org_id = public.user_org_id());

create policy quotes_all on quotes for all
  using (org_id = public.user_org_id())
  with check (org_id = public.user_org_id());

create policy messages_all on messages for all
  using (org_id = public.user_org_id())
  with check (org_id = public.user_org_id());
