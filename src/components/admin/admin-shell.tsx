"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { adminNavigation } from "@/lib/admin-modules";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { AdminRoleContext, type AdminRole } from "@/components/admin/admin-role-context";

function AdminAccountActions() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function signOut() {
    const { error: signOutError } = await createSupabaseBrowserClient().auth.signOut();
    if (signOutError) {
      setError(signOutError.message);
      return;
    }

    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="admin-account-actions">
      {error && <span className="admin-inline-error" role="alert">{error}</span>}
      <Link className="admin-account-link" href="/admin/account">Change password</Link>
      <button className="admin-signout-button" onClick={signOut} type="button">
        <span aria-hidden="true">↗</span> Sign out
      </button>
    </div>
  );
}

export default function AdminShell({
  children,
  email,
  displayName,
  role,
}: {
  children: React.ReactNode;
  email: string;
  displayName: string | null;
  role: AdminRole;
}) {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const initials = (displayName || email).slice(0, 1).toUpperCase();

  return (
    <AdminRoleContext.Provider value={role}>
      <div className="admin-shell" data-admin-role={role}>
        <aside className={`admin-sidebar${mobileNavOpen ? " is-open" : ""}`}>
          <Link
            aria-label="CartScout business workspace"
            className="admin-workspace-switcher"
            href="/admin"
            onClick={() => setMobileNavOpen(false)}
          >
            <span className="admin-workspace-avatar">C</span>
            <span><strong>CartScout</strong><small>Business workspace</small></span>
          </Link>
          <nav className="admin-sidebar-nav" aria-label="Admin navigation">
            {adminNavigation.map((item, index) => {
              if (!("items" in item)) {
                const active = pathname === item.href;
                return (
                  <Link
                    aria-current={active ? "page" : undefined}
                    className={`admin-nav-parent${active ? " is-active" : ""}`}
                    href={item.href}
                    key={item.key}
                    onClick={() => setMobileNavOpen(false)}
                  >
                    <span className="admin-nav-parent-icon" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                    <span>{item.label}</span>
                    {active && <span className="admin-nav-active-dot" aria-hidden="true" />}
                  </Link>
                );
              }

              const items = role !== "staff"
                ? item.items
                : item.items.filter((child) => child.key !== "admins");
              const isTagConnections = item.key === "blog-management" && pathname === "/admin/blog-tag-assignments";
              const active = isTagConnections || items.some((child) => pathname === child.href || pathname.startsWith(`${child.href}/`));
              const expanded = expandedGroups[item.key] ?? active;
              if (!items.length) return null;

              return (
                <section className="admin-nav-group" key={item.key}>
                  <button
                    aria-expanded={expanded}
                    className={`admin-nav-parent${active ? " is-active" : ""}`}
                    onClick={() => setExpandedGroups((current) => ({ ...current, [item.key]: !expanded }))}
                    type="button"
                  >
                    <span className="admin-nav-parent-icon" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                    <span>{item.label}</span>
                    <span className={`admin-nav-chevron${expanded ? " is-expanded" : ""}`} aria-hidden="true">⌄</span>
                  </button>
                  {expanded && (
                    <div className="admin-nav-children">
                      {items.map((child) => {
                        const childActive = pathname === child.href || pathname.startsWith(`${child.href}/`);
                        return (
                          <Link
                            aria-current={childActive ? "page" : undefined}
                            className={`admin-nav-child${childActive ? " is-active" : ""}`}
                            href={child.href}
                            key={child.key}
                            onClick={() => setMobileNavOpen(false)}
                          >
                            {child.label}
                          </Link>
                        );
                      })}
                      {item.key === "blog-management" && (
                        <Link
                          aria-current={isTagConnections ? "page" : undefined}
                          className={`admin-nav-child${isTagConnections ? " is-active" : ""}`}
                          href="/admin/blog-tag-assignments"
                        >
                          Connect tags to posts
                        </Link>
                      )}
                    </div>
                  )}
                </section>
              );
            })}
          </nav>
          <div className="admin-sidebar-footer">
            <div className="admin-user-avatar">{initials}</div>
            <div className="admin-user-details">
              <strong>{displayName || (role === "superadmin" ? "Superadmin" : role === "admin" ? "Admin" : "Staff")}</strong>
              <span>{email}</span>
            </div>
            <AdminAccountActions />
          </div>
        </aside>
        {mobileNavOpen && (
          <button
            aria-label="Close navigation"
            className="admin-sidebar-backdrop"
            onClick={() => setMobileNavOpen(false)}
            type="button"
          />
        )}
        <div className="admin-content">
          <header className="admin-topbar">
            <button
              aria-expanded={mobileNavOpen}
              aria-label="Toggle navigation"
              className="admin-mobile-toggle"
              onClick={() => setMobileNavOpen((open) => !open)}
              type="button"
            >
              <span /><span /><span />
            </button>
            <div className="admin-breadcrumb"><span>Workspace</span><span aria-hidden="true">/</span><strong>{pathname === "/admin" ? "Overview" : "Management"}</strong></div>
            {role === "staff" && <span className="admin-role-indicator">Read-only access</span>}
            {role === "admin" && <span className="admin-role-indicator">Admin access</span>}
            <Link className="admin-preview-link" href="/" target="_blank">
              View website <span aria-hidden="true">↗</span>
            </Link>
          </header>
          <main className="admin-main">{children}</main>
        </div>
      </div>
    </AdminRoleContext.Provider>
  );
}
