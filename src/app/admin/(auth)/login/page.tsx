import AdminLoginForm from "@/components/admin/login-form";
import { getSupabaseConfig } from "@/lib/supabase/config";

export default function AdminLoginPage() {
  return <AdminLoginForm configured={Boolean(getSupabaseConfig())} />;
}
