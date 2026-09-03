-- PREPARED ONLY: Frankfurt demo project (numyqalfphyrnedlfzfs)
-- Review and apply intentionally. This migration has not been executed.

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  storage_path text,
  original_name text not null,
  mime_type text not null,
  byte_size bigint not null check (byte_size > 0),
  status text not null default 'uploaded' check (status in ('uploaded', 'analyzed', 'reviewed')),
  created_at timestamptz not null default now()
);

create table if not exists public.document_analysis_results (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  result jsonb not null,
  source text not null default 'demo' check (source in ('demo', 'ai')),
  created_at timestamptz not null default now()
);

create table if not exists public.document_reviews (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  facts jsonb not null,
  confirmed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_events (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  document_id uuid references public.documents(id) on delete set null,
  event_type text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists documents_owner_created_idx on public.documents (owner_id, created_at desc);
create index if not exists document_analysis_results_document_idx on public.document_analysis_results (document_id, created_at desc);
create index if not exists document_reviews_document_idx on public.document_reviews (document_id, created_at desc);
create index if not exists audit_events_owner_created_idx on public.audit_events (owner_id, created_at desc);

alter table public.documents enable row level security;
alter table public.document_analysis_results enable row level security;
alter table public.document_reviews enable row level security;
alter table public.audit_events enable row level security;

create policy "documents_owner_all" on public.documents for all to authenticated using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
create policy "analysis_owner_all" on public.document_analysis_results for all to authenticated using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
create policy "reviews_owner_all" on public.document_reviews for all to authenticated using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
create policy "audit_owner_select_insert" on public.audit_events for select to authenticated using ((select auth.uid()) = owner_id);
create policy "audit_owner_insert" on public.audit_events for insert to authenticated with check ((select auth.uid()) = owner_id);

insert into storage.buckets (id, name, public)
values ('frankfurt-document-demo', 'frankfurt-document-demo', false)
on conflict (id) do nothing;

create policy "demo_documents_owner_select" on storage.objects for select to authenticated using (bucket_id = 'frankfurt-document-demo' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "demo_documents_owner_insert" on storage.objects for insert to authenticated with check (bucket_id = 'frankfurt-document-demo' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "demo_documents_owner_delete" on storage.objects for delete to authenticated using (bucket_id = 'frankfurt-document-demo' and (storage.foldername(name))[1] = (select auth.uid())::text);
