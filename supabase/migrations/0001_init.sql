-- Bayt Languages V2 — initial schema, RLS policies, and public verification view.
-- Run this once via the Supabase Dashboard SQL Editor (or `supabase db push` once the CLI works locally).

-- ============================================================
-- ENUMS
-- ============================================================
create type client_type as enum ('individual', 'business', 'government', 'organization', 'other');
create type visibility_mode as enum ('full', 'masked', 'hidden');
create type document_category as enum ('legal', 'medical', 'academic', 'business', 'personal', 'government', 'other');
create type translation_classification as enum ('certified', 'notarized', 'standard', 'sworn');
create type verification_status as enum ('verified', 'revoked', 'expired');
create type staff_role as enum ('admin', 'staff');

-- ============================================================
-- HELPER: updated_at trigger
-- ============================================================
create function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================
-- STAFF (extends Supabase auth.users)
-- ============================================================
create table staff_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role staff_role not null default 'staff',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table staff_profiles enable row level security;

create policy "staff can read own profile"
  on staff_profiles for select
  to authenticated
  using (id = auth.uid());

create policy "admins can read all profiles"
  on staff_profiles for select
  to authenticated
  using (
    exists (
      select 1 from staff_profiles sp
      where sp.id = auth.uid() and sp.role = 'admin' and sp.is_active
    )
  );

create policy "admins can manage profiles"
  on staff_profiles for all
  to authenticated
  using (
    exists (
      select 1 from staff_profiles sp
      where sp.id = auth.uid() and sp.role = 'admin' and sp.is_active
    )
  )
  with check (
    exists (
      select 1 from staff_profiles sp
      where sp.id = auth.uid() and sp.role = 'admin' and sp.is_active
    )
  );

