import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/admin-shell";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseConfig } from "@/lib/supabase/config";

export const instant = false;

export default async function WorkspaceLayout({ children }: { children: ReactNode }) {
  if (!getSupabaseConfig()) {
    return (
      <main className="admin-setup-screen">
        <section className="admin-setup-card">
          <span className="admin-brand-mark">CS</span>
          <p className="admin-kicker">CARTSCOUT CONTROL CENTER</p>
          <h1>Connect your Supabase project</h1>
          <p>Add your project URL and publishable key to <code>.env.local</code>, then restart the app.</p>
          <Link className="admin-button admin-button-primary" href="/admin/login">Continue to sign in</Link>
        </section>
      </main>
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError) throw new Error(`Unable to verify admin session: ${authError.message}`);
  if (!user) redirect("/admin/login");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, display_name")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) throw new Error(`Unable to verify admin access: ${profileError.message}`);
  if (profile?.role !== "superadmin") redirect("/admin/access");

  return (
    <AdminShell email={user.email ?? ""} displayName={profile.display_name}>
      {children}
    </AdminShell>
  );
}
