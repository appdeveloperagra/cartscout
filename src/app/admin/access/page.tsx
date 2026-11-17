import Link from "next/link";

export default function AdminAccessPage() {
  return (
    <main className="admin-access-screen">
      <section className="admin-access-card">
        <span className="admin-brand-mark">CS</span>
        <p className="admin-kicker">ACCESS RESTRICTED</p>
        <h1>This account has no workspace access.</h1>
        <p>Ask a CartScout Admin or Superadmin to create your account or update your access role, then try signing in again.</p>
        <Link className="admin-button admin-button-primary" href="/admin/login">Use another account</Link>
      </section>
    </main>
  );
}
