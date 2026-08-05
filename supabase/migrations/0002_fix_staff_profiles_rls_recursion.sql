-- Fixes infinite recursion in RLS: policies that checked "is this user an admin?" did so
-- by querying staff_profiles from *within* a policy on staff_profiles itself, which
-- Postgres cannot evaluate without recursively re-invoking that same policy.
-- Fix: move the check into SECURITY DEFINER helper functions, which run with the
-- function owner's privileges and so don't re-trigger RLS on staff_profiles.

create function is_active_staff(uid uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from staff_profiles
    where id = uid and is_active
  );
$$;

create function is_admin_staff(uid uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from staff_profiles
    where id = uid and role = 'admin' and is_active
  );
$$;

-- staff_profiles
drop policy "admins can read all profiles" on staff_profiles;
drop policy "admins can manage profiles" on staff_profiles;

create policy "admins can read all profiles"
  on staff_profiles for select to authenticated
  using (is_admin_staff(auth.uid()));

create policy "admins can manage profiles"
  on staff_profiles for all to authenticated
  using (is_admin_staff(auth.uid()))
  with check (is_admin_staff(auth.uid()));

-- translation_documents
drop policy "active staff can read documents" on translation_documents;
drop policy "active staff can create documents" on translation_documents;
drop policy "active staff can update documents" on translation_documents;
drop policy "admins can delete documents" on translation_documents;

create policy "active staff can read documents"
  on translation_documents for select to authenticated
  using (is_active_staff(auth.uid()));

create policy "active staff can create documents"
  on translation_documents for insert to authenticated
  with check (is_active_staff(auth.uid()));

create policy "active staff can update documents"
  on translation_documents for update to authenticated
  using (is_active_staff(auth.uid()))
  with check (is_active_staff(auth.uid()));

create policy "admins can delete documents"
  on translation_documents for delete to authenticated
  using (is_admin_staff(auth.uid()));

-- document_versions
drop policy "active staff can read versions" on document_versions;
drop policy "active staff can insert versions" on document_versions;

create policy "active staff can read versions"
  on document_versions for select to authenticated
  using (is_active_staff(auth.uid()));

create policy "active staff can insert versions"
  on document_versions for insert to authenticated
  with check (is_active_staff(auth.uid()));

-- verification_records
drop policy "active staff can read verification records" on verification_records;
drop policy "active staff can create verification records" on verification_records;
drop policy "active staff can update verification records" on verification_records;

create policy "active staff can read verification records"
  on verification_records for select to authenticated
  using (is_active_staff(auth.uid()));

create policy "active staff can create verification records"
  on verification_records for insert to authenticated
  with check (is_active_staff(auth.uid()));

create policy "active staff can update verification records"
  on verification_records for update to authenticated
  using (is_active_staff(auth.uid()))
  with check (is_active_staff(auth.uid()));

-- audit_log
drop policy "active staff can read audit log" on audit_log;

create policy "active staff can read audit log"
  on audit_log for select to authenticated
  using (is_active_staff(auth.uid()));
