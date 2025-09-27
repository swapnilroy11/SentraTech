-- Contact Sales Supabase Table Setup
-- Run this SQL in your Supabase SQL editor

-- Enable necessary extensions
create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

-- Create contact_requests table (also known as "Contact Request" table)
create table public.contact_requests (
  id uuid not null default gen_random_uuid() primary key,
  full_name text not null,
  work_email text not null,
  phone text null,
  company_name text not null,
  company_website text null,
  monthly_volume text not null,
  plan_selected text null,
  plan_id text null,
  billing_term text null,
  price_display text null,
  preferred_contact_method text null,
  message text null,
  status text not null default 'pending',
  priority smallint not null default 0,
  assigned_to uuid null references auth.users(id),
  created_by uuid null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version int not null default 1,
  ip_address inet null,
  utm_data jsonb default '{}',
  metadata jsonb default '{}',
  consent_marketing boolean not null default false,
  scheduled_time timestamptz null
);

-- Create demo_requests table for demo request functionality
create table public.demo_requests (
  id uuid not null default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  company text not null,
  phone text null,
  message text null,
  call_volume text null,
  interaction_volume text null,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Create indexes for better performance
create index on public.contact_requests(status);
create index on public.contact_requests(created_at desc);
create index on public.contact_requests(lower(work_email));
create index on public.contact_requests using gin(utm_data);
create index on public.contact_requests using gin(metadata);
create index on public.contact_requests(plan_selected);
create index on public.contact_requests(monthly_volume);
create index on public.contact_requests(billing_term);
create index on public.contact_requests(plan_id);

-- Create indexes for demo_requests table
create index on public.demo_requests(status);
create index on public.demo_requests(created_at desc);
create index on public.demo_requests(lower(email));
create index on public.demo_requests(company);

-- Create update trigger function
create or replace function public.trigger_update_contact_requests()
  returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  new.version := coalesce(old.version,0)+1;
  return new;
end; $$;

-- Create trigger
drop trigger if exists contact_requests_before_update on public.contact_requests;
create trigger contact_requests_before_update
  before update on public.contact_requests
  for each row execute function public.trigger_update_contact_requests();

-- Enable Row Level Security
alter table public.contact_requests enable row level security;
alter table public.demo_requests enable row level security;

-- Create RLS policies
-- Policy for inserting new contact requests (anyone can submit)
create policy insert_contact_requests on public.contact_requests
  for insert with check (true);

-- Policy for admin access (full access)
create policy admin_all_contact_requests on public.contact_requests
  for all using (
    current_setting('request.jwt.claims.role', true) = 'admin'
    or current_setting('request.jwt.claims.sub', true)::uuid in (
      select id from auth.users where email like '%@sentratech.com'
    )
  );

-- Policy for sales team to view and update their assigned leads
create policy sales_select_contact_requests on public.contact_requests
  for select using (
    current_setting('request.jwt.claims.role', true) = 'admin'
    or assigned_to = nullif(current_setting('request.jwt.claims.sub', true), '')::uuid
    or current_setting('request.jwt.claims.sub', true)::uuid in (
      select id from auth.users where email like '%@sentratech.com'
    )
  );

create policy sales_update_contact_requests on public.contact_requests
  for update using (
    current_setting('request.jwt.claims.role', true) = 'admin'
    or assigned_to = nullif(current_setting('request.jwt.claims.sub', true), '')::uuid
    or current_setting('request.jwt.claims.sub', true)::uuid in (
      select id from auth.users where email like '%@sentratech.com'
    )
  );

-- Grant permissions
grant select, insert on public.contact_requests to authenticated;
grant select, insert on public.contact_requests to anon;

-- Create enum types for better data validation (optional)
create type contact_method_enum as enum ('email', 'phone', 'demo');
create type volume_enum as enum ('under_10k', '10k_50k', 'over_50k');
create type status_enum as enum ('pending', 'contacted', 'qualified', 'proposal_sent', 'closed_won', 'closed_lost');

-- Add check constraints (optional but recommended)
alter table public.contact_requests 
add constraint valid_email check (work_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

alter table public.contact_requests 
add constraint valid_monthly_volume check (monthly_volume in ('under_10k', '10k_50k', 'over_50k'));

alter table public.contact_requests 
add constraint valid_contact_method check (preferred_contact_method in ('email', 'phone', 'demo'));

alter table public.contact_requests 
add constraint valid_status check (status in ('pending', 'contacted', 'qualified', 'proposal_sent', 'closed_won', 'closed_lost'));

-- Create a view for sales dashboard (optional)
create or replace view public.contact_requests_summary as 
select 
  id,
  full_name,
  work_email,
  company_name,
  plan_selected,
  monthly_volume,
  preferred_contact_method,
  status,
  created_at,
  scheduled_time,
  utm_data->'utm_source' as utm_source,
  utm_data->'utm_campaign' as utm_campaign,
  metadata->'deviceType' as device_type
from public.contact_requests
order by created_at desc;

-- Grant access to the view
grant select on public.contact_requests_summary to authenticated;

-- Success message
select 'Contact Sales table setup completed successfully!' as status;