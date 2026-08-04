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

  const { data: staff } = await supabase
    .from("staff_profiles")
    .select("full_name, role, is_active")
    .eq("id", user.id)
    .single();

  if (!staff || !staff.is_active) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="border-b border-neutral-800 px-6 py-4">
        <p className="text-sm text-neutral-400">
          Signed in as {staff.full_name} ({staff.role})
        </p>
      </header>
      <div className="p-6">{children}</div>
    </div>
  );
}
