-- Private Storage bucket for translated document PDFs. No public access — every
-- download goes through a signed URL minted by the service-role client (see
-- app/api/verify/download in Phase 5), so no anon storage policy is needed at all.
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

-- Active staff can upload and read objects in this bucket. Deletes/updates are
-- deliberately not granted here — versions are append-only (see document_versions).
create policy "active staff can upload documents"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'documents' and is_active_staff(auth.uid())
  );

create policy "active staff can read documents"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'documents' and is_active_staff(auth.uid())
  );
