import { redirect } from "next/navigation";
import ChangePasswordForm from "@/components/admin/change-password-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AccountPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw new Error(`Unable to verify admin session: ${error.message}`);
  if (!user?.email) redirect("/admin/login");

  return (
    <section className="admin-account-page">
      <div className="admin-page-heading">
        <div>
          <p className="admin-kicker">YOUR PROFILE</p>
          <h1>My account</h1>
          <p className="admin-page-subtitle">Signed in as {user.email}.</p>
        </div>
      </div>
      <ChangePasswordForm email={user.email} />
    </section>
  );
}
