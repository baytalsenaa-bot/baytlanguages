import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Service-role client — bypasses RLS entirely. Import ONLY from app/api/** route
// handlers or admin Server Components that perform privileged writes (signed URLs,
// PIN checks, audit log inserts). The `server-only` import makes any accidental
// bundling into a client component fail the build instead of leaking the key.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
