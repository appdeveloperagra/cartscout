import "server-only";

import { createClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseConfig } from "@/lib/supabase/config";

export type WorkspaceAdminRole = "superadmin" | "admin";

export async function requireAdmin() {
  const config = getSupabaseConfig();
  if (!config) {
    return { response: Response.json({ error: "Supabase is not configured." }, { status: 503 }) };
  }

  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { response: Response.json({ error: "Sign in with an admin account to continue." }, { status: 401 }) };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    return { response: Response.json({ error: `Unable to verify admin access: ${profileError.message}` }, { status: 500 }) };
  }
  const role = profile?.role;
  if (role !== "superadmin" && role !== "admin") {
    return { response: Response.json({ error: "Only Admins and Superadmins can manage team accounts." }, { status: 403 }) };
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    return { response: Response.json({ error: "Account management is not configured. Set SUPABASE_SERVICE_ROLE_KEY on the server." }, { status: 503 }) };
  }

  return {
    user,
    role,
    admin: createClient(config.url, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }),
  };
}
