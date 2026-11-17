import { redirect } from "next/navigation";
import AdminUserManagement from "@/components/admin/admin-user-management";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError) throw new Error(`Unable to verify admin session: ${authError.message}`);
  if (!user) redirect("/admin/login");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) throw new Error(`Unable to verify admin access: ${profileError.message}`);
  if (profile?.role !== "superadmin" && profile?.role !== "admin") redirect("/admin/access");

  return <AdminUserManagement currentUserId={user.id} currentUserRole={profile.role} />;
}
