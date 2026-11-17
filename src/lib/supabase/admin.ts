import "server-only";

import { createClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseConfig } from "@/lib/supabase/config";

export async function requireSuperadmin() {
  const config = getSupabaseConfig();
  if (!config) {
    return { response: Response.json({ error: "Supabase is not configured." }, { status: 503 }) };
  }

  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { response: Response.json({ error: "Sign in with a superadmin account to continue." }, { status: 401 }) };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    return { response: Response.json({ error: `Unable to verify admin access: ${profileError.message}` }, { status: 500 }) };
  }
  if (profile?.role !== "superadmin") {
    return { response: Response.json({ error: "Only superadmins can manage team accounts." }, { status: 403 }) };
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    return { response: Response.json({ error: "Team invitations are not configured. Set SUPABASE_SERVICE_ROLE_KEY on the server." }, { status: 503 }) };
  }

  return {
    user,
    admin: createClient(config.url, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }),
  };
}
