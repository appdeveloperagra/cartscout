"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { adminNavigation } from "@/lib/admin-modules";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

function AdminSignOutButton() {
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
}: {
  children: React.ReactNode;
  email: string;
  displayName: string | null;
}) {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const initials = (displayName || email).slice(0, 1).toUpperCase();

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar${mobileNavOpen ? " is-open" : ""}`}>
        <Link className="admin-logo" href="/admin" onClick={() => setMobileNavOpen(false)}>
          <Image src="/cartscout-logo.png" alt="CartScout" width={180} height={28} priority />
          <span>CONTROL CENTER</span>
        </Link>
        <div className="admin-workspace-switcher">
          <span className="admin-workspace-avatar">C</span>
          <span><strong>CartScout</strong><small>Business workspace</small></span>
          <span className="admin-workspace-chevron" aria-hidden="true">⌄</span>
        </div>
        <nav className="admin-sidebar-nav" aria-label="Admin navigation">
          {adminNavigation.map((group) => (
            <section className="admin-nav-group" key={group.heading}>
              <p>{group.heading}</p>
              {group.items.map((item, index) => {
                const href = item.key === "overview" ? "/admin" : `/admin/${item.key}`;
                const active = item.key === "overview"
                  ? pathname === "/admin"
                  : pathname === href || pathname.startsWith(`${href}/`);
                return (
                  <Link
                    className={`admin-nav-link${active ? " is-active" : ""}`}
                    href={href}
                    key={item.key}
                    onClick={() => setMobileNavOpen(false)}
                  >
                    <span className="admin-nav-icon" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                    <span>{item.label}</span>
                    {active && <span className="admin-nav-active-dot" aria-hidden="true" />}
                  </Link>
                );
              })}
            </section>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <div className="admin-user-avatar">{initials}</div>
          <div className="admin-user-details">
            <strong>{displayName || "Superadmin"}</strong>
            <span>{email}</span>
          </div>
          <AdminSignOutButton />
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
          <Link className="admin-preview-link" href="/" target="_blank">
            View website <span aria-hidden="true">↗</span>
          </Link>
        </header>
        <main className="admin-main">{children}</main>
      </div>
    </div>
  );
}
