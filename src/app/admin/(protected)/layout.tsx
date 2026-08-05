import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: staff, error: staffError } = await supabase
    .from("staff_profiles")
    .select("full_name, role, is_active")
    .eq("id", user.id)
    .single();

  if (staffError) {
    console.error("Failed to load staff profile:", staffError);
  }

  if (!staff || !staff.is_active) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="flex items-center justify-between border-b border-neutral-800 px-6 py-4">
        <nav className="flex gap-4 text-sm">
          <Link href="/admin/dashboard" className="text-neutral-300 hover:text-neutral-100">
            Dashboard
          </Link>
          <Link href="/admin/documents" className="text-neutral-300 hover:text-neutral-100">
            Documents
          </Link>
        </nav>
        <p className="text-sm text-neutral-400">
          Signed in as {staff.full_name} ({staff.role})
        </p>
      </header>
      <div className="p-6">{children}</div>
    </div>
  );
}