-- ============================================================
-- CORE DOCUMENT / JOB RECORD (admin-managed, never exposed directly to anon)
-- ============================================================
create table translation_documents (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references staff_profiles(id),
  updated_by uuid references staff_profiles(id),

  client_public_name text not null,
  client_visibility_mode visibility_mode not null default 'masked',
  client_type client_type not null default 'individual',

  title text not null,
  description text,
  category document_category not null,
  classification translation_classification not null default 'certified',
  original_language text not null,
  translated_language text not null,
  original_page_count int check (original_page_count > 0),
  translated_page_count int check (translated_page_count > 0),

  requested_at date,
  translation_started_at date,
  translation_completed_at date,
  review_completed_at date,
  delivered_at date,

  qc_process jsonb,
  certification_number text,

  internal_notes text,

  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_documents_category on translation_documents(category);
create index idx_documents_created_by on translation_documents(created_by);

create trigger trg_documents_updated_at
  before update on translation_documents
  for each row
  execute function set_updated_at();

alter table translation_documents enable row level security;

create policy "active staff can read documents"
  on translation_documents for select
  to authenticated
  using (
    exists (select 1 from staff_profiles sp where sp.id = auth.uid() and sp.is_active)
  );

create policy "active staff can create documents"
  on translation_documents for insert
  to authenticated
  with check (
    exists (select 1 from staff_profiles sp where sp.id = auth.uid() and sp.is_active)
  );

create policy "active staff can update documents"
  on translation_documents for update
  to authenticated
  using (
    exists (select 1 from staff_profiles sp where sp.id = auth.uid() and sp.is_active)
  )
  with check (
    exists (select 1 from staff_profiles sp where sp.id = auth.uid() and sp.is_active)
  );

create policy "admins can delete documents"
  on translation_documents for delete
  to authenticated
  using (
    exists (select 1 from staff_profiles sp where sp.id = auth.uid() and sp.role = 'admin' and sp.is_active)
  );

-- ============================================================
-- FILE VERSIONS (supports reissue/correction, version history)
-- ============================================================
create table document_versions (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references translation_documents(id) on delete cascade,
  version_number int not null,
  storage_path text not null,
  sha256_hash text not null,
  file_size_bytes bigint not null,
  original_filename text,
  is_current boolean not null default true,
  uploaded_by uuid not null references staff_profiles(id),
  uploaded_at timestamptz not null default now(),
  supersedes_reason text
);

create unique index uq_document_version_number on document_versions(document_id, version_number);
create unique index uq_one_current_version on document_versions(document_id) where is_current;
create index idx_versions_document on document_versions(document_id);

create function unset_previous_current_version()
returns trigger
language plpgsql
as $$
begin
  if new.is_current then
    update document_versions
    set is_current = false
    where document_id = new.document_id
      and id <> new.id
      and is_current;
  end if;
  return new;
end;
$$;

create trigger trg_versions_unset_previous_current
  before insert on document_versions
  for each row
  execute function unset_previous_current_version();

alter table document_versions enable row level security;

create policy "active staff can read versions"
  on document_versions for select
  to authenticated
  using (
    exists (select 1 from staff_profiles sp where sp.id = auth.uid() and sp.is_active)
  );

create policy "active staff can insert versions"
  on document_versions for insert
  to authenticated
  with check (
    exists (select 1 from staff_profiles sp where sp.id = auth.uid() and sp.is_active)
  );

-- No update/delete policy: versions are append-only by design (corrections insert a new row).

-- ============================================================
-- VERIFICATION RECORDS (public-facing anchor; 1:1 with document)
-- ============================================================
create table verification_records (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null unique references translation_documents(id) on delete cascade,
  reference_code text not null unique,
  status verification_status not null default 'verified',
  status_reason text,
  issued_at timestamptz not null default now(),
  expires_at timestamptz,
  revoked_at timestamptz,
  revoked_by uuid references staff_profiles(id),

  pin_enabled boolean not null default false,
  pin_hash text,

  certificate_storage_path text,
  certificate_generated_at timestamptz,

  created_at timestamptz not null default now()
);

create index idx_verification_reference_code on verification_records(reference_code);
create index idx_verification_status on verification_records(status);

alter table verification_records enable row level security;

create policy "active staff can read verification records"
  on verification_records for select
  to authenticated
  using (
    exists (select 1 from staff_profiles sp where sp.id = auth.uid() and sp.is_active)
  );

create policy "active staff can create verification records"
  on verification_records for insert
  to authenticated
  with check (
    exists (select 1 from staff_profiles sp where sp.id = auth.uid() and sp.is_active)
  );

create policy "active staff can update verification records"
  on verification_records for update
  to authenticated
  using (
    exists (select 1 from staff_profiles sp where sp.id = auth.uid() and sp.is_active)
  )
  with check (
    exists (select 1 from staff_profiles sp where sp.id = auth.uid() and sp.is_active)
  );

-- No anon grant on the base table at all — public reads go through public_verification_view below.

-- ============================================================
-- AUDIT LOG (admin action history — inserted only via service-role route handlers)
-- ============================================================
create table audit_log (
  id bigint generated always as identity primary key,
  actor_id uuid references staff_profiles(id),
  action text not null,
  document_id uuid references translation_documents(id),
  verification_id uuid references verification_records(id),
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index idx_audit_document on audit_log(document_id);
create index idx_audit_actor on audit_log(actor_id);
create index idx_audit_created on audit_log(created_at desc);

alter table audit_log enable row level security;

create policy "active staff can read audit log"
  on audit_log for select
  to authenticated
  using (
    exists (select 1 from staff_profiles sp where sp.id = auth.uid() and sp.is_active)
  );

-- Deliberately no insert/update/delete policy for `authenticated` — only the service-role
-- client (which bypasses RLS) writes audit rows, so a compromised staff session can't tamper
-- with its own trail.

-- ============================================================
-- LEGAL NOTICES (optional DB-editable disclaimer; UI copy otherwise lives in next-intl messages)
-- ============================================================
create table legal_notices (
  locale text not null,
  slug text not null default 'verification_disclaimer',
  body text not null,
  updated_at timestamptz not null default now(),
  primary key (locale, slug)
);

alter table legal_notices enable row level security;

create policy "anyone can read legal notices"
  on legal_notices for select
  to anon, authenticated
  using (true);

create policy "admins can manage legal notices"
  on legal_notices for all
  to authenticated
  using (
    exists (select 1 from staff_profiles sp where sp.id = auth.uid() and sp.role = 'admin' and sp.is_active)
  )
  with check (
    exists (select 1 from staff_profiles sp where sp.id = auth.uid() and sp.role = 'admin' and sp.is_active)
  );

-- ============================================================
-- PUBLIC VERIFICATION VIEW
-- Exposes only what the public verification page needs. Owned by the migration-running role
-- (not `anon`), so anon querying the view relies on the view owner's table access rather than
-- needing any grant on the base tables — the standard Postgres/Supabase pattern for exposing a
-- narrow, safe slice of RLS-locked tables to anonymous readers.
-- ============================================================
create view public_verification_view as
select
  vr.reference_code,
  vr.status,
  vr.issued_at,
  vr.pin_enabled,
  vr.certificate_generated_at is not null as certificate_available,

  case td.client_visibility_mode
    when 'full' then td.client_public_name
    when 'masked' then
      left(split_part(td.client_public_name, ' ', 1), 20) || ' ' ||
      coalesce(left(split_part(td.client_public_name, ' ', 2), 1) || '.', '')
    else 'Client'
  end as client_display_name,
  td.client_type,

  td.title,
  td.description,
  td.category,
  td.classification,
  td.original_language,
  td.translated_language,
  td.original_page_count,
  td.translated_page_count,

  td.requested_at,
  td.translation_started_at,
  td.translation_completed_at,
  td.review_completed_at,
  td.delivered_at,

  td.qc_process,
  td.certification_number,

  dv.version_number as current_version_number,
  dv.sha256_hash as current_sha256_hash,
  dv.uploaded_at as current_version_uploaded_at

from verification_records vr
join translation_documents td on td.id = vr.document_id and td.is_active
left join document_versions dv on dv.document_id = td.id and dv.is_current;

create view public_version_history_view as
select
  vr.reference_code,
  dv.version_number,
  dv.sha256_hash,
  dv.uploaded_at,
  dv.supersedes_reason
from verification_records vr
join document_versions dv on dv.document_id = vr.document_id
where not dv.is_current;

grant select on public_verification_view to anon, authenticated;
grant select on public_version_history_view to anon, authenticated;
