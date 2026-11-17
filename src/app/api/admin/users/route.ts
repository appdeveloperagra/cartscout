import type { User } from "@supabase/supabase-js";
import { requireAdmin } from "@/lib/supabase/admin";

type AccountRole = "staff" | "admin" | "superadmin";

function isAccountRole(value: unknown, canManageSuperadmins: boolean): value is AccountRole {
  return value === "staff" || value === "admin" || (value === "superadmin" && canManageSuperadmins);
}

function sameOriginRequest(request: Request) {
  return request.headers.get("origin") === new URL(request.url).origin;
}

export async function GET() {
  const access = await requireAdmin();
  if ("response" in access) return access.response;

  const { data: profiles, error: profilesError } = await access.admin
    .from("profiles")
    .select("id, display_name, role, created_at")
    .order("created_at", { ascending: false });

  if (profilesError) {
    return Response.json({ error: `Unable to load team accounts: ${profilesError.message}` }, { status: 500 });
  }

  const profilesById = new Map((profiles ?? []).map((profile) => [profile.id, profile]));
  const authUsers: User[] = [];
  let page = 1;
  while (true) {
    const { data, error } = await access.admin.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) {
      return Response.json({ error: `Unable to load account emails: ${error.message}` }, { status: 500 });
    }

    authUsers.push(...data.users);
    if (data.users.length < 1000) break;
    page += 1;
  }

  const users = authUsers.map((authUser) => {
    const profile = profilesById.get(authUser.id);
    const metadataName = authUser.user_metadata.full_name;
    return {
      id: authUser.id,
      display_name: profile?.display_name ??
        (typeof metadataName === "string" ? metadataName : null),
      role: profile?.role === "superadmin" || profile?.role === "admin" || profile?.role === "staff"
        ? profile.role
        : null,
      created_at: profile?.created_at ?? authUser.created_at,
      email: authUser.email ?? "",
      emailConfirmed: Boolean(authUser.email_confirmed_at),
    };
  }).filter((account) => access.role === "superadmin" || account.role !== "superadmin");

  return Response.json({ users });
}

export async function POST(request: Request) {
  if (!sameOriginRequest(request)) {
    return Response.json({ error: "This request must come from CartScout." }, { status: 403 });
  }

  const access = await requireAdmin();
  if ("response" in access) return access.response;

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await request.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return Response.json({ error: "Enter account details and choose an access role." }, { status: 400 });
    }
    body = parsed as Record<string, unknown>;
  } catch {
    return Response.json({ error: "The account request is not valid JSON." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const displayName = typeof body.displayName === "string" ? body.displayName.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const role = body.role;

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  if (password.length < 8 || password.length > 128) {
    return Response.json({ error: "Password must be between 8 and 128 characters." }, { status: 400 });
  }
  if (displayName.length > 120) {
    return Response.json({ error: "Display name must be 120 characters or fewer." }, { status: 400 });
  }
  if (!isAccountRole(role, access.role === "superadmin")) {
    return Response.json({ error: "Choose a role you are permitted to assign." }, { status: 400 });
  }

  const { data, error: createError } = await access.admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: displayName ? { full_name: displayName } : {},
  });

  if (createError) {
    return Response.json(
      { error: "Unable to create account. Check that the email is not already registered and the password meets Auth requirements." },
      { status: 400 },
    );
  }
  if (!data.user) {
    return Response.json({ error: "Supabase did not return the created account." }, { status: 502 });
  }

  const { error: profileError } = await access.admin
    .from("profiles")
    .upsert(
      { id: data.user.id, display_name: displayName || null, role },
      { onConflict: "id" },
    );

  if (profileError) {
    const { error: cleanupError } = await access.admin.auth.admin.deleteUser(data.user.id);
    const detail = cleanupError
      ? ` The account could not be rolled back: ${cleanupError.message}`
      : " The account was rolled back.";
    return Response.json(
      { error: `Unable to assign the requested role: ${profileError.message}.${detail}` },
      { status: 500 },
    );
  }

  return Response.json({
    message: `Account created for ${email}. It is active immediately; no invitation email was sent.`,
  }, { status: 201 });
}

export async function PATCH(request: Request) {
  if (!sameOriginRequest(request)) {
    return Response.json({ error: "This request must come from CartScout." }, { status: 403 });
  }

  const access = await requireAdmin();
  if ("response" in access) return access.response;

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await request.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return Response.json({ error: "Choose an account and access role." }, { status: 400 });
    }
    body = parsed as Record<string, unknown>;
  } catch {
    return Response.json({ error: "The role update request is not valid JSON." }, { status: 400 });
  }

  const id = typeof body.id === "string" ? body.id : "";
  const role = body.role;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    return Response.json({ error: "Choose a valid team account." }, { status: 400 });
  }
  if (!isAccountRole(role, access.role === "superadmin")) {
    return Response.json({ error: "Choose a role you are permitted to assign." }, { status: 400 });
  }
  if (id === access.user.id && role !== access.role) {
    return Response.json({ error: "You cannot change your own access role." }, { status: 409 });
  }

  const { data: targetProfile, error: targetError } = await access.admin
    .from("profiles")
    .select("role")
    .eq("id", id)
    .maybeSingle();

  if (targetError) {
    return Response.json({ error: `Unable to verify the target account: ${targetError.message}` }, { status: 500 });
  }
  if (access.role === "admin" && targetProfile?.role === "superadmin") {
    return Response.json({ error: "That account could not be found." }, { status: 404 });
  }

  const { data, error } = await access.admin
    .from("profiles")
    .upsert({ id, role }, { onConflict: "id" })
    .select("id")
    .maybeSingle();

  if (error) {
    const status = error.code === "23503" ? 404 : 500;
    return Response.json({ error: status === 404 ? "That account could not be found." : `Unable to update access role: ${error.message}` }, { status });
  }
  if (!data) {
    return Response.json({ error: "That team account could not be found." }, { status: 404 });
  }

  return Response.json({ message: "Access role updated." });
}
