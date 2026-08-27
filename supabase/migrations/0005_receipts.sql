-- Translation cost receipts: an optional record attached to a document,
-- generated the same way the verification certificate is (a signed,
-- generate-once-and-cache PDF), and offered as a third download alongside
-- the translated file and the certificate on the public verify page.
create type receipt_status as enum ('pending_payment', 'partially_paid', 'paid', 'cancelled');

create table receipts (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null unique references translation_documents(id) on delete cascade,
  receipt_number text not null unique,
  status receipt_status not null default 'pending_payment',

  total_character_count int,
  rate_description text,
  base_cost numeric(12, 2),
  base_currency text,
  equivalent_cost numeric(12, 2),
  equivalent_currency text not null default 'SAR',

  discount_percent numeric(5, 2) not null default 0,
  discounted_amount numeric(12, 2),
  final_amount numeric(12, 2) not null,
  amount_paid numeric(12, 2) not null default 0,

  notes text,

  receipt_storage_path text,
  receipt_generated_at timestamptz,

  created_by uuid not null references staff_profiles(id),
  issued_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_receipts_document on receipts(document_id);

alter table receipts enable row level security;

create policy "active staff can read receipts"
  on receipts for select to authenticated
  using (is_active_staff(auth.uid()));

create policy "active staff can create receipts"
  on receipts for insert to authenticated
  with check (is_active_staff(auth.uid()));

create policy "active staff can update receipts"
  on receipts for update to authenticated
  using (is_active_staff(auth.uid()))
  with check (is_active_staff(auth.uid()));

-- No anon grant on the base table — the receipt PDF is served through
-- /api/verify/[code]/receipt via the service-role client, same pattern as
-- the certificate. The public view only needs to know whether one exists.
create or replace view public_verification_view as
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
  dv.uploaded_at as current_version_uploaded_at,

  exists(select 1 from receipts r where r.document_id = td.id) as receipt_available

from verification_records vr
join translation_documents td on td.id = vr.document_id and td.is_active
left join document_versions dv on dv.document_id = td.id and dv.is_current;

grant select on public_verification_view to anon, authenticated;
