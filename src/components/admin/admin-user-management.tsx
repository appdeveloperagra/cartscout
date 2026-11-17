"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";

type AdminRole = "staff" | "superadmin";

type AdminUser = {
  id: string;
  email: string;
  display_name: string | null;
  role: AdminRole | null;
  created_at: string;
  invitationPending: boolean;
};

async function getResponseMessage(response: Response) {
  const result: unknown = await response.json();
  if (result && typeof result === "object" && "error" in result && typeof result.error === "string") {
    throw new Error(result.error);
  }
  if (!response.ok) throw new Error("The request could not be completed.");
  return result as { message?: string; users?: AdminUser[] };
}

function formatCreatedAt(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat("en-ZA", { dateStyle: "medium" }).format(date);
}

export default function AdminUserManagement({ currentUserId }: { currentUserId: string }) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [roles, setRoles] = useState<Record<string, AdminRole | "">>({});
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [newRole, setNewRole] = useState<AdminRole>("staff");
  const [isLoading, setIsLoading] = useState(true);
  const [isInviting, setIsInviting] = useState(false);
  const [savingId, setSavingId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const fetchUsers = useCallback(async () => {
    const response = await fetch("/api/admin/users", { cache: "no-store" });
    const result = await getResponseMessage(response);
    return result.users ?? [];
  }, []);

  const loadUsers = useCallback(async () => {
    try {
      const loadedUsers = await fetchUsers();
      setUsers(loadedUsers);
      setRoles(Object.fromEntries(loadedUsers.map((user) => [user.id, user.role ?? ""])));
      setError("");
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load team accounts.");
    } finally {
      setIsLoading(false);
    }
  }, [fetchUsers]);

  useEffect(() => {
    let active = true;
    void fetchUsers()
      .then((loadedUsers) => {
        if (!active) return;
        setUsers(loadedUsers);
        setRoles(Object.fromEntries(loadedUsers.map((user) => [user.id, user.role ?? ""])));
      })
      .catch((loadError: unknown) => {
        if (active) setError(loadError instanceof Error ? loadError.message : "Unable to load team accounts.");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [fetchUsers]);

  async function inviteUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    setIsInviting(true);

    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, displayName, role: newRole }),
      });
      const result = await getResponseMessage(response);
      setEmail("");
      setDisplayName("");
      setNewRole("staff");
      setNotice(result.message ?? "Invitation sent.");
      setIsLoading(true);
      await loadUsers();
    } catch (inviteError) {
      setError(inviteError instanceof Error ? inviteError.message : "Unable to invite this account.");
    } finally {
      setIsInviting(false);
    }
  }

  async function saveRole(user: AdminUser) {
    const role = roles[user.id];
    if (!role || role === user.role) return;

    setError("");
    setNotice("");
    setSavingId(user.id);
    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, role }),
      });
      const result = await getResponseMessage(response);
      setNotice(result.message ?? "Access role updated.");
      setIsLoading(true);
      await loadUsers();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to update this access role.");
    } finally {
      setSavingId("");
    }
  }

  return (
    <section className="admin-users-page">
      <div className="admin-page-heading">
        <div>
          <p className="admin-kicker">ADMINISTRATION</p>
          <h1>Admin access</h1>
          <p className="admin-page-subtitle">Invite team members and choose what they can access.</p>
        </div>
      </div>

      <section className="admin-invite-panel" aria-labelledby="admin-invite-title">
        <div className="admin-invite-heading">
          <div>
            <p className="admin-kicker">TEAM ACCOUNTS</p>
            <h2 id="admin-invite-title">Invite a team member</h2>
            <p>They’ll receive an email link to set their password and sign in.</p>
          </div>
        </div>
        <form className="admin-invite-form" onSubmit={inviteUser}>
          <label className="admin-form-field">
            <span>Email address <i aria-hidden="true">*</i></span>
            <input
              autoComplete="email"
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              value={email}
            />
          </label>
          <label className="admin-form-field">
            <span>Display name</span>
            <input
              autoComplete="name"
              maxLength={120}
              onChange={(event) => setDisplayName(event.target.value)}
              type="text"
              value={displayName}
            />
          </label>
          <label className="admin-form-field">
            <span>Access role <i aria-hidden="true">*</i></span>
            <select
              onChange={(event) => setNewRole(event.target.value === "superadmin" ? "superadmin" : "staff")}
              value={newRole}
            >
              <option value="staff">Staff — read-only access</option>
              <option value="superadmin">Superadmin — manage the workspace</option>
            </select>
          </label>
          <button className="admin-button admin-button-primary" disabled={isInviting} type="submit">
            {isInviting ? "Sending invitation..." : "Send invitation"}
          </button>
        </form>
      </section>

      {notice && <p className="admin-success-message" role="status">{notice}</p>}
      {error && <p className="admin-form-error admin-query-error" role="alert">{error}</p>}

      <div className="admin-table-panel admin-users-table-panel">
        <div className="admin-table-toolbar">
          <div><strong>{users.length.toLocaleString("en-ZA")}</strong><span> team accounts</span></div>
          <button
            className="admin-button admin-button-subtle"
            disabled={isLoading}
            onClick={() => {
              setError("");
              setIsLoading(true);
              void loadUsers();
            }}
            type="button"
          >
            Refresh
          </button>
        </div>
        {isLoading ? (
          <div className="admin-table-loading" role="status">Loading team accounts...</div>
        ) : users.length ? (
          <div className="admin-table-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  <th scope="col">Team member</th>
                  <th scope="col">Access role</th>
                  <th scope="col">Account status</th>
                  <th scope="col">Added</th>
                  <th scope="col"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <span className="admin-table-primary-value">{user.display_name || "No display name"}</span>
                      <span className="admin-user-email">{user.email || "Email unavailable"}</span>
                    </td>
                    <td>
                      <label className="sr-only" htmlFor={`role-${user.id}`}>Access role for {user.email}</label>
                      <select
                        className="admin-role-select"
                        disabled={user.id === currentUserId || savingId === user.id}
                        id={`role-${user.id}`}
                        onChange={(event) => setRoles((current) => ({
                          ...current,
                          [user.id]: event.target.value === ""
                            ? ""
                            : event.target.value === "superadmin"
                              ? "superadmin"
                              : "staff",
                        }))}
                        value={roles[user.id] ?? user.role ?? ""}
                      >
                        <option value="">No role assigned</option>
                        <option value="staff">Staff</option>
                        <option value="superadmin">Superadmin</option>
                      </select>
                    </td>
                    <td>
                      <span className={`admin-status-pill${user.invitationPending ? "" : " is-active"}`}>
                        <i />{user.invitationPending ? "Invitation pending" : "Active"}
                      </span>
                    </td>
                    <td>{formatCreatedAt(user.created_at)}</td>
                    <td className="admin-row-actions">
                      {user.id === currentUserId ? (
                        <span className="admin-current-account">You</span>
                      ) : (
                        <button
                          disabled={!roles[user.id] || roles[user.id] === user.role || savingId === user.id}
                          onClick={() => void saveRole(user)}
                          type="button"
                        >
                          {savingId === user.id ? "Saving..." : user.role ? "Save role" : "Assign role"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-empty-state">
            <span aria-hidden="true">✦</span>
            <h2>No team accounts found</h2>
            <p>Send an invitation above to add your first team member.</p>
          </div>
        )}
      </div>
    </section>
  );
}
