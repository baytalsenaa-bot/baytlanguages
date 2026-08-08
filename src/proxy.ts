import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

// Branches by path: /admin/** gets Supabase session-refresh + auth redirects (no i18n —
// it's a single-language internal tool). Everything else gets next-intl's locale
// negotiation. Next.js only allows one middleware/proxy file, hence the branch here
// rather than two separate files.
export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin")) {
    return handleAdminAuth(request);
  }

  return intlMiddleware(request);
}

async function handleAdminAuth(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoginPage = request.nextUrl.pathname === "/admin/login";
  const isResetPasswordPage = request.nextUrl.pathname === "/admin/reset-password";

  if (!user && !isLoginPage && !isResetPasswordPage) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (user && isLoginPage) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
