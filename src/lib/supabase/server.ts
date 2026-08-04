import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Anon-key client acting as the current viewer (admin session or anonymous public
// visitor). Relies on RLS / the public views for read scoping — never bypasses them.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component render — middleware refreshes the
            // session cookie on the request/response instead.
          }
        },
      },
    },
  );
}
