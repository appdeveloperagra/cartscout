import type { User } from "@supabase/supabase-js";
import { requireSuperadmin } from "@/lib/supabase/admin";

type AdminRole = "staff" | "superadmin";

function isAdminRole(value: unknown): value is AdminRole {
  return value === "staff" || value === "superadmin";
}

function sameOriginRequest(request: Request) {
  return request.headers.get("origin") === new URL(request.url).origin;
}

export async function GET() {
  const access = await requireSuperadmin();
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
      role: profile?.role === "superadmin" || profile?.role === "staff" ? profile.role : null,
      created_at: profile?.created_at ?? authUser.created_at,
      email: authUser.email ?? "",
      invitationPending: Boolean(authUser.email && !authUser.email_confirmed_at),
    };
  });

  return Response.json({ users });
}

export async function POST(request: Request) {
  if (!sameOriginRequest(request)) {
    return Response.json({ error: "This request must come from CartScout." }, { status: 403 });
  }

  const access = await requireSuperadmin();
  if ("response" in access) return access.response;

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await request.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return Response.json({ error: "Enter an email address and access role." }, { status: 400 });
    }
    body = parsed as Record<string, unknown>;
  } catch {
    return Response.json({ error: "The invitation request is not valid JSON." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const displayName = typeof body.displayName === "string" ? body.displayName.trim() : "";
  const role = body.role;

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  if (displayName.length > 120) {
    return Response.json({ error: "Display name must be 120 characters or fewer." }, { status: 400 });
  }
  if (!isAdminRole(role)) {
    return Response.json({ error: "Choose Staff or Superadmin." }, { status: 400 });
  }

  const redirectTo = new URL("/admin/accept-invite", request.url).toString();
  const { data, error: inviteError } = await access.admin.auth.admin.inviteUserByEmail(email, {
    data: displayName ? { full_name: displayName } : {},
    redirectTo,
  });

  if (inviteError) {
    return Response.json({ error: `Unable to send invitation: ${inviteError.message}` }, { status: 400 });
  }
  if (!data.user) {
    return Response.json({ error: "Supabase did not return the invited account." }, { status: 502 });
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
      ? ` The invited account could not be rolled back: ${cleanupError.message}`
      : " The invitation was rolled back.";
    return Response.json(
      { error: `Unable to assign the requested role: ${profileError.message}.${detail}` },
      { status: 500 },
    );
  }

  return Response.json({ message: `Invitation sent to ${email}.` }, { status: 201 });
}

export async function PATCH(request: Request) {
  if (!sameOriginRequest(request)) {
    return Response.json({ error: "This request must come from CartScout." }, { status: 403 });
  }

  const access = await requireSuperadmin();
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
  if (!isAdminRole(role)) {
    return Response.json({ error: "Choose Staff or Superadmin." }, { status: 400 });
  }
  if (id === access.user.id && role !== "superadmin") {
    return Response.json({ error: "You cannot remove your own superadmin access." }, { status: 409 });
  }

  const { data, error } = await access.admin
    .from("profiles")
    .upsert({ id, role }, { onConflict: "id" })
    .select("id")
    .maybeSingle();

  if (error) {
    return Response.json({ error: `Unable to update access role: ${error.message}` }, { status: 500 });
  }
  if (!data) {
    return Response.json({ error: "That team account could not be found." }, { status: 404 });
  }

  return Response.json({ message: "Access role updated." });
}
