-- PIN brute-force protection: a 4-8 digit PIN has low entropy, so it needs its
-- own lockout independent of any general IP rate limiting. Tracked directly in
-- Postgres rather than pulling in Redis/Upstash for a single counter.
alter table verification_records
  add column pin_failed_attempts int not null default 0,
  add column pin_locked_until timestamptz;
